"use client";
import React from "react";
import { Question, ReadingTest, Passage } from "../readingTest";

interface FillBlanksFormProps {
  questions: Question[];
  passageIndex: number;
  groupIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
}

const FillBlanksForm: React.FC<FillBlanksFormProps> = ({
  questions,
  passageIndex,
  groupIndex,
  test,
  setTest,
}) => {
  const updateQuestion = (field: string, value: any, qIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions[groupIndex]["fill_in_the_blanks"][
      qIndex
    ][field as keyof Question] = value;
    setTest({ ...test, parts: updatedParts });
  };

  return (
    <div>
      {questions.map((q, idx) => (
        <div key={idx} className="mb-2">
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => updateQuestion("question", e.target.value, idx)}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="Answer"
            value={q.answer}
            onChange={(e) => updateQuestion("answer", e.target.value, idx)}
            className="border p-2"
          />
        </div>
      ))}
    </div>
  );
};

export default FillBlanksForm; 