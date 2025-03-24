import React from "react";


const FillInTheBlanks: React.FC<any> = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Fill in the Blanks</h5>
      {question.map((q: any) => (
        <div key={q.question_number} className="p-4 border rounded-lg mb-2">
          <p>
            <strong>{q.question_number}. </strong>
            {q.question}
          </p>
          <input
            type="text"
            placeholder="Write answer here"
            className="input input-bordered mt-2 w-full"
            onChange={(e) =>
              handleAnswerChange(
                `${q.question_number}`,
                e.target.value,
                q.input_type,
                q.answer,
              )
            }
          />
        </div>
      ))}
    </div>
  );
};

export default FillInTheBlanks;
