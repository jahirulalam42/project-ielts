import React from "react";

const PassFillInTheBlanks = ({ question, handleAnswerChange }: any) => {
  // Function to render text with input fields dynamically
  const renderTextWithBlanks = () => {
    const parts = [];
    let lastIndex = 0;

    // Regex to find placeholders like "__________"
    const regex = /__________/g;
    let match;

    let blankIndex = 0; // Index to track which blank we're currently processing

    while ((match = regex.exec(question[0].text)) !== null) {
      // Add the part of text before the blank
      if (lastIndex < match.index) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {question[0].text.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Get the current blank data
      const currentBlank = question[0].blanks[blankIndex];
      const blankNumber = currentBlank.blank_number;
      const correctAnswer = currentBlank.answer;

      // Add the number before the input box
      parts.push(<span key={`number-${blankNumber}`}>{blankNumber}.</span>);

      // Add the input field for the blank
      parts.push(
        <input
          key={`input-${blankNumber}`}
          type="text"
          onChange={(e) =>
            handleAnswerChange(
              blankNumber,
              e.target.value,
              "Passage Fill in the Blanks", // As the input_type is 'text' for this case
              correctAnswer, // Pass the correct answer for this specific blank
              e.target.value.toLowerCase().trim() ===
                correctAnswer.toLowerCase().trim()
            )
          }
        />
      );

      blankIndex++; // Move to the next blank
      lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last blank
    if (lastIndex < question[0].text?.length) {
      parts.push(
        <span key={`text-final`}>{question[0].text.slice(lastIndex)}</span>
      );
    }

    return parts;
  };

  return (
    <div>
      <div>
        <h3>Passage Fill in the Blanks</h3>
      </div>

      <div>
        <p>{question[0]?.instruction}</p>
      </div>

      <div>
        <div>{renderTextWithBlanks()}</div>
      </div>
    </div>
  );
};

export default PassFillInTheBlanks;
