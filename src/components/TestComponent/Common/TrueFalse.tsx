import React from "react";

const TrueFalse = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">True/False/Not Given</h5>
      {question.map((q: any) => (
        <div key={q.question_number} className="p-4 border rounded-lg mb-2">
          <p>
            <strong>{q.question_number}. </strong>
            {q.question}
          </p>
          <select
            className="select select-bordered mt-2 w-full"
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
              Select answer
            </option>
            <option value="True">True</option>
            <option value="False">False</option>
            <option value="Not Given">Not Given</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default TrueFalse;
