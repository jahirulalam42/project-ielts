import { useState } from 'react';
import { MapGroup, MapItem } from './listeningTest';

const MapGroupForm = ({
    group,
    updateGroup
}: {
    group: MapGroup;
    updateGroup: (group: MapGroup) => void;
}) => {
    const [localGroup, setLocalGroup] = useState<MapGroup>(group);

    const addMap = () => {
        const newMap: MapItem = {
            title: '',
            image: '',
            labels: ['A', 'B', 'C'],
            questions: []
        };

        setLocalGroup(prev => ({
            ...prev,
            content: [...prev.content, newMap]
        }));
    };

    const updateMap = (index: number, field: keyof MapItem, value: any) => {
        const updatedContent = [...localGroup.content];
        updatedContent[index] = { ...updatedContent[index], [field]: value };
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const addQuestion = (mapIndex: number) => {
        const updatedContent = [...localGroup.content];
        const questions = updatedContent[mapIndex].questions;

        const newQuestion = {
            question_number: questions.length + 1,
            question: '',
            answer: '',
            input_type: 'radio',
            min_selection: 1,
            max_selection: 1
        };

        updatedContent[mapIndex].questions = [...questions, newQuestion];
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const updateQuestion = (mapIndex: number, qIndex: number, field: string, value: any) => {
        const updatedContent = [...localGroup.content];
        const updatedQuestions = [...updatedContent[mapIndex].questions];
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
        updatedContent[mapIndex].questions = updatedQuestions;
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const removeQuestion = (mapIndex: number, qIndex: number) => {
        const updatedContent = [...localGroup.content];
        updatedContent[mapIndex].questions = updatedContent[mapIndex].questions.filter(
            (_, i) => i !== qIndex
        );
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const removeMap = (index: number) => {
        setLocalGroup(prev => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index)
        }));
    };

    // Save changes when leaving
    const handleBlur = () => {
        updateGroup(localGroup);
    };

    return (
        <div className="space-y-6" onBlur={handleBlur}>
            {localGroup.content.map((mapItem, mapIndex) => (
                <div key={mapIndex} className="bg-base-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Map Section {mapIndex + 1}</h4>
                        <button
                            type="button"
                            onClick={() => removeMap(mapIndex)}
                            className="btn btn-error btn-xs"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={mapItem.title}
                                onChange={e => updateMap(mapIndex, 'title', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Image URL</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={mapItem.image}
                                onChange={e => updateMap(mapIndex, 'image', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Labels (comma separated)</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={mapItem.labels.join(', ')}
                            onChange={e => updateMap(mapIndex, 'labels', e.target.value.split(',').map(l => l.trim()))}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Questions</span>
                        </label>
                        <div className="space-y-3">
                            {mapItem.questions.map((q, qIndex) => (
                                <div key={qIndex} className="bg-base-200 p-3 rounded">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Q{q.question_number}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(mapIndex, qIndex)}
                                            className="btn btn-error btn-xs"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Question Text</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input input-bordered"
                                                value={q.question}
                                                onChange={e => updateQuestion(mapIndex, qIndex, 'question', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Correct Answer</span>
                                            </label>
                                            <select
                                                className="select select-bordered"
                                                value={q.answer}
                                                onChange={e => updateQuestion(mapIndex, qIndex, 'answer', e.target.value)}
                                                required
                                            >
                                                <option value="">Select correct label</option>
                                                {mapItem.labels.map((label, labelIndex) => (
                                                    <option key={labelIndex} value={label}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addQuestion(mapIndex)}
                                className="btn btn-xs mt-2"
                            >
                                Add Question
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addMap}
                className="btn btn-sm"
            >
                Add Map Section
            </button>
        </div>
    );
};

export default MapGroupForm;