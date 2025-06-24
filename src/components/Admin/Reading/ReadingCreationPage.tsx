"use client";
import { submitReadingQuestions } from "@/services/data";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ReadingTest, Passage, Question } from "./readingTest";
import PartForm from "./PartForm";

const ReadingCreationPage: React.FC = () => {
  const [test, setTest] = useState<ReadingTest>({
    title: "",
    type: "academic",
    duration: 60,
    parts: [],
  });

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
          passageType: "type1",
        },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Transform test data to match required JSON structure
      const transformedTest = {
        ...test,
        parts: test.parts.map((part) => {
          // Group all question groups into a single object by type
          const questionsByType: Record<string, any> = {};
          // Replace the problematic forEach section with this corrected version:

          part.questions.forEach((questionGroup) => {
            const questionType = Object.keys(questionGroup)[0];
            const questions = questionGroup[questionType];

            if (questionType === "passage_fill_in_the_blanks") {
              questionsByType[questionType] = questions.map((q: any) => ({
                question_number:
                  q?.blanks?.map((b: any) => b.blank_number) || [],
                instruction: q?.instruction,
                text: q?.text,
                blanks: q?.blanks,
              }));
            } else if (questionType === "summary_fill_in_the_blanks") {
              questionsByType[questionType] = questions.map((q: any) => ({
                question_numbers: q?.question_numbers || [],
                passage: q?.passage,
                answers: q?.answers || [],
                options:
                  q?.options && Array.isArray(q.options) && q.options.length > 0
                    ? q.options
                    : [],
                input_type: q?.input_type || "drag_and_drop",
              }));
            } else if (questionType === "fill_in_the_blanks_with_subtitle") {
              questionsByType[questionType] = questions.map((q: any, index: number) => {
                const base: any = {
                  subtitle: q?.subtitle || "",
                  extra:
                    q?.extra && Array.isArray(q.extra) && q.extra.length > 0
                      ? q.extra
                      : [],
                  questions:
                    q?.questions &&
                    Array.isArray(q.questions) &&
                    q.questions.length > 0
                      ? q.questions.map((subQ: any) => ({
                          question_number: subQ?.question_number,
                          answer: subQ?.answer,
                          input_type: subQ?.input_type || "text",
                        }))
                      : [],
                };
                
                // Only include title for the first question, and put it at the top
                if (index === 0) {
                  return {
                    title: q?.title || "",
                    ...base
                  };
                }
                
                return base;
              });
            } else if (questionType === "multiple_mcq") {
              questionsByType[questionType] = questions.map((q: any) => {
                let base: any = {
                  question_numbers: q?.question_numbers,
                  question: q?.question,
                  options:
                    q?.options &&
                    Array.isArray(q.options) &&
                    q.options.length > 0
                      ? q.options
                      : undefined,
                  input_type: q?.input_type,
                  min_selection: q?.min_selection,
                  max_selection: q?.max_selection,
                };
                if (q?.correct_mapping)
                  base.correct_mapping = q.correct_mapping;
                return base;
              });
            } else {
              // Handle all other question types
              const filteredQuestions = questions.map((q: any) => {
                const base: any = {
                  question_number: q?.question_number,
                  question: q?.question,
                  answer: q?.answer,
                  input_type: q?.input_type,
                };
                if (
                  q?.options &&
                  Array.isArray(q.options) &&
                  q.options.length > 0
                )
                  base.options = q.options;
                if (q?.min_selection !== undefined)
                  base.min_selection = q.min_selection;
                if (q?.max_selection !== undefined)
                  base.max_selection = q.max_selection;
                if (
                  q?.question_numbers &&
                  Array.isArray(q.question_numbers) &&
                  q.question_numbers.length > 0
                )
                  base.question_numbers = q.question_numbers;
                if (q?.instruction) base.instruction = q.instruction;
                if (q?.text) base.text = q.text;
                if (q?.blanks && Array.isArray(q.blanks) && q.blanks.length > 0)
                  base.blanks = q.blanks;
                if (
                  q?.answers &&
                  Array.isArray(q.answers) &&
                  q.answers.length > 0
                )
                  base.answers = q.answers;
                if (q?.passage) base.passage = q.passage;
                if (q?.title) base.title = q.title;
                if (q?.subtitle) base.subtitle = q.subtitle;
                if (
                  q?.extra &&
                  ((Array.isArray(q.extra) && q.extra.length > 0) ||
                    (typeof q.extra === "string" && q.extra))
                )
                  base.extra = q.extra;
                if (
                  q?.questions &&
                  Array.isArray(q.questions) &&
                  q.questions.length > 0
                )
                  base.questions = q.questions;
                return base;
              });
              questionsByType[questionType] = filteredQuestions;
            }
          });
          const { passageType, ...partWithoutPassageType } = part;
          return {
            ...partWithoutPassageType,
            questions: questionsByType,
          };
        }),
      };

      // Print the final transformed test JSON
      console.log("Final Test JSON:", JSON.stringify(transformedTest, null, 2));
      // Submit the transformed test
      const response = await submitReadingQuestions(transformedTest);
      if (response.success) {
        toast.success("Test created successfully!");
        // Reset form or redirect
      } else {
        toast.error("Failed to create test");
      }
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("An error occurred while creating the test");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Reading Test
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered border-black w-full"
                value={test.title}
                onChange={(e) => setTest({ ...test, title: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Type</span>
              </label>
              <select
                className="select select-bordered border-black w-full"
                value={test.type}
                onChange={(e) =>
                  setTest({
                    ...test,
                    type: e.target.value as "academic" | "general",
                  })
                }
              >
                <option value="academic">Academic</option>
                <option value="general">General Training</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">
                  Duration (minutes)
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered border-black w-full"
                value={test.duration}
                onChange={(e) =>
                  setTest({ ...test, duration: parseInt(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div className="border-t border-base-300 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Test Passages</h2>
              <button
                type="button"
                onClick={addPassage}
                className="btn btn-primary"
              >
                Add Passage
              </button>
            </div>
            {test.parts.map((passage, passageIndex) => (
              <PartForm
                key={passageIndex}
                passage={passage}
                passageIndex={passageIndex}
                test={test}
                setTest={setTest}
              />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <button type="submit" className="btn btn-success btn-wide">
              Create Test
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" />
      </div>
    </div>
  );
};

export default ReadingCreationPage;
