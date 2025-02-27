import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    await dbConnect();
    const body = await request.json();
    // Validate input data here if needed
    const user = await UserModel.find({ email: body.email });
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid User format - Failed to create test" },
      { status: 400 }
    );
  }
};
