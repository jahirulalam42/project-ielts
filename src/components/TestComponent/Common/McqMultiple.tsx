import React from "react";

const McqMultiple = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Multiple Select Questions</h5>
      {question.map((q: any, idx: number) => (
        <div key={idx} className="p-4 border rounded-lg mb-2">
          <p>
            <strong>{q.question_number.join(", ")}. </strong>
            {q.question}
          </p>
          <div className="mt-2 space-y-2">
            {q.options.map((option: any) => (
              <label key={option.label} className="flex items-center space-x-2">
                <input type="checkbox" className="checkbox checkbox-primary" onChange={(e) =>
                  handleAnswerChange(
                    `${q.question_number.join(
                      "_"
                    )}`,
                    option.value,
                    q.input_type,
                    q.answer,
                  )
                } />
                <span>{option.value}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default McqMultiple;
