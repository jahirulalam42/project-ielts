"use client";
import React from "react";
import { Question, ReadingTest, Passage } from "../readingTest";

interface MultipleMCQFormProps {
  questions: Question[];
  passageIndex: number;
  groupIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
}

const MultipleMCQForm: React.FC<MultipleMCQFormProps> = ({
  questions,
  passageIndex,
  groupIndex,
  test,
  setTest,
}) => {
  const updateQuestion = (field: string, value: any, qIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions[groupIndex]["multiple_mcq"][qIndex][
      field as keyof Question
    ] = value;
    setTest({ ...test, parts: updatedParts });
  };

  const updateOption = (
    qIndex: number,
    optIndex: number,
    field: string,
    value: string
  ) => {
    const updatedParts = [...test.parts];
    const options = [
      ...updatedParts[passageIndex].questions[groupIndex]["multiple_mcq"][qIndex]
        .options!,
    ];
    options[optIndex] = { ...options[optIndex], [field]: value };
    updatedParts[passageIndex].questions[groupIndex]["multiple_mcq"][qIndex].options =
      options;
    setTest({ ...test, parts: updatedParts });
  };

  const addOption = (qIndex: number) => {
    const updatedParts = [...test.parts];
    const options = [
      ...updatedParts[passageIndex].questions[groupIndex]["multiple_mcq"][qIndex]
        .options!,
    ];
    options.push({ label: "", value: "" });
    updatedParts[passageIndex].questions[groupIndex]["multiple_mcq"][qIndex].options =
      options;
    setTest({ ...test, parts: updatedParts });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updatedParts = [...test.parts];
    const options = [
      ...updatedParts[passageIndex].questions[groupIndex]["multiple_mcq"][qIndex]
        .options!,
    ];
    options.splice(optIndex, 1);
    updatedParts[passageIndex].questions[groupIndex]["multiple_mcq"][qIndex].options =
      options;
    setTest({ ...test, parts: updatedParts });
  };

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div key={idx} className="border p-4 rounded-lg">
          {/* Question Numbers Display */}
          <div className="mb-2">
            <span className="font-medium">Question Numbers: </span>
            <span className="text-blue-600">
              {q.question_numbers ? q.question_numbers.join(", ") : "N/A"}
            </span>
          </div>

          {/* Question Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="input input-bordered border-black w-full"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            {q.options?.map((option, optionIdx) => (
              <div key={option.label} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Option ${option.label}`}
                  value={option.value}
                  onChange={(e) =>
                    updateOption(idx, optionIdx, "value", e.target.value)
                  }
                  className="input input-bordered border-black flex-1"
                />
              </div>
            ))}
          </div>

          {/* Correct Answers Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Correct Answers (Choose 2):
            </label>
            <div className="space-y-2">
              {q.options?.map((opt) => (
                <div key={opt.label} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={q.correct_mapping?.includes(opt.label) || false}
                    onChange={(e) => {
                      const updatedCorrectMapping = q.correct_mapping
                        ? [...q.correct_mapping]
                        : [];
                      if (e.target.checked) {
                        if (updatedCorrectMapping.length < 2) {
                          updatedCorrectMapping.push(opt.label);
                        }
                      } else {
                        const index = updatedCorrectMapping.indexOf(opt.label);
                        if (index !== -1) {
                          updatedCorrectMapping.splice(index, 1);
                        }
                      }
                      updateQuestion("correct_mapping", updatedCorrectMapping, idx);
                    }}
                    className="checkbox checkbox-primary"
                  />
                  <span>
                    {opt.label}: {opt.value}
                  </span>
                </div>
              ))}
            </div>
            {q.correct_mapping && q.correct_mapping.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Selected answers: {q.correct_mapping.join(", ")}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleMCQForm; 