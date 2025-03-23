// app/api/questions/reading/[id]/route.ts
import { NextResponse } from "next/server";
// Adjust the path based on your project structure
import readingData from "../../../../../../data/reading.json";
import dbConnect from "@/lib/dbConnect";
import ReadingModel from "@/models/ReadingModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const test = await ReadingModel.findById(id);
    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch reading tests" },
      { status: 500 }
    );
  }
}
