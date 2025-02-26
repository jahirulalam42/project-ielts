import mongoose from "mongoose";

export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: any;
}

const userSchema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: [true, "Please provide a user Name."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a strong password."],
  },
});

export default mongoose.models.User || mongoose.model<User>("user", userSchema);
