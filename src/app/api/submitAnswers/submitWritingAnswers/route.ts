import dbConnect from "@/lib/dbConnect";
import SubmitAnswerModel from "@/models/SubmitWritingAnswerModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const submitAnswer = await SubmitAnswerModel.find({});
    return NextResponse.json({ success: true, data: submitAnswer });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch Answers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    // Validate input data here if needed
    const submitAnswer = await SubmitAnswerModel.create(body);
    return NextResponse.json(
      { success: true, data: submitAnswer },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Invalid data format - Failed to submit answer",
      },
      { status: 400 }
    );
  }
}

// /api/submission/update-total-score.ts
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { submissionId, totalScore } = body;

    if (!submissionId || totalScore == null) {
      return NextResponse.json(
        { success: false, error: "Missing testId, userId, or totalScore" },
        { status: 400 }
      );
    }

    const result = await SubmitAnswerModel.findByIdAndUpdate(
      { _id: submissionId },
      { $set: { totalScore } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Update totalScore error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update totalScore" },
      { status: 500 }
    );
  }
}
