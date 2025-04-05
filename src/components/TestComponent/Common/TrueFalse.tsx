import React from "react";

const TrueFalse = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">True/False/Not Given</h5>
      {question.map((q: any) => (
        <div
          key={q.question_number}
          className="p-4 border rounded-lg mb-2 flex items-center gap-3"
        >
          {/* Question Number */}
          <strong className="min-w-[30px]">{q.question_number}.</strong>

          {/* Dropdown */}
          <select
            className="border border-gray-400 px-2 py-1 rounded-md text-sm"
            onChange={(e) =>
              handleAnswerChange(
                `${q.question_number}`,
                e.target.value,
                q.input_type,
                q.answer
              )
            }
            defaultValue=""
          >
            <option disabled value="">
            </option>
            <option value="True">True</option>
            <option value="False">False</option>
            <option value="Not Given">Not Given</option>
          </select>

          {/* Question Text (Takes Remaining Space) */}
          <p className="flex-1">{q.question}</p>
        </div>
      ))}
    </div>
  );
};

export default TrueFalse;
