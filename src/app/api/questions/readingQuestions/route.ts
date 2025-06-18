import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReadingModel from "@/models/ReadingModel";

// GET handler
export async function GET() {
  try {
    await dbConnect();
    const tests = await ReadingModel.find({});
    return NextResponse.json({ success: true, data: tests });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch reading tests" },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    // Validate input data here if needed
    const newTest = await ReadingModel.create(body);
    return NextResponse.json({ success: true, data: newTest }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid data format - Failed to create test" },
      { status: 400 }
    );
  }
}