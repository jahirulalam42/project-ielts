"use client";
import React from "react";
import { Question, ReadingTest, Passage } from "../readingTest";

interface PassageFillBlanksFormProps {
  questions: Question[];
  passageIndex: number;
  groupIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
  triggerGlobalRecalculation?: () => void;
}

const PassageFillBlanksForm: React.FC<PassageFillBlanksFormProps> = ({
  questions,
  passageIndex,
  groupIndex,
  test,
  setTest,
  triggerGlobalRecalculation,
}) => {
  const updateQuestion = (field: string, value: any, qIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions[groupIndex]["passage_fill_in_the_blanks"][
      qIndex
    ][field as keyof Question] = value;
    setTest({ ...test, parts: updatedParts });
    if (triggerGlobalRecalculation) {
      triggerGlobalRecalculation();
    }
  };

  // Function to extract blanks from text
  const getBlanksFromText = (text: string, questionNumbers?: number[] | number) => {
    const regex = /__________/g;
    const matches = [...text.matchAll(regex)];
    return matches.map((match, index) => ({
      blank_number: Array.isArray(questionNumbers) 
        ? questionNumbers[index] 
        : typeof questionNumbers === 'number'
          ? questionNumbers + index
          : index + 1,
      input_type: "text",
      answer: "",
    }));
  };

  // Helper function to format question numbers
  const formatQuestionNumbers = (questionNumber: number | number[] | undefined) => {
    if (!questionNumber) return "N/A";
    if (Array.isArray(questionNumber)) return questionNumber.join(", ");
    return questionNumber.toString();
  };

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div key={idx} className="border p-4 rounded-lg">
          {/* Question Numbers Display */}
          <div className="mb-2">
            <span className="font-medium">Question Numbers: </span>
            <span className="text-blue-600">
              {q.blanks && q.blanks.length > 0
                ? q.blanks.map((b) => b.blank_number).join(", ")
                : formatQuestionNumbers(q.question_number)}
            </span>
          </div>

          {/* Passage Text with Blanks */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passage text (use __________ for blanks):
            </label>
            <textarea
              placeholder="Enter the passage text with __________ where blanks should be"
              value={q.text || ""}
              onChange={(e) => {
                const newText = e.target.value;
                // Get existing blanks to preserve answers
                const existingBlanks = q.blanks || [];
                const existingAnswers = existingBlanks.reduce(
                  (acc, blank) => {
                    acc[blank.blank_number] = blank.answer;
                    return acc;
                  },
                  {} as Record<number, string>
                );

                // Extract new blanks from text
                const extractedBlanks = getBlanksFromText(
                  newText,
                  q.question_number
                );

                // Map the blanks to use the question numbers and preserve existing answers
                const blanksWithQuestionNumbers = extractedBlanks.map(
                  (blank, blankIdx) => ({
                    blank_number: Array.isArray(q.question_number)
                      ? q.question_number[blankIdx]
                      : typeof q.question_number === 'number'
                        ? q.question_number + blankIdx
                        : blankIdx + 1,
                    input_type: "text",
                    answer:
                      existingAnswers[
                        Array.isArray(q.question_number)
                          ? q.question_number[blankIdx]
                          : typeof q.question_number === 'number'
                            ? q.question_number + blankIdx
                            : blankIdx + 1
                      ] || "",
                  })
                );

                // Update both the text and the blanks
                updateQuestion("text", newText, idx);
                updateQuestion("blanks", blanksWithQuestionNumbers, idx);
              }}
              className="textarea textarea-bordered border-black w-full"
              rows={6}
            />
          </div>

          {/* Answers for Blanks */}
          {q.blanks && q.blanks.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answers for blanks:
              </label>
              <div className="space-y-2">
                {q.blanks.map((blank, blankIdx) => (
                  <div
                    key={`${blank.blank_number}-${blankIdx}`}
                    className="flex items-center gap-2"
                  >
                    <span className="font-medium">
                      Question {blank.blank_number}:
                    </span>
                    <input
                      type="text"
                      placeholder="Answer"
                      value={blank.answer || ""}
                      onChange={(e) => {
                        const updatedBlanks = q.blanks ? [...q.blanks] : [];
                        if (updatedBlanks[blankIdx]) {
                          updatedBlanks[blankIdx] = {
                            ...updatedBlanks[blankIdx],
                            answer: e.target.value,
                          };
                        }
                        updateQuestion("blanks", updatedBlanks, idx);
                      }}
                      className="input input-bordered border-black flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Messages */}
          {(!q.blanks || q.blanks.length === 0) && q.text && (
            <div className="text-red-500 text-sm">
              No blanks detected. Use __________ (10 underscores) to create blanks
              in your text.
            </div>
          )}

          {q.blanks &&
            q.question_number &&
            q.blanks.length > (Array.isArray(q.question_number) ? q.question_number.length : 1) && (
              <div className="text-orange-500 text-sm">
                Warning: You have {q.blanks.length} blanks but only{" "}
                {Array.isArray(q.question_number) ? q.question_number.length : 1} question numbers allocated. Some blanks
                may not have proper question numbers.
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default PassageFillBlanksForm; 