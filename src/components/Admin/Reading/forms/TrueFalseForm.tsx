"use client";
import React from "react";
import { Question, ReadingTest, Passage } from "../readingTest";

interface TrueFalseFormProps {
  questions: Question[];
  passageIndex: number;
  groupIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
}

const TrueFalseForm: React.FC<TrueFalseFormProps> = ({
  questions,
  passageIndex,
  groupIndex,
  test,
  setTest,
}) => {
  const updateQuestion = (field: string, value: any, qIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions[groupIndex]["true_false_not_given"][
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
            className="input input-bordered border-black w-full mb-4"
          />
          <select
            value={q.answer}
            onChange={(e) => updateQuestion("answer", e.target.value, idx)}
            className="select select-bordered border-black w-full"
          >
            <option>True</option>
            <option>False</option>
            <option>Not Given</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default TrueFalseForm; 