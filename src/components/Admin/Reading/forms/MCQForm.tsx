"use client";
import React from "react";
import { Question, ReadingTest, Passage } from "../readingTest";

interface MCQFormProps {
  questions: Question[];
  passageIndex: number;
  groupIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
}

const MCQForm: React.FC<MCQFormProps> = ({
  questions,
  passageIndex,
  groupIndex,
  test,
  setTest,
}) => {
  const updateQuestion = (field: string, value: any, qIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions[groupIndex]["mcq"][qIndex][
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
      ...updatedParts[passageIndex].questions[groupIndex]["mcq"][qIndex].options!,
    ];
    options[optIndex] = { ...options[optIndex], [field]: value };
    updatedParts[passageIndex].questions[groupIndex]["mcq"][qIndex].options =
      options;
    setTest({ ...test, parts: updatedParts });
  };

  const addOption = (qIndex: number) => {
    const updatedParts = [...test.parts];
    const options = [
      ...updatedParts[passageIndex].questions[groupIndex]["mcq"][qIndex].options!,
    ];
    options.push({ label: "", value: "" });
    updatedParts[passageIndex].questions[groupIndex]["mcq"][qIndex].options =
      options;
    setTest({ ...test, parts: updatedParts });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updatedParts = [...test.parts];
    const options = [
      ...updatedParts[passageIndex].questions[groupIndex]["mcq"][qIndex].options!,
    ];
    options.splice(optIndex, 1);
    updatedParts[passageIndex].questions[groupIndex]["mcq"][qIndex].options =
      options;
    setTest({ ...test, parts: updatedParts });
  };

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div key={idx} className="border p-4 rounded-lg">
          {/* Question input box */}
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

          {/* Correct Answer Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Correct Answer:
            </label>
            <select
              value={q.answer?.[0] || ""}
              onChange={(e) => updateQuestion("answer", [e.target.value], idx)}
              className="select select-bordered border-black w-full"
            >
              <option value="">Select correct answer</option>
              {q.options?.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label}: {opt.value}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MCQForm; 