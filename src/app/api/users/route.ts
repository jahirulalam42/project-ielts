import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

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
      { success: false, error: "Invalid User format - Failed to create test" },
      { status: 400 }
    );
  }
}
