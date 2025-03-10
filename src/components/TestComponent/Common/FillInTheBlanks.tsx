import React from "react";

// Define the shape of each question object
interface Question {
  question_number: number;
  question: string;
  answer: boolean;
  input_type: string;
}

// Define the props for your component
interface FillInTheBlanksProps {
  question: Question[];
}

const FillInTheBlanks: React.FC<FillInTheBlanksProps> = ({ question }) => {
  return (
    <div>
      <h5 className="font-medium mb-2">Fill in the Blanks</h5>
      {question.map((q: any) => (
        <div key={q.question_number} className="p-4 border rounded-lg mb-2">
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
  );
};

export default FillInTheBlanks;
