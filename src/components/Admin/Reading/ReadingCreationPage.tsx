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
      // Enhanced console logging
      console.group('📝 Reading Test Data');
      console.log('Test Title:', test.title);
      console.log('Test Type:', test.type);
      console.log('Duration:', test.duration, 'minutes');
      console.log('Number of Passages:', test.parts.length);
      
      // Log each passage with its questions
      test.parts.forEach((passage, index) => {
        console.group(`Passage ${index + 1}`);
        console.log('Title:', passage.title);
        console.log('Instructions:', passage.instructions);
        console.log('Passage Title:', passage.passage_title);
        console.log('Passage Subtitle:', passage.passage_subtitle);
        console.log('Passage Type:', passage.passageType);
        
        // Log questions for this passage
        if (passage.questions.length > 0) {
          console.group('Questions');
          passage.questions.forEach((questionGroup, qIndex) => {
            const questionType = Object.keys(questionGroup)[0];
            console.group(`${questionType} Questions`);
            console.log(JSON.stringify(questionGroup[questionType], null, 2));
            console.groupEnd();
          });
          console.groupEnd();
        }
        
        console.groupEnd();
      });
      
      console.groupEnd();
      
      // Submit the test
      const response = await submitReadingQuestions(test);
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
        <h1 className="text-3xl font-bold text-center mb-8">Create Reading Test</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered border-black w-full"
                value={test.title}
                onChange={e => setTest({ ...test, title: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Type</span>
              </label>
              <select
                className="select select-bordered border-black w-full"
                value={test.type}
                onChange={e => setTest({ ...test, type: e.target.value as "academic" | "general" })}
              >
                <option value="academic">Academic</option>
                <option value="general">General Training</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Duration (minutes)</span>
              </label>
              <input
                type="number"
                className="input input-bordered border-black w-full"
                value={test.duration}
                onChange={e => setTest({ ...test, duration: parseInt(e.target.value) })}
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