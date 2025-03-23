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

const ReadingTest = ({ test }: any) => {
  const [answers, setAnswers] = useState<any>({});
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
        const existingEntryIndex = currentArray.findIndex((obj) => obj.hasOwnProperty(questionId));

        if (existingEntryIndex !== -1) {
          // Update existing entry
          return currentArray.map((obj, index) =>
            index === existingEntryIndex
              ? {
                ...obj,
                "answers": Array.isArray(obj[questionId])
                  ? obj[questionId].includes(value)
                    ? obj[questionId].filter((v: any) => v !== value) // Remove if exists
                    : [...obj, questionId, value, answer] // Add new value
                  : [questionId, value, answer], // Convert to array if not already
              }
              : obj
          );
        } else {
          // Add new entry if not found
          return [...currentArray, { "answers": [questionId, value, answer] }];
        }
      } else {
        const existingEntryIndex = currentArray.findIndex((obj) => obj.hasOwnProperty(questionId));

        if (existingEntryIndex !== -1) {
          // Update existing entry for text input
          return currentArray.map((obj, index) =>
            index === existingEntryIndex
              ? { ...obj, "answers": { questionId, value, answer } } // Update the value
              : obj
          );
        } else {
          // Add new entry if not found
          return [...currentArray, { "answers": { questionId, value, answer } }];
        }
      }
    });
  };




  const testData = {
    userId: session?.user?.id,
    testId: test._id,
    answers: answers,
  };

  const handleSubmit = () => {
    console.log("This is Test Data", testData);
    // Submit to API
  };

  console.log("This is test Id", test._id);
  console.log("This is session Data", session);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Exam Header */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h1 className="card-title text-3xl">{test.title}</h1>
          <p className="text-lg">Type: {test.type}</p>
          <p className="text-lg">Duration: {test.duration} minutes</p>
        </div>
      </div>

      {/* Each Reading Part */}
      {test.parts &&
        test.parts.map((part: any, index: number) => (
          <div key={index} className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-2xl">{part.title}</h2>
              {part.instructions && (
                <p className="italic text-gray-600 mb-4">{part.instructions}</p>
              )}

              {/* Passage Section */}
              {part.passage && (
                <div className="mb-4">
                  {part.passage_title && (
                    <h3 className="text-xl font-medium mb-2">
                      {part.passage_title}
                    </h3>
                  )}
                  <div className="prose max-w-none">
                    {Array.isArray(part.passage) ? (
                      part.passage.map((p: any, i: number) => {
                        if (typeof p === "object" && p !== null) {
                          return Object.entries(p).map(([questionId, value]) => (
                            <p key={`${i}-${questionId}`}>
                              {value as React.ReactNode}
                            </p>
                          ));
                        }
                        return <p key={i}>{p}</p>;
                      })
                    ) : (
                      <p>{part.passage}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Image */}
              {part.image && (
                <div className="mb-4">
                  <Image
                    src={part.image}
                    alt={part.title || "Passage Image"}
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
              )}

              {/* Questions Section */}
              {part.questions && (
                <div className="mt-4">
                  <h4 className="text-xl font-semibold mb-3">Questions</h4>

                  <div className="space-y-6">
                    {part.questions?.map((question: any, index: number) => (
                      <div key={index}>
                        {/* True False Not Given */}
                        {question.true_false_not_given && (
                          <TrueFalse question={question.true_false_not_given} handleAnswerChange={handleAnswerChange} />
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
                        {question.mcq && <McqSingle question={question.mcq} handleAnswerChange={handleAnswerChange} />}

                        {/* Passage Fill in Blanks */}
                        {question.passage_fill_in_the_blanks && (
                          <PassFillInTheBlanks
                            question={question.passage_fill_in_the_blanks}
                            handleAnswerChange={handleAnswerChange}
                          />
                        )}

                        {/* Multiple MCQ (Checkbox style) */}
                        {question.multiple_mcq && (
                          <McqMultiple question={question.multiple_mcq} handleAnswerChange={handleAnswerChange} />
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
                </div>
              )}
            </div>
          </div>
        ))}

      <button onClick={handleSubmit} className="btn btn-primary mt-6">
        Submit Answers
      </button>
    </div>
  );
};

export default ReadingTest;
