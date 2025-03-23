import React from "react";

const ParagraphMatching = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Paragraph Matching</h5>
      {question.map((q: any) => (
        <div key={q.question_number} className="p-4 border rounded-lg mb-2">
          <p>
            <strong>{q.question_number}. </strong>
            {q.question}
          </p>
          <select className="select select-bordered mt-2 w-full" onChange={(e) =>
            handleAnswerChange(
              `${q.question_number}`,
              e.target.value,
              q.input_type,
              q.answer,
            )
          }>
            <option disabled selected>
              Select answer
            </option>
            {q.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default ParagraphMatching;
