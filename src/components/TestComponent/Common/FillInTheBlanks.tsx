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
      {/* <h5 className="font-medium mb-2">Fill in the Blanks</h5> */}
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
                      isAnswerCorrect(e.target.value, q.answer) // Use the normalized comparison
                    )
                  }
                />
                {q.question.split("_________")[1]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FillInTheBlanks;
