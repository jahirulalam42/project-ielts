"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import SubFillInTheBlanks from "../Common/SubFillInTheBlanks";
import McqSingle from "../Common/McqSingle";
import Map from "../Common/Map";

interface ListeningTestProps {
    test: {
        id: string;
        title: string;
        type: string;
        duration: number;
        audioUrl: string;
        parts: Array<{
            title: string;
            questions: Array<{
                fill_in_the_blanks_with_subtitle?: any[];
                mcq?: any[];
                map?: any[];
            }>;
        }>;
    };
}

const ListeningTest: React.FC<ListeningTestProps> = ({ test }) => {
    const [answers, setAnswers] = useState<any>({});
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(test.duration * 60); // Convert minutes to seconds
    const [isTimeUp, setIsTimeUp] = useState(false);
    const { data: session }: any = useSession();

    const currentPart = test.parts[currentPartIndex];

    useEffect(() => {
        // Initialize answers state
        const initialAnswers: any = {};
        test.parts.forEach(part => {
            part.questions.forEach(questionSet => {
                if (questionSet.fill_in_the_blanks_with_subtitle) {
                    questionSet.fill_in_the_blanks_with_subtitle.forEach(blankSet => {
                        blankSet.questions?.forEach((q: any) => {
                            initialAnswers[`fill_${q.question_number}`] = {
                                value: '',
                                answerText: q.answer,
                                isCorrect: false
                            };
                        });
                    });
                }
                if (questionSet.mcq) {
                    questionSet.mcq.forEach((q: any) => {
                        initialAnswers[`mcq_${q.question_number}`] = {
                            value: '',
                            answerText: q.answer,
                            isCorrect: false
                        };
                    });
                }
                if (questionSet.map) {
                    questionSet.map.forEach((mapSet: any) => {
                        mapSet.questions.forEach((q: any) => {
                            initialAnswers[`map_${q.question_number}`] = {
                                value: '',
                                answerText: q.answer,
                                isCorrect: false
                            };
                        });
                    });
                }
            });
        });
        setAnswers(initialAnswers);
    }, [test.parts]);

    const handleAnswerChange = (
        questionId: number,
        value: string,
        inputType: string,
        answer: string,
        isCorrect?: boolean
    ) => {
        setAnswers((prev: any) => ({
            ...prev,
            [`${inputType}_${questionId}`]: {
                value,
                answerText: answer,
                isCorrect: isCorrect
            }
        }));
    };

    const handleNextPart = () => {
        if (currentPartIndex < test.parts.length - 1) {
            setCurrentPartIndex(prev => prev + 1);
        }
    };

    const handlePrevPart = () => {
        if (currentPartIndex > 0) {
            setCurrentPartIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submissionTime = new Date();

        const totalPoint = Object.values(answers).filter(
            (answer: any) => answer.isCorrect === true
        ).length;

        const testData = {
            userId: session?.user?.id,
            testId: test.id,
            answers: answers,
            totalScore: totalPoint,
            submittedAt: submissionTime.toLocaleString(),
        };

        try {
            // TODO: Implement your submission API call here
            // const res = await postSubmitListeningTest(testData);
            
            toast.success("Submission successful!");
            redirect(`/getSubmittedAnswers/${testData.testId}`);
        } catch (error: any) {
            toast.error(`Submission failed: ${error.message}`);
        }
    };

    useEffect(() => {
        if (timeLeft === 0) {
            setIsTimeUp(true);
            handleSubmit(new Event('submit') as any);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="container mx-auto p-4 min-h-screen">
                {/* Test Header */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <h1 className="card-title text-3xl">{test.title}</h1>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg">Type: {test.type}</p>
                                <p className="text-lg">Duration: {test.duration} minutes</p>
                            </div>
                            <div className="badge badge-primary">
                                Part {currentPartIndex + 1} of {test.parts.length}
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-lg font-bold">
                                Time Left: {formatTime(timeLeft)}
                            </div>
                            {isTimeUp && (
                                <div className="text-lg text-red-500 font-bold">Time's up!</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Audio Player */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <audio controls className="w-full">
                            <source src={test.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>

                {/* Questions Section */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="text-2xl font-bold mb-4">{currentPart.title}</h2>
                        <div className="space-y-6">
                            {currentPart.questions?.map((questionSet, index) => (
                                <div key={index}>
                                    {questionSet.fill_in_the_blanks_with_subtitle && (
                                        <SubFillInTheBlanks
                                            question={questionSet.fill_in_the_blanks_with_subtitle}
                                            handleAnswerChange={handleAnswerChange}
                                        />
                                    )}
                                    {questionSet.mcq && (
                                        <McqSingle
                                            question={questionSet.mcq}
                                            handleAnswerChange={handleAnswerChange}
                                        />
                                    )}
                                    {questionSet.map && (
                                        <Map
                                            question={questionSet.map[0]}
                                            handleAnswerChange={handleAnswerChange}
                                            answers={answers}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={handlePrevPart}
                                disabled={currentPartIndex === 0}
                                className="btn btn-secondary"
                                type="button"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextPart}
                                disabled={currentPartIndex === test.parts.length - 1}
                                className="btn btn-primary"
                                type="button"
                            >
                                Next
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-success mt-6 w-full"
                        >
                            Submit Test
                        </button>
                    </div>
                </div>

                {/* Toast Notifications */}
                <ToastContainer />
            </div>
        </form>
    );
};

export default ListeningTest; 