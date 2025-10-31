import React from "react";
import FormattedInstructions from "./FormattedInstructions";

const FillInTheBlanks: React.FC<any> = ({
  instructions,
  question,
  answers,
  setAnswers,
  handleAnswerChange,
  handleQuestionFocus,
}: any) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Fill in the Blanks</h5>
      <FormattedInstructions instructions={instructions} />

      <div className="p-4 border border-black rounded-lg mb-2">
        {question.map((q: any) => {
          return (
            <div key={q.question_number} className="mb-2">
              <p>
                <strong>{q.question_number}. </strong>
                {/* Split question around the blank (_________) */}
                {q.question.split("_________")[0]}
                <input
                  type="text"
                  placeholder=""
                  className="border-b-2 border-black mx-1 w-24 text-center"
                  style={{
                    height: "20px", // Shortened height
                    padding: "5px 5px", // Adjusted padding
                    fontSize: "14px", // Font size for better fit
                  }}
                  onFocus={() => handleQuestionFocus(q.question_number)}
                  onChange={(e) =>
                    handleAnswerChange(
                      q.question_number,
                      e.target.value,
                      "Fill in the Blanks",
                      q.answer,
                      e.target.value === q.answer ? true : false
                    )
                  }
                />
                {q.question.split("__________")[1]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FillInTheBlanks;
