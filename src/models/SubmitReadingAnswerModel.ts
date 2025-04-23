import mongoose, { Model, Schema } from "mongoose";

export interface SubmitReadingAnswers extends mongoose.Document {
  userId: String;
  testId: String;
  answer: String;
  totalScore: Number;
  submittedAt: string;
}

const SubmitReadingAnswerSchema = new mongoose.Schema<SubmitReadingAnswers>({
  userId: {
    type: String,
    required: [true, "Please provide a unique userId."],
  },
  testId: {
    type: String,
    required: [true, "Please provide a unique testId"],
  },
  answer: {
    type: Array,
    required: [true, "Please provide answers"],
  },
  submittedAt: {
    type: String,
    required: [true, "Please provide submission time"],
  },
  totalScore: {
    type: Number,
    required: [true, "Please submit your score"],
  },
});

export default (mongoose.models.SubmitAnswers as Model<SubmitReadingAnswers>) ||
  mongoose.model<SubmitReadingAnswers>(
    "SubmitReadingAnswer",
    SubmitReadingAnswerSchema
  );
