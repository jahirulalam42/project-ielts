import React from "react";
import FormattedInstructions from "./FormattedInstructions";

const SubFillInTheBlanks = ({
  instructions,
  question,
  answers,
  setAnswers,
  handleAnswerChange,
  handleQuestionFocus,
}: any) => {
  // Helper function to normalize answers for comparison
  const normalizeAnswer = (answer: string): string => {
    return answer
      .trim() // Remove leading/trailing spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .toLowerCase(); // Optional: make case insensitive
  };

  // Check if answer is correct (with space normalization)
  const isAnswerCorrect = (
    userAnswer: string,
    correctAnswer: string
  ): boolean => {
    return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
  };

  return (
    <div>
      {/* <h5 className="font-medium mb-2">Section Completion</h5> */}
      <FormattedInstructions instructions={instructions} />
      <div className="p-4 border border-black rounded-lg mb-2">
        {question.map((section: any, idx: number) => {
          let questionIndex = 0; // Track the correct question mapping

          return (
            <div key={idx} className="mb-4">
              {section.title && (
                <h5 className="text-center font-bold text-lg mb-3">
                  {section.title}
                </h5>
              )}
              {section.subtitle && (
                <h6 className="font-bold mb-2">{section.subtitle}</h6>
              )}
              {section.extra?.map((text: string, i: number) => {
                const isSubItem = text.trim().startsWith("-");
                const displayText = isSubItem
                  ? text.trim().substring(1).trim()
                  : text;

                return (
                  <div
                    key={i}
                    className={`text-sm mb-2 ${isSubItem ? "ml-6" : ""}`}
                  >
                    {isSubItem ? (
                      <span className="mr-2">-</span>
                    ) : (
                      <span className="mr-2">•</span>
                    )}
                    {displayText.split("__________").map((part, j, arr) => {
                      const currentQuestion =
                        section.questions?.[questionIndex];

                      return (
                        <React.Fragment key={j}>
                          {part}
                          {j < arr.length - 1 && currentQuestion && (
                            <>
                              <strong>
                                {currentQuestion.question_number}.
                              </strong>
                              <input
                                type="text"
                                placeholder=""
                                className="border-b-2 border-black mx-1 w-24 text-center"
                                onFocus={() =>
                                  handleQuestionFocus(
                                    currentQuestion.question_number
                                  )
                                }
                                onChange={(e) =>
                                  handleAnswerChange(
                                    currentQuestion.question_number,
                                    e.target.value,
                                    "Fill in the Blanks",
                                    currentQuestion.answer,
                                    // Use the normalized comparison instead of direct comparison
                                    isAnswerCorrect(
                                      e.target.value,
                                      currentQuestion.answer
                                    )
                                  )
                                }
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
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubFillInTheBlanks;
