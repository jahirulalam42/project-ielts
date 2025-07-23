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
import TextHighlighter from "./TextHighlighter";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { postSubmitReadingTest } from "@/services/data";

const ReadingTest = ({ test }: any) => {
  const [answers, setAnswers] = useState<any>({});
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [passageHighlights, setPassageHighlights] = useState<any[]>([]);
  const { data: session }: any = useSession();

  const currentPart = test.parts[currentPartIndex];

  console.log("Parts", test.parts);

  console.log("Current Part", currentPart);

  // useEffect(() => {
  //   // Flatten all questions from all parts
  //   const flattenQuestions = (parts: any[]) => {
  //     return parts.flatMap((part) => {
  //       if (!Array.isArray(part.questions)) return [];

  //       return part?.questions.flatMap((value: any) => {
  //         if (Array.isArray(value)) {
  //           return value.map((q: any) => ({
  //             ...q,
  //             input_type: q.input_type || "text",
  //             question_number: q.question_number,
  //             question_type: q.input_type, // optional: add type info
  //           }));
  //         } else if (typeof value === "object" && value !== null) {
  //           return [
  //             {
  //               ...value,
  //               input_type: value.input_type || "text",
  //               question_number:
  //                 value.question_number || value.question_numbers,
  //               question_type: value.input_type, // optional
  //             },
  //           ];
  //         }

  //         return [];
  //       });
  //     });
  //   };

  //   const allQuestions = flattenQuestions(test.parts);

  //   console.log("All Questions", allQuestions);

  //   const initialAnswers = allQuestions.flatMap((q) => {
  //     if (q.input_type === "checkbox" && Array.isArray(q.question_numbers)) {
  //       // For multiple MCQ questions
  //       return q.question_numbers.map(
  //         (questionNumber: number, index: number) => ({
  //           questionId: questionNumber,
  //           value: "", // Will store the selected option
  //           answerText: q.correct_mapping[index], // The correct answer
  //           isCorrect: false,
  //           questionGroup: q.question_numbers, // Store the group of questions
  //         })
  //       );
  //     } else if (
  //       q.input_type === "checkbox" &&
  //       !Array.isArray(q.question_numbers)
  //     ) {
  //       return {
  //         questionId: q.question_number,
  //         answers: [],
  //         answerText: Array.isArray(q.answer) ? q.answer : [q.answer],
  //         isCorrect: false,
  //       };
  //     } else if (q.input_type === "text" && Array.isArray(q.questions)) {
  //       return q.questions.map((que: any) => ({
  //         questionId: que.question_number,
  //         value: "",
  //         answerText: que.answer,
  //         isCorrect: false,
  //       }));
  //     } else if (q.input_type === "text" && Array.isArray(q.question_number)) {
  //       // NEW CONDITION: Handle PassFillInTheBlanks where question_number is an array
  //       return q.question_number.map((questionNum: number, index: number) => ({
  //         questionId: questionNum,
  //         value: "",
  //         answerText: q.blanks ? q.blanks[index]?.answer : "", // Get answer from blanks array
  //         isCorrect: false,
  //       }));
  //     } else if (
  //       q.input_type === "drag_and_drop" &&
  //       Array.isArray(q.question_numbers)
  //     ) {
  //       return q.question_numbers.map((que: any, index: number) => ({
  //         questionId: q.question_numbers[index],
  //         value: "",
  //         answerText: q.answers[index],
  //         isCorrect: false,
  //       }));
  //     } else {
  //       // Ensure questionId is always a single number, not an array
  //       const questionId = Array.isArray(q.question_number)
  //         ? q.question_number[0]
  //         : q.question_number;
  //       return {
  //         questionId: questionId,
  //         value: "",
  //         answerText: q.answer,
  //         isCorrect: false,
  //       };
  //     }
  //   });

  //   setAnswers(initialAnswers);
  // }, [test.parts]);

  useEffect(() => {
    // Flatten all questions from all parts
    const flattenQuestions = (parts: any[]) => {
      return parts.flatMap((part) => {
        if (!Array.isArray(part.questions)) return [];

        return part.questions.flatMap((questionGroup: any) => {
          const allQuestions: any[] = [];

          // Extract questions from each question type
          Object.keys(questionGroup).forEach((questionType) => {
            const questionsArray = questionGroup[questionType];

            if (Array.isArray(questionsArray)) {
              questionsArray.forEach((question) => {
                allQuestions.push({
                  ...question,
                  questionType:
                    questionType === "true_false_not_given"
                      ? "True False Not Given"
                      : questionType === "fill_in_the_blanks"
                      ? "Fill in the Blanks"
                      : questionType === "matching_headings"
                      ? "Matching Headings"
                      : questionType === "paragraph_matching"
                      ? "Paragraph Matching"
                      : questionType === "multiple_mcq"
                      ? "Multiple MCQ"
                      : questionType === "passage_fill_in_the_blanks"
                      ? "Passage Fill in the Blanks"
                      : questionType === "mcq"
                      ? "MCQ"
                      : questionType === "summary_fill_in_the_blanks"
                      ? "Summary Fill in the Blanks"
                      : questionType === "fill_in_the_blanks_with_subtitle"
                      ? "Fill in the blanks with Subtitle"
                      : "",
                  input_type: question.input_type || "text",
                });
              });
            }
          });

          return allQuestions;
        });
      });
    };

    const allQuestions = flattenQuestions(test.parts);
    console.log("All Questions", allQuestions);

    const initialAnswers = allQuestions.flatMap((q) => {
      if (q.input_type === "checkbox" && Array.isArray(q.question_numbers)) {
        // For multiple MCQ questions
        return q.question_numbers.map(
          (questionNumber: number, index: number) => ({
            questionId: questionNumber,
            questionType: q.questionType,
            value: "", // Will store the selected option
            answerText: q.correct_mapping ? q.correct_mapping[index] : "", // The correct answer
            isCorrect: false,
            questionGroup: q.question_numbers, // Store the group of questions
          })
        );
      } else if (
        q.input_type === "checkbox" &&
        !Array.isArray(q.question_numbers)
      ) {
        return {
          questionId: q.question_number,
          questionType: q.questionType,
          answers: [],
          answerText: Array.isArray(q.answer) ? q.answer : [q.answer],
          isCorrect: false,
        };
      } else if (q.input_type === "text" && Array.isArray(q.questions)) {
        return q.questions.map((que: any) => ({
          questionId: que.question_number,
          questionType: q.questionType,
          value: "",
          answerText: que.answer,
          isCorrect: false,
        }));
      } else if (q.input_type === "text" && Array.isArray(q.question_number)) {
        // Handle PassFillInTheBlanks where question_number is an array
        return q.question_number.map((questionNum: number, index: number) => ({
          questionId: questionNum,
          questionType: q.questionType,
          value: "",
          answerText: q.blanks ? q.blanks[index]?.answer : "", // Get answer from blanks array
          isCorrect: false,
        }));
      } else if (
        q.input_type === "drag_and_drop" &&
        Array.isArray(q.question_numbers)
      ) {
        return q.question_numbers.map((questionNumber: any, index: number) => ({
          questionId: questionNumber,
          questionType: q.questionType,
          value: "",
          answerText: q.answers ? q.answers[index] : "",
          isCorrect: false,
        }));
      } else {
        // Handle single questions (like true_false_not_given, mcq, etc.)
        const questionId = Array.isArray(q.question_number)
          ? q.question_number[0]
          : q.question_number;

        return {
          questionId: questionId,
          value: "",
          answerText: q.answer || "",
          isCorrect: false,
          questionType: q.questionType, // Store question type for debugging
        };
      }
    });

    console.log("Initial Answers:", initialAnswers);
    setAnswers(initialAnswers);
  }, [test.parts]);

  const handleAnswerChange = (
    questionId: number,
    value: string,
    isCheckbox: string,
    answer: string,
    isCorrect?: boolean,
    questionGroup?: number[]
  ) => {
    setAnswers((prev: any) => {
      const currentArray = Array.isArray(prev) ? prev : [];

      if (isCheckbox === "checkbox" && questionGroup) {
        // For multiple MCQ questions
        return currentArray.map((obj) => {
          if (obj.questionId === questionId) {
            // If this is the question being answered
            return {
              ...obj,
              questionId: questionId,
              value: value, // Store the selected option value
              isCorrect: isCorrect, // Use the isCorrect parameter passed from McqMultiple
            };
          }
          return obj;
        });
      } else if (isCheckbox === "checkbox") {
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
          (obj) => String(obj.questionId) === String(questionId)
        );

        if (existingEntryIndex !== -1) {
          return currentArray.map((obj, index) =>
            index === existingEntryIndex
              ? {
                  ...obj,
                  questionId: questionId,
                  value: String(value),
                  answerText: answer,
                  isCorrect: isCorrect,
                }
              : obj
          );
        } else {
          return [
            ...currentArray,
            {
              questionId: String(questionId),
              value: String(value),
              answerText: answer,
              isCorrect: isCorrect,
            },
          ];
        }
      }
    });
  };

  const handleHighlightChange = (highlights: any[]) => {
    setPassageHighlights(highlights);
    console.log("Passage highlights updated:", highlights);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    const submissionTime = new Date();

    const totalPoint =
      answers?.filter((answer: any) => answer.isCorrect === true).length || 0;
    const testData = {
      userId: session?.user?.id,
      testId: test._id,
      answers: answers,
      totalScore: totalPoint,
      submittedAt: submissionTime.toLocaleString(),
      passageHighlights: passageHighlights,
    };

    // 3. Send POST to App Router route
    try {
      const res = await postSubmitReadingTest(testData);

      console.log("Response", res);

      console.log("This is Test Data", testData);

      // 4. Handle non-OK statuses
      if (!res.success) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }

      // 5. On success, optionally show a toast and redirect
      toast.success("Submission successful!");
      redirect(`getSubmittedAnswers/${testData.testId}`); // client-side navigation after success
    } catch (error: any) {
      toast.error(`Submission failed: ${error.message}`);
    }

    if (Object.keys(answers).length === 0) {
      toast.error("Please Select Answer");
    } else {
      redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/getSubmittedAnswers/${testData.testId}`
      );
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTimeUp(true);
      // handleSubmit(); // Automatically submit the test when time runs out
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
    <form onSubmit={handleSubmit}>
      <div className="container mx-auto p-4 min-h-screen">
        {/* Exam Header */}
        <div className="card bg-base-100 shadow-xl mb-6 ">
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

            {currentPart?.image && (
              <Image
                src={currentPart.image}
                alt={currentPart.passage_title}
                width={600}
                height={400}
                className="rounded-lg mb-4"
                unoptimized
              />
            )}

            <div className="prose max-w-none space-y-4">
              <TextHighlighter
                content={currentPart.passage}
                onHighlightChange={handleHighlightChange}
              />
            </div>
          </div>

          {/* Questions Section (Right) */}
          <div className="lg:h-[80vh] lg:overflow-y-auto p-4 border-l">
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">{currentPart.title}</h3>
              <p className="italic text-gray-600 mb-6">
                {currentPart.instructions}
              </p>

              {currentPart.questions &&
                currentPart.questions.map((question: any, index: number) => (
                  <div key={index}>
                    {question.true_false_not_given && (
                      <TrueFalse
                        question={question.true_false_not_given}
                        handleAnswerChange={handleAnswerChange}
                      />
                    )}

                    {question.fill_in_the_blanks && (
                      <FillInTheBlanks
                        question={question.fill_in_the_blanks}
                        handleAnswerChange={handleAnswerChange}
                      />
                    )}

                    {question.matching_headings && (
                      <MatchingHeadings
                        question={question.matching_headings}
                        handleAnswerChange={handleAnswerChange}
                      />
                    )}

                    {question.paragraph_matching && (
                      <ParagraphMatching
                        question={question.paragraph_matching}
                        handleAnswerChange={handleAnswerChange}
                      />
                    )}

                    {question.mcq && (
                      <McqSingle
                        question={question.mcq}
                        handleAnswerChange={handleAnswerChange}
                      />
                    )}

                    {question.multiple_mcq && (
                      <McqMultiple
                        question={question.multiple_mcq}
                        handleAnswerChange={handleAnswerChange}
                      />
                    )}

                    {question.passage_fill_in_the_blanks && (
                      <PassFillInTheBlanks
                        question={question.passage_fill_in_the_blanks}
                        handleAnswerChange={handleAnswerChange}
                      />
                    )}

                    {question.summary_fill_in_the_blanks && (
                      <SumFillInTheBlanks
                        question={question.summary_fill_in_the_blanks}
                        handleAnswerChange={handleAnswerChange}
                      />
                    )}

                    {question.fill_in_the_blanks_with_subtitle && (
                      <SubFillInTheBlanks
                        question={question.fill_in_the_blanks_with_subtitle}
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
                type="button"
              >
                Previous
              </button>
              <button
                onClick={handleNextPart}
                disabled={currentPartIndex === test.parts.length - 1}
                className="btn btn-primary"
                type="button"
              >
                Next
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn btn-success mt-6 w-full"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </form>
  );
};

export default ReadingTest;
