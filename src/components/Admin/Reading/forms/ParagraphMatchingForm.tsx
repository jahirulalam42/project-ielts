"use client";
import React from "react";
import { Question, ReadingTest, Passage } from "../readingTest";

interface ParagraphMatchingFormProps {
  questions: Question[];
  passageIndex: number;
  groupIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
}

const ParagraphMatchingForm: React.FC<ParagraphMatchingFormProps> = ({
  questions,
  passageIndex,
  groupIndex,
  test,
  setTest,
}) => {
  const updateQuestion = (field: string, value: any, qIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions[groupIndex]["paragraph_matching"][
      qIndex
    ][field as keyof Question] = value;
    setTest({ ...test, parts: updatedParts });
  };

  // Helper function to format question numbers
  const formatQuestionNumber = (questionNumber: number | undefined) => {
    if (!questionNumber) return "N/A";
    return questionNumber.toString();
  };

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div key={idx} className="border p-4 rounded-lg">
          {/* Question Number Display */}
          <div className="mb-2">
            <span className="font-medium">Question Number: </span>
            <span className="text-blue-600">
              {formatQuestionNumber(q.question_number)}
            </span>
          </div>

          {/* Question Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question:
            </label>
            <input
              type="text"
              placeholder="Question reference (e.g., Which paragraph discusses piracy?)"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="input input-bordered border-black w-full"
            />
          </div>

          {/* Answer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Answer:
            </label>
            <select
              value={q.answer || ""}
              onChange={(e) => updateQuestion("answer", e.target.value, idx)}
              className="select select-bordered border-black w-full"
            >
              <option value="">-- Select Answer --</option>
              {q.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}: {option.value}
                </option>
              ))}
            </select>
          </div>

          {/* Available Options Display */}
          {q.options && q.options.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Paragraphs:
              </label>
              <div className="space-y-2">
                {q.options.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <span className="font-medium">{option.label}:</span>
                    <span>{option.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Message */}
          {!q.answer && (
            <div className="text-orange-500 text-sm mt-2">
              Please select an answer for this question.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParagraphMatchingForm; 