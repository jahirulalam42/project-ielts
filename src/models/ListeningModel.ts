import mongoose, { Model, Schema } from "mongoose";

interface PartsObject {
  title: string;
  questions: Object;
}

export interface ListeningTest extends mongoose.Document {
  title: String;
  type: String;
  duration: Number;
  audioUrl: String;
  parts: PartsObject[];
}

const ListeningSchema = new mongoose.Schema<ListeningTest>({
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
  audioUrl: {
    type: String,
    required: [true, "Please provide the audio URL."],
  },
  parts: [
    {
      title: String,
      questions: Object,
    },
  ],
});

export default (mongoose.models.ListeningTest as Model<ListeningTest>) ||
  mongoose.model<ListeningTest>("ListeningTest", ListeningSchema);
