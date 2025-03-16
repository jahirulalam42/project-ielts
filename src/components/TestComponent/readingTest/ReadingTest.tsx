import Image from "next/image";
import React from "react";
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
                        {question.true_false_not_given && (
                          <TrueFalse question={question.true_false_not_given} />
                        )}

                        {/* Fill in the Blanks */}
                        {question.fill_in_the_blanks &&
                          Array.isArray(question.fill_in_the_blanks) && (
                            <FillInTheBlanks
                              question={question.fill_in_the_blanks}
                            />
                          )}

                        {/* Matching Headings */}
                        {question.matching_headings && (
                          <MatchingHeadings
                            question={question.matching_headings}
                          />
                        )}

                        {/* Paragraph Matching */}
                        {question.paragraph_matching && (
                          <ParagraphMatching
                            question={question.paragraph_matching}
                          />
                        )}

                        {/* Multiple Choice (Single/Multi) */}
                        {question.mcq && <McqSingle question={question.mcq} />}

                        {/* Passage Fill in Blanks */}
                        {question.passage_fill_in_the_blanks && (
                          <PassFillInTheBlanks
                            question={question.passage_fill_in_the_blanks}
                          />
                        )}

                        {/* Multiple MCQ (Checkbox style) */}
                        {question.multiple_mcq && (
                          <McqMultiple question={question.multiple_mcq} />
                        )}

                        {/* Summary Fill in Blanks */}
                        {question.summary_fill_in_the_blanks && (
                          <SumFillInTheBlanks
                            question={question.summary_fill_in_the_blanks}
                          />
                        )}

                        {/* Fill in Blanks with Subtitles */}
                        {question.fill_in_the_blanks_with_subtitle && (
                          <SubFillInTheBlanks
                            question={question.fill_in_the_blanks_with_subtitle}
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
    </div>
  );
};

export default ReadingTest;
