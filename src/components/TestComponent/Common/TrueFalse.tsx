import React from "react";

const TrueFalse = ({
  question,
  answers,
  handleAnswerChange,
  setAnswers,
  handleQuestionFocus,
}: any) => {
  console.log("True false question", question);
  return (
    <div>
      <h5 className="font-medium mb-2">True/False/Not Given</h5>
      {question.map((q: any) => {
        const answerObj = answers?.find(
          (a: any) => a.questionId === q.question_number
        );
        const currentValue = answerObj ? answerObj.value : "";
        return (
          <div
            key={q.question_number}
            className="p-4 border border-black rounded-lg mb-2 flex items-center gap-3"
          >
            {/* Question Number */}
            <strong className="min-w-[30px]">{q.question_number}.</strong>

            <div>
              {/* Dropdown */}
              <select
                className="border border-black px-2 py-1 rounded-md text-sm"
                id={q.question_number}
                onFocus={() => handleQuestionFocus(q.question_number)}
                onChange={(e) =>
                  handleAnswerChange(
                    q.question_number,
                    e.target.value,
                    "True False",
                    q.answer,
                    e.target.value === q.answer ? true : false
                  )
                }
                // value={currentValue}
                defaultValue={""}
              >
                {/* <option disabled value=""></option> */}
                <option value="True">True</option>
                <option value="False">False</option>
                <option value="Not Given">Not Given</option>
              </select>
              <label htmlFor={q.question_number} className="px-2">
                {q.question}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrueFalse;
