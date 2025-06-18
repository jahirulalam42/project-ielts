"use client";
import React from "react";
import { Question, ReadingTest, Passage } from "../readingTest";

interface SummaryFillBlanksFormProps {
  questions: Question[];
  passageIndex: number;
  groupIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
}

const SummaryFillBlanksForm: React.FC<SummaryFillBlanksFormProps> = ({
  questions,
  passageIndex,
  groupIndex,
  test,
  setTest,
}) => {
  const updateQuestion = (field: string, value: any, qIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions[groupIndex]["summary_fill_in_the_blanks"][
      qIndex
    ][field as keyof Question] = value;
    setTest({ ...test, parts: updatedParts });
  };

  // Helper function to format question numbers
  const formatQuestionNumbers = (questionNumbers: number[] | undefined) => {
    if (!questionNumbers) return "N/A";
    return questionNumbers.join(", ");
  };

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div key={idx} className="border p-4 rounded-lg">
          {/* Question Numbers Display */}
          <div className="mb-2">
            <span className="font-medium">Question Numbers: </span>
            <span className="text-blue-600">
              {formatQuestionNumbers(q.question_numbers)}
            </span>
          </div>

          {/* Passage Text with Blanks */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passage text (use __________ for blanks):
            </label>
            <textarea
              placeholder="Enter the passage text with __________ where blanks should be"
              value={q.passage || ""}
              onChange={(e) => {
                const newPassage = e.target.value;
                const regex = /__________/g;
                const matches = [...newPassage.matchAll(regex)];
                const numBlanks = matches.length;

                // Update question_numbers to match the number of blanks
                const startNumber = q.question_numbers?.[0] || 1;
                const newQuestionNumbers = Array.from(
                  { length: numBlanks },
                  (_, idx) => startNumber + idx
                );

                updateQuestion("passage", newPassage, idx);
                updateQuestion("question_numbers", newQuestionNumbers, idx);
              }}
              className="textarea textarea-bordered border-black w-full"
              rows={6}
            />
          </div>

          {/* Options Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options:
            </label>
            <div className="space-y-2">
              {(q.options || []).map((option, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <span className="font-medium">{option.label}:</span>
                  <input
                    type="text"
                    placeholder={`Option ${option.label}`}
                    value={option.value}
                    onChange={(e) => {
                      const updatedOptions = [...(q.options || [])];
                      updatedOptions[optIdx] = {
                        ...updatedOptions[optIdx],
                        value: e.target.value,
                      };
                      updateQuestion("options", updatedOptions, idx);
                    }}
                    className="input input-bordered border-black flex-1"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const label = String.fromCharCode(65 + (q.options?.length || 0));
                const newOption = { label, value: "" };
                const updatedOptions = [...(q.options || []), newOption];
                updateQuestion("options", updatedOptions, idx);
              }}
              className="btn btn-primary mt-2"
            >
              Add Option
            </button>
          </div>

          {/* Answers Section */}
          {q.passage && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answers for blanks:
              </label>
              <div className="space-y-2">
                {q.question_numbers?.map((questionNumber, blankIdx) => (
                  <div key={questionNumber} className="flex items-center gap-2">
                    <span className="font-medium">
                      Question {questionNumber}:
                    </span>
                    <select
                      value={q.answers?.[blankIdx] || ""}
                      onChange={(e) => {
                        const updatedAnswers = [...(q.answers || [])];
                        updatedAnswers[blankIdx] = e.target.value;
                        updateQuestion("answers", updatedAnswers, idx);
                      }}
                      className="select select-bordered border-black flex-1"
                    >
                      <option value="">Select an option</option>
                      {(q.options || []).map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label}: {option.value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Messages */}
          {(!q.passage || !q.passage.includes("__________")) && (
            <div className="text-red-500 text-sm">
              No blanks detected. Use __________ (10 underscores) to create blanks
              in your text.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryFillBlanksForm; 