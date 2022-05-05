import mongoose, { Schema } from "mongoose";

interface userSchema {
	username: String;
	password: String;
	confirmPassword: String;
	email: String;
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
		minlength: [6, "Password length should be 6 or more!"],
		required: [true, "A user must have a password."],
		validate: {
			validator: function (this: userSchema, currEl: String) {
				return currEl === this.password;
			},
			message: "Passwords didn't match."
		}
	},
	email: {
		type: String,
		lowercase: true,
		required: [true, "A user must have an email."],
		validate: {
			validator: (email: String) => {
				return email.match(
					/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				);
			},
			message: "Please provide a valid Email!"
		}
	}
});

export default mongoose.model("User", userSchema);
