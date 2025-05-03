import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import WritingModel from "@/models/WritingModel";

interface ReadingTest {
  id: string;
  title: string;
  type: string;
  duration: number;
  parts: Array<any>;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Validate the ID is a properly formatted MongoDB ObjectID
    if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid MongoDB ObjectID format" },
        { status: 400 }
      );
    }

    const test = await WritingModel.findById(id);
    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch reading tests" },
      { status: 500 }
    );
  }
}
