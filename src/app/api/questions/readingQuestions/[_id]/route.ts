// app/api/questions/reading/[id]/route.ts
import { NextResponse } from "next/server";
// Adjust the path based on your project structure
import readingData from "../../../../../../data/reading.json";
import dbConnect from "@/lib/dbConnect";
import ReadingModel from "@/models/ReadingModel";

interface ReadingTest {
  id: string;
  title: string;
  type: string;
  duration: number;
  parts: Array<any>;
}

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   // Extract the test ID from the URL params
//   const { id } = params;

//   // Find the test by id from the JSON data
//   const test: ReadingTest | undefined = readingData.readingTests.find(
//     (test: ReadingTest) => test.id === id
//   );

//   if (!test) {
//     // Return a 404 response if no test is found
//     return NextResponse.json({ error: "Test not found" }, { status: 404 });
//   }

//   // Return the found test data as JSON
//   return NextResponse.json(test);
// }

export async function GET(
  request: Request,
  { params }: { params: { _id: string } }
) {
  try {
    await dbConnect();
    const { _id } = params;
    const test = await ReadingModel.findById(_id);
    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch reading tests" },
      { status: 500 }
    );
  }
}
