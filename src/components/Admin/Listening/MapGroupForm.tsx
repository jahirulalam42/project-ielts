import { useState, useEffect } from 'react';
import { MapGroup } from './listeningTest';

interface MapGroupFormProps {
    group: MapGroup;
    updateGroup: (group: MapGroup) => void;
}

const MapGroupForm = ({ group, updateGroup }: MapGroupFormProps) => {
    const [localGroup, setLocalGroup] = useState<MapGroup>(group);

    useEffect(() => {
        setLocalGroup(group);
    }, [group]);

    const handleBlur = () => {
        updateGroup(localGroup);
    };

    const handleMapItemChange = (mapIndex: number, field: string, value: string) => {
        setLocalGroup(prev => {
            const updatedMap = [...prev.map];
            updatedMap[mapIndex] = {
                ...updatedMap[mapIndex],
                [field]: value
            };
            return { ...prev, map: updatedMap };
        });
    };

    const handleLabelsChange = (mapIndex: number, labels: string[]) => {
        setLocalGroup(prev => {
            const updatedMap = [...prev.map];
            updatedMap[mapIndex] = {
                ...updatedMap[mapIndex],
                labels
            };
            return { ...prev, map: updatedMap };
        });
    };

    const addLabel = (mapIndex: number) => {
        setLocalGroup(prev => {
            const updatedMap = [...prev.map];
            const currentLabels = updatedMap[mapIndex].labels;
            const lastLabel = currentLabels[currentLabels.length - 1];
            const nextLabel = String.fromCharCode(lastLabel.charCodeAt(0) + 1);
            
            updatedMap[mapIndex] = {
                ...updatedMap[mapIndex],
                labels: [...currentLabels, nextLabel]
            };
            return { ...prev, map: updatedMap };
        });
    };

    const removeLabel = (mapIndex: number, labelIndex: number) => {
        setLocalGroup(prev => {
            const updatedMap = [...prev.map];
            const updatedLabels = updatedMap[mapIndex].labels.filter((_, index) => index !== labelIndex);
            
            // Update any questions that were using the removed label
            const updatedQuestions = updatedMap[mapIndex].questions.map(q => ({
                ...q,
                answer: q.answer === updatedMap[mapIndex].labels[labelIndex] ? '' : q.answer
            }));

            updatedMap[mapIndex] = {
                ...updatedMap[mapIndex],
                labels: updatedLabels,
                questions: updatedQuestions
            };
            return { ...prev, map: updatedMap };
        });
    };

    const handleQuestionChange = (mapIndex: number, questionIndex: number, field: string, value: string) => {
        setLocalGroup(prev => {
            const updatedMap = [...prev.map];
            const updatedQuestions = [...updatedMap[mapIndex].questions];
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                [field]: value
            };
            updatedMap[mapIndex] = {
                ...updatedMap[mapIndex],
                questions: updatedQuestions
            };
            return { ...prev, map: updatedMap };
        });
    };

    const addMapItem = () => {
        setLocalGroup(prev => ({
            ...prev,
            map: [...prev.map, {
                title: '',
                image: '',
                labels: ['A', 'B', 'C'],
                questions: []
            }]
        }));
    };

    const removeMapItem = (mapIndex: number) => {
        setLocalGroup(prev => ({
            ...prev,
            map: prev.map.filter((_, index) => index !== mapIndex)
        }));
    };

    const addQuestion = (mapIndex: number) => {
        setLocalGroup(prev => {
            const updatedMap = [...prev.map];
            const currentQuestions = updatedMap[mapIndex].questions;
            const newQuestionNumber = currentQuestions.length + 1;
            
            updatedMap[mapIndex] = {
                ...updatedMap[mapIndex],
                questions: [...currentQuestions, {
                    question_number: newQuestionNumber,
                    question: '',
                    answer: '',
                    input_type: 'radio',
                    min_selection: 1,
                    max_selection: 1
                }]
            };
            return { ...prev, map: updatedMap };
        });
    };

    const removeQuestion = (mapIndex: number, questionIndex: number) => {
        setLocalGroup(prev => {
            const updatedMap = [...prev.map];
            const updatedQuestions = updatedMap[mapIndex].questions.filter((_, index) => index !== questionIndex);
            updatedMap[mapIndex] = {
                ...updatedMap[mapIndex],
                questions: updatedQuestions
            };
            return { ...prev, map: updatedMap };
        });
    };

    return (
        <div className="space-y-6" onBlur={handleBlur}>
            {localGroup.map.map((mapItem, mapIndex) => (
                <div key={mapIndex} className="bg-base-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium font-semibold">Map Section {mapIndex + 1}</h4>
                        <button
                            type="button"
                            onClick={() => removeMapItem(mapIndex)}
                            className="btn btn-error btn-sm"
                        >
                            Remove Map
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-black">Title</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered border-black"
                                value={mapItem.title}
                                onChange={e => handleMapItemChange(mapIndex, 'title', e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-black">Image URL</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered border-black"
                                value={mapItem.image}
                                onChange={e => handleMapItemChange(mapIndex, 'image', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-control mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="label">
                                <span className="label-text font-semibold text-black">Labels</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => addLabel(mapIndex)}
                                className="btn btn-primary btn-sm"
                            >
                                Add Label
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {mapItem.labels.map((label, labelIndex) => (
                                <div key={label} className="flex items-center gap-2 bg-base-200 px-3 py-1 rounded">
                                    <span>{label}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeLabel(mapIndex, labelIndex)}
                                        className="btn btn-ghost btn-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h5 className="font-medium font-semibold">Questions</h5>
                            <button
                                type="button"
                                onClick={() => addQuestion(mapIndex)}
                                className="btn btn-primary btn-sm"
                            >
                                Add Question
                            </button>
                        </div>

                        {mapItem.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="bg-base-200 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h6 className="font-medium font-semibold">Question {question.question_number}</h6>
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(mapIndex, questionIndex)}
                                        className="btn btn-error btn-sm"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-black">Question</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered border-black"
                                            value={question.question}
                                            onChange={e => handleQuestionChange(mapIndex, questionIndex, 'question', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-black">Answer</span>
                                        </label>
                                        <select
                                            className="select select-bordered border-black"
                                            value={question.answer}
                                            onChange={e => handleQuestionChange(mapIndex, questionIndex, 'answer', e.target.value)}
                                        >
                                            <option value="">Select Answer</option>
                                            {mapItem.labels.map(label => (
                                                <option key={label} value={label}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addMapItem}
                className="btn btn-primary"
            >
                Add Map Section
            </button>
        </div>
    );
};

export default MapGroupForm;