import mongoose, { Model, Schema } from "mongoose";

interface PartsObject {
  title: string;
  passage: Array<string> | Array<{ [key: string]: string }>; // More flexible interface
  image?: string;
  questions: Object;
}

export interface ReadingTest extends mongoose.Document {
  title: String;
  type: String;
  duration: Number;
  parts: PartsObject[];
}

const ReadingSchema = new mongoose.Schema<ReadingTest>({
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
      passage: [Schema.Types.Mixed], // Array of Mixed to allow both string and object elements within the array. Still flexible.
      image: String,
      questions: {},
    },
  ],
});

export default (mongoose.models.ReadingTest as Model<ReadingTest>) ||
  mongoose.model<ReadingTest>("ReadingTest", ReadingSchema);
