'use client'
import useInitializeAnswers from "@/hooks/useInitializeAnswers";
import React from "react";

const SubFillInTheBlanks = ({ question, answers, setAnswers, handleAnswerChange }: any) => {
  useInitializeAnswers({ question, setAnswers });
  return (
    <div>
      <h5 className="font-medium mb-2">Section Completion</h5>
      {question.map((section: any, idx: number) => {
        const answerObj = answers?.find((a: any) => a.questionId === section.question_number);
        const currentValue = answerObj ? answerObj.value : '';
        let questionIndex = 0; // Track the correct question mapping

        return (
          <div key={idx} className="p-4 border rounded-lg mb-2">
            {section.subtitle && (
              <h6 className="font-medium mb-2">{section.subtitle}</h6>
            )}
            {section.extra?.map((text: string, i: number) => {
              return (
                <p key={i} className="text-sm mb-2">
                  {/* Add bullet point before each sentence */}
                  <span className="mr-2">•</span>
                  {text.split("__________").map((part, j, arr) => {
                    const currentQuestion = section.questions?.[questionIndex];

                    return (
                      <React.Fragment key={j}>
                        {part}
                        {j < arr.length - 1 && currentQuestion && (
                          <>
                            <strong>{currentQuestion.question_number}.</strong>
                            <input
                              type="text"
                              placeholder=""
                              className="border-b-2 border-gray-400 mx-1 w-24 text-center"
                              onChange={(e) =>
                                handleAnswerChange(
                                  currentQuestion.question_number,
                                  e.target.value,
                                  currentQuestion.input_type,
                                  currentQuestion.answer,
                                  e.target.value === currentQuestion.answer
                                    ? true
                                    : false
                                )
                              }
                              value={currentValue}
                            />
                            {/* Increment AFTER rendering the input field */}
                            {(() => {
                              questionIndex++;
                              return null; // Prevents unwanted rendering
                            })()}
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SubFillInTheBlanks;
