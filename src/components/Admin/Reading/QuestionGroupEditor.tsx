"use client";
import React, { useState } from "react";
import {
  Passage,
  ReadingTest,
  Question,
  QuestionType,
  questionTypes,
} from "./readingTest";
import TrueFalseForm from "./forms/TrueFalseForm";
import FillBlanksForm from "./forms/FillBlanksForm";
import MatchingHeadingsForm from "./forms/MatchingHeadingsForm";
import ParagraphMatchingForm from "./forms/ParagraphMatchingForm";
import MCQForm from "./forms/MCQForm";
import MultipleMCQForm from "./forms/MultipleMCQForm";
import SummaryFillBlanksForm from "./forms/SummaryFillBlanksForm";
import PassageFillBlanksForm from "./forms/PassageFillBlanksForm";
import FillBlanksWithSubtitleForm from "./forms/FillBlanksWithSubtitleForm";

interface QuestionGroupEditorProps {
  passage: Passage;
  passageIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
}

const QuestionGroupEditor: React.FC<QuestionGroupEditorProps> = ({
  passage,
  passageIndex,
  test,
  setTest,
}) => {
  const [currentQuestionType, setCurrentQuestionType] = useState<
    QuestionType | ""
  >("");
  const [questionCount, setQuestionCount] = useState<number>(1);

  // Global function to recalculate all question numbers in the test
  const recalculateAllQuestionNumbers = (testData: ReadingTest): ReadingTest => {
    const updatedTest = { ...testData };
    let currentQuestionNumber = 1;

    updatedTest.parts.forEach((part, partIndex) => {
      part.questions.forEach((questionGroup, groupIndex) => {
        const questionType = Object.keys(questionGroup)[0] as QuestionType;
        const questions = questionGroup[questionType];

        switch (questionType) {
          case "true_false_not_given":
          case "fill_in_the_blanks":
          case "mcq":
          case "matching_headings":
          case "paragraph_matching":
            questions.forEach((q, qIndex) => {
              updatedTest.parts[partIndex].questions[groupIndex][questionType][qIndex].question_number = currentQuestionNumber++;
            });
            break;

          case "multiple_mcq":
            questions.forEach((q, qIndex) => {
              const questionNumbers = [currentQuestionNumber, currentQuestionNumber + 1];
              updatedTest.parts[partIndex].questions[groupIndex][questionType][qIndex].question_numbers = questionNumbers;
              updatedTest.parts[partIndex].questions[groupIndex][questionType][qIndex].question_number = currentQuestionNumber;
              currentQuestionNumber += 2;
            });
            break;

          case "passage_fill_in_the_blanks":
            questions.forEach((q, qIndex) => {
              const question = updatedTest.parts[partIndex].questions[groupIndex][questionType][qIndex];
              const numBlanks = question.blanks?.length || 0;
              const questionNumbers = Array.from({ length: numBlanks }, (_, idx) => currentQuestionNumber + idx);
              
              question.question_number = questionNumbers;
              question.question_numbers = questionNumbers;
              
              // Update blank numbers
              if (question.blanks) {
                question.blanks.forEach((blank, blankIdx) => {
                  blank.blank_number = currentQuestionNumber + blankIdx;
                });
              }
              
              currentQuestionNumber += numBlanks;
            });
            break;

          case "summary_fill_in_the_blanks":
            questions.forEach((q, qIndex) => {
              const question = updatedTest.parts[partIndex].questions[groupIndex][questionType][qIndex];
              const numBlanks = question.question_numbers?.length || 0;
              const questionNumbers = Array.from({ length: numBlanks }, (_, idx) => currentQuestionNumber + idx);
              
              question.question_numbers = questionNumbers;
              currentQuestionNumber += numBlanks;
            });
            break;

          case "fill_in_the_blanks_with_subtitle":
            questions.forEach((q, qIndex) => {
              const question = updatedTest.parts[partIndex].questions[groupIndex][questionType][qIndex];
              const numQuestions = question.questions?.length || 0;
              
              if (question.questions) {
                question.questions.forEach((subQ: any, subQIdx: number) => {
                  subQ.question_number = currentQuestionNumber + subQIdx;
                });
              }
              
              currentQuestionNumber += numQuestions;
            });
            break;
        }
      });
    });

    return updatedTest;
  };

  // Function to update test with recalculated question numbers
  const updateTestWithRecalculatedNumbers = (newTest: ReadingTest) => {
    const recalculatedTest = recalculateAllQuestionNumbers(newTest);
    setTest(recalculatedTest);
  };

  // Utility function to trigger global recalculation (can be passed to form components)
  const triggerGlobalRecalculation = () => {
    const recalculatedTest = recalculateAllQuestionNumbers(test);
    setTest(recalculatedTest);
  };

  const addQuestionGroup = () => {
    if (!currentQuestionType || questionCount < 1) return;
    const updatedParts = [...test.parts];
    const newQuestions: Question[] = [];

    // Create new questions with temporary numbering (will be recalculated globally)
    switch (currentQuestionType) {
      case "true_false_not_given":
      case "fill_in_the_blanks":
      case "mcq":
        for (let i = 0; i < questionCount; i++) {
          const questionData: Question = {
            question_number: 1, // Temporary, will be recalculated
            question: "",
            input_type:
              currentQuestionType === "fill_in_the_blanks"
                ? "text"
                : currentQuestionType === "true_false_not_given"
                ? "dropdown"
                : "radio",
            answer:
              currentQuestionType === "true_false_not_given" ? "True" : "",
            title: "",
            subtitle: "",
            extra: "",
            questions: [],
          };

          if (currentQuestionType === "mcq") {
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
        const passageText = passage.passage;
        let optionsList;

        if (Array.isArray(passageText)) {
          optionsList = passageText.map((_, index) => ({
            label: String.fromCharCode(65 + index),
            value: String.fromCharCode(65 + index),
          }));
        } else {
          optionsList = Object.keys(passageText).map((key) => ({
            label: key,
            value: key,
          }));
        }

        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            question_number: 1, // Temporary, will be recalculated
            question: "",
            answer: optionsList[0]?.value || "A",
            options: optionsList,
            input_type: "dropdown",
            title: "",
            subtitle: "",
            extra: "",
            questions: [],
          });
        }
        break;

      case "multiple_mcq":
        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            question_number: 1, // Temporary, will be recalculated
            question_numbers: [1, 2], // Temporary, will be recalculated
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
            answer: [],
            title: "",
            subtitle: "",
            extra: "",
            questions: [],
          });
        }
        break;

      case "passage_fill_in_the_blanks":
        newQuestions.push({
          question_number: [1], // Temporary, will be recalculated
          question_numbers: [1], // Temporary, will be recalculated
          question: "",
          input_type: "text",
          instruction:
            "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
          text: "",
          blanks: [],
          answer: [],
          title: "",
          subtitle: "",
          extra: "",
          questions: [],
        });
        break;

      case "summary_fill_in_the_blanks":
        newQuestions.push({
          question_number: 1, // Temporary, will be recalculated
          question_numbers: [1], // Temporary, will be recalculated
          question: "",
          input_type: "text",
          passage: "",
          answers: [],
          options: [],
          title: "",
          subtitle: "",
          extra: "",
          questions: [],
        });
        break;

      case "fill_in_the_blanks_with_subtitle":
        const subtitleQuestions = [];
        for (let i = 0; i < questionCount; i++) {
          subtitleQuestions.push({
            question_number: 1, // Temporary, will be recalculated
            answer: "",
            input_type: "text"
          });
        }
        newQuestions.push({
          question: "",
          input_type: "text",
          title: "",
          subtitle: "",
          extra: [""],
          questions: subtitleQuestions
        });
        break;

      default:
        return;
    }

    // Add the new questions to the test
    const updatedTest = { ...test };
    updatedTest.parts = [...test.parts];
    updatedTest.parts[passageIndex] = {
      ...test.parts[passageIndex],
      questions: [
        ...test.parts[passageIndex].questions,
        { [currentQuestionType]: newQuestions },
      ],
    };

    // Recalculate all question numbers globally
    updateTestWithRecalculatedNumbers(updatedTest);
    
    setCurrentQuestionType("");
    setQuestionCount(1);
  };

  const renderQuestionForm = (
    questionType: string,
    questions: Question[],
    groupIndex: number
  ) => {
    const formProps = {
      questions,
      passageIndex,
      groupIndex,
      test,
      setTest,
      triggerGlobalRecalculation,
    };

    switch (questionType) {
      case "true_false_not_given":
        return <TrueFalseForm {...formProps} />;
      case "fill_in_the_blanks":
        return <FillBlanksForm {...formProps} />;
      case "matching_headings":
        return <MatchingHeadingsForm {...formProps} />;
      case "paragraph_matching":
        return <ParagraphMatchingForm {...formProps} />;
      case "multiple_mcq":
        return <MultipleMCQForm {...formProps} />;
      case "mcq":
        return <MCQForm {...formProps} />;
      case "summary_fill_in_the_blanks":
        return <SummaryFillBlanksForm {...formProps} />;
      case "passage_fill_in_the_blanks":
        return <PassageFillBlanksForm {...formProps} />;
      case "fill_in_the_blanks_with_subtitle":
        return <FillBlanksWithSubtitleForm {...formProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <select
          value={currentQuestionType}
          onChange={(e) =>
            setCurrentQuestionType(e.target.value as QuestionType)
          }
          className="select select-bordered border-black"
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
            className="input input-bordered border-black w-24"
            placeholder="Count"
          />
        )}
        <button
          onClick={addQuestionGroup}
          className="btn btn-primary"
          disabled={!currentQuestionType}
        >
          Add Questions
        </button>
      </div>

      {/* Render existing question groups */}
      {passage.questions.map((questionGroup, groupIndex) => {
        const questionType = Object.keys(questionGroup)[0] as QuestionType;
        const questions = questionGroup[questionType];
        return (
          <div key={groupIndex} className="border p-4 rounded-lg relative">
            {/* Header with question type and remove button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{questionType}</h3>
              <button
                onClick={() => {
                  const updatedTest = { ...test };
                  updatedTest.parts[passageIndex].questions.splice(groupIndex, 1);
                  updateTestWithRecalculatedNumbers(updatedTest);
                }}
                className="btn btn-error btn-sm"
                title="Remove this question group"
              >
                ✕
              </button>
            </div>
            {renderQuestionForm(questionType, questions, groupIndex)}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionGroupEditor;
