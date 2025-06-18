import React from "react";
import { WritingPart } from "./WritingTest";

type WritingPartFormProps = {
  part: WritingPart;
  index: number;
  onChange: (part: WritingPart, index: number) => void;
  onRemove: (index: number) => void;
};

const WritingPartForm: React.FC<WritingPartFormProps> = ({
  part,
  index,
  onChange,
  onRemove,
}) => {
  const handleChange = (field: keyof WritingPart, value: string | string[]) => {
    onChange({ ...part, [field]: value }, index);
  };

  const handleArrayChange = (
    field: "Question" | "instruction",
    idx: number,
    value: string
  ) => {
    const newArray = [...part[field]];
    newArray[idx] = value;
    handleChange(field, newArray);
  };

  const addArrayItem = (field: "Question" | "instruction") => {
    handleChange(field, [...part[field], ""]);
  };

  const removeArrayItem = (field: "Question" | "instruction", idx: number) => {
    const newArray = part[field].filter((_, i) => i !== idx);
    handleChange(field, newArray);
  };

  return (
    <div className="card bg-base-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Part {index + 1}</h3>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="btn btn-error btn-sm"
        >
          Remove Part
        </button>
      </div>

      <div className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Title</span>
          </label>
          <input
            type="text"
            value={part.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="input input-bordered border-black"
            placeholder="Writing Task 1"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Subtitle</span>
          </label>
          <input
            type="text"
            value={part.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            className="input input-bordered border-black"
            placeholder="You should spend about 20 minutes on this task."
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Questions</span>
          </label>
          {part.Question.map((q, qIdx) => (
            <div key={qIdx} className="flex mb-2">
              <textarea
                value={q}
                onChange={(e) =>
                  handleArrayChange("Question", qIdx, e.target.value)
                }
                className="textarea textarea-bordered border-black flex-grow mr-2"
                placeholder="Question text"
                rows={2}
              />
              {part.Question.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("Question", qIdx)}
                  className="btn btn-error btn-square"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("Question")}
            className="btn btn-sm btn-outline mt-2"
          >
            Add Question Paragraph
          </button>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Instructions</span>
          </label>
          {part.instruction.map((inst, instIdx) => (
            <div key={instIdx} className="flex mb-2">
              <textarea
                value={inst}
                onChange={(e) =>
                  handleArrayChange("instruction", instIdx, e.target.value)
                }
                className="textarea textarea-bordered border-black flex-grow mr-2"
                placeholder="Instruction"
                rows={2}
              />
              {part.instruction.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("instruction", instIdx)}
                  className="btn btn-error btn-square"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("instruction")}
            className="btn btn-sm btn-outline mt-2"
          >
            Add Instruction
          </button>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Image URL (Optional)</span>
          </label>
          <input
            type="text"
            value={part.image}
            onChange={(e) => handleChange("image", e.target.value)}
            className="input input-bordered border-black"
            placeholder="https://example.com/image.png"
          />
        </div>
      </div>
    </div>
  );
};

export default WritingPartForm;
