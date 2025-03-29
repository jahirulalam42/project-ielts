import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";

const SumFillInTheBlanks = ({ question, handleAnswerChange }: any) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const blankNumber = parseInt(String(over.id));
      const selectedLabel = String(active.id);
      const correctAnswer = question.answers[blankNumber.toString()];

      setSelectedAnswers((prev) => ({ ...prev, [blankNumber]: selectedLabel }));

      // Send value, input_type and answerText to parent
      handleAnswerChange(blankNumber, selectedLabel, question.input_type, correctAnswer);
    }
  };

  return (
    <div>
      <h5 className="font-medium mb-2">Summary Completion</h5>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-4 border rounded-lg mb-2">
          <p className="italic mb-2">{question.instruction}</p>
          <div className="whitespace-pre-wrap leading-7">
            {question.passage.split(/\[(\d+)\]/).map((part: string, index: number) => {
              const blankNumber = parseInt(part);
              if (!isNaN(blankNumber)) {
                return (
                  <span key={index} className="inline-flex items-center space-x-1">
                    <span className="font-semibold">{blankNumber}.</span>
                    <DropZone blankNumber={blankNumber} answer={selectedAnswers[blankNumber]} />
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
            {question.options.map((opt: any) => (
              <DraggableOption key={opt.label} id={opt.label} label={opt.label} value={opt.value} />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

const DraggableOption = ({ id, label, value }: { id: string; label: string; value: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="px-3 py-1 border rounded cursor-grab"
      style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined }}
    >
      <strong>{label}.</strong> {value}
    </div>
  );
};

const DropZone = ({ blankNumber, answer }: { blankNumber: number; answer?: string }) => {
  const { setNodeRef } = useDroppable({ id: blankNumber.toString() });

  return (
    <span
      ref={setNodeRef}
      className="inline-block border-b-2 border-dashed px-2 mx-1 min-w-[50px] text-center"
    >
      {answer ? answer : ""}
    </span>
  );
};

export default SumFillInTheBlanks;
