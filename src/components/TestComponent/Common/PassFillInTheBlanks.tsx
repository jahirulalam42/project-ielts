import React from "react";

const PassFillInTheBlanks = ({ question, handleAnswerChange }: any) => {
  // Function to render text with input fields dynamically
  const renderTextWithBlanks = () => {
    const parts = [];
    let lastIndex = 0;

    // Regex to find placeholders like "__________"
    const regex = /__________/g;
    let match;

    let blankNumber = 24;  // Start numbering from 24, or any other starting number

    while ((match = regex.exec(question.text)) !== null) {
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

      // Add the input field for the blank
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
              "text", // As the input_type is 'text' for this case
              "" // The correct answer will be checked later
            )
          }
        />
      );

      blankNumber++; // Increment blank number for the next blank

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
