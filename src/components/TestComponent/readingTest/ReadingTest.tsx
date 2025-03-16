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

const ReadingTest = ({ test }: any) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleAnswerChange = (
    key: string,
    value: string,
    isCheckbox: boolean = false
  ) => {
    setAnswers((prev) => {
      const current = prev[key];
      if (isCheckbox) {
        const currentArray = Array.isArray(current) ? current : [];
        return {
          ...prev,
          [key]: currentArray.includes(value)
            ? currentArray.filter((v) => v !== value)
            : [...currentArray, value],
        };
      } else {
        return { ...prev, [key]: value };
      }
    });
  };

  const handleSubmit = () => {
    console.log("Answers:", answers);
    // Submit to API
  };

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
                          return Object.entries(p).map(([key, value]) => (
                            <p key={`${i}-${key}`}>
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
                        {/* {question.true_false_not_given && (
                          <TrueFalse question={question.true_false_not_given} />
                        )} */}

                        {question.true_false_not_given && (
                          <div>
                            <h5 className="font-medium mb-2">
                              True/False/Not Given
                            </h5>
                            {question.true_false_not_given.map(
                              (q: any, questionIndex: any) => (
                                <div
                                  key={q.question_number}
                                  className="p-4 border rounded-lg mb-2"
                                >
                                  <p>
                                    <strong>{q.question_number}. </strong>
                                    {q.question}
                                  </p>
                                  <select
                                    className="select select-bordered mt-2 w-full"
                                    onChange={(e) =>
                                      handleAnswerChange(
                                        `part${index}-q${questionIndex}-tf${q.question_number}`,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option disabled selected>
                                      Select answer
                                    </option>
                                    <option value="True">True</option>
                                    <option value="False">False</option>
                                    <option value="Not Given">Not Given</option>
                                  </select>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/* Fill in the Blanks */}
                        {/* {question.fill_in_the_blanks &&
                          Array.isArray(question.fill_in_the_blanks) && (
                            <FillInTheBlanks
                              question={question.fill_in_the_blanks}
                            />
                          )} */}

                        {question.fill_in_the_blanks &&
                          Array.isArray(question.fill_in_the_blanks) && (
                            <div>
                              <h5 className="font-medium mb-2">
                                Fill in the Blanks
                              </h5>
                              {question.fill_in_the_blanks.map((q: any) => (
                                <div
                                  key={q.question_number}
                                  className="p-4 border rounded-lg mb-2"
                                >
                                  <p>
                                    <strong>{q.question_number}. </strong>
                                    {q.question}
                                  </p>
                                  <input
                                    type="text"
                                    placeholder="Write answer here"
                                    className="input input-bordered mt-2 w-full"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Matching Headings */}
                        {/* {question.matching_headings && (
                          <MatchingHeadings
                            question={question.matching_headings}
                          />
                        )} */}

                        {question.matching_headings && (
                          <div>
                            <h5 className="font-medium mb-2">
                              Matching Headings
                            </h5>
                            {question.matching_headings.paragraphs.map(
                              (p: any, i: number) => (
                                <div
                                  key={i}
                                  className="p-4 border rounded-lg mb-2"
                                >
                                  <p>{p.text}</p>
                                  <select className="select select-bordered mt-2 w-full">
                                    <option disabled selected>
                                      Select heading
                                    </option>
                                    {question.matching_headings.headings.map(
                                      (heading: string, idx: number) => (
                                        <option key={idx} value={heading}>
                                          {heading}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/* Paragraph Matching */}
                        {/* {question.paragraph_matching && (
                          <ParagraphMatching
                            question={question.paragraph_matching}
                          />
                        )} */}

                        {question.paragraph_matching && (
                          <div>
                            <h5 className="font-medium mb-2">
                              Paragraph Matching
                            </h5>
                            {question.paragraph_matching.map((q: any) => (
                              <div
                                key={q.question_number}
                                className="p-4 border rounded-lg mb-2"
                              >
                                <p>
                                  <strong>{q.question_number}. </strong>
                                  {q.question}
                                </p>
                                <select className="select select-bordered mt-2 w-full">
                                  <option disabled selected>
                                    Select answer
                                  </option>
                                  {q.options.map((option: any) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Multiple Choice (Single/Multi) */}
                        {/* {question.mcq && <McqSingle question={question.mcq} />} */}

                        {question.mcq && (
                          <div>
                            <h5 className="font-medium mb-2">
                              Multiple Choice Questions
                            </h5>
                            {question.mcq.map((q: any, idx: number) => (
                              <div
                                key={idx}
                                className="p-4 border rounded-lg mb-2"
                              >
                                <p>
                                  <strong>{q.question_number}. </strong>
                                  {q.question}
                                </p>
                                <div className="mt-2 space-y-2">
                                  {q.options.map((option: any) => (
                                    <label
                                      key={option.label}
                                      className="flex items-center space-x-2"
                                    >
                                      <input
                                        type={
                                          q.input_type === "checkbox"
                                            ? "checkbox"
                                            : "radio"
                                        }
                                        name={`mcq-${idx}`}
                                        className="checkbox checkbox-primary"
                                      />
                                      <span>{option.value}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Passage Fill in Blanks */}
                        {/* {question.passage_fill_in_the_blanks && (
                          <PassFillInTheBlanks
                            question={question.passage_fill_in_the_blanks}
                          />
                        )} */}

                        {question.passage_fill_in_the_blanks && (
                          <div>
                            <h5 className="font-medium mb-2">
                              Passage Fill in the Blanks
                            </h5>
                            <div className="p-4 border rounded-lg mb-2">
                              <p>{question.text}</p>
                              <div className="mt-4 space-y-3">
                                {question.passage_fill_in_the_blanks.blanks.map(
                                  (blank: any) => (
                                    <div
                                      key={blank.blank_number}
                                      className="flex items-center space-x-3"
                                    >
                                      <span className="font-bold">
                                        Blank {blank.blank_number}:
                                      </span>
                                      <input
                                        type="text"
                                        placeholder="Write answer here"
                                        className="input input-bordered w-full"
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Multiple MCQ (Checkbox style) */}
                        {/* {question.multiple_mcq && (
                          <McqMultiple question={question.multiple_mcq} />
                        )} */}

                        {question.multiple_mcq && (
                          <div>
                            <h5 className="font-medium mb-2">
                              Multiple Select Questions
                            </h5>
                            {question.multiple_mcq.map(
                              (q: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="p-4 border rounded-lg mb-2"
                                >
                                  <p>
                                    <strong>
                                      {q.question_number.join(", ")}.{" "}
                                    </strong>
                                    {q.question}
                                  </p>
                                  <div className="mt-2 space-y-2">
                                    {q.options.map((option: any) => (
                                      <label
                                        key={option.label}
                                        className="flex items-center space-x-2"
                                      >
                                        <input
                                          type="checkbox"
                                          className="checkbox checkbox-primary"
                                        />
                                        <span>{option.value}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/* Summary Fill in Blanks */}
                        {/* {question.summary_fill_in_the_blanks && (
                          <SumFillInTheBlanks
                            question={question.summary_fill_in_the_blanks}
                          />
                        )} */}

                        {question.summary_fill_in_the_blanks && (
                          <div>
                            <h5 className="font-medium mb-2">
                              Summary Completion
                            </h5>
                            <div className="p-4 border rounded-lg mb-2">
                              <p className="italic mb-2">
                                {question.instruction}
                              </p>
                              <div className="whitespace-pre-wrap">
                                {question.summary_fill_in_the_blanks.passage
                                  .split("\n")
                                  .map((line: string, i: number) => (
                                    <div key={i} className="mb-2">
                                      {line.split(" ").map((word, j) =>
                                        word.startsWith("__") ? (
                                          <select
                                            key={j}
                                            className="select select-bordered select-sm mx-1"
                                          >
                                            <option disabled selected>
                                              Choose
                                            </option>
                                            {question.options.map(
                                              (opt: any) => (
                                                <option
                                                  key={opt.label}
                                                  value={opt.value}
                                                >
                                                  {opt.value}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        ) : (
                                          <span key={j}>{word} </span>
                                        )
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Fill in Blanks with Subtitles */}
                        {/* {question.fill_in_the_blanks_with_subtitle && (
                          <SubFillInTheBlanks
                            question={question.fill_in_the_blanks_with_subtitle}
                          />
                        )} */}

                        {question.fill_in_the_blanks_with_subtitle && (
                          <div>
                            <h5 className="font-medium mb-2">
                              Section Completion
                            </h5>
                            {question.fill_in_the_blanks_with_subtitle.map(
                              (section: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="p-4 border rounded-lg mb-2"
                                >
                                  {section.subtitle && (
                                    <h6 className="font-medium mb-2">
                                      {section.subtitle}
                                    </h6>
                                  )}
                                  {section.extra?.map(
                                    (text: string, i: number) => (
                                      <p
                                        key={i}
                                        className="text-sm italic mb-2"
                                      >
                                        {text}
                                      </p>
                                    )
                                  )}
                                  {section.questions?.map((q: any) => (
                                    <div
                                      key={q.question_number}
                                      className="mb-3"
                                    >
                                      <p>
                                        <strong>{q.question_number}. </strong>
                                        {q.question}
                                      </p>
                                      <input
                                        type="text"
                                        placeholder="Write answer here"
                                        className="input input-bordered w-full mt-1"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary mt-6"
                    >
                      Submit Answers
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ReadingTest;
