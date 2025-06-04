"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getSubmitWritingTest } from "@/services/data";
import { useSession } from "next-auth/react";

// Define TypeScript interfaces
interface Answer {
    partId: string;
    question: string;
    response: string;
    instructions: string[];
}

interface Submission {
    _id: string;
    userId: string;
    testId: string;
    answers: Answer[];
    submittedAt: string;
    __v: number;
}

const SubmissionPage = () => {
    const params = useParams();
    const { testId } = params;
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                if (!testId || !session?.user?.id) return;

                const response = await getSubmitWritingTest(testId, session.user.id);
                console.log("API Response", response);

                if (response.success) {
                    // Handle array response or single object
                    const data = Array.isArray(response.data)
                        ? response.data[0] // Take first element if array
                        : response.data;

                    setSubmission(data || null);
                    setError(null);
                } else {
                    setError("Failed to fetch submission data");
                }
            } catch (err) {
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [testId, session?.user?.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="alert alert-error max-w-md">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="alert alert-warning max-w-md">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <span>No submission found</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <h1 className="card-title text-3xl mb-4">Writing Test Submission</h1>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="badge badge-info">
                            Submitted: {submission.submittedAt}
                        </div>
                        <div className="badge badge-primary">
                            Test ID: {submission.testId}
                        </div>
                    </div>

                    {submission.answers.map((answer, index) => (
                        <div key={answer.partId} className="mb-8">
                            <div className="divider"></div>
                            <h2 className="text-2xl font-semibold mb-4">
                                Task {index + 1}
                            </h2>

                            <div className="bg-base-200 p-6 rounded-lg">
                                <h3 className="text-lg font-medium mb-2">Question:</h3>
                                <div className="prose max-w-none mb-4">
                                    <p className="mb-2">{answer.question}</p>
                                </div>

                                <div className="mt-4 bg-neutral text-neutral-content p-4 rounded-lg">
                                    <h4 className="font-bold mb-2">Instructions:</h4>
                                    <ul className="list-disc pl-5">
                                        {answer.instructions.map((instruction, idx) => (
                                            <li key={idx}>{instruction}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium mb-2">Your Response:</h3>
                                    <div className="p-4 border border-gray-300 rounded-lg bg-white">
                                        <pre className="whitespace-pre-wrap font-sans text-gray-800">
                                            {answer.response}
                                        </pre>
                                    </div>
                                    <div className="mt-2 text-right text-sm text-gray-500">
                                        Word Count: {answer.response.trim().split(/\s+/).length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 flex justify-center">
                        <button
                            className="btn btn-primary"
                            onClick={() => window.print()}
                        >
                            Print Submission
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionPage;