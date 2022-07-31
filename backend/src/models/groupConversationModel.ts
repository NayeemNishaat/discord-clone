import mongoose, { Schema } from "mongoose";

const groupConversationSchema: Schema = new mongoose.Schema({
	name: {
		type: String
	},
	owner: { type: Schema.Types.ObjectId, ref: "User" },
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	],
	messages: [
		{
			author: {
				type: Schema.Types.ObjectId,
				ref: "User"
			},
			message: { type: String },
			date: { type: Date },
			type: { type: String }
		}
	]
});

export default mongoose.model("GroupConversation", groupConversationSchema);
