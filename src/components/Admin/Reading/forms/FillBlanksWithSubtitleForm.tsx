"use client";
import React from "react";
import { Question, ReadingTest, Passage } from "../readingTest";

interface FillBlanksWithSubtitleFormProps {
  questions: Question[];
  passageIndex: number;
  groupIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
}

interface SubQuestion {
  question_number: number;
  answer: string;
  input_type: string;
}

const FillBlanksWithSubtitleForm: React.FC<FillBlanksWithSubtitleFormProps> = ({
  questions,
  passageIndex,
  groupIndex,
  test,
  setTest,
}) => {
  const updateQuestion = (field: string, value: any, qIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions[groupIndex]["fill_in_the_blanks_with_subtitle"][
      qIndex
    ][field as keyof Question] = value;
    setTest({ ...test, parts: updatedParts });
  };

  return (
    <div className="space-y-4">
      {questions.map((section, sectionIdx) => (
        <div key={sectionIdx} className="border p-4 rounded-lg">
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (optional):
            </label>
            <input
              type="text"
              placeholder="Title"
              value={section.title || ""}
              onChange={(e) => updateQuestion("title", e.target.value, sectionIdx)}
              className="input input-bordered border-black w-full"
            />
          </div>

          {/* Subtitle Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle:
            </label>
            <input
              type="text"
              placeholder="Subtitle"
              value={section.subtitle || ""}
              onChange={(e) => updateQuestion("subtitle", e.target.value, sectionIdx)}
              className="input input-bordered border-black w-full font-medium"
            />
          </div>

          {/* Text Lines with Blanks */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text with blanks:
            </label>
            <div className="space-y-2">
              {section.extra?.map((text: string, textIdx: number) => (
                <div key={textIdx} className="flex items-center gap-2">
                  <textarea
                    placeholder={`Text line ${textIdx + 1} (use __________ for blanks)`}
                    value={text || ""}
                    onChange={(e) => {
                      const updatedExtra = [...section.extra];
                      updatedExtra[textIdx] = e.target.value;
                      updateQuestion("extra", updatedExtra, sectionIdx);
                    }}
                    className="textarea textarea-bordered border-black flex-1"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedExtra = [...section.extra];
                      updatedExtra.splice(textIdx, 1);
                      updateQuestion("extra", updatedExtra, sectionIdx);
                    }}
                    className="btn btn-error btn-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const updatedExtra = [...(section.extra || []), ""];
                updateQuestion("extra", updatedExtra, sectionIdx);
              }}
              className="btn btn-primary mt-2"
            >
              Add Text Line
            </button>
          </div>

          {/* Answers Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answers:
            </label>
            <div className="space-y-2">
              {section.questions?.map((question: SubQuestion, qIdx: number) => (
                <div key={qIdx} className="flex items-center gap-2">
                  <span className="font-medium">
                    Question {question.question_number}:
                  </span>
                  <input
                    type="text"
                    placeholder="Answer"
                    value={question.answer || ""}
                    onChange={(e) => {
                      const updatedQuestions = [...section.questions];
                      updatedQuestions[qIdx].answer = e.target.value;
                      updateQuestion("questions", updatedQuestions, sectionIdx);
                    }}
                    className="input input-bordered border-black flex-1"
                  />
                  <select
                    value={question.input_type || "text"}
                    onChange={(e) => {
                      const updatedQuestions = [...section.questions];
                      updatedQuestions[qIdx].input_type = e.target.value;
                      updateQuestion("questions", updatedQuestions, sectionIdx);
                    }}
                    className="select select-bordered border-black"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedQuestions = [...section.questions];
                      updatedQuestions.splice(qIdx, 1);
                      updateQuestion("questions", updatedQuestions, sectionIdx);
                    }}
                    className="btn btn-error btn-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const currentQuestions = section.questions || [];
                const nextQuestionNumber =
                  currentQuestions.length > 0
                    ? Math.max(...currentQuestions.map((q: SubQuestion) => q.question_number)) + 1
                    : 1;
                const updatedQuestions = [
                  ...currentQuestions,
                  {
                    question_number: nextQuestionNumber,
                    answer: "",
                    input_type: "text",
                  },
                ];
                updateQuestion("questions", updatedQuestions, sectionIdx);
              }}
              className="btn btn-primary mt-2"
            >
              Add Answer
            </button>
          </div>

          {/* Warning Messages */}
          {section.extra?.some(text => text.includes("__________")) && (
            <div className="text-orange-500 text-sm">
              Make sure to add answers for all blanks in the text.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FillBlanksWithSubtitleForm; 