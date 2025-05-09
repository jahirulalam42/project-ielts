// app/listening-tests/[id]/page.tsx

"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import listeningTests from '../../../../../data/listening.json';
import Link from 'next/link';

interface AnswerState {
    [questionId: string]: string | string[] | Record<string, string>;
}

export default function ListeningTestPage() {
    const params = useParams();
    const testId = params.id as string;
    const [answers, setAnswers] = useState<AnswerState>({});
    const [submitted, setSubmitted] = useState(false);

    console.log('Id', testId)

    // Find the selected test
    const test = listeningTests.listeningTests.find(t => t.id === testId);

    useEffect(() => {
        if (!test) return;

        // Initialize answers state
        const initialAnswers: AnswerState = {};
        test.questions.forEach((question: any) => {
            switch (question.type) {
                case 'form-completion':
                    initialAnswers[question.id] = question.fields.map(() => '');
                    break;
                case 'multiple-choice':
                    initialAnswers[question.id] = [];
                    break;
                case 'matching':
                    initialAnswers[question.id] = {};
                    break;
                default:
                    initialAnswers[question.id] = '';
            }
        });
        setAnswers(initialAnswers);
    }, [test]);

    if (!test) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl text-error">Test not found</h1>
                <Link href="/listening" className="btn btn-primary mt-4">
                    Back to Tests
                </Link>
            </div>
        );
    }

    // Handle answer updates
    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    // Render different question types
    const renderQuestion = (question: any) => {
        switch (question.type) {
            case 'form-completion':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                        {question.fields.map((field: any, index: number) => (
                            <div key={index} className="form-control">
                                <label className="label">
                                    <span className="label-text">{field.label}</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={(answers[question.id] as string[])[index] || ''}
                                    onChange={(e) => {
                                        const newAnswers = [...(answers[question.id] as string[])];
                                        newAnswers[index] = e.target.value;
                                        handleAnswerChange(question.id, newAnswers);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                );

            case 'multiple-choice':
                return (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                        {question.options.map((option: string, index: number) => (
                            <label key={index} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type={question.correctAnswers.length > 1 ? 'checkbox' : 'radio'}
                                    className="checkbox checkbox-primary"
                                    name={question.id}
                                    value={option}
                                    checked={(answers[question.id] as string[]).includes(option)}
                                    onChange={(e) => {
                                        const selected = [...(answers[question.id] as string[])];
                                        if (e.target.checked) {
                                            selected.push(option);
                                        } else {
                                            const index = selected.indexOf(option);
                                            if (index > -1) selected.splice(index, 1);
                                        }
                                        handleAnswerChange(question.id, selected);
                                    }}
                                />
                                <span className="label-text">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'note-completion':
                return (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                        <div className="bg-base-200 p-4 rounded-lg">
                            {question.content.map((line: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    {line.includes('▁') ? (
                                        <>
                                            <span>{line.split('▁')[0]}</span>
                                            <input
                                                type="text"
                                                className="input input-bordered w-32"
                                                value={answers[question.id] as string || ''}
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <span>{line}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'sentence-completion':
                return (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={answers[question.id] as string || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        />
                    </div>
                );

            case 'matching':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {question.pairs.map((pair: any, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="font-medium">{pair.left}</span>
                                    <select
                                        className="select select-bordered flex-1"
                                        value={(answers[question.id] as Record<string, string>)[pair.left] || ''}
                                        onChange={(e) => {
                                            const newMatches = { ...(answers[question.id] as Record<string, string>) };
                                            newMatches[pair.left] = e.target.value;
                                            handleAnswerChange(question.id, newMatches);
                                        }}
                                    >
                                        <option value="">Select match</option>
                                        {question.pairs.map((p: any) => (
                                            <option key={p.right} value={p.right}>{p.right}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Test Header */}
            <div className="bg-base-200 p-6 rounded-lg mb-8">
                <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
                <p className="text-lg mb-4">{test.description}</p>
                <div className="flex items-center gap-4">
                    <audio controls className="w-full">
                        <source src={test.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-8">
                {test.questions.map((question, index) => (
                    <div key={question.id} className="card bg-base-100 shadow-xl p-6">
                        <div className="badge badge-primary badge-lg mb-4">Question {index + 1}</div>
                        {renderQuestion(question)}
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <div className="fixed bottom-4 right-4">
                <button
                    className="btn btn-primary btn-lg shadow-lg"
                    onClick={() => setSubmitted(true)}
                >
                    Submit Answers
                </button>
            </div>

            {submitted && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Answers Submitted!</h3>
                        <p className="py-4">Your answers have been successfully submitted.</p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setSubmitted(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}