"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSingleWritingTest } from '@/services/data';

interface PassageItem {
    label?: string;
    detail?: string;
    month?: string;
    ridership?: string;
    change?: string;
    [key: string]: any;
}

interface TestPart {
    title: string;
    instructions: string;
    passage_title: string;
    passage_subtitle: string;
    passage: string[] | PassageItem[];
    image?: string;
    _id: string;
}

export default function WritingTestPage() {
    const params = useParams();
    const [test, setTest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const data = await getSingleWritingTest(params.id)

                if (data.success) {
                    setTest(data.data);
                }
            } catch (err) {
                setError('Failed to fetch writing test');
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [params.id]);

    const renderPassageContent = (passage: string[] | PassageItem[]) => {
        if (passage.length === 0) return null;

        if (typeof passage[0] === 'string') {
            return (passage as string[]).map((text, index) => (
                <p key={index} className="mb-2">{text}</p>
            ));
        }

        const items = passage as PassageItem[];
        if (items[0].label) {
            return (
                <ul className="list-disc pl-6 space-y-2">
                    {items.map((item, index) => (
                        <li key={index}>
                            <strong>{item.label}:</strong> {item.detail}
                        </li>
                    ))}
                </ul>
            );
        }

        if (items[0].month) {
            return (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Ridership</th>
                                <th>Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.month}</td>
                                    <td>{item.ridership}</td>
                                    <td>{item.change}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return null;
    };

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

    if (!test) {
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
                    <span>Test not found</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <h1 className="card-title text-3xl mb-4">{test.title}</h1>
                    <div className="flex gap-4 mb-6">
                        <div className="badge badge-info">{test.type}</div>
                        <div className="badge badge-warning">
                            Duration: {test.duration} minutes
                        </div>
                    </div>

                    {test.parts.map((part: any) => (
                        <div key={part._id} className="mb-8">
                            <div className="divider"></div>
                            <h2 className="text-2xl font-semibold mb-4">{part.title}</h2>
                            <div className="bg-base-200 p-6 rounded-lg">
                                <h3 className="text-lg font-medium mb-2">
                                    {part.passage_title}
                                </h3>
                                {part.passage_subtitle && (
                                    <p className="text-sm opacity-75 mb-4">
                                        {part.passage_subtitle}
                                    </p>
                                )}

                                <div className="prose max-w-none mb-4">
                                    {renderPassageContent(part.passage)}
                                </div>

                                {part.image && (
                                    <div className="my-4">
                                        <img
                                            src={part.image}
                                            alt={part.passage_title}
                                            className="rounded-lg max-w-full h-auto mx-auto"
                                        />
                                    </div>
                                )}

                                <div className="mt-6 bg-neutral text-neutral-content p-4 rounded-lg">
                                    <h4 className="font-bold mb-2">Instructions:</h4>
                                    <p>{part.instructions}</p>
                                </div>

                                <div className="mt-6">
                                    <textarea
                                        className="textarea textarea-bordered w-full h-64"
                                        placeholder="Write your response here..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 flex justify-end gap-4">
                        <button className="btn btn-primary">
                            Submit Test
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}