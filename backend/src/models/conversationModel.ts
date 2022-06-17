import mongoose, { Schema } from "mongoose";

const conversationSchema: Schema = new mongoose.Schema({
	participents: [
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

export default mongoose.model("Conversation", conversationSchema);
