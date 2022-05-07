import mongoose, { Schema, Document } from "mongoose";

interface IuserSchema extends Document {
	username: string;
	password: string;
	confirmPassword: string | undefined;
	email: string;
}

const userSchema: Schema = new mongoose.Schema({
	username: {
		type: String,
		minlength: [3, "Username should have minimum length of 3."],
		maxlength: [10, "Username should have maximum length of 10."],
		trim: true,
		required: [true, "A user must have a name!"]
	},
	password: {
		type: String,
		minlength: [6, "Password length should be 6 or more!"],
		required: [true, "A user must have a password."]
	},
	confirmPassword: {
		type: String,
		minlength: [6, "Confirm Password length should be 6 or more!"],
		required: [true, "A user must have a confirm password."],
		validate: {
			validator: function (this: IuserSchema, currEl: string) {
				return currEl === this.password; // Important: currEl is confirmPassword
			},
			message: "Passwords didn't match."
		}
	},
	email: {
		type: String,
		lowercase: true,
		required: [true, "A user must have an email."],
		validate: {
			validator: (email: string) => {
				return email.match(
					/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				);
			},
			message: "Please provide a valid Email!"
		}
	}
});

userSchema.pre<IuserSchema>("save", function (next) {
	if (!this.isModified("password")) return next();

	this.confirmPassword = undefined;

	next();
});

export default mongoose.model("User", userSchema);
