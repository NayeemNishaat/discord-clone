import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Input from "./Input";
import { useState, useEffect, SyntheticEvent, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button } from "@mui/material";
import { AlertColor } from "@mui/material/Alert";
import Alert from "./Alert";

export default function ModalInvite({
  open,
  handleClose
}: {
  open: boolean;
  handleClose: React.ReactEventHandler;
}) {
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const [valid, setValid] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    type: AlertColor;
    message: string;
  }>({
    show: false,
    type: "success",
    message: ""
  });

  const activeChat = useSelector((state: RootState) => state.chat.activeChat);

  useEffect(() => {
    if (
      emailTouched &&
      (email === "" ||
        !new RegExp(
          /^[^\W][a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        ).test(email.toLowerCase()))
    )
      setValidEmail(false);
    else setValidEmail(true);

    if (emailTouched && validEmail) setValid(true);
    else setValid(false);
  }, [emailTouched, email, validEmail]);

  const clickHandler = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/user/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          invitee: email,
          groupId: activeChat.chatType === "group" ? activeChat.id : null,
          groupName: activeChat.chatType === "group" ? activeChat.name : null
        })
      });

      const data = await res.json();

      setEmailTouched(false);
      setEmail("");

      if (data.status === "fail" || data.status === "error")
        throw Error(data.message);

      setAlertInfo({
        show: true,
        type: "success",
        message: "Invitation Sent!"
      });

      setTimeout(() => {
        setAlertInfo({
          show: false,
          type: "success",
          message: ""
        });
      }, 2000);
    } catch (err: any) {
      setAlertInfo({
        show: true,
        type: "error",
        message: err.message
      });

      setTimeout(() => {
        setAlertInfo({
          show: false,
          type: "success",
          message: ""
        });
      }, 5000);
    }
  };

  return (
    <div>
      {alertInfo.show && (
        <Alert
          show={alertInfo.show}
          type={alertInfo.type}
          message={alertInfo.message}
          setAlertInfo={setAlertInfo}
        />
      )}

      <Modal
        open={open}
        onClose={(e: SyntheticEvent<Element, Event>) => {
          setAlertInfo({
            show: false,
            type: "success",
            message: ""
          });

          handleClose(e);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className="absolute top-1/2 left-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded bg-[#d3d3d3] p-5 text-center">
            <h4 className="font-bold">Invite</h4>
            <p>Insert email to invite</p>
            <Input
              label="Email"
              placeholder="Enter Email"
              type="email"
              value={email}
              setValue={setEmail}
              error={!validEmail}
              helperText={!validEmail ? "Invalid Email" : ""}
              setTouched={setEmailTouched}
            />
            <Button
              variant="outlined"
              disabled={!valid}
              onClick={clickHandler}
              sx={{
                marginTop: "10px",
                fontWeight: "bold"
              }}
            >
              Submit
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
