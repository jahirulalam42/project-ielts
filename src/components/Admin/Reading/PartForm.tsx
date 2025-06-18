"use client";
import React, { useState } from "react";
import { Passage, ReadingTest, QuestionType, questionTypes } from "./readingTest";
import QuestionGroupEditor from "./QuestionGroupEditor";

interface PartFormProps {
  passage: Passage;
  passageIndex: number;
  test: ReadingTest;
  setTest: (test: ReadingTest) => void;
}

const PartForm: React.FC<PartFormProps> = ({
  passage,
  passageIndex,
  test,
  setTest,
}) => {
  const updatePassageField = (
    field: keyof Passage,
    value: any
  ) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex][field] = value;
    setTest({ ...test, parts: updatedParts });
  };

  const updatePassageType = (
    passageType: "type1" | "type2"
  ) => {
    const updatedParts = [...test.parts];

    // If changing to type2, ensure the passage is in the correct structure
    if (
      passageType === "type2" &&
      Array.isArray(updatedParts[passageIndex].passage)
    ) {
      const passageArray = updatedParts[passageIndex].passage as string[];
      updatedParts[passageIndex].passage = passageArray.reduce(
        (acc: Record<string, string>, para, idx) => {
          const key = String.fromCharCode(65 + idx); // A, B, C...
          acc[key] = para;
          return acc;
        },
        {}
      );
    }

    // If changing to type1, ensure the passage is an array
    if (
      passageType === "type1" &&
      typeof updatedParts[passageIndex].passage !== "object"
    ) {
      updatedParts[passageIndex].passage = Object.values(
        updatedParts[passageIndex].passage
      );
    }

    updatedParts[passageIndex].passageType = passageType;
    setTest({ ...test, parts: updatedParts });
  };

  const updateParagraph = (
    paraIndex: number,
    value: string
  ) => {
    const updatedParts = [...test.parts];
    if (Array.isArray(updatedParts[passageIndex].passage)) {
      updatedParts[passageIndex].passage[paraIndex] = value;
    } else {
      const key = String.fromCharCode(65 + paraIndex);
      (updatedParts[passageIndex].passage as Record<string, string>)[key] = value;
    }
    setTest({ ...test, parts: updatedParts });
  };

  const addParagraph = () => {
    const updatedParts = [...test.parts];
    if (Array.isArray(updatedParts[passageIndex].passage)) {
      updatedParts[passageIndex].passage.push("");
    } else {
      const key = String.fromCharCode(65 + Object.keys(updatedParts[passageIndex].passage).length);
      (updatedParts[passageIndex].passage as Record<string, string>)[key] = "";
    }
    setTest({ ...test, parts: updatedParts });
  };

  return (
    <div className="border p-4 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Title</span>
          </label>
          <input
            type="text"
            value={passage.title}
            onChange={(e) => updatePassageField("title", e.target.value)}
            className="input input-bordered border-black w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Instructions</span>
          </label>
          <input
            type="text"
            value={passage.instructions}
            onChange={(e) => updatePassageField("instructions", e.target.value)}
            className="input input-bordered border-black w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Passage Title</span>
          </label>
          <input
            type="text"
            value={passage.passage_title}
            onChange={(e) => updatePassageField("passage_title", e.target.value)}
            className="input input-bordered border-black w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Passage Subtitle</span>
          </label>
          <input
            type="text"
            value={passage.passage_subtitle}
            onChange={(e) => updatePassageField("passage_subtitle", e.target.value)}
            className="input input-bordered border-black w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Image URL</span>
          </label>
          <input
            type="text"
            value={passage.image}
            onChange={(e) => updatePassageField("image", e.target.value)}
            className="input input-bordered border-black w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Passage Type</span>
          </label>
          <select
            value={passage.passageType}
            onChange={(e) => updatePassageType(e.target.value as "type1" | "type2")}
            className="select select-bordered border-black w-full"
          >
            <option value="type1">Type 1 (Array)</option>
            <option value="type2">Type 2 (Object)</option>
          </select>
        </div>
      </div>

      {/* Passage Content */}
      <div className="mb-4">
        <label className="label">
          <span className="label-text font-semibold">Passage Content</span>
        </label>
        {Array.isArray(passage.passage) ? (
          <div className="space-y-4">
            {passage.passage.map((para, paraIndex) => (
              <div key={paraIndex} className="form-control">
                <textarea
                  value={para}
                  onChange={(e) => updateParagraph(paraIndex, e.target.value)}
                  className="textarea textarea-bordered border-black w-full"
                  rows={4}
                />
              </div>
            ))}
            <button onClick={addParagraph} className="btn btn-primary">
              Add Paragraph
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(passage.passage).map(([key, value], paraIndex) => (
              <div key={key} className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Paragraph {key}</span>
                </label>
                <textarea
                  value={value as string}
                  onChange={(e) => updateParagraph(paraIndex, e.target.value)}
                  className="textarea textarea-bordered border-black w-full"
                  rows={4}
                />
              </div>
            ))}
            <button onClick={addParagraph} className="btn btn-primary">
              Add Paragraph
            </button>
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Questions</h3>
        <QuestionGroupEditor
          passage={passage}
          passageIndex={passageIndex}
          test={test}
          setTest={setTest}
        />
      </div>
    </div>
  );
};

export default PartForm; 
