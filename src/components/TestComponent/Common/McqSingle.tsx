import React from "react";

const McqSingle = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Multiple Choice Questions</h5>
      {question.map((q: any, idx: number) => (
        <div key={idx} className="p-4 border rounded-lg mb-2">
          <p>
            <strong>{q.question_number}. </strong>
            {q.question}
          </p>
          <div className="mt-2 space-y-2">
            {q.options.map((option: any) => (
              <label key={option.label} className="flex items-center space-x-2">
                <input
                  type={q.input_type === "checkbox" ? "checkbox" : "radio"}
                  name={`mcq-${idx}`}
                  className="checkbox checkbox-primary"
                  onChange={(e) =>
                    handleAnswerChange(
                      q.question_number,
                      option.value,
                      q.input_type,
                      q.answer
                    )
                  }
                />
                <span>{option.value}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default McqSingle;
