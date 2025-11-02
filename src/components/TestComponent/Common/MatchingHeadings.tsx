import React from "react";
import FormattedInstructions from "./FormattedInstructions";

const MatchingHeadings = ({
  instructions,
  question,
  answers,
  setAnswers,
  handleAnswerChange,
  handleQuestionFocus,
}: any) => {
  return (
    <div>
      {/* <h5 className="font-medium mb-2">Heading Matching</h5> */}
      <FormattedInstructions instructions={instructions} />

      {question.map((q: any) => {
        return (
          <div
            key={q.question_number}
            className="p-4 border border-black rounded-lg mb-2 flex items-center gap-3"
          >
            {/* Question Number */}
            <strong className="min-w-[30px]">{q.question_number}.</strong>

            {/* Dropdown */}
            <select
              className="border border-black-400 px-2 py-1 rounded-md text-sm w-32"
              onFocus={() => handleQuestionFocus(q.question_number)}
              onChange={(e) =>
                handleAnswerChange(
                  q.question_number,
                  e.target.value,
                  "Matching Headings",
                  q.answer,
                  e.target.value === q.answer ? true : false
                )
              }
              defaultValue={""}
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
        );
      })}
    </div>
  );
};

export default MatchingHeadings;
