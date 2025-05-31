import { useState } from 'react';
import { MCQGroup, MCQItem } from './listeningTest';

const MCQGroupForm = ({
    group,
    updateGroup
}: {
    group: MCQGroup;
    updateGroup: (group: MCQGroup) => void;
}) => {
    const [localGroup, setLocalGroup] = useState<MCQGroup>(group);

    const addQuestion = () => {
        const newQuestion: MCQItem = {
            question_number: localGroup.content.length + 1,
            question: '',
            answer: '',
            options: [{ label: 'A', value: '' }],
            input_type: 'radio',
            min_selection: 1,
            max_selection: 1
        };

        setLocalGroup(prev => ({
            ...prev,
            content: [...prev.content, newQuestion]
        }));
    };

    const updateQuestion = (index: number, field: keyof MCQItem, value: any) => {
        const updatedContent = [...localGroup.content];
        updatedContent[index] = { ...updatedContent[index], [field]: value };
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const updateOption = (qIndex: number, optIndex: number, value: string) => {
        const updatedContent = [...localGroup.content];
        const updatedOptions = [...updatedContent[qIndex].options];
        updatedOptions[optIndex] = { ...updatedOptions[optIndex], value };
        updatedContent[qIndex].options = updatedOptions;
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const addOption = (qIndex: number) => {
        const updatedContent = [...localGroup.content];
        const options = updatedContent[qIndex].options;
        const newLabel = String.fromCharCode(65 + options.length); // A, B, C, ...

        updatedContent[qIndex].options = [
            ...options,
            { label: newLabel, value: '' }
        ];

        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const removeOption = (qIndex: number, optIndex: number) => {
        const updatedContent = [...localGroup.content];
        updatedContent[qIndex].options = updatedContent[qIndex].options.filter(
            (_, i) => i !== optIndex
        );
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const removeQuestion = (index: number) => {
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
            {localGroup.content.map((question, qIndex) => (
                <div key={qIndex} className="bg-base-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Question {question.question_number}</h4>
                        <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="btn btn-error btn-xs"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Question Text</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={question.question}
                            onChange={e => updateQuestion(qIndex, 'question', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Correct Answer</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={question.answer}
                            onChange={e => updateQuestion(qIndex, 'answer', e.target.value)}
                            required
                        >
                            <option value="">Select correct option</option>
                            {question.options.map((opt, optIndex) => (
                                <option key={optIndex} value={opt.label}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Options</span>
                        </label>
                        <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                    <span className="font-medium w-6">{option.label}:</span>
                                    <input
                                        type="text"
                                        className="input input-bordered flex-1"
                                        value={option.value}
                                        onChange={e => updateOption(qIndex, optIndex, e.target.value)}
                                        required
                                    />
                                    {question.options.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(qIndex, optIndex)}
                                            className="btn btn-error btn-xs"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="btn btn-xs mt-2"
                            >
                                Add Option
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addQuestion}
                className="btn btn-sm"
            >
                Add Question
            </button>
        </div>
    );
};

export default MCQGroupForm;