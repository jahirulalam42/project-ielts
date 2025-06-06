import dbConnect from "@/lib/dbConnect";
import SubmitAnswerModel from "@/models/SubmitWritingAnswerModel";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: any }) {
  try {
    await dbConnect();
    const resolvedParams = await params;

    const ids = resolvedParams.id;

    // Validate that ids is an array with two valid ObjectIDs
    if (
      !Array.isArray(ids) ||
      ids.length !== 2 ||
      !/^[0-9a-fA-F]{24}$/.test(ids[0]) ||
      !/^[0-9a-fA-F]{24}$/.test(ids[1])
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid testId or userId format" },
        { status: 400 }
      );
    }

    const [testId, userId] = ids;

    const result = await SubmitAnswerModel.findOne({ testId, userId }).sort({
      submittedAt: -1,
    }); // Sort by submittedAt descending (most recent first)

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "No data found for the provided testId and userId",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const ids = resolvedParams.id;

    // Validate that ids is an array with two valid ObjectIDs
    if (
      !Array.isArray(ids) ||
      ids.length !== 2 ||
      !/^[0-9a-fA-F]{24}$/.test(ids[0]) ||
      !/^[0-9a-fA-F]{24}$/.test(ids[1])
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid testId or userId format" },
        { status: 400 }
      );
    }

    const [testId, userId] = ids;
    const body = await request.json();
    const { partId, evaluation } = body;

    if (!partId || !evaluation) {
      return NextResponse.json(
        { success: false, error: "Missing partId or evaluation data" },
        { status: 400 }
      );
    }

    // Find the submission and update the specific answer's evaluation
    const result = await SubmitAnswerModel.findOneAndUpdate(
      { testId, userId },
      { $set: { "answers.$[elem].evaluation": evaluation } },
      {
        arrayFilters: [{ "elem.partId": partId }],
        new: true
      }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "No submission found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to update evaluation" },
      { status: 500 }
    );
  }
}
