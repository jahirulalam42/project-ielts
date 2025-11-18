import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import NotificationModel from "@/models/NotificationModel";
import UserModel from "@/models/UserModel";
import { authOptions } from "@/lib/auth";

const serializeNotification = (notification: any) => ({
  ...notification,
  _id: notification._id.toString(),
  createdAt: notification.createdAt?.toISOString?.() ?? notification.createdAt,
  updatedAt: notification.updatedAt?.toISOString?.() ?? notification.updatedAt,
  targetUserId: notification.targetUserId
    ? notification.targetUserId.toString()
    : undefined,
  readBy: (notification.readBy || []).map((reader: any) =>
    reader?.toString ? reader.toString() : reader
  ),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");
    const limitParam = searchParams.get("limit") || "30";
    const limit = Number.isNaN(Number(limitParam)) ? 30 : parseInt(limitParam);

    if (scope === "admin") {
      if (session.user.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      const notifications = await NotificationModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        data: notifications.map(serializeNotification),
      });
    }

    const userId = session.user.id;

    const notifications = await NotificationModel.find({
      $or: [
        { audience: "all" },
        { audience: "user", targetUserId: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const formatted = notifications.map((notification: any) => {
      const serialized = serializeNotification(notification);
      return {
        ...serialized,
        isRead: serialized.readBy?.includes(userId) ?? false,
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      message,
      type = "info",
      link,
      targetType = "all",
      targetUserEmail,
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and message are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    let targetUserId = null;
    if (targetType === "user") {
      if (!targetUserEmail) {
        return NextResponse.json(
          {
            success: false,
            error: "Target user email is required",
          },
          { status: 400 }
        );
      }

      const targetUser = await UserModel.findOne({
        email: targetUserEmail.toLowerCase().trim(),
      });

      if (!targetUser) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      targetUserId = targetUser._id;
    }

    const notification = await NotificationModel.create({
      title,
      message,
      type,
      link,
      audience: targetType === "all" ? "all" : "user",
      targetUserId,
      createdBy: session.user.id,
    });

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    console.error("Notifications POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

