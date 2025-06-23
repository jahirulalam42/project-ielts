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

  const addQuestionGroup = () => {
    if (!currentQuestionType || questionCount < 1) return;
    const updatedParts = [...test.parts];
    const newQuestions: Question[] = [];

    // Get the highest question number across ALL parts
    const getGlobalMaxQuestionNumber = () => {
      let maxNumber = 0;

      test.parts.forEach((part) => {
        part.questions.forEach((questionGroup) => {
          Object.values(questionGroup).forEach((questionsArray: Question[]) => {
            questionsArray.forEach((q) => {
              if (q.question_number) {
                maxNumber = Math.max(maxNumber, q.question_number);
              }
              if (q.question_numbers) {
                const arrayMax = Math.max(...q.question_numbers);
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

    // Handle different question types
    switch (currentQuestionType) {
      case "true_false_not_given":
      case "fill_in_the_blanks":
      case "mcq":
        for (let i = 0; i < questionCount; i++) {
          const questionData: Question = {
            question_number: nextQuestionNumber + i,
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
            question_number: nextQuestionNumber + i,
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
          const questionNumbers = [
            nextQuestionNumber + i * 2,
            nextQuestionNumber + i * 2 + 1,
          ];

          newQuestions.push({
            question_number: nextQuestionNumber + i,
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
            answer: [],
            title: "",
            subtitle: "",
            extra: "",
            questions: [],
          });
        }
        nextQuestionNumber += questionCount * 2;
        break;

      case "passage_fill_in_the_blanks":
        const passageQuestionNumbers = Array.from(
          { length: questionCount },
          (_, idx) => nextQuestionNumber + idx
        );

        newQuestions.push({
          question_number: nextQuestionNumber,
          question_numbers: passageQuestionNumbers,
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
        const summaryQuestionNumbers = Array.from(
          { length: questionCount },
          (_, idx) => nextQuestionNumber + idx
        );

        newQuestions.push({
          question_number: nextQuestionNumber,
          question_numbers: summaryQuestionNumbers,
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
        newQuestions.push({
          question_number: nextQuestionNumber,
          question: "",
          input_type: "text",
          title: "",
          subtitle: "",
          extra: [""],
          questions: [],
        });
        break;

      default:
        return;
    }

    const updatedTest = { ...test };
    updatedTest.parts = [...test.parts];
    updatedTest.parts[passageIndex] = {
      ...test.parts[passageIndex],
      questions: [
        ...test.parts[passageIndex].questions,
        { [currentQuestionType]: newQuestions },
      ],
    };

    setTest(updatedTest);
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
          <div key={groupIndex} className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-4">{questionType}</h3>
            {renderQuestionForm(questionType, questions, groupIndex)}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionGroupEditor;
