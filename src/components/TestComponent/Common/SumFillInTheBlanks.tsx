import React, { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";

const SumFillInTheBlanks = ({
  question,
  answers,
  setAnswers,
  handleAnswerChange,
}: any) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const blankIndex = parseInt(String(over.id)); // Use the index to identify the blank
      const selectedLabel = String(active.id); // Get the selected answer label
      const submittedAnswer = question.answers[blankIndex]; // Get the correct answer for this blank

      setSelectedAnswers((prev) => ({ ...prev, [blankIndex]: selectedLabel }));

      // Send value, input_type, and correct answer to the parent
      handleAnswerChange(
        question.question_numbers[blankIndex],
        selectedLabel,
        question.input_type,
        submittedAnswer,
        selectedLabel === submittedAnswer ? true : false
      );
    }
  };

  return (
    <div>
      <h5 className="font-medium mb-2">Summary Completion</h5>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-4 border rounded-lg mb-2">
          <p className="italic mb-2">{question.instruction}</p>
          <div className="whitespace-pre-wrap leading-7">
            {/* Render passage text with numbered blanks */}
            {question.passage
              ?.split("__________")
              .map((part: string, index: number) => {
                if (index < question.answers.length) {
                  return (
                    <span key={index} className="inline">
                      {part}
                      <span className="font-semibold">
                        {question.question_numbers[index]}.
                      </span>{" "}
                      {/* Display the question number */}
                      <DropZone
                        blankIndex={index}
                        answer={selectedAnswers[index]}
                      />
                      {/* Show the blank as a drop zone */}
                    </span>
                  );
                }
                return <span key={index}>{part} </span>;
              })}
          </div>
        </div>

        <div className="mt-4 p-4 border rounded-lg">
          <h6 className="font-medium mb-2">Drag the correct answers:</h6>
          <div className="flex gap-2 flex-wrap">
            {/* Render draggable options */}
            {question.options?.map((opt: any) => (
              <DraggableOption
                key={opt.label}
                id={opt.label}
                label={opt.label}
                value={opt.value}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

const DraggableOption = ({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="px-3 py-1 border rounded cursor-grab"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      <strong>{label}.</strong> {value}
    </div>
  );
};

const DropZone = ({
  blankIndex,
  answer,
}: {
  blankIndex: number;
  answer?: string;
}) => {
  const { setNodeRef } = useDroppable({ id: blankIndex.toString() });

  return (
    <span
      ref={setNodeRef}
      className="inline-block border-b-2 border-dashed px-2 mx-1 min-w-[50px] text-center"
    >
      {/* Show answer if selected, otherwise show nothing */}
      {answer}
    </span>
  );
};

export default SumFillInTheBlanks;
