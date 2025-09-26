import React, { useState } from "react";
import { MultipleMCQGroup, MultipleMCQItem } from "./listeningTest";

interface MultipleMCQGroupFormProps {
  questions: MultipleMCQItem[];
  instruction?: string;
  onUpdate: (data: {
    questions: MultipleMCQItem[];
    instruction: string;
  }) => void;
}

const MultipleMCQGroupForm = ({
  questions,
  instruction = "",
  onUpdate,
}: MultipleMCQGroupFormProps) => {
  const [localQuestions, setLocalQuestions] =
    useState<MultipleMCQItem[]>(questions);
  const [localInstruction, setLocalInstruction] = useState<string>(instruction);

  const updateParent = (
    newQuestions: MultipleMCQItem[] = localQuestions,
    newInstruction: string = localInstruction
  ) => {
    onUpdate({ questions: newQuestions, instruction: newInstruction });
  };

  const handleInstructionChange = (value: string) => {
    setLocalInstruction(value);
    updateParent(localQuestions, value);
  };

  const updateQuestion = (index: number, updatedQuestion: MultipleMCQItem) => {
    const newQuestions = [...localQuestions];
    newQuestions[index] = updatedQuestion;
    setLocalQuestions(newQuestions);
    updateParent(newQuestions);
  };

  const addQuestion = () => {
    const newQuestion: MultipleMCQItem = {
      question_numbers: [
        localQuestions.length > 0
          ? Math.max(...localQuestions.flatMap((q) => q.question_numbers)) + 1
          : 1,
      ],
      question: "",
      options: [
        { label: "A", value: "" },
        { label: "B", value: "" },
        { label: "C", value: "" },
        { label: "D", value: "" },
        { label: "E", value: "" },
      ],
      input_type: "checkbox",
      min_selection: 2,
      max_selection: 2,
      correct_mapping: ["A", "B"],
    };
    const newQuestions = [...localQuestions, newQuestion];
    setLocalQuestions(newQuestions);
    updateParent(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = localQuestions.filter((_, i) => i !== index);
    setLocalQuestions(newQuestions);
    updateParent(newQuestions);
  };

  const updateQuestionField = (
    index: number,
    field: keyof MultipleMCQItem,
    value: any
  ) => {
    const updatedQuestion = { ...localQuestions[index], [field]: value };
    updateQuestion(index, updatedQuestion);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: "label" | "value",
    value: string
  ) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.options[optionIndex] = {
      ...updatedQuestion.options[optionIndex],
      [field]: value,
    };
    updateQuestion(questionIndex, updatedQuestion);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    const newLabel = String.fromCharCode(65 + updatedQuestion.options.length);
    updatedQuestion.options.push({ label: newLabel, value: "" });
    updateQuestion(questionIndex, updatedQuestion);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.options.splice(optionIndex, 1);
    updatedQuestion.options.forEach((option, index) => {
      option.label = String.fromCharCode(65 + index);
    });
    updateQuestion(questionIndex, updatedQuestion);
  };

  const updateCorrectMapping = (
    questionIndex: number,
    mappingIndex: number,
    value: string
  ) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.correct_mapping[mappingIndex] = value;
    updateQuestion(questionIndex, updatedQuestion);
  };

  const addCorrectMapping = (questionIndex: number) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.correct_mapping.push("A");
    updateQuestion(questionIndex, updatedQuestion);
  };

  const removeCorrectMapping = (
    questionIndex: number,
    mappingIndex: number
  ) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.correct_mapping.splice(mappingIndex, 1);
    updateQuestion(questionIndex, updatedQuestion);
  };

  return (
    <div className="space-y-6">
      {/* Group Instruction - Only show if there are questions */}
      {localQuestions.length > 0 && (
        <div className="card bg-base-100 p-4 border">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Group Instruction
                <span className="text-gray-500 text-sm ml-2">
                  (This instruction will apply to all questions below)
                </span>
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              value={localInstruction}
              onChange={(e) => handleInstructionChange(e.target.value)}
              placeholder="Enter instructions for this group of multiple MCQ questions..."
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Questions List */}
      {localQuestions.map((question, questionIndex) => (
        <div key={questionIndex} className="card bg-base-100 p-4 border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">
              Multiple MCQ Question {questionIndex + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeQuestion(questionIndex)}
              className="btn btn-error btn-sm"
            >
              Remove Question
            </button>
          </div>

          <div className="space-y-4">
            {/* Question Text */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Question Text</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={question.question}
                onChange={(e) =>
                  updateQuestionField(questionIndex, "question", e.target.value)
                }
                placeholder="Enter the question text..."
                rows={3}
              />
            </div>

            {/* Question Numbers */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Question Numbers
                </span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {question.question_numbers.map((num, numIndex) => (
                  <input
                    key={numIndex}
                    type="number"
                    className="input input-bordered w-20"
                    value={num}
                    onChange={(e) => {
                      const newNumbers = [...question.question_numbers];
                      newNumbers[numIndex] = parseInt(e.target.value);
                      updateQuestionField(
                        questionIndex,
                        "question_numbers",
                        newNumbers
                      );
                    }}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newNumbers = [
                      ...question.question_numbers,
                      question.question_numbers.length > 0
                        ? Math.max(...question.question_numbers) + 1
                        : 1,
                    ];
                    updateQuestionField(
                      questionIndex,
                      "question_numbers",
                      newNumbers
                    );
                  }}
                  className="btn btn-sm btn-outline"
                >
                  +
                </button>
              </div>
            </div>

            {/* Selection Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Min Selection
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={question.min_selection}
                  onChange={(e) =>
                    updateQuestionField(
                      questionIndex,
                      "min_selection",
                      parseInt(e.target.value)
                    )
                  }
                  min={1}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Max Selection
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={question.max_selection}
                  onChange={(e) =>
                    updateQuestionField(
                      questionIndex,
                      "max_selection",
                      parseInt(e.target.value)
                    )
                  }
                  min={1}
                />
              </div>
            </div>

            {/* Options */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Options</span>
              </label>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-2 items-center">
                    <span className="font-medium w-8">{option.label}</span>
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      value={option.value}
                      onChange={(e) =>
                        updateOption(
                          questionIndex,
                          optionIndex,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder={`Option ${option.label}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(questionIndex, optionIndex)}
                      className="btn btn-error btn-sm"
                      disabled={question.options.length <= 2}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(questionIndex)}
                  className="btn btn-outline btn-sm"
                >
                  Add Option
                </button>
              </div>
            </div>

            {/* Correct Mapping */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Correct Answers (in order of question numbers)
                </span>
              </label>
              <div className="space-y-2">
                {question.correct_mapping.map((mapping, mappingIndex) => (
                  <div key={mappingIndex} className="flex gap-2 items-center">
                    <span className="font-medium">
                      Q
                      {question.question_numbers[mappingIndex] ||
                        mappingIndex + 1}
                      :
                    </span>
                    <select
                      className="select select-bordered"
                      value={mapping}
                      onChange={(e) =>
                        updateCorrectMapping(
                          questionIndex,
                          mappingIndex,
                          e.target.value
                        )
                      }
                    >
                      {question.options.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        removeCorrectMapping(questionIndex, mappingIndex)
                      }
                      className="btn btn-error btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addCorrectMapping(questionIndex)}
                  className="btn btn-outline btn-sm"
                >
                  Add Correct Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={addQuestion} className="btn btn-primary">
        Add Multiple MCQ Question
      </button>
    </div>
  );
};

export default MultipleMCQGroupForm;
