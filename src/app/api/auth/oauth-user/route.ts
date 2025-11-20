// app/api/auth/oauth-user/route.ts
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import NotificationModel from "@/models/NotificationModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (request: Request) => {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, name, provider, providerId } = body;

    if (!email || !name || !provider) {
      return NextResponse.json(
        { success: false, error: "Email, name, and provider are required" },
        { status: 400 }
      );
    }

    // Check if user already exists with this email
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      // User exists - update provider info if needed and return user
      let updatedUser = existingUser;

      // If user doesn't have authProvider field, add it
      if (!existingUser.authProvider) {
        updatedUser = await UserModel.findByIdAndUpdate(
          existingUser._id,
          {
            authProvider: provider,
            providerId: providerId,
          },
          { new: true }
        );
      }

      const { password: _, ...userData } = updatedUser.toObject();

      return NextResponse.json(
        {
          success: true,
          data: {
            _id: userData._id,
            id: userData._id,
            email: userData.email,
            username: userData.username,
            role: userData.role,
          },
        },
        { status: 200 }
      );
    }

    // Create new user for OAuth
    const username = generateUsernameFromEmail(email, name);

    // Generate a random password for OAuth users (they'll never use it)
    const randomPassword =
      Math.random().toString(36).slice(-16) +
      Math.random().toString(36).slice(-16);
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    const newUser = await UserModel.create({
      username: username,
      email: email.toLowerCase().trim(),
      password: hashedPassword, // Required field but won't be used for OAuth login
      authProvider: provider,
      providerId: providerId,
      role: "user", // Default role
      emailVerified: new Date(), // OAuth emails are typically verified
    });

    // Create welcome notification for new OAuth user
    try {
      await NotificationModel.create({
        title: "Welcome to IELTS Prep! 🎉",
        message: `Hello ${newUser.username}! We're thrilled to have you join our IELTS preparation community. Get started by exploring our practice tests, track your progress, and work towards achieving your target band score. Good luck on your IELTS journey!`,
        type: "success",
        audience: "user",
        targetUserId: newUser._id,
        createdBy: newUser._id,
        link: "/userDashboard",
      });
    } catch (error) {
      console.error(
        "Error creating welcome notification for OAuth user:",
        error
      );
      // Don't fail user creation if notification fails
    }

    const { password: _, ...userData } = newUser.toObject();

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: userData._id,
          id: userData._id,
          email: userData.email,
          username: userData.username,
          role: userData.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("OAuth User API Error:", error);

    // Handle duplicate key errors (email already exists)
    if (error.code === 11000 || error.name === "MongoServerError") {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Server error during OAuth user processing" },
      { status: 500 }
    );
  }
};

// Helper function to generate username from email or name
function generateUsernameFromEmail(email: string, name: string): string {
  // Try to use the name first
  if (name) {
    const cleanName = name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    if (cleanName.length >= 3) {
      return cleanName;
    }
  }

  // Fallback to email username part
  const emailUsername = email.split("@")[0];
  const cleanEmailUsername = emailUsername
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");

  return cleanEmailUsername;
}
