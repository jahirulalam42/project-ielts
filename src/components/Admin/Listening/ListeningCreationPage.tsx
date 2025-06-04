'use client'
import { useState } from 'react';
import { ListeningTest, TestPart } from './listeningTest';
import PartForm from './PartForm';
import { submitListeningQuestions } from '@/services/data';
import { toast, ToastContainer } from 'react-toastify';

const ListeningCreationPage = () => {
    const [test, setTest] = useState<ListeningTest>({
        title: '',
        type: 'academic',
        duration: 30,
        audioUrl: '',
        parts: [{ title: 'Part 1', questions: [] }]
    });

    const handleTestChange = (field: keyof ListeningTest, value: string | number) => {
        setTest(prev => ({ ...prev, [field]: value }));
    };

    const addPart = () => {
        setTest(prev => ({
            ...prev,
            parts: [...prev.parts, { title: `Part ${prev.parts.length + 1}`, questions: [] }]
        }));
    };

    const updatePart = (index: number, part: TestPart) => {
        setTest(prev => {
            const parts = [...prev.parts];
            parts[index] = part;
            return { ...prev, parts };
        });
    };

    const removePart = (index: number) => {
        setTest(prev => ({
            ...prev,
            parts: prev.parts.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting test:', JSON.stringify(test, null, 2));

        try {
            const data = await submitListeningQuestions(JSON.stringify(test));
            console.log(data.success);
            if (data.success) {
                toast.success("Test created successfully!");
                // Optionally, redirect or reset the form
            } else {
                toast.error("Failed to create test. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred while creating the test.");
        }

        // Submit to API here
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create Listening Test</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <div className="form-control">
                        <label className="label">
                            <span className="label-text">Test ID</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={test.id}
                            onChange={e => handleTestChange('id', e.target.value)}
                            required
                        />
                    </div> */}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={test.title}
                            onChange={e => handleTestChange('title', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Type</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={test.type}
                            onChange={e => handleTestChange('type', e.target.value)}
                        >
                            <option value="academic">Academic</option>
                            <option value="general">General Training</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Duration (minutes)</span>
                        </label>
                        <input
                            type="number"
                            className="input input-bordered"
                            value={test.duration}
                            onChange={e => handleTestChange('duration', parseInt(e.target.value))}
                            required
                        />
                    </div>

                    <div className="md:col-span-2 form-control">
                        <label className="label">
                            <span className="label-text">Audio URL</span>
                        </label>
                        <input
                            type="url"
                            className="input input-bordered"
                            value={test.audioUrl}
                            onChange={e => handleTestChange('audioUrl', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-10">
                    {test.parts.map((part, partIndex) => (
                        <PartForm
                            key={partIndex}
                            part={part}
                            partIndex={partIndex}
                            updatePart={updatePart}
                            removePart={removePart}
                            isLast={partIndex === test.parts.length - 1}
                        />
                    ))}

                    <button
                        type="button"
                        onClick={addPart}
                        className="btn btn-primary"
                    >
                        Add Part
                    </button>
                </div>

                <div className="flex justify-end mt-10">
                    <button type="submit" className="btn btn-success">
                        Create Test
                    </button>
                </div>
            </form>
            <ToastContainer position="top-right" />
        </div>
    );
};

export default ListeningCreationPage;