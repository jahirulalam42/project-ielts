import React from "react";

const FillInTheBlanks: React.FC<any> = ({
  question,
  handleAnswerChange,
}: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Fill in the Blanks</h5>
      {question.map((q: any) => (
        <div key={q.question_number} className="p-4 border rounded-lg mb-2">
          <p>
            <strong>{q.question_number}. </strong>
            {/* Split question around the blank (_________) */}
            {q.question.split("_________")[0]}
            <input
              type="text"
              placeholder=""
              className="input input-bordered inline-block w-auto mx-2"
              style={{
                height: "30px", // Shortened height
                padding: "5px 10px", // Adjusted padding
                fontSize: "14px", // Font size for better fit
              }}
              onChange={(e) =>
                handleAnswerChange(
                  q.question_number,
                  e.target.value,
                  q.input_type,
                  q.answer,
                  e.target.value === q.answer ? true : false
                )
              }
            />
            {q.question.split("__________")[1]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FillInTheBlanks;
