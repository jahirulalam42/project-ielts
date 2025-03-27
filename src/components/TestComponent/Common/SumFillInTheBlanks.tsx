import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";

const SumFillInTheBlanks = ({ question, handleAnswerChange }: any) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const blankNumber = String(over.id);
      setSelectedAnswers((prev) => ({ ...prev, [blankNumber]: active.id }));
      handleAnswerChange(blankNumber, active.id); // Notify parent
    }
  };

  return (
    <div>
      <h5 className="font-medium mb-2">Summary Completion</h5>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-4 border rounded-lg mb-2">
          <p className="italic mb-2">{question.instruction}</p>
          <div className="whitespace-pre-wrap">
            {question.passage.split(/\[(\d+)\]/).map((part: string, index: number) => {
              const blankNumber = parseInt(part);
              if (!isNaN(blankNumber)) {
                return <DropZone key={index} blankNumber={blankNumber} answer={selectedAnswers[blankNumber]} />;
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
