import React from "react";

const SubFillInTheBlanks = ({ question, handleAnswerChange }: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Section Completion</h5>
      {question.map((section: any, idx: number) => (
        <div key={idx} className="p-4 border rounded-lg mb-2">
          {section.subtitle && (
            <h6 className="font-medium mb-2">{section.subtitle}</h6>
          )}
          {section.extra?.map((text: string, i: number) => (
            <p key={i} className="text-sm italic mb-2">
              {text}
            </p>
          ))}
          {section.questions?.map((q: any) => (
            <div key={q.question_number} className="mb-3">
              <p>
                <strong>{q.question_number}. </strong>
                {q.question}
              </p>
              <input
                type="text"
                placeholder="Write answer here"
                className="input input-bordered w-full mt-1"
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
      ))}
    </div>
  );
};

export default SubFillInTheBlanks;
