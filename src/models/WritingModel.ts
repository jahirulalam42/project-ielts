import mongoose, { Model, Schema } from "mongoose";

interface PartsObject {
  title: string;
  instructions: string;
  passage_title: string;
  passage_subtitle: string;
  passage: Array<string> | Array<{ [key: string]: string }>;
  image?: string;
}

export interface WritingTest extends mongoose.Document {
  title: String;
  type: String;
  duration: Number;
  parts: PartsObject[];
}

const WritingSchema = new mongoose.Schema<WritingTest>({
  title: {
    type: String,
    required: [true, "Please provide a name for title."],
  },
  type: {
    type: String,
    required: [true, "Please provide the type of exam."],
  },
  duration: {
    type: Number,
    required: [true, "Please provide duration of Exam Time."],
  },
  parts: [
    {
      title: String,
      instructions: String,
      passage_title: String,
      passage_subtitle: String,
      passage: [Schema.Types.Mixed],
      image: String,
    },
  ],
});

export default (mongoose.models.WritingTest as Model<WritingTest>) ||
  mongoose.model<WritingTest>("WritingTest", WritingSchema);
