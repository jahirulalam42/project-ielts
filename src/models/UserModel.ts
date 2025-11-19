import mongoose from "mongoose";

export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: any;
  image: string;
  phone: string;
  location: string;
  bio: string;
  role: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  image: {
    type: String,
  },
  phone: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  role: {
    type: String,
  },
  type: {
    type: String,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

export default mongoose.models.user || mongoose.model<User>("user", userSchema);
