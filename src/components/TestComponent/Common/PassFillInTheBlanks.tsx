import React from "react";

const PassFillInTheBlanks = ({ question, handleAnswerChange }: any) => {
  // Function to render text with input fields dynamically
  const renderTextWithBlanks = () => {
    const parts = [];
    let lastIndex = 0;

    // Regex to find placeholders like {blank_number: 24}
    const regex = /\{blank_number:\s*(\d+)\}/g;
    let match;

    while ((match = regex.exec(question.text)) !== null) {
      const blankNumber = parseInt(match[1]);

      // Add the part of text before the blank
      if (lastIndex < match.index) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {question.text.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Add the number before the input box
      parts.push(
        <span key={`number-${blankNumber}`} className="font-bold mx-1">
          {blankNumber}.
        </span>
      );

      // Find the corresponding blank object
      const blank = question.blanks.find(
        (b: any) => b.blank_number === blankNumber
      );
      if (blank) {
        parts.push(
          <input
            key={`input-${blankNumber}`}
            type="text"
            placeholder=""
            className="input input-bordered inline w-20 text-center"
            style={{
              height: "30px", // Shortened height
              padding: "5px 10px", // Adjusted padding
              fontSize: "14px",
            }} // Adjusting height
            onChange={(e) =>
              handleAnswerChange(
                blankNumber,
                e.target.value,
                blank.input_type,
                blank.answer
              )
            }
          />
        );
      }

      lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last blank
    if (lastIndex < question.text.length) {
      parts.push(
        <span key={`text-last`}>{question.text.slice(lastIndex)}</span>
      );
    }

    return parts;
  };

  return (
    <div>
      <h5 className="font-medium mb-2">Passage Fill in the Blanks</h5>
      <div className="p-4 border rounded-lg mb-2">
        <p>{renderTextWithBlanks()}</p>
      </div>
    </div>
  );
};

export default PassFillInTheBlanks;
