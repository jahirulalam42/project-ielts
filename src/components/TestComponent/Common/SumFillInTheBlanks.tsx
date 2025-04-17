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
      const correctAnswer = question.answers[blankIndex]; // Get the correct answer for this blank

      setSelectedAnswers((prev) => ({ ...prev, [blankIndex]: selectedLabel }));

<<<<<<< HEAD
      // Send value, input_type, and correct answer to the parent
      handleAnswerChange(blankIndex, selectedLabel, question.input_type, correctAnswer);
=======
      console.log("Select Label", selectedLabel);
      console.log("Correct Answer", correctAnswer);

      // Send value, input_type and answerText to parent
      handleAnswerChange(
        blankNumber,
        selectedLabel,
        question.input_type,
        correctAnswer,
        selectedLabel === correctAnswer ? true : false
      );
>>>>>>> 00654a3c0366853101fa5b6f844c138dd8e4c42e
    }
  };

  return (
    <div>
      <h5 className="font-medium mb-2">Summary Completion</h5>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-4 border rounded-lg mb-2">
          <p className="italic mb-2">{question.instruction}</p>
          <div className="whitespace-pre-wrap leading-7">
<<<<<<< HEAD
            {/* Render passage text with numbered blanks */}
            {question.passage.split("__________").map((part: string, index: number) => {
              if (index < question.answers.length) {
                return (
                  <span key={index} className="inline">
                    {part}
                    <span className="font-semibold">{question.question_numbers[index]}.</span> {/* Display the question number */}
                    <DropZone blankIndex={index} answer={selectedAnswers[index]} />
                    {/* Show the blank as a drop zone */}
                  </span>
                );
              }
              return <span key={index}>{part} </span>;
            })}
=======
            {question.passage
              .split(/\[(\d+)\]/)
              .map((part: string, index: number) => {
                const blankNumber = parseInt(part);
                if (!isNaN(blankNumber)) {
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1"
                    >
                      <span className="font-semibold">{blankNumber}.</span>
                      <DropZone
                        blankNumber={blankNumber}
                        answer={selectedAnswers[blankNumber]}
                      />
                    </span>
                  );
                }
                return <span key={index}>{part} </span>;
              })}
>>>>>>> 00654a3c0366853101fa5b6f844c138dd8e4c42e
          </div>
        </div>

        <div className="mt-4 p-4 border rounded-lg">
          <h6 className="font-medium mb-2">Drag the correct answers:</h6>
          <div className="flex gap-2 flex-wrap">
<<<<<<< HEAD
            {/* Render draggable options */}
            {question.options.map((opt: any) => (
              <DraggableOption key={opt.label} id={opt.label} label={opt.label} value={opt.value} />
            ))}
=======
            {question.options.map((opt: any) => {
              return (
                <DraggableOption
                  key={opt.label}
                  id={opt.label}
                  label={opt.label}
                  value={opt.text}
                />
              );
            })}
>>>>>>> 00654a3c0366853101fa5b6f844c138dd8e4c42e
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

<<<<<<< HEAD
const DropZone = ({ blankIndex, answer }: { blankIndex: number; answer?: string }) => {
  const { setNodeRef } = useDroppable({ id: blankIndex.toString() });
=======
const DropZone = ({
  blankNumber,
  answer,
}: {
  blankNumber: number;
  answer?: string;
}) => {
  const { setNodeRef } = useDroppable({ id: blankNumber.toString() });
>>>>>>> 00654a3c0366853101fa5b6f844c138dd8e4c42e

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
