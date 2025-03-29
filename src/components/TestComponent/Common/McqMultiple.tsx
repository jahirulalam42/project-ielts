import React, { useState } from "react";

// The McqMultiple component accepts the question and the answer handler
const McqMultiple = ({ question, handleAnswerChange }: any) => {
  // To track the selected answers for each group of questions
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});

  // Handle checkbox change for each group of questions
  const handleCheckboxChange = (groupKey: string, optionLabel: string, q: any) => {
    const currentSelections = selectedOptions[groupKey] || [];

    // If the option is already selected, unselect it
    if (currentSelections.includes(optionLabel)) {
      const newSelections = currentSelections.filter((item) => item !== optionLabel);
      setSelectedOptions({ ...selectedOptions, [groupKey]: newSelections });
      handleAnswerChange(groupKey, newSelections, q.input_type, q.correct_mapping);
    } else {
      // If the selection limit is not reached, select the option
      if (currentSelections.length < q.max_selection) {
        const newSelections = [...currentSelections, optionLabel];
        setSelectedOptions({ ...selectedOptions, [groupKey]: newSelections });
        handleAnswerChange(groupKey, newSelections, q.input_type, q.correct_mapping);
      } else {
        alert(`You can only select ${q.max_selection} options for this question.`);
      }
    }
  };

  return (
    <div>
      <h5 className="font-medium mb-2">Multiple Select Questions</h5>
      {question.map((q: any, idx: number) => {
        // Create a group key based on the question numbers
        const groupKey = q.question_numbers.join("_");
        const currentSelections = selectedOptions[groupKey] || [];

        return (
          <div key={idx} className="p-4 border rounded-lg mb-2">
            <p>
              <strong>{q.question_numbers.join(", ")}. </strong>
              {q.question}
            </p>
            <div className="mt-2 space-y-2">
              {q.options.map((option: any) => (
                <label key={option.label} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={currentSelections.includes(option.label)}
                    onChange={() => handleCheckboxChange(groupKey, option.label, q)}
                  />
                  <span>{option.value}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default McqMultiple;
