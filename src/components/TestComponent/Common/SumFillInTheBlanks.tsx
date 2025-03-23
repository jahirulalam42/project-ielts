import React from "react";

const SumFillInTheBlanks = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Summary Completion</h5>
      <div className="p-4 border rounded-lg mb-2">
        <p className="italic mb-2">{question.instruction}</p>
        <div className="whitespace-pre-wrap">
          {question.passage.split("\n").map((line: string, i: number) => (
            <div key={i} className="mb-2">
              {line.split(" ").map((word, j) =>
                word.startsWith("__") ? (
                  <select
                    key={j}
                    className="select select-bordered select-sm mx-1"
                  >
                    <option disabled selected>
                      Choose
                    </option>
                    {question.options.map((opt: any) => (
                      <option key={opt.label} value={opt.value}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span key={j}>{word} </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SumFillInTheBlanks;
