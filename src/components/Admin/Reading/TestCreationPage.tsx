"use client";
import React, { useState } from "react";

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
  question_number?: number;
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
  passage: string[] | Record<string, string>;
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
  const getBlanksFromText = (text: string) => {
    const regex = /__________/g; // Match all occurrences of "__________"
    const matches = [...text.matchAll(regex)]; // Find all occurrences of "__________"

    return matches.map((match, index) => ({
      blank_number: index + 1, // Start numbering blanks from 1
      input_type: "text", // Use text input for each blank
      answer: "", // Empty answer initially, to be filled by admin
    }));
  };

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
      updatedParts[passageIndex].passage = updatedParts[
        passageIndex
      ].passage.reduce((acc: any, para: any, idx: number) => {
        const key = String.fromCharCode(65 + idx); // A, B, C...
        acc[key] = para;
        return acc;
      }, {} as Record<string, string>);
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
  const addQuestionGroup = (passageIndex: number) => {
    if (!currentQuestionType || questionCount < 1) return;
    const updatedParts = [...test.parts];
    const newQuestions: any = [];

    // Determine the last question number used across all parts
    let lastQuestionNumber = 0;
    updatedParts.forEach((passage) => {
      passage.questions.forEach((questionGroup) => {
        Object.values(questionGroup).forEach((questions) => {
          questions.forEach((q) => {
            if (q.question_numbers) {
              lastQuestionNumber = Math.max(
                lastQuestionNumber,
                ...q.question_numbers
              );
            }
          });
        });
      });
    });

    // The next question number starts from 1 if no questions exist yet
    let nextQuestionNumber = lastQuestionNumber + 1;

    // Handle different question types
    switch (currentQuestionType) {
      case "fill_in_the_blanks_with_subtitle":
        newQuestions.push({
          title: title,
          subtitle: subtitle,
          extra: extra,
          questions: questions.map((question, idx) => ({
            question_number: question.question_number,
            answer: question.answer,
            input_type: question.input_type,
          })),
        });

        break;

      case "true_false_not_given":
        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            question_number: i + 1,
            question: "",
            answer: "True",
            input_type: "dropdown",
          });
        }
        break;

      case "fill_in_the_blanks":
        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            question_number: i + 1,
            question: "",
            answer: "",
            input_type: "text",
          });
        }
        break;

      case "matching_headings":
        // Generate options (heading keys) from the passage (A, B, C, etc.)
        const headingOptions = Object.keys(
          updatedParts[passageIndex].passage
        ).map((key) => ({
          label: key, // 'A', 'B', 'C'...
          value: key, // 'A', 'B', 'C'...
        }));

        // Create matching_headings questions
        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            question_number: i + 1,
            question: "", // Admin will enter the question (heading reference)
            answer: "", // Admin will select the correct answer (A, B, C...)
            options: headingOptions, // Use headingOptions for matching_headings
            input_type: "dropdown", // User selects from options (A, B, C, etc.)
          });
        }
        break;

      case "paragraph_matching":
        // Generate options (paragraph keys) from the passage (A, B, C, etc.)
        const paragraphOptions = Object.keys(
          updatedParts[passageIndex].passage
        ).map((key) => ({
          label: key, // 'A', 'B', 'C'...
          value: key, // 'A', 'B', 'C'...
        }));

        // Create paragraph_matching questions
        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            question_number: i + 1,
            question: "", // Question reference input by admin
            answer: "", // Admin will select the correct answer (A, B, C...)
            options: paragraphOptions, // Use paragraphOptions for paragraph_matching
            input_type: "dropdown", // User selects from options (A, B, C, etc.)
          });
        }
        break;

      case "mcq":
        // Create MCQ questions with unique options for each question
        for (let i = 0; i < questionCount; i++) {
          const options: { label: string; value: string }[] = [];
          for (let j = 0; j < 4; j++) {
            options.push({
              label: String.fromCharCode(65 + j), // 'A', 'B', 'C', 'D'
              value: "", // Initially empty, will be filled by user
            });
          }

          newQuestions.push({
            question_number: i + 1,
            question: "", // Admin will input the question
            answer: [], // Admin will select the correct answer(s) (e.g., ["D"])
            options: options, // Dynamically generated options for this question
            input_type: "radio", // Only one option can be selected
            min_selection: 1, // Only 1 option can be selected
            max_selection: 1, // Only 1 option can be selected
          });
        }
        break;

      case "summary_fill_in_the_blanks":
        // Auto-generate question numbers
        const questionNumbers = Array.from(
          { length: questionCount },
          (_, idx) => idx + 1
        );

        // Create the summary fill-in-the-blanks question with passage, options, and correct answers
        newQuestions.push({
          question_numbers: questionNumbers, // Auto-generated question numbers
          passage: summaryPassage, // Passage entered by the admin
          answers: answers, // Correct answers selected by the admin
          options: options, // Options entered by the admin
          input_type: "drag_and_drop", // Drag-and-drop input type
          question: "", // Placeholder for the question text (admin will input this)
        });
        break;

      case "multiple_mcq":
        for (let i = 0; i < questionCount; i++) {
          // Each question gets two consecutive numbers
          const questionNumbers = [
            nextQuestionNumber + 2 * i,
            nextQuestionNumber + 2 * i + 1,
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
            correct_mapping: [], // Admin can fill correct options
          });
        }
        break;

      case "passage_fill_in_the_blanks":
        // Create new questions for passage_fill_in_the_blanks
        for (let i = 0; i < questionCount; i++) {
          const passageText = ""; // Placeholder for passage text (admin input)
          const blanks = getBlanksFromText(passageText); // Extract blanks from the passage text

          // Ensure that the created question object includes all required fields
          newQuestions.push({
            question_number: i + 1, // Start from question number 1 (for each question)
            question: "", // Placeholder for the actual question text (admin will fill this)
            input_type: "text", // Input type for fill-in-the-blank questions
            instruction:
              "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
            text: passageText, // The passage text will be entered by the admin
            blanks: blanks.map((blank) => ({
              blank_number: blank.blank_number, // Blank number (e.g., 1, 2, 3...)
              input_type: "text", // Input type for fill-in-the-blank question
              answer: "", // Initially empty answer, to be filled by the admin
            })),
          });
        }
        break;

      default:
        return;
    }

    updatedParts[passageIndex].questions.push({
      [currentQuestionType]: newQuestions,
    });
    setTest({ ...test, parts: updatedParts });
    setCurrentQuestionType("");
    setQuestionCount(1);
  };

  // Render question inputs based on question type
  const renderQuestionInput = (
    questionType: string,
    questions: Question[],
    passageIndex: number,
    groupIndex: number
  ) => {
    const updateQuestion = (field: string, value: any, qIndex: number) => {
      const updatedParts = [...test.parts];
      updatedParts[passageIndex].questions[groupIndex][questionType][qIndex][
        field as keyof Question
      ] = value;
      setTest({ ...test, parts: updatedParts });
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
              value={q.answer as string}
              onChange={(e) => updateQuestion("answer", e.target.value, idx)}
              className="border p-2 mb-2 w-full"
            >
              {q.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} {/* Display 'A', 'B', 'C', etc. */}
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
              value={q.answer as string}
              onChange={(e) => updateQuestion("answer", e.target.value, idx)}
              className="border p-2 mb-2 w-full"
            >
              {q.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} {/* Display 'A', 'B', 'C', etc. */}
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

      case "fill_in_the_blanks_with_subtitle":
        return questions.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-4 border p-4">
            {/* Title input */}
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
                    rows="2"
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
                  const currentQuestions =
                    updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].questions || [];
                  const nextQuestionNumber =
                    currentQuestions.length > 0
                      ? Math.max(
                          ...currentQuestions.map((q: any) => q.question_number)
                        ) + 1
                      : 1;

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
                    question_number: nextQuestionNumber,
                    answer: "",
                    input_type: "text",
                  });

                  setTest({ ...test, parts: updatedParts });
                }}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Add Answer
              </button>
            </div>
          </div>
        ));

      case "summary_fill_in_the_blanks":
        return questions.map((q, idx) => (
          <div key={idx}>
            {/* Passage input */}
            <div className="mb-2">
              <textarea
                placeholder="Enter Passage for summary fill-in-the-blanks"
                value={summaryPassage}
                onChange={(e) => {
                  const newPassage = e.target.value;
                  setSummaryPassage(newPassage);
                  const extractedBlanks =
                    getBlanksFromTextForSummary(newPassage);
                  setBlanks(extractedBlanks); // Update blanks dynamically
                }}
                className="border p-2 mb-2 w-full"
              />
            </div>

            {/* Dynamically render dropdowns for each blank */}
            <div className="mb-2">
              {blanks.map((blank, blankIdx) => (
                <div key={blank}>
                  <label>{`Select answer for blank ${blank}:`}</label>
                  <select
                    value={answers[blankIdx] || ""}
                    onChange={(e) =>
                      handleAnswerChange(blankIdx, e.target.value)
                    } // Update answer for this blank
                    className="border p-2 mb-2"
                  >
                    <option value="">Select an option</option>
                    {options.map((option) => (
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
              onClick={addOption}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add Option
            </button>

            {/* Render Inputs for New Options */}
            {options.map((option, optIdx) => (
              <div key={optIdx} className="mb-2">
                {/* Label is auto-generated (A, B, C, ...) */}
                <input
                  type="text"
                  placeholder={`Option Value ${String.fromCharCode(
                    65 + optIdx
                  )}`}
                  value={option.value}
                  onChange={(e) =>
                    handleOptionChange(optIdx, "value", e.target.value)
                  }
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
            {currentQuestionType &&
              currentQuestionType !== "passage_fill_in_the_blanks" &&
              currentQuestionType !== "summary_fill_in_the_blanks" &&
              currentQuestionType !== "fill_in_the_blanks_with_subtitle" && (
                <input
                  type="number"
                  min="1"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="border p-2 mr-2"
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
        onClick={() => console.log(JSON.stringify(test, null, 2))}
        className="bg-purple-500 text-white p-2 rounded mx-2"
      >
        Submit
      </button>
    </div>
  );
};

export default TestCreationPage;