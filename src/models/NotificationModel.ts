import mongoose, { Model, Schema } from "mongoose";

export interface NotificationDocument extends mongoose.Document {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "urgent";
  link?: string;
  audience: "all" | "user";
  targetUserId?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  readBy: string[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "urgent"],
      default: "info",
    },
    link: {
      type: String,
      default: "",
    },
    audience: {
      type: String,
      enum: ["all", "user"],
      default: "all",
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readBy: {
      type: [String],
      default: [],
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ audience: 1, targetUserId: 1 });

export default (mongoose.models.Notification as Model<NotificationDocument>) ||
  mongoose.model<NotificationDocument>("Notification", NotificationSchema);

