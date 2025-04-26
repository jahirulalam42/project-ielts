import dbConnect from "@/lib/dbConnect";
import SubmitAnswerModel from "@/models/SubmitReadingAnswerModel";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: any }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    console.log("resolvedParams", resolvedParams);
    const { id } = resolvedParams;

    // Validate the ID is a properly formatted MongoDB ObjectID
    if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid MongoDB ObjectID format" },
        { status: 400 }
      );
    }

    const testId = await SubmitAnswerModel.find({ testId: id });
    return NextResponse.json({ success: true, data: testId });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch reading tests" },
      { status: 500 }
    );
  }
}
