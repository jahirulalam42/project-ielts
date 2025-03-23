import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

interface User {
  username: string;
  email: string;
  password: string;
}

export const POST = async (request: Request) => {
  try {
    await dbConnect();
    const body = await request.json();
    // Validate input data here if needed
    const user: User[] = await UserModel.find({ email: body.email });
    if (body.password === user[0].password) {
      return NextResponse.json({ success: true, data: user }, { status: 201 });
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid User format - Failed to create test" },
      { status: 400 }
    );
  }
};
