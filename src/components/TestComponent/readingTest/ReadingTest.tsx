"use client";
import Image from "next/image";
import React, { useState } from "react";
import TrueFalse from "../Common/TrueFalse";
import FillInTheBlanks from "../Common/FillInTheBlanks";
import MatchingHeadings from "../Common/MatchingHeadings";
import ParagraphMatching from "../Common/ParagraphMatching";
import McqSingle from "../Common/McqSingle";
import PassFillInTheBlanks from "../Common/PassFillInTheBlanks";
import McqMultiple from "../Common/McqMultiple";
import SumFillInTheBlanks from "../Common/SumFillInTheBlanks";
import SubFillInTheBlanks from "../Common/SubFillInTheBlanks";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const ReadingTest = ({ test }: any) => {
  const [answers, setAnswers] = useState<any>({});
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const { data: session }: any = useSession();

  const handleAnswerChange = (
    questionId: string,
    value: string,
    isCheckbox: string,
    answer: string
  ) => {
    setAnswers((prev: any) => {
      // Ensure prev is always an array
      const currentArray = Array.isArray(prev) ? prev : [];

      if (isCheckbox === "checkbox") {
        const existingEntryIndex = currentArray.findIndex(
          (obj) => obj.questionId === questionId
        );

        if (existingEntryIndex !== -1) {
          // Update existing entry
          return currentArray.map((obj, index) =>
            index === existingEntryIndex
              ? {
                  questionId,
                  answers: Array.isArray(obj.answers)
                    ? obj.answers.includes(value)
                      ? obj.answers.filter((v: any) => v !== value) // Remove if exists
                      : [...obj.answers, value] // Add new value
                    : [value], // Convert to array if not already
                  answerText: answer,
                }
              : obj
          );
        } else {
          // Add new entry if not found
          return [
            ...currentArray,
            { questionId, answers: [value], answerText: answer },
          ];
        }
      } else {
        const existingEntryIndex = currentArray.findIndex(
          (obj) => obj.questionId === questionId
        );

        if (existingEntryIndex !== -1) {
          // Update existing entry for text input
          return currentArray.map((obj, index) =>
            index === existingEntryIndex
              ? { ...obj, value, answerText: answer } // Update the value
              : obj
          );
        } else {
          // Add new entry if not found
          return [...currentArray, { questionId, value, answerText: answer }];
        }
      }
    });
  };

  const currentPart = test.parts[currentPartIndex];

  const handleNextPart = () => {
    if (currentPartIndex < test.parts.length - 1) {
      setCurrentPartIndex((prev) => prev + 1);
    }
  };

  const handlePrevPart = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const testData = {
      userId: session?.user?.id,
      testId: test._id,
      answers: answers,
    };
    console.log("This is Test Data", testData);
    if (Object.keys(answers).length === 0) {
      toast.error("Please Select Answer");
    } else {
      redirect("/");
    }
    // Submit to API
  };
  console.log("This is current part:", currentPart)
  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Exam Header */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h1 className="card-title text-3xl">{test.title}</h1>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg">Type: {test.type}</p>
              <p className="text-lg">Duration: {test.duration} minutes</p>
            </div>
            <div className="badge badge-primary">
              Part {currentPartIndex + 1} of {test.parts.length}
            </div>
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Passage Section (Left) */}
        <div className="lg:h-[80vh] lg:overflow-y-auto p-4 border-r-2">
          <h2 className="text-2xl font-bold mb-4">{currentPart.passage_title}</h2>

          {currentPart.image && (
            <Image
              src={currentPart.image}
              alt={currentPart.passage_title}
              width={600}
              height={400}
              className="rounded-lg mb-4"
            />
          )}

          <div className="prose max-w-none space-y-4">
            {currentPart.passage.map((p: any, i: number) =>
              typeof p === "object" ? (
                Object.entries(p).map(([key, value]) => (
                  <p key={`${i}-${key}`}>
                    <span className="font-bold">{key}.</span> {value as string}
                  </p>
                ))
              ) : (
                <p key={i}>{p}</p>
              )
            )}
          </div>
        </div>


        {/* Questions Section (Right) */}
        <div className="lg:h-[80vh] lg:overflow-y-auto p-4 border-l">
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">{currentPart.title}</h3>
            <p className="italic text-gray-600 mb-6">
              {currentPart.instructions}
            </p>

            {currentPart.questions?.map((question: any, index: number) => (
              <div key={index}>
                {/* Existing question type components */}
                {question.true_false_not_given && (
                  <TrueFalse
                    question={question.true_false_not_given}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Fill in the Blanks */}
                {question.fill_in_the_blanks &&
                  Array.isArray(question.fill_in_the_blanks) && (
                    <FillInTheBlanks
                      question={question.fill_in_the_blanks}
                      handleAnswerChange={handleAnswerChange}
                    />
                  )}

                {/* Matching Headings */}
                {question.matching_headings && (
                  <MatchingHeadings
                    question={question.matching_headings}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Paragraph Matching */}
                {question.paragraph_matching && (
                  <ParagraphMatching
                    question={question.paragraph_matching}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Multiple Choice (Single/Multi) */}
                {question.mcq && (
                  <McqSingle
                    question={question.mcq}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Passage Fill in Blanks */}
                {question.passage_fill_in_the_blanks && (
                  <PassFillInTheBlanks
                    question={question.passage_fill_in_the_blanks}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Multiple MCQ (Checkbox style) */}
                {question.multiple_mcq && (
                  <McqMultiple
                    question={question.multiple_mcq}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Summary Fill in Blanks */}
                {question.summary_fill_in_the_blanks && (
                  <SumFillInTheBlanks
                    question={question.summary_fill_in_the_blanks}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Fill in Blanks with Subtitles */}
                {question.fill_in_the_blanks_with_subtitle && (
                  <SubFillInTheBlanks
                    question={question.fill_in_the_blanks_with_subtitle}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevPart}
              className="btn"
              disabled={currentPartIndex === 0}
            >
              Previous
            </button>

            {currentPartIndex < test.parts.length - 1 ? (
              <button onClick={handleNextPart} className="btn btn-primary">
                Next Passage
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn btn-success">
                Submit Test
              </button>
            )}
          </div>
          <div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingTest;
