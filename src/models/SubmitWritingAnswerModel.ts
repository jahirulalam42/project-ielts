import mongoose, { Model, Schema } from "mongoose";

interface EvaluationResult {
  score: number;
  feedback: {
    taskAchievement: string;
    coherenceAndCohesion: string;
    lexicalResource: string;
    grammaticalRangeAndAccuracy: string;
  };
  overallFeedback: string;
}

export interface SubmitWritingAnswers extends mongoose.Document {
  userId: String;
  testId: String;
  answers: Array<{
    partId: string;
    question: string;
    response: string;
    instructions: string[];
    evaluation?: EvaluationResult;
  }>;
  submittedAt: string;
}

const SubmitWritingAnswerSchema = new mongoose.Schema<SubmitWritingAnswers>({
  userId: {
    type: String,
    required: [true, "Please provide a unique userId."],
  },
  testId: {
    type: String,
    required: [true, "Please provide a unique testId"],
  },
  answers: [{
    partId: String,
    question: String,
    response: String,
    instructions: [String],
    evaluation: {
      score: Number,
      feedback: {
        taskAchievement: String,
        coherenceAndCohesion: String,
        lexicalResource: String,
        grammaticalRangeAndAccuracy: String
      },
      overallFeedback: String
    }
  }],
  submittedAt: {
    type: String,
    required: [true, "Please provide submission time"],
  },
});

export default (mongoose.models.SubmitWritingAnswer as Model<SubmitWritingAnswers>) ||
  mongoose.model<SubmitWritingAnswers>("SubmitWritingAnswer", SubmitWritingAnswerSchema);
