import React, { useState, useEffect } from "react";

// The McqMultiple component accepts the question and the answer handler
const McqMultiple = ({ question, handleAnswerChange, handleQuestionFocus }: any) => {
  // Track selected options for each question in the group
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { [key: number]: string };
  }>({});

  // Initialize selectedOptions when component mounts or questions change
  useEffect(() => {
    const initialSelections: { [key: string]: { [key: number]: string } } = {};
    question.forEach((q: any) => {
      const groupKey = q.question_numbers.join("-");
      initialSelections[groupKey] = {};
      q.question_numbers.forEach((num: number) => {
        initialSelections[groupKey][num] = "";
      });
    });
    setSelectedOptions(initialSelections);
  }, [question]);

  // Check if an individual answer is correct
  const checkIndividualAnswer = (value: string, correctAnswers: string[]) => {
    return correctAnswers.includes(value);
  };

  // Handle checkbox change for each group of questions
  const handleCheckboxChange = (
    groupKey: string,
    optionLabel: string,
    q: any,
    questionNumber: number
  ) => {
    const currentSelections = selectedOptions[groupKey] || {};
    const selectedCount = Object.values(currentSelections).filter(
      (v) => v !== ""
    ).length;

    // If the option is already selected for this question, unselect it
    if (currentSelections[questionNumber] === optionLabel) {
      const newSelections = {
        ...currentSelections,
        [questionNumber]: "",
      };
      setSelectedOptions({ ...selectedOptions, [groupKey]: newSelections });

      // Update all answers in the group
      q.question_numbers.forEach((num: number) => {
        handleAnswerChange(
          num,
          newSelections[num] || "",
          "MCQ Multiple",
          q.correct_mapping[q.question_numbers.indexOf(num)],
          checkIndividualAnswer(newSelections[num] || "", q.correct_mapping),
          q.question_numbers
        );
      });
    } else {
      // If the selection limit is not reached, select the option
      if (selectedCount < q.max_selection) {
        const newSelections = {
          ...currentSelections,
          [questionNumber]: optionLabel,
        };
        setSelectedOptions({ ...selectedOptions, [groupKey]: newSelections });

        // Update all answers in the group
        q.question_numbers.forEach((num: number) => {
          handleAnswerChange(
            num,
            newSelections[num] || "",
            q.input_type,
            q.correct_mapping[q.question_numbers.indexOf(num)],
            checkIndividualAnswer(newSelections[num] || "", q.correct_mapping),
            q.question_numbers
          );
        });
      } else {
        alert(
          `You can only select ${q.max_selection} options for this question.`
        );
      }
    }
  };

  return (
    <div>
      <h5 className="font-medium mb-2">Multiple Select Questions</h5>
      {question.map((q: any, idx: number) => {
        const groupKey = q.question_numbers.join("-");
        const currentSelections = selectedOptions[groupKey] || {};

        return (
          <div key={idx} className="p-4 border border-black rounded-lg mb-2">
            <p>
              <strong>{q.question_numbers.join(", ")}. </strong>
              {q.question}
            </p>
            <div className="mt-2 space-y-2">
              {q.options.map((option: any) => (
                <label
                  key={option.label}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    onFocus={() => handleQuestionFocus(q.question_numbers[0])}
                    checked={Object.values(currentSelections).includes(
                      option.label
                    )}
                    onChange={() => {
                      // Find which question number this option should be assigned to
                      const availableQuestion = q.question_numbers.find(
                        (num: number) =>
                          !currentSelections[num] ||
                          currentSelections[num] === option.label
                      );
                      if (availableQuestion) {
                        handleCheckboxChange(
                          groupKey,
                          option.label,
                          q,
                          availableQuestion
                        );
                      }
                    }}
                  />
                  <span>{option.value}</span>
                </label>
              ))}
            </div>

            {/* Debug info - remove this in production */}
            <div className="text-xs text-black-500 mt-2">
              Selected:{" "}
              {Object.entries(currentSelections)
                .filter(([_, value]) => value !== "")
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")}{" "}
              | Correct: {q.correct_mapping?.join(", ")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default McqMultiple;
