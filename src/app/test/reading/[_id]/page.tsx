"use client";

import { useEffect, useState } from 'react';

interface QuestionData {
    title: string;
    type: string;
    duration: number;
    parts: {
        title: string;
        passage: (string | { [key: string]: string })[];
        image: string;
        questions: {
            true_false_not_given?: {
                question: string;
                answer: string;
                input_type: string;
            }[];
            fill_in_the_blanks?: {
                question: string;
                answer: string;
                input_type: string;
            }[];
            matching_headings?: {
                paragraphs: {
                    text: string;
                    answer: string;
                    input_type: string;
                }[];
                headings: string[];
            };
            paragraph_matching?: {
                question_number: number;
                question: string;
                answer: string;
                options: { label: string; value: string }[];
                input_type: string;
            }[];
            mcq?: {
                question_number: number;
                question: string;
                answer: string[];
                options: { label: string; value: string }[];
                input_type: string;
                min_selection: number;
                max_selection: number;
            }[];
        };
    }[];
}

export default function ReadingTestPage({ params }: { params: { _id: string } }) {
    const [testData, setTestData] = useState<QuestionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${params._id}`
                );
                if (!response.ok) throw new Error('Failed to fetch test data');
                const data = await response.json();
                setTestData(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params._id]);

    if (loading) return <div className="text-center p-8 text-lg text-gray-600">Loading...</div>;
    if (!testData) return <div className="text-center p-8 text-lg text-gray-600">Test not found</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg">
            {/* Header Section */}
            <header className="mb-8 border-b pb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{testData.title}</h1>
                <div className="flex gap-4 text-gray-600">
                    <span>Type: {testData.type}</span>
                    <span>Duration: {testData.duration} minutes</span>
                </div>
            </header>

            {/* Test Parts */}
            {testData.parts.map((part, partIndex) => (
                <section key={partIndex} className="mb-12">
                    {/* Part Title */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">{part.title}</h2>

                    {/* Image (if available) */}
                    {part.image && (
                        <img
                            src={part.image}
                            alt={part.title}
                            className="mb-6 rounded-lg shadow-md w-full max-w-2xl mx-auto"
                        />
                    )}

                    {/* Passage Section */}
                    <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="font-medium text-lg text-gray-700 mb-4">Passage:</h3>
                        {part.passage.map((paragraph, paraIndex) => (
                            typeof paragraph === 'string' ? (
                                <p key={paraIndex} className="mb-4 text-gray-700 leading-relaxed">
                                    {paragraph}
                                </p>
                            ) : (
                                Object.entries(paragraph).map(([label, text]) => (
                                    <div key={label} className="mb-4">
                                        <strong className="mr-2 text-gray-800">{label}.</strong>
                                        <span className="text-gray-700 leading-relaxed">{text}</span>
                                    </div>
                                ))
                            )
                        ))}
                    </div>

                    {/* Questions Section */}
                    <div className="space-y-8">
                        {/* True/False/Not Given Questions */}
                        {part.questions.true_false_not_given?.map((question, qIndex) => (
                            <div key={qIndex} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <p className="font-medium text-gray-800 mb-4">{question.question}</p>
                                <select className="select select-bordered w-full max-w-xs bg-white">
                                    <option disabled selected>Select an option</option>
                                    <option value="True">True</option>
                                    <option value="False">False</option>
                                    <option value="Not Given">Not Given</option>
                                </select>
                            </div>
                        ))}

                        {/* Fill in the Blanks */}
                        {part.questions.fill_in_the_blanks?.map((question, qIndex) => (
                            <div key={qIndex} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <p className="font-medium text-gray-800 mb-4">
                                    {question.question.replace('__________', '__________')}
                                </p>
                                <input
                                    type="text"
                                    className="input input-bordered w-full max-w-xs bg-white"
                                    placeholder="Enter your answer"
                                />
                            </div>
                        ))}

                        {/* Matching Headings */}
                        {part.questions.matching_headings && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="font-medium text-lg text-gray-800 mb-6">Matching Headings</h3>
                                {part.questions.matching_headings.paragraphs.map((paragraph, pIndex) => (
                                    <div key={pIndex} className="mb-6">
                                        <p className="text-gray-700 mb-4">{paragraph.text}</p>
                                        <select className="select select-bordered w-full max-w-xs bg-white">
                                            <option disabled selected>Select a heading</option>
                                            {part.questions.matching_headings?.headings.map((heading, hIndex) => (
                                                <option key={hIndex} value={heading}>{heading}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Paragraph Matching */}
                        {part.questions.paragraph_matching?.map((question, qIndex) => (
                            <div key={qIndex} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <p className="font-medium text-gray-800 mb-4">{question.question}</p>
                                <select className="select select-bordered w-full max-w-xs bg-white">
                                    <option disabled selected>Select a paragraph</option>
                                    {question.options.map((option, oIndex) => (
                                        <option key={oIndex} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        {/* Multiple Choice Questions */}
                        {part.questions.mcq?.map((question, qIndex) => (
                            <div key={qIndex} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <p className="font-medium text-gray-800 mb-4">{question.question}</p>
                                <div className="space-y-3">
                                    {question.options.map((option, oIndex) => (
                                        <label key={oIndex} className="flex items-center space-x-3">
                                            <input
                                                type={question.input_type === 'checkbox' ? 'checkbox' : 'radio'}
                                                name={`mcq-${qIndex}`}
                                                className="checkbox checkbox-primary"
                                            />
                                            <span className="text-gray-700">{option.value}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}