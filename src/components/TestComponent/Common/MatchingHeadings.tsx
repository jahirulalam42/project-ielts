import React from "react";

const MatchingHeadings = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Matching Headings</h5>
      {question.paragraphs.map((p: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg mb-2">
          <p>{p.text}</p>
          <select className="select select-bordered mt-2 w-full" onChange={(e) =>
            handleAnswerChange(
              `${p.question_number}`,
              e.target.value,
              p.input_type,
              p.answer,
            )
          }>
            <option disabled selected>
              Select heading
            </option>
            {question.headings.map((heading: string, idx: number) => (
              <option key={idx} value={heading}>
                {heading}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default MatchingHeadings;
