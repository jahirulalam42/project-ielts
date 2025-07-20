"use client";
import { submitReadingQuestions } from "@/services/data";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { RenderQuestionInput } from "./RenderQuestionInput";
import {
  updateParagraph,
  updatePassageField,
  updatePassageType,
} from "./UpdatePassage";
import ImageUploader from "../Common/ImageUploader";

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

              // Handle nested questions structure (for fill_in_the_blanks_with_subtitle)
              if (q.questions && Array.isArray(q.questions)) {
                q.questions.forEach((nestedQ: any) => {
                  if (
                    nestedQ.question_number &&
                    typeof nestedQ.question_number === "number"
                  ) {
                    maxNumber = Math.max(maxNumber, nestedQ.question_number);
                  }
                });
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
              },
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
      const existingFillBlanksGroup = existingQuestions.find(
        (group) => Object.keys(group)[0] === "fill_in_the_blanks_with_subtitle"
      );

      if (existingFillBlanksGroup) {
        // Merge new questions into existing group
        const existingGroup = existingFillBlanksGroup as Record<string, any[]>;
        const allSections = [
          ...existingGroup["fill_in_the_blanks_with_subtitle"],
          ...newQuestions,
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

  // Render question inputs based on question type

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
        questions: part.questions,
      })),
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
              updatePassageField(
                passageIndex,
                "title",
                e.target.value,
                test,
                setTest
              )
            }
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Instructions"
            value={passage.instructions}
            onChange={(e) =>
              updatePassageField(
                passageIndex,
                "instructions",
                e.target.value,
                test,
                setTest
              )
            }
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Passage Title"
            value={passage.passage_title}
            onChange={(e) =>
              updatePassageField(
                passageIndex,
                "passage_title",
                e.target.value,
                test,
                setTest
              )
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
                e.target.value,
                test,
                setTest
              )
            }
            className="border p-2 mb-2 w-full"
          />
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Upload Image (Optional)
              </span>
            </label>

            <ImageUploader
              onUploaded={(url) =>
                updatePassageField(passageIndex, "image", url, test, setTest)
              }
            />
          </div>
          {/* Passage Type Selection */}
          <div className="mb-4">
            <label className="block mb-2">Select Passage Type</label>
            <select
              value={passage.passageType}
              onChange={(e) =>
                updatePassageType(
                  passageIndex,
                  e.target.value as "type1" | "type2",
                  test,
                  setTest
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
                      updateParagraph(
                        passageIndex,
                        paraIndex,
                        e.target.value,
                        test,
                        setTest
                      )
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
                        e.target.value,
                        test,
                        setTest
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
                {RenderQuestionInput(
                  questionType,
                  questionGroup[questionType],
                  passageIndex,
                  groupIndex,
                  test,
                  setTest,
                  setSummaryPassage,
                  setBlanks,
                  blanks,
                  setAnswers,
                  setOptions
                )}
              </div>
            );
          })}
        </div>
      ))}
      <button
        onClick={(e) => {
          e.preventDefault();
          console.log(
            "Test object before submission:",
            JSON.stringify(test, null, 2)
          );

          // Validate test object before submission
          if (
            !test.title ||
            !test.type ||
            !test.duration ||
            !test.parts ||
            test.parts.length === 0
          ) {
            toast.error(
              "Please fill in all required fields: title, type, duration, and at least one passage"
            );
            return;
          }

          // Check if any passage has questions
          const hasQuestions = test.parts.some(
            (part) => part.questions && part.questions.length > 0
          );
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
