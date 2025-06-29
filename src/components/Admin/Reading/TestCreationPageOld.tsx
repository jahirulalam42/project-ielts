"use client";
import { submitReadingQuestions } from "@/services/data";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

// Define types for the test structure
interface Option {
  label: string;
  value: string;
}

interface Blank {
  blank_number: number;
  input_type: string;
  answer: string;
}

interface Question {
  question_number?: any;
  question_numbers?: number[];
  question: string;
  questions: any;
  answer?: string | string[];
  options?: Option[];
  input_type: string;
  min_selection?: number;
  max_selection?: number;
  correct_mapping?: string[];
  instruction?: string;
  text?: string;
  blanks?: Blank[];
  passage?: string;
  answers?: string[];
  title: string;
  subtitle: string;
  extra: any;
}

// Define a new structure for fill_in_the_blanks_with_subtitle
interface FillInTheBlanksWithSubtitle {
  title: string;
  subtitle: string;
  extra: string[];
  questions: Question[];
}

interface Passage {
  title: string;
  instructions: string;
  passage_title: string;
  passage_subtitle: string;
  passage: any;
  image: string;
  questions: Record<string, Question[]>[];
  passageType: "type1" | "type2"; // Added to specify passage type
}

interface Test {
  title: string;
  type: "academic" | "general";
  duration: number;
  parts: Passage[];
}

const questionTypes = [
  "true_false_not_given",
  "fill_in_the_blanks",
  "matching_headings",
  "paragraph_matching",
  "multiple_mcq",
  "passage_fill_in_the_blanks",
  "mcq",
  "summary_fill_in_the_blanks",
  "fill_in_the_blanks_with_subtitle",
];

const TestCreationPage: React.FC = () => {
  const [test, setTest] = useState<Test>({
    title: "",
    type: "academic",
    duration: 60,
    parts: [],
  });
  const [currentPassageIndex, setCurrentPassageIndex] = useState<number | null>(
    null
  );
  const [currentQuestionType, setCurrentQuestionType] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [summaryPassage, setSummaryPassage] = useState<string>(""); // Passage input
  const [blanks, setBlanks] = useState<number[]>([]); // Track the blanks in the passage
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  ); // Dynamic options
  const [answers, setAnswers] = useState<string[]>([]); // Answers as an array
  // State for fill_in_the_blanks_with_subtitle inputs
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [extra, setExtra] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const addPassage = () => {
    setTest({
      ...test,
      parts: [
        ...test.parts,
        {
          title: "",
          instructions: "",
          passage_title: "",
          passage_subtitle: "",
          passage: [],
          image: "",
          questions: [],
          passageType: "type1", // Default to type1
        },
      ],
    });
    setCurrentPassageIndex(test.parts.length - 1); // Set index to the newly added passage
  };

  // Function to dynamically generate blanks based on the passage text
  // const getBlanksFromText = (text: string) => {
  //   const regex = /__________/g; // Match all occurrences of "__________"
  //   const matches = [...text.matchAll(regex)]; // Find all occurrences of "__________"

  //   return matches.map((match, index) => ({
  //     blank_number: index + 1, // Start numbering blanks from 1
  //     input_type: "text", // Use text input for each blank
  //     answer: "", // Empty answer initially, to be filled by admin
  //   }));
  // };

  const getBlanksFromTextForSummary = (text: string) => {
    const regex = /__________/g; // Match all occurrences of "__________"
    const matches = [...text.matchAll(regex)];
    return matches.map((match, index) => index + 1); // Return blank numbers (e.g., 1, 2, 3...)
  };

  const addOption = () => {
    const label = String.fromCharCode(65 + options.length); // Auto-increment label (A, B, C, ...)
    const newOption = { label, value: "" }; // Initially empty value for the new option
    setOptions([...options, newOption]);
  };

  const handleOptionChange = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setOptions(updatedOptions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value; // Set the answer for the current blank
    setAnswers(updatedAnswers);
  };

  // Handle passage type change
  const updatePassageType = (
    passageIndex: number,
    passageType: "type1" | "type2"
  ) => {
    const updatedParts = [...test.parts];

    // If changing to type2, ensure the passage is in the correct structure
    if (
      passageType === "type2" &&
      Array.isArray(updatedParts[passageIndex].passage)
    ) {
      const passageArray = updatedParts[passageIndex].passage as string[];
      updatedParts[passageIndex].passage = passageArray.reduce(
        (acc: Record<string, string>, para, idx) => {
          const key = String.fromCharCode(65 + idx); // A, B, C...
          acc[key] = para;
          return acc;
        },
        {}
      );
    }

    // If changing to type1, ensure the passage is an array
    if (
      passageType === "type1" &&
      typeof updatedParts[passageIndex].passage !== "object"
    ) {
      updatedParts[passageIndex].passage = Object.values(
        updatedParts[passageIndex].passage
      );
    }

    updatedParts[passageIndex].passageType = passageType;
    setTest({ ...test, parts: updatedParts });
  };

  // Update any passage field (e.g., title, instructions, etc.)
  const updatePassageField = (
    passageIndex: number,
    field: keyof Passage,
    value: any
  ) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex][field] = value;
    setTest({ ...test, parts: updatedParts });
  };

  // Update paragraph based on passage type
  const updateParagraph = (
    passageIndex: number,
    paraIndex: number,
    value: string
  ) => {
    const updatedParts = [...test.parts];
    const passage = updatedParts[passageIndex].passage;

    if (Array.isArray(passage)) {
      passage[paraIndex] = value; // Type 1: Array of paragraphs
    } else {
      const paragraphKey = String.fromCharCode(65 + paraIndex); // 'A', 'B', 'C'...
      passage[paragraphKey] = value; // Type 2: Object with keys
    }

    setTest({ ...test, parts: updatedParts });
  };

  // Add a new paragraph based on passage type
  const addParagraph = (passageIndex: number) => {
    const updatedParts = [...test.parts];
    const passage = updatedParts[passageIndex].passage;

    if (Array.isArray(passage)) {
      passage.push(""); // Type 1: Array of paragraphs
    } else {
      const paragraphKey = String.fromCharCode(
        65 + Object.keys(passage).length
      ); // 'A', 'B', 'C'...
      passage[paragraphKey] = ""; // Type 2: Object with keys
    }

    setTest({ ...test, parts: updatedParts });
  };

  // UI for adding new question groups
  // Fixed question numbering logic - replace the addQuestionGroup function

  const addQuestionGroup = (passageIndex: number) => {
    if (!currentQuestionType || questionCount < 1) return;
    const updatedParts = [...test.parts];
    const newQuestions: any = [];

    // FIXED: Get the highest question number across ALL parts, not just current part
    const getGlobalMaxQuestionNumber = () => {
      let maxNumber = 0;

      test.parts.forEach((part) => {
        part.questions.forEach((questionGroup) => {
          Object.values(questionGroup).forEach((questionsArray: any) => {
            questionsArray.forEach((q: any) => {
              // Handle single question_number
              if (q.question_number && typeof q.question_number === "number") {
                maxNumber = Math.max(maxNumber, q.question_number);
              }
              // Handle question_numbers array
              if (q.question_numbers && Array.isArray(q.question_numbers)) {
                const arrayMax = Math.max(...q.question_numbers);
                maxNumber = Math.max(maxNumber, arrayMax);
              }
              // Handle question_number as array (for passage_fill_in_the_blanks)
              if (q.question_number && Array.isArray(q.question_number)) {
                const arrayMax = Math.max(...q.question_number);
                maxNumber = Math.max(maxNumber, arrayMax);
              }
            });
          });
        });
      });

      return maxNumber;
    };

    const globalMaxQuestionNumber = getGlobalMaxQuestionNumber();
    let nextQuestionNumber = globalMaxQuestionNumber + 1;

    // Handle different question types with corrected numbering
    switch (currentQuestionType) {
      case "fill_in_the_blanks_with_subtitle":
        // Create multiple separate question groups, each with its own subtitle
        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            title: i === 0 ? title : undefined, // Only first question gets title, others get undefined
            subtitle: subtitle,
            extra: extra.length > 0 ? extra : [""], // Ensure at least one empty extra field
            questions: [
              {
                question_number: nextQuestionNumber + i,
                answer: "",
                input_type: "text",
              }
            ],
          });
        }
        break;

      case "true_false_not_given":
      case "fill_in_the_blanks":
      case "mcq":
        for (let i = 0; i < questionCount; i++) {
          const questionData: any = {
            question_number: nextQuestionNumber + i,
            question: "",
            input_type:
              currentQuestionType === "fill_in_the_blanks"
                ? "text"
                : currentQuestionType === "true_false_not_given"
                ? "dropdown"
                : "radio",
          };

          if (currentQuestionType === "true_false_not_given") {
            questionData.answer = "True";
          } else if (currentQuestionType === "fill_in_the_blanks") {
            questionData.answer = "";
          } else if (currentQuestionType === "mcq") {
            questionData.answer = [];
            questionData.options = [
              { label: "A", value: "" },
              { label: "B", value: "" },
              { label: "C", value: "" },
              { label: "D", value: "" },
            ];
            questionData.min_selection = 1;
            questionData.max_selection = 1;
          }

          newQuestions.push(questionData);
        }
        break;

      case "matching_headings":
      case "paragraph_matching":
        const passage = updatedParts[passageIndex].passage;
        let optionsList;

        if (Array.isArray(passage)) {
          // For type1 passages (array), create options A, B, C based on array indices
          optionsList = passage.map((_, index) => ({
            label: String.fromCharCode(65 + index), // A, B, C, etc.
            value: String.fromCharCode(65 + index), // A, B, C, etc.
          }));
        } else {
          // For type2 passages (object), use the existing keys
          optionsList = Object.keys(passage).map((key) => ({
            label: key, // A, B, C, etc.
            value: key, // A, B, C, etc.
          }));
        }

        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            question_number: nextQuestionNumber + i,
            question: "",
            answer: optionsList[0]?.value || "A", // Default to first option, never empty or 0
            options: optionsList,
            input_type: "dropdown",
          });
        }
        break;

      case "multiple_mcq":
        for (let i = 0; i < questionCount; i++) {
          // FIXED: Each multiple_mcq question gets 2 consecutive numbers
          const questionNumbers = [
            nextQuestionNumber + i * 2,
            nextQuestionNumber + i * 2 + 1,
          ];

          newQuestions.push({
            question_numbers: questionNumbers,
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
            correct_mapping: [],
          });
        }
        // Update nextQuestionNumber for next question type
        nextQuestionNumber += questionCount * 2;
        break;

      case "summary_fill_in_the_blanks":
        // For summary_fill_in_the_blanks, we create one question but need to account for multiple blanks
        // The actual number of blanks will be determined when the user enters the passage text in the UI
        // So we use the questionCount from the input field
        const summaryQuestionNumbers = Array.from(
          { length: questionCount },
          (_, idx) => nextQuestionNumber + idx
        );

        newQuestions.push({
          question_numbers: summaryQuestionNumbers,
          passage: summaryPassage || "", // Use current summaryPassage or empty string
          answers: Array(questionCount).fill(""), // Initialize answers array with empty strings
          options: [...options],
          input_type: "drag_and_drop",
          question: "",
        });
        break;

      case "passage_fill_in_the_blanks":
        const passageQuestionNumbers = Array.from(
          { length: questionCount },
          (_, idx) => nextQuestionNumber + idx
        );

        newQuestions.push({
          question_number: passageQuestionNumbers, // This should be an array
          instruction:
            "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
          text: "",
          blanks: [],
        });
        break;

      default:
        return;
    }

    // Special handling for fill_in_the_blanks_with_subtitle - merge into existing group if it exists
    if (currentQuestionType === "fill_in_the_blanks_with_subtitle") {
      const existingQuestions = updatedParts[passageIndex].questions;
      const existingFillBlanksGroup = existingQuestions.find(group => 
        Object.keys(group)[0] === "fill_in_the_blanks_with_subtitle"
      );
      
      if (existingFillBlanksGroup) {
        // Merge new questions into existing group
        const existingGroup = existingFillBlanksGroup as Record<string, any[]>;
        const allSections = [
          ...existingGroup["fill_in_the_blanks_with_subtitle"],
          ...newQuestions
        ];
        
        // Recalculate question numbers across all sections to ensure sequential numbering
        let questionCounter = 1;
        allSections.forEach((section: any) => {
          if (section.questions && Array.isArray(section.questions)) {
            section.questions.forEach((q: any) => {
              q.question_number = questionCounter++;
            });
          }
        });
        
        existingGroup["fill_in_the_blanks_with_subtitle"] = allSections;
      } else {
        // Create new group
        updatedParts[passageIndex].questions.push({
          [currentQuestionType]: newQuestions,
        });
      }
    } else {
      // For other question types, add normally
      updatedParts[passageIndex].questions.push({
        [currentQuestionType]: newQuestions,
      });
    }

    setTest({ ...test, parts: updatedParts });
    setCurrentQuestionType("");
    setQuestionCount(1);

    // Clear state
    setSummaryPassage("");
    setOptions([]);
    setAnswers([]);
    setBlanks([]);
    setTitle("");
    setSubtitle("");
    setExtra([]);
    setQuestions([]);
  };

  // ADDITIONAL FIX: Update the getBlanksFromText function to use proper question numbers
  const getBlanksFromText = (text: string, questionNumbers?: number[]) => {
    const regex = /__________/g;
    const matches = [...text.matchAll(regex)];

    return matches.map((match, index) => ({
      blank_number: questionNumbers ? questionNumbers[index] : index + 1,
      input_type: "text",
      answer: "",
    }));
  };

  // Render question inputs based on question type
  const renderQuestionInput = (
    questionType: string,
    questions: Question[],
    passageIndex: number,
    groupIndex: number
  ) => {
    // const updateQuestion = (field: string, value: any, qIndex: number) => {
    //   const updatedParts = [...test.parts];
    //   updatedParts[passageIndex].questions[groupIndex][questionType][qIndex][
    //     field as keyof Question
    //   ] = value;
    //   setTest({ ...test, parts: updatedParts });
    // };

    const updateQuestion = (field: string, value: any, qIndex: number) => {
      const updatedParts = [...test.parts];

      // Create a deep copy of the specific question
      const currentQuestion = {
        ...updatedParts[passageIndex].questions[groupIndex][questionType][
          qIndex
        ],
      };

      // Update the specific field
      currentQuestion[field as keyof Question] = value;

      // Update the question in the parts array
      updatedParts[passageIndex].questions[groupIndex][questionType][qIndex] =
        currentQuestion;

      // Update the test state
      setTest({ ...test, parts: updatedParts });

      // Debug log to verify the update
      console.log(`Updated ${field} for question ${qIndex}:`, value);
    };

    switch (questionType) {
      case "true_false_not_given":
        return questions.map((q, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="border p-2 mr-2"
            />
            <select
              value={q.answer as string}
              onChange={(e) => updateQuestion("answer", e.target.value, idx)}
              className="border p-2"
            >
              <option>True</option>
              <option>False</option>
              <option>Not Given</option>
            </select>
          </div>
        ));
      case "fill_in_the_blanks":
        return questions.map((q, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="text"
              placeholder="Question with blank (e.g., The ___ is red)"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Answer"
              value={q.answer as string}
              onChange={(e) => updateQuestion("answer", e.target.value, idx)}
              className="border p-2"
            />
          </div>
        ));
      case "matching_headings":
        return questions.map((q, idx) => (
          <div key={idx} className="mb-2">
            {/* Question input box */}
            <input
              type="text"
              placeholder="Question reference (e.g., reference to two chemical compounds which impact on performance)"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="border p-2 mb-2 w-full"
            />
            {/* Dropdown to select the matching heading */}
            <select
              value={(q.answer as string) || "A"} // Ensure there's always a default value
              onChange={(e) => updateQuestion("answer", e.target.value, idx)}
              className="border p-2 mb-2 w-full"
            >
              <option value="">-- Select Answer --</option>{" "}
              {/* Add default option */}
              {q.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}: {opt.value}{" "}
                  {/* Show both label and value if needed */}
                </option>
              ))}
            </select>
          </div>
        ));

      case "paragraph_matching":
        return questions.map((q, idx) => (
          <div key={idx} className="mb-2">
            {/* Question input box */}
            <input
              type="text"
              placeholder="Question reference (e.g., Which paragraph discusses piracy?)"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="border p-2 mb-2 w-full"
            />
            {/* Dropdown to select the matching paragraph */}
            <select
              value={(q.answer as string) || "A"} // Ensure there's always a default value
              onChange={(e) => updateQuestion("answer", e.target.value, idx)}
              className="border p-2 mb-2 w-full"
            >
              <option value="">-- Select Answer --</option>{" "}
              {/* Add default option */}
              {q.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}: {opt.value}{" "}
                  {/* Show both label and value if needed */}
                </option>
              ))}
            </select>
          </div>
        ));

      // For 'multiple_mcq' rendering
      case "multiple_mcq":
        return questions.map((q, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="border p-2 mb-2 w-full"
            />
            {q.options?.map((opt, optIdx) => (
              <div key={opt.label} className="mb-2">
                <input
                  type="text"
                  placeholder={`Option ${opt.label}`}
                  value={opt.value}
                  onChange={(e) => {
                    const updatedOptions = [...q.options!];
                    updatedOptions[optIdx].value = e.target.value;
                    updateQuestion("options", updatedOptions, idx);
                  }}
                  className="border p-2 mb-2 w-full"
                />
              </div>
            ))}
            <div className="mb-2">
              <label>Select correct answers:</label>
              {q.options?.map((opt, optIdx) => (
                <div key={opt.label}>
                  <input
                    type="checkbox"
                    checked={q.correct_mapping?.includes(opt.label) || false}
                    onChange={(e) => {
                      const updatedCorrectMapping = q.correct_mapping
                        ? [...q.correct_mapping]
                        : [];
                      if (e.target.checked) {
                        updatedCorrectMapping.push(opt.label);
                      } else {
                        const index = updatedCorrectMapping.indexOf(opt.label);
                        if (index !== -1)
                          updatedCorrectMapping.splice(index, 1);
                      }
                      updateQuestion(
                        "correct_mapping",
                        updatedCorrectMapping,
                        idx
                      );
                    }}
                  />
                  {opt.label}: {opt.value}
                </div>
              ))}
            </div>
          </div>
        ));

      case "mcq":
        return questions.map((q, idx) => (
          <div key={idx} className="mb-2">
            {/* Question input box */}
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="border p-2 mb-2 w-full"
            />
            {/* Input fields for options */}
            {q.options?.map((option, optionIdx) => (
              <div key={option.label} className="mb-2">
                <input
                  type="text"
                  placeholder={`Option ${option.label} (e.g., Misinformation is a relatively recent phenomenon.)`}
                  value={option.value}
                  onChange={(e) => {
                    // Create a new array of options where we only update the current option
                    const updatedOptions = [...q.options!];
                    updatedOptions[optionIdx].value = e.target.value;
                    // Update only the options for the specific question
                    updateQuestion("options", updatedOptions, idx);
                  }}
                  className="border p-2 mb-2 w-full"
                />
              </div>
            ))}
            {/* Dropdown to select the correct answer */}
            <select
              value={q.answer?.[0] || ""} // Provide fallback if answer is undefined
              onChange={(e) => updateQuestion("answer", [e.target.value], idx)} // Ensure answer is an array of labels
              className="border p-2 mb-2 w-full"
            >
              {q.options?.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {" "}
                  {/* Use label for answer selection */}
                  {opt.label}: {opt.value}
                </option>
              ))}
            </select>
          </div>
        ));

      // Replace the "passage_fill_in_the_blanks" case in your renderQuestionInput function with this:

      // Replace your existing "passage_fill_in_the_blanks" case in renderQuestionInput with this fixed version:

      case "passage_fill_in_the_blanks":
        return questions.map((q, idx) => (
          <div key={idx} className="mb-4 border p-4">
            {/* Display question numbers */}
            <div className="mb-2">
              <span className="font-medium">Question Numbers: </span>
              <span className="text-blue-600">
                {q.question_number ? q.question_number.join(", ") : "N/A"}
              </span>
            </div>

            {/* Instruction input */}
            <div className="mb-2">
              <label className="block mb-1 font-medium">Instruction:</label>
              <input
                type="text"
                placeholder="Instruction"
                value={
                  q.instruction ||
                  "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer."
                }
                onChange={(e) =>
                  updateQuestion("instruction", e.target.value, idx)
                }
                className="border p-2 mb-2 w-full"
              />
            </div>

            {/* Passage text with blanks */}
            <div className="mb-2">
              <label className="block mb-1 font-medium">
                Passage text (use __________ for blanks):
              </label>
              <textarea
                placeholder="Enter the passage text with __________ where blanks should be"
                value={q.text || ""}
                onChange={(e) => {
                  const newText = e.target.value;

                  // Get existing blanks to preserve answers
                  const existingBlanks = q.blanks || [];
                  const existingAnswers = existingBlanks.reduce(
                    (acc, blank) => {
                      acc[blank.blank_number] = blank.answer;
                      return acc;
                    },
                    {} as Record<number, string>
                  );

                  // Extract new blanks from text
                  const extractedBlanks = getBlanksFromText(
                    newText,
                    q.question_number
                  );

                  // Map the blanks to use the question numbers and preserve existing answers
                  const blanksWithQuestionNumbers = extractedBlanks.map(
                    (blank, blankIdx) => ({
                      blank_number: q.question_number
                        ? q.question_number[blankIdx]
                        : blankIdx + 1,
                      input_type: "text",
                      answer:
                        existingAnswers[
                          q.question_number
                            ? q.question_number[blankIdx]
                            : blankIdx + 1
                        ] || "",
                    })
                  );

                  // Update both the text and the blanks
                  updateQuestion("text", newText, idx);
                  updateQuestion("blanks", blanksWithQuestionNumbers, idx);
                }}
                className="border p-2 w-full"
                rows={6}
              />
            </div>

            {/* Render blanks for answers */}
            {q.blanks && q.blanks.length > 0 && (
              <div className="mb-2">
                <label className="block mb-1 font-medium">
                  Answers for blanks:
                </label>
                {q.blanks.map((blank, blankIdx) => (
                  <div
                    key={`${blank.blank_number}-${blankIdx}`}
                    className="mb-2 flex items-center"
                  >
                    <span className="mr-2 font-medium">
                      Question {blank.blank_number}:
                    </span>
                    <input
                      type="text"
                      placeholder="Answer"
                      value={blank.answer || ""}
                      onChange={(e) => {
                        // Create a deep copy of the blanks array
                        const updatedBlanks = q.blanks ? [...q.blanks] : [];

                        // Update the specific blank's answer
                        if (updatedBlanks[blankIdx]) {
                          updatedBlanks[blankIdx] = {
                            ...updatedBlanks[blankIdx],
                            answer: e.target.value,
                          };
                        }

                        // Update the question with the new blanks array
                        updateQuestion("blanks", updatedBlanks, idx);
                      }}
                      className="border p-2 flex-1"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Show message if no blanks detected */}
            {(!q.blanks || q.blanks.length === 0) && q.text && (
              <div className="text-red-500 text-sm">
                No blanks detected. Use __________ (10 underscores) to create
                blanks in your text.
              </div>
            )}

            {/* Warning if blanks exceed question numbers */}
            {q.blanks &&
              q.question_number &&
              q.blanks.length > q.question_number.length && (
                <div className="text-orange-500 text-sm">
                  Warning: You have {q.blanks.length} blanks but only{" "}
                  {q.question_number.length} question numbers allocated. Some
                  blanks may not have proper question numbers.
                </div>
              )}

            {/* Debug info - you can remove this after testing */}
            <div className="mt-4 p-2 bg-gray-100 text-xs">
              <strong>Debug Info:</strong>
              <pre>{JSON.stringify(q.blanks, null, 2)}</pre>
            </div>
          </div>
        ));

      case "fill_in_the_blanks_with_subtitle":
        return questions.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-4 border p-4">
            {/* Title Input - Only show for the first question */}
            {sectionIdx === 0 && (
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={section.title || ""}
                  onChange={(e) => {
                    const updatedParts = [...test.parts];
                    updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].title = e.target.value;
                    setTest({ ...test, parts: updatedParts });
                  }}
                  className="border p-2 mb-2 w-full"
                />
              </div>
            )}

            {/* Subtitle input */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Subtitle"
                value={section.subtitle || ""}
                onChange={(e) => {
                  const updatedParts = [...test.parts];
                  updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ][sectionIdx].subtitle = e.target.value;
                  setTest({ ...test, parts: updatedParts });
                }}
                className="border p-2 mb-2 w-full font-medium"
              />
            </div>

            {/* Extra text with blanks */}
            <div className="mb-2">
              <label className="block mb-1 font-medium">
                Text with blanks:
              </label>
              {section.extra?.map((text: any, textIdx: any) => (
                <div key={textIdx} className="mb-2">
                  <textarea
                    placeholder={`Text line ${
                      textIdx + 1
                    } (use __________ for blanks)`}
                    value={text || ""}
                    onChange={(e) => {
                      const updatedParts = [...test.parts];
                      updatedParts[passageIndex].questions[groupIndex][
                        questionType
                      ][sectionIdx].extra[textIdx] = e.target.value;
                      setTest({ ...test, parts: updatedParts });
                    }}
                    className="border p-2 w-full"
                    rows={2}
                  />
                </div>
              ))}

              {/* Add new text line button */}
              <button
                type="button"
                onClick={() => {
                  const updatedParts = [...test.parts];
                  if (
                    !updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].extra
                  ) {
                    updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].extra = [];
                  }
                  updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ][sectionIdx].extra.push("");
                  setTest({ ...test, parts: updatedParts });
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Add Text Line
              </button>
            </div>

            {/* Questions/Answers */}
            <div className="mb-2">
              <label className="block mb-1 font-medium">Answers:</label>
              {section.questions?.map((question: any, qIdx: number) => (
                <div key={qIdx} className="mb-2 flex items-center">
                  <span className="mr-2">
                    Question {question.question_number}:
                  </span>
                  <input
                    type="text"
                    placeholder="Answer"
                    value={question.answer || ""}
                    onChange={(e) => {
                      const updatedParts = [...test.parts];
                      updatedParts[passageIndex].questions[groupIndex][
                        questionType
                      ][sectionIdx].questions[qIdx].answer = e.target.value;
                      setTest({ ...test, parts: updatedParts });
                    }}
                    className="border p-2 flex-1"
                  />
                  <select
                    value={question.input_type || "text"}
                    onChange={(e) => {
                      const updatedParts = [...test.parts];
                      updatedParts[passageIndex].questions[groupIndex][
                        questionType
                      ][sectionIdx].questions[qIdx].input_type = e.target.value;
                      setTest({ ...test, parts: updatedParts });
                    }}
                    className="border p-2 ml-2"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedParts = [...test.parts];
                      updatedParts[passageIndex].questions[groupIndex][
                        questionType
                      ][sectionIdx].questions.splice(qIdx, 1);
                      setTest({ ...test, parts: updatedParts });
                      
                      // Recalculate question numbers to ensure sequential numbering
                      setTimeout(() => {
                        recalculateFillInTheBlanksQuestionNumbers(passageIndex, groupIndex);
                      }, 0);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Add new question button */}
              <button
                type="button"
                onClick={() => {
                  const updatedParts = [...test.parts];
                  const allQuestions = updatedParts[passageIndex].questions[groupIndex][questionType];
                  
                  // Get the next question number across ALL sections
                  const getNextQuestionNumber = () => {
                    let maxNumber = 0;
                    allQuestions.forEach((section: any) => {
                      if (section.questions && Array.isArray(section.questions)) {
                        section.questions.forEach((q: any) => {
                          if (q.question_number && typeof q.question_number === "number") {
                            maxNumber = Math.max(maxNumber, q.question_number);
                          }
                        });
                      }
                    });
                    return maxNumber + 1;
                  };

                  if (
                    !updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].questions
                  ) {
                    updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].questions = [];
                  }

                  updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ][sectionIdx].questions.push({
                    question_number: getNextQuestionNumber(),
                    answer: "",
                    input_type: "text",
                  });

                  setTest({ ...test, parts: updatedParts });
                  
                  // Recalculate question numbers to ensure sequential numbering
                  setTimeout(() => {
                    recalculateFillInTheBlanksQuestionNumbers(passageIndex, groupIndex);
                  }, 0);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Add Answer
              </button>
            </div>

            {/* Remove section button - only show for sections after the first one */}
            {sectionIdx > 0 && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    const updatedParts = [...test.parts];
                    updatedParts[passageIndex].questions[groupIndex][questionType].splice(sectionIdx, 1);
                    setTest({ ...test, parts: updatedParts });
                    
                    // Recalculate question numbers to ensure sequential numbering
                    setTimeout(() => {
                      recalculateFillInTheBlanksQuestionNumbers(passageIndex, groupIndex);
                    }, 0);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded text-sm"
                >
                  Remove This Section
                </button>
              </div>
            )}
          </div>
        ));

      case "summary_fill_in_the_blanks":
        return questions.map((q, idx) => (
          <div key={idx}>
            {/* Passage input - update both local state and test object */}
            <div className="mb-2">
              <textarea
                placeholder="Enter Passage for summary fill-in-the-blanks"
                value={q.passage || ""} // Use value from test object, not local state
                onChange={(e) => {
                  const newPassage = e.target.value;
                  // Update the test object directly
                  updateQuestion("passage", newPassage, idx);

                  // Also update local state for blank detection
                  setSummaryPassage(newPassage);
                  const extractedBlanks =
                    getBlanksFromTextForSummary(newPassage);
                  setBlanks(extractedBlanks);
                }}
                className="border p-2 mb-2 w-full"
                rows={6}
              />
            </div>

            {/* Dynamically render dropdowns for each blank */}
            <div className="mb-2">
              {blanks.map((blank, blankIdx) => (
                <div key={blank}>
                  <label>{`Select answer for blank ${blank}:`}</label>
                  <select
                    value={q.answers?.[blankIdx] || ""} // Use value from test object
                    onChange={(e) => {
                      const updatedAnswers = [...(q.answers || [])];
                      updatedAnswers[blankIdx] = e.target.value;
                      updateQuestion("answers", updatedAnswers, idx);
                      setAnswers(updatedAnswers); // Keep local state in sync
                    }}
                    className="border p-2 mb-2"
                  >
                    <option value="">Select an option</option>
                    {(q.options || []).map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}: {option.value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            <button
              type="button"
              onClick={() => {
                const label = String.fromCharCode(
                  65 + (q.options?.length || 0)
                );
                const newOption = { label, value: "" };
                const updatedOptions = [...(q.options || []), newOption];
                updateQuestion("options", updatedOptions, idx);
                setOptions(updatedOptions); // Keep local state in sync
              }}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add Option
            </button>

            {/* Render Inputs for Options */}
            {(q.options || []).map((option, optIdx) => (
              <div key={optIdx} className="mb-2">
                <input
                  type="text"
                  placeholder={`Option Value ${option.label}`}
                  value={option.value}
                  onChange={(e) => {
                    const updatedOptions = [...(q.options || [])];
                    updatedOptions[optIdx] = {
                      ...updatedOptions[optIdx],
                      value: e.target.value,
                    };
                    updateQuestion("options", updatedOptions, idx);
                    setOptions(updatedOptions); // Keep local state in sync
                  }}
                  className="border p-2 mb-2 w-full"
                />
              </div>
            ))}
          </div>
        ));

      default:
        return null;
    }
  };

  const handleReadingTestSubmit = async (formData: any) => {
    try {
      const data = await submitReadingQuestions(formData);
      console.log(data.success);
      if (data.success) {
        toast.success("Test created successfully!");
        // Optionally, redirect or reset the form
      } else {
        toast.error("Failed to create test. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the test.");
    }
  };

  // Function to recalculate question numbers for fill_in_the_blanks_with_subtitle
  const recalculateFillInTheBlanksQuestionNumbers = (passageIndex: number, groupIndex: number) => {
    const updatedParts = [...test.parts];
    const questionType = "fill_in_the_blanks_with_subtitle";
    const sections = updatedParts[passageIndex].questions[groupIndex][questionType];
    
    if (sections && Array.isArray(sections)) {
      let questionCounter = 1;
      sections.forEach((section: any) => {
        if (section.questions && Array.isArray(section.questions)) {
          section.questions.forEach((q: any) => {
            q.question_number = questionCounter++;
          });
        }
      });
      setTest({ ...test, parts: updatedParts });
    }
  };

  // Function to clean test data before submission
  const cleanTestData = (testData: any) => {
    const cleaned = {
      title: testData.title,
      type: testData.type,
      duration: testData.duration,
      parts: testData.parts.map((part: any) => ({
        title: part.title,
        instructions: part.instructions,
        passage_title: part.passage_title,
        passage_subtitle: part.passage_subtitle,
        passage: part.passage,
        image: part.image || "",
        questions: part.questions
      }))
    };
    return cleaned;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create IELTS Test</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Test Title"
          value={test.title}
          onChange={(e) => setTest({ ...test, title: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={test.type}
          onChange={(e) =>
            setTest({ ...test, type: e.target.value as "academic" | "general" })
          }
          className="border p-2 mr-2"
        >
          <option value="academic">Academic</option>
          <option value="general">General</option>
        </select>
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={test.duration}
          onChange={(e) =>
            setTest({ ...test, duration: parseInt(e.target.value) })
          }
          className="border p-2"
        />
      </div>
      <button
        onClick={addPassage}
        className="bg-blue-500 text-white p-2 rounded mb-4 mx-2"
      >
        Add Passage
      </button>
      {test.parts.map((passage, passageIndex) => (
        <div key={passageIndex} className="border p-4 mb-4">
          <h2 className="text-xl font-semibold">Passage {passageIndex + 1}</h2>
          <input
            type="text"
            placeholder="Title (e.g., READING PASSAGE 1)"
            value={passage.title}
            onChange={(e) =>
              updatePassageField(passageIndex, "title", e.target.value)
            }
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Instructions"
            value={passage.instructions}
            onChange={(e) =>
              updatePassageField(passageIndex, "instructions", e.target.value)
            }
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Passage Title"
            value={passage.passage_title}
            onChange={(e) =>
              updatePassageField(passageIndex, "passage_title", e.target.value)
            }
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Passage Subtitle"
            value={passage.passage_subtitle}
            onChange={(e) =>
              updatePassageField(
                passageIndex,
                "passage_subtitle",
                e.target.value
              )
            }
            className="border p-2 mb-2 w-full"
          />
          {/* Passage Type Selection */}
          <div className="mb-4">
            <label className="block mb-2">Select Passage Type</label>
            <select
              value={passage.passageType}
              onChange={(e) =>
                updatePassageType(
                  passageIndex,
                  e.target.value as "type1" | "type2"
                )
              }
              className="border p-2"
            >
              <option value="type1">Type 1 (Array)</option>
              <option value="type2">Type 2 (Object)</option>
            </select>
          </div>
          <div className="mb-2">
            {Array.isArray(passage.passage)
              ? passage.passage.map((para, paraIndex) => (
                  <textarea
                    key={paraIndex}
                    placeholder={`Paragraph ${String.fromCharCode(
                      65 + paraIndex
                    )}`}
                    value={para}
                    onChange={(e) =>
                      updateParagraph(passageIndex, paraIndex, e.target.value)
                    }
                    className="border p-2 mb-2 w-full"
                  />
                ))
              : Object.keys(passage.passage).map((key) => (
                  <textarea
                    key={key}
                    placeholder={`Paragraph ${key}`}
                    value={passage.passage[key]}
                    onChange={(e) =>
                      updateParagraph(
                        passageIndex,
                        parseInt(key, 36) - 10,
                        e.target.value
                      )
                    }
                    className="border p-2 mb-2 w-full"
                  />
                ))}
            <button
              onClick={() => addParagraph(passageIndex)}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add Paragraph
            </button>
          </div>
          selector:
          <div className="mb-2">
            <select
              value={currentQuestionType}
              onChange={(e) => setCurrentQuestionType(e.target.value)}
              className="border p-2 mr-2"
            >
              <option value="">Select Question Type</option>
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {currentQuestionType && (
              <input
                type="number"
                min="1"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="border p-2 mr-2"
                placeholder="Number of questions"
              />
            )}
            <button
              onClick={() => addQuestionGroup(passageIndex)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Questions
            </button>
          </div>
          {passage.questions.map((questionGroup, groupIndex) => {
            const questionType = Object.keys(questionGroup)[0];
            return (
              <div key={groupIndex} className="border p-2 mb-2">
                <h3 className="font-semibold">{questionType}</h3>
                {renderQuestionInput(
                  questionType,
                  questionGroup[questionType],
                  passageIndex,
                  groupIndex
                )}
              </div>
            );
          })}
        </div>
      ))}
      <button
        onClick={(e) => {
          e.preventDefault();
          console.log("Test object before submission:", JSON.stringify(test, null, 2));
          
          // Validate test object before submission
          if (!test.title || !test.type || !test.duration || !test.parts || test.parts.length === 0) {
            toast.error("Please fill in all required fields: title, type, duration, and at least one passage");
            return;
          }
          
          // Check if any passage has questions
          const hasQuestions = test.parts.some(part => part.questions && part.questions.length > 0);
          if (!hasQuestions) {
            toast.error("Please add at least one question to a passage");
            return;
          }
          
          handleReadingTestSubmit(cleanTestData(test));
        }}
        className=" btn btn-success btn-md text-white "
      >
        Submit
      </button>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default TestCreationPage;
