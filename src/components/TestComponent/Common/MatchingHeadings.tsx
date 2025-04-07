import React from "react";

const MatchingHeadings = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Heading Matching</h5>
      {question.map((q: any) => (
        <div
          key={q.question_number}
          className="p-4 border rounded-lg mb-2 flex items-center gap-3"
        >
          {/* Question Number */}
          <strong className="min-w-[30px]">{q.question_number}.</strong>

          {/* Dropdown */}
          <select
            className="border border-gray-400 px-2 py-1 rounded-md text-sm w-32"
            onChange={(e) =>
              handleAnswerChange(
                q.question_number,
                e.target.value,
                q.input_type,
                q.answer
              )
            }
            defaultValue=""
          >
            <option value="" disabled></option>
            {q.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Question Text (Takes Remaining Space) */}
          <span className="flex-1">{q.question}</span>
        </div>
      ))}
    </div>
  );
};

export default MatchingHeadings;
