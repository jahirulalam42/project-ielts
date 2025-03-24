import React from "react";

const PassFillInTheBlanks = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Passage Fill in the Blanks</h5>
      <div className="p-4 border rounded-lg mb-2">
        <p>{question.text}</p>
        <div className="mt-4 space-y-3">
          {question.blanks.map((blank: any) => (
            <div
              key={blank.blank_number}
              className="flex items-center space-x-3"
            >
              <span className="font-bold">Blank {blank.blank_number}:</span>
              <input
                type="text"
                placeholder="Write answer here"
                className="input input-bordered w-full"
                onChange={(e) =>
                  handleAnswerChange(
                    `${blank.blank_number}`,
                    e.target.value,
                    blank.input_type,
                    blank.answer,
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassFillInTheBlanks;
