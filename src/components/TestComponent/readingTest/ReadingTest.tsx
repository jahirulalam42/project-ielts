"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
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
  const [answers, setAnswers] = useState<any>([]);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const { data: session }: any = useSession();

  const currentPart = test.parts[currentPartIndex];

  const handleAnswerChange = (
    questionId: number,
    value: string,
    isCheckbox: string,
    answer: string,
    isCorrect?: boolean
  ) => {
    setAnswers((prev: any) => {
      const currentArray = Array.isArray(prev) ? prev : [];

      if (isCheckbox === "checkbox") {
        const existingEntryIndex = currentArray.findIndex(
          (obj) => obj.questionId === questionId
        );

        if (existingEntryIndex !== -1) {
          return currentArray.map((obj, index) =>
            index === existingEntryIndex
              ? {
                questionId,
                answers: Array.isArray(obj.answers)
                  ? obj.answers.includes(value)
                    ? obj.answers.filter((v: any) => v !== value)
                    : [...obj.answers, value]
                  : [value],
                answerText: answer,
                isCorrect: isCorrect,
              }
              : obj
          );
        } else {
          return [
            ...currentArray,
            {
              questionId,
              answers: [value],
              answerText: answer,
              isCorrect: isCorrect,
            },
          ];
        }
      } else {
        const existingEntryIndex = currentArray.findIndex(
          (obj) => obj.questionId === questionId
        );

        if (existingEntryIndex !== -1) {
          return currentArray.map((obj, index) =>
            index === existingEntryIndex
              ? { ...obj, value, answerText: answer, isCorrect: isCorrect }
              : obj
          );
        } else {
          return [
            ...currentArray,
            { questionId, value, answerText: answer, isCorrect: isCorrect },
          ];
        }
      }
    });
  };



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

  // useEffect(()=>{},[answers])

  const handleSubmit = () => {
    const totalPoint = answers?.filter((answer: any) => answer.isCorrect === true).length || 0;
    const testData = {
      userId: session?.user?.id,
      testId: test._id,
      answers: answers,
      totalScore: totalPoint
    };
    console.log("This is Test Data", testData);
    if (Object.keys(answers).length === 0) {
      toast.error("Please Select Answer");
    } else {
      redirect("/");
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTimeUp(true);
      handleSubmit(); // Automatically submit the test when time runs out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

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
          <div className="flex justify-between items-center mt-4">
            <div className="text-lg font-bold">
              Time Left: {formatTime(timeLeft)}
            </div>
            {isTimeUp && (
              <div className="text-lg text-red-500 font-bold">Time's up!</div>
            )}
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Passage Section (Left) */}
        <div className="lg:h-[80vh] lg:overflow-y-auto p-4 border-r-2">
          <h2 className="text-2xl font-bold mb-4">
            {currentPart.passage_title}
          </h2>

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
                    answers={answers}
                    setAnswers={setAnswers}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Fill in the Blanks */}
                {question.fill_in_the_blanks &&
                  Array.isArray(question.fill_in_the_blanks) && (
                    <FillInTheBlanks
                      question={question.fill_in_the_blanks}
                      answers={answers}
                      setAnswers={setAnswers}
                      handleAnswerChange={handleAnswerChange}
                    />
                  )}

                {/* Matching Headings */}
                {question.matching_headings && (
                  <MatchingHeadings
                    question={question.matching_headings}
                    answers={answers}
                    setAnswers={setAnswers}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Paragraph Matching */}
                {question.paragraph_matching && (
                  <ParagraphMatching
                    question={question.paragraph_matching}
                    answers={answers}
                    setAnswers={setAnswers}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Multiple Choice (Single/Multi) */}
                {question.mcq && (
                  <McqSingle
                    question={question.mcq}
                    answers={answers}
                    setAnswers={setAnswers}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Passage Fill in Blanks */}
                {question.passage_fill_in_the_blanks && (
                  <PassFillInTheBlanks
                    question={question.passage_fill_in_the_blanks}
                    answers={answers}
                    setAnswers={setAnswers}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Multiple MCQ (Checkbox style) */}
                {question.multiple_mcq && (
                  <McqMultiple
                    question={question.multiple_mcq}
                    answers={answers}
                    setAnswers={setAnswers}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Summary Fill in Blanks */}
                {question.summary_fill_in_the_blanks && (
                  <SumFillInTheBlanks
                    question={question.summary_fill_in_the_blanks}
                    answers={answers}
                    setAnswers={setAnswers}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* Fill in Blanks with Subtitles */}
                {question.fill_in_the_blanks_with_subtitle && (
                  <SubFillInTheBlanks
                    question={question.fill_in_the_blanks_with_subtitle}
                    answers={answers}
                    setAnswers={setAnswers}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevPart}
              disabled={currentPartIndex === 0}
              className="btn btn-secondary"
            >
              Previous
            </button>
            <button
              onClick={handleNextPart}
              disabled={currentPartIndex === test.parts.length - 1}
              className="btn btn-primary"
            >
              Next
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="btn btn-success mt-6 w-full"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default ReadingTest;
