import mongoose from "mongoose";

export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: any;
  role: string;
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
  role: {
    type: String,
  },
});

export default mongoose.models.user || mongoose.model<User>("user", userSchema);
