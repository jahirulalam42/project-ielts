import mongoose, { Model } from "mongoose";

interface PartsObject {
  title: string;
  passage: string;
  image?: string;
  questions: Object[];
}

interface PartsExactData {
  [key: string]: PartsObject;
}

export interface ReadingTest extends mongoose.Document {
  title: string;
  duration: number;
  parts: PartsExactData;
}

const ReadingSchema = new mongoose.Schema<ReadingTest>({
  title: {
    type: String,
    required: [true, "Please provide a name for title."],
  },
  duration: {
    type: Number,
    required: [true, "Please provide duration of Exam Time."],
  },
  parts: [
    {
      title: String,
      passage: String,
      image: String,
      questions: [{}],
    },
  ],
});

export default (mongoose.models.ReadingTest as Model<ReadingTest>) ||
  mongoose.model<ReadingTest>("ReadingTest", ReadingSchema);
