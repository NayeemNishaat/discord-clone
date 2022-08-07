import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import Conversation from "../models/conversationModel";
import GroupConversation from "../models/groupConversationModel";
import { getIoInstance } from "../socketEvents";

interface JwtPayload {
  id: string;
  email: string;
}

declare const process: {
  env: {
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_IN: number;
  };
};

interface friends {
  _id: string;
  socketId?: string;
  usename: string;
  isOnline: boolean;
}

let token: string;
export const verifyUser = async (
  socket: Socket,
  next: { (err?: ExtendedError | undefined): void }
) => {
  if (socket.handshake.headers.cookie) {
    socket.handshake.headers.cookie.split("; ").forEach((el: string) => {
      const arr = el.split("=");
      if (arr[0] === "jwt") token = arr[1];
    });
  }

  if (!token) return socket.emit("error", "Please log in to get access!");

  let decoded: { id: string; email: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  } catch (err) {
    return socket.emit("error", "Invalid Token!");
  }

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return socket.emit(
      "error",
      "The user belonging to this token does no longer exist."
    );

  socket.data = currentUser;
  next();
};

const users = new Map();
let userInfo: {
  friends: friends[];
  receivedInvitation: {}[];
};

const getSocketId = (id: string) => {
  return [...users].find(
    ([_key, value]: [string, string]) => value === id
  )?.[0] as string;
};

const getOnlineFriends = (friends: friends[]) => {
  return friends.map((friend) => {
    if (Array.from(users.values()).includes(friend._id.toString())) {
      friend.isOnline = true;
      friend.socketId = getSocketId(friend._id.toString());
      return friend;
    }
    friend.isOnline = false;
    return friend;
  });
};

const updateOnlineFriends = async (userId: string, active: boolean = true) => {
  const io = getIoInstance();

  const user = (await User.findById(userId, "friends")
    .populate("friends", "username")
    .lean()) as {
    _id: string;
    username: string;
    email: string;
    friends: friends[];
  };

  const friendsStat = getOnlineFriends(user.friends);

  friendsStat.forEach((friend) => {
    if (friend.isOnline === true) {
      return io.to(friend.socketId as string).emit("friendOnline", {
        _id: user._id,
        usename: user.username,
        isOnline: active
      });
    }
  });
};

export const sendInviteNotification = async (
  receiver: string,
  sender: {
    _id: string;
    username: string;
    email: string;
  },
  groupId: string,
  groupName: string
) => {
  const io = getIoInstance();

  let activeUserIds: string[] = []; // Important: Array because a user could be connected from multiple devices!

  users.forEach((value, key) => {
    if (value === receiver.toString()) activeUserIds.push(key); // Note: Finding active receiver's SocketId!
  });

  userInfo = await User.findById(receiver, "receivedInvitation friends")
    .populate("receivedInvitation", "username")
    .lean();

  activeUserIds.forEach((activeUserId) => {
    io.to(activeUserId).emit("invite", [
      ...userInfo.receivedInvitation,
      {
        _id: sender._id,
        username: sender.username,
        groupName: groupName,
        groupId: groupId
      }
    ]);
  });
};

export const sendFriendNotification = (
  sender: {
    _id: string;
    friends: friends[];
  },
  receiver: {
    _id: string;
    friends: friends[];
  }
) => {
  const io = getIoInstance();

  users.forEach((value, key) => {
    if (value === receiver._id.toString()) {
      const receiverFriends = getOnlineFriends(receiver.friends);
      io.to(key).emit("friend", receiverFriends);
    }

    if (value === sender._id.toString()) {
      const senderFriends = getOnlineFriends(sender.friends);
      io.to(key).emit("friend", senderFriends);
    }
  });
};

export const sendGroupNotification = async (
  userId: string,
  socketId?: string,
  groupId?: string
) => {
  const io = getIoInstance();

  if (!socketId) socketId = getSocketId(userId.toString());

  const { groups } = (await User.findById(userId, "groups")
    .populate({
      path: "groups",
      select: "name owner members",
      populate: { path: "members", select: "username" }
    })
    .lean()) as {
    groups: {
      _id: string;
      name: string;
      owner: string;
      members: {
        _id: string;
        username: string;
        isOnline: boolean;
        socketId: string;
      }[];
    }[];
  };

  const updateOnlineStatus = () => {
    groups.forEach((group) => {
      group.members = getOnlineFriends(
        group.members as unknown as friends[]
      ) as unknown as {
        _id: string;
        username: string;
        isOnline: boolean;
        socketId: string;
      }[];

      if (groupId && groupId === group._id) {
        group.members.forEach((member) => {
          io.to(member.socketId).emit("groupList", group);
        });
      }
    });

    io.to(socketId as string).emit("groupList", groups);
  };
  updateOnlineStatus();

  const timeoutIntv = () => {
    setTimeout(() => {
      updateOnlineStatus();
      timeoutIntv();
    }, 10000);
  };
  timeoutIntv();
};

const getPrivateHistory = async (socket: Socket, friendId: string) => {
  const conversation = await Conversation.findOne({
    participents: { $all: [socket.data._id, friendId] }
  }).populate({
    path: "messages",
    populate: { path: "author", select: "username" }
  });

  if (!conversation) return socket.emit("privateHistory", null);

  return socket.emit("privateHistory", conversation.messages);
};

const getGroupHistory = async (socket: Socket, groupId: string) => {
  const groupConversation = (await GroupConversation.findById(
    groupId,
    "messages",
    { populate: { path: "messages.author", select: "username" } }
  )) as { messages: { author: { username: string }; content: string }[] };

  if (!groupConversation.messages.length)
    return socket.emit("groupHistory", null);

  return socket.emit("groupHistory", groupConversation.messages);
};

const handlePrivateMessage = async (
  socket: Socket,
  data: { to: string; message: string }
) => {
  const io = getIoInstance();
  const senderId = socket.data._id;
  const receiverId = data.to;

  const conversation = await Conversation.findOne({
    participents: { $all: [senderId, receiverId] }
  });

  if (conversation) {
    await Conversation.updateOne(
      {
        _id: conversation._id
      },
      {
        $push: {
          messages: {
            author: senderId,
            message: data.message,
            date: new Date(),
            type: "private"
          }
        }
      }
    );
  } else {
    Conversation.create({
      participents: [senderId, receiverId],
      messages: [
        {
          author: senderId,
          message: data.message,
          date: new Date(),
          type: "private"
        }
      ]
    });
  }

  [senderId, receiverId].forEach((id) => {
    const activeUser = getSocketId(id.toString());

    activeUser &&
      io.to(activeUser).emit("private", {
        author: { username: socket.data.username },
        message: data.message,
        date: new Date(),
        type: "private"
      });
  });
};

const handleGroupMessage = async (
  socket: Socket,
  data: { to: string; message: string }
) => {
  const io = getIoInstance();
  const senderId = socket.data._id;
  const groupId = data.to;

  const group = (await GroupConversation.findByIdAndUpdate(
    groupId,
    {
      $push: {
        messages: {
          author: senderId,
          message: data.message,
          date: new Date(),
          type: "group"
        }
      }
    },
    { projection: "members" }
  )) as { members: string[]; messages: { author: string; message: string }[] };

  group.members.forEach((member: string) => {
    const activeUser = getSocketId(member.toString());

    activeUser &&
      io.to(activeUser).emit("group", {
        author: { username: socket.data.username },
        message: data.message,
        date: new Date(),
        type: "group"
      });
  });
};

const onGoingCalls: string[][] = [];

export const connectedUsers = async (socket: Socket) => {
  if (!Array.from(users.values()).includes(socket.data._id.toString()))
    users.set(socket.id, socket.data._id.toString());

  const userInfo = (await User.findById(
    socket.data._id,
    "receivedInvitation friends"
  )
    .populate({
      path: "receivedInvitation",
      populate: { path: "user", select: "username" }
    })
    .populate("friends", "username")
    .lean()) as {
    friends: friends[];
    receivedInvitation: {
      user: { _id: string; username: string };
      groupName: string;
      groupId: string;
    }[];
  };

  const friends = getOnlineFriends(userInfo.friends);

  if (userInfo.receivedInvitation) {
    let invArr: {}[] = [];
    userInfo.receivedInvitation.forEach(
      (inv: {
        user: { _id: string; username: string };
        groupName: string;
        groupId: string;
      }) => {
        invArr.push({
          _id: inv.user._id,
          username: inv.user.username,
          groupName: inv.groupName,
          groupId: inv.groupId
        });
      }
    );
    socket.emit("invite", invArr);
  }

  socket.emit("friend", friends);

  await updateOnlineFriends(socket.data._id);

  await sendGroupNotification(socket.data._id, socket.id);

  socket.on("privateHistory", async (friendId: string) => {
    await getPrivateHistory(socket, friendId);
  });

  socket.on("groupHistory", async (groupId: string) => {
    await getGroupHistory(socket, groupId);
  });

  socket.on("private", async (data) => {
    await handlePrivateMessage(socket, data);
  });

  socket.on("group", async (data) => {
    await handleGroupMessage(socket, data);
  });

  socket.on("startCall", async (data) => {
    data.activeMembers.forEach(
      (member: { _id: string; username: string; isOnline: boolean }) => {
        socket.to(getSocketId(member._id)).emit("incomingCall", {
          user: socket.data,
          callType: data.callType
        });
      }
    );
  });

  socket.on(
    "callInit",
    async (userInfo: {
      _id: string;
      username: string;
      isOnline: boolean;
      socketId: string;
    }) => {
      let activeMemberIds: string[] = [];
      activeMemberIds.push(userInfo._id);
      activeMemberIds.push(socket.data._id.toString());
      onGoingCalls.push(activeMemberIds);

      socket
        .to(getSocketId(userInfo._id))
        .emit("connPrepare", { id: socket.id, user: socket.data });
    }
  );

  socket.on("connInit", (id) => {
    socket.to(id).emit("connInit", { id: socket.id, user: socket.data });
  });

  socket.on("connSignal", (signalInfo) => {
    socket
      .to(signalInfo.id)
      .emit("connSignal", { ...signalInfo, id: socket.id });
  });

  socket.on("calleeLeft", () => {
    onGoingCalls.forEach((call) => {
      if (call.includes(socket.data._id.toString())) {
        call.forEach((id) => {
          socket
            .to(getSocketId(id))
            .emit("calleeLeft", { id: socket.id, user: socket.data });
        });

        call.splice(call.indexOf(socket.data._id.toString()), 1);
        if (call.length === 1) {
          onGoingCalls.splice(onGoingCalls.indexOf(call), 1);
        }
      }
    });
  });

  socket.on("disconnect", async () => {
    onGoingCalls.forEach((call) => {
      if (call.includes(socket.data._id.toString())) {
        call.forEach((id) => {
          socket
            .to(getSocketId(id))
            .emit("calleeLeft", { id: socket.id, user: socket.data });
        });

        call.splice(call.indexOf(socket.data._id.toString()), 1);
        if (call.length === 1) {
          onGoingCalls.splice(onGoingCalls.indexOf(call), 1);
        }
      }
    });

    users.delete(socket.id);
    await updateOnlineFriends(socket.data._id, false);
  });
};
