import React from "react";
import Image from "next/image";

interface MapQuestion {
    question_number: number;
    question: string;
    answer: string;
    input_type: string;
    min_selection: number;
    max_selection: number;
}

interface MapProps {
    question: {
        title: string;
        image: string;
        labels: string[];
        questions: MapQuestion[];
    };
    handleAnswerChange: (
        questionId: number,
        value: string,
        inputType: string,
        answer: string,
        isCorrect?: boolean
    ) => void;
    answers?: Record<string, any>;
}

const Map: React.FC<MapProps> = ({ question, handleAnswerChange, answers = {} }) => {
    return (
        <div className="space-y-4 mb-6">
            <h3 className="text-xl font-semibold mb-2">{question.title}</h3>
            <div className="w-full flex justify-center mb-4">
                <Image
                    src={question.image}
                    alt={question.title}
                    width={600}
                    height={400}
                    className="rounded-lg mx-auto"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <th className="bg-black text-white px-2 py-1 text-left font-normal"></th>
                            {question.labels.map((label) => (
                                <th key={label} className="bg-black text-white px-4 py-1 font-bold text-center">{label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {question.questions.map((q) => (
                            <tr key={q.question_number} className="border-b border-white">
                                <td className="pr-2 py-2 text-white whitespace-nowrap font-medium">
                                    {q.question_number}. {q.question}
                                </td>
                                {question.labels.map((label) => (
                                    <td key={label} className="text-center">
                                        <input
                                            type="radio"
                                            name={`map_${q.question_number}`}
                                            value={label}
                                            checked={answers && answers[`map_${q.question_number}`]?.value === label}
                                            onChange={() => handleAnswerChange(
                                                q.question_number,
                                                label,
                                                'map',
                                                q.answer,
                                                label === q.answer
                                            )}
                                            className="form-radio h-5 w-5 text-primary bg-black border-white focus:ring-2 focus:ring-primary"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Map; 