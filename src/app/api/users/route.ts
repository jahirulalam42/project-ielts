import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

// GET - Fetch all users
export async function GET() {
  try {
    await dbConnect();
    const users = await UserModel.find({});
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    // Validate input data here if needed
    const newUser = await UserModel.create(body);
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid User format - Failed to create User" },
      { status: 400 }
    );
  }
}
