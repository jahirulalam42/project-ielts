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

          <div>
            {/* Dropdown */}
            <select
              className="border border-gray-400 px-2 py-1 rounded-md text-sm"
              id={q.question_number}
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
            <label htmlFor={q.question_number} className="px-2">{q.question}</label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrueFalse;
