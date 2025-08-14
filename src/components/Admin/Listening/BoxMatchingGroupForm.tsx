import React, { useState } from 'react';
import { BoxMatchingGroup, BoxMatchingItem } from './listeningTest';

interface BoxMatchingGroupFormProps {
    questions: BoxMatchingItem[];
    onUpdate: (questions: BoxMatchingItem[]) => void;
}

const BoxMatchingGroupForm = ({ questions, onUpdate }: BoxMatchingGroupFormProps) => {
    const [localQuestions, setLocalQuestions] = useState<BoxMatchingItem[]>(questions);

    const updateQuestion = (index: number, updatedQuestion: BoxMatchingItem) => {
        const newQuestions = [...localQuestions];
        newQuestions[index] = updatedQuestion;
        setLocalQuestions(newQuestions);
        onUpdate(newQuestions);
    };

    const addQuestion = () => {
        const newQuestion: BoxMatchingItem = {
            instructions: '',
            options_title: '',
            question_title: '',
            options: [
                { label: 'A', value: '' },
                { label: 'B', value: '' },
                { label: 'C', value: '' },
                { label: 'D', value: '' },
                { label: 'E', value: '' },
                { label: 'F', value: '' },
                { label: 'G', value: '' },
                { label: 'H', value: '' }
            ],
            questions: [
                { question_number: 1, topic: '', answer: '' },
                { question_number: 2, topic: '', answer: '' },
                { question_number: 3, topic: '', answer: '' },
                { question_number: 4, topic: '', answer: '' },
                { question_number: 5, topic: '', answer: '' },
                { question_number: 6, topic: '', answer: '' }
            ]
        };
        const newQuestions = [...localQuestions, newQuestion];
        setLocalQuestions(newQuestions);
        onUpdate(newQuestions);
    };

    const removeQuestion = (index: number) => {
        const newQuestions = localQuestions.filter((_, i) => i !== index);
        setLocalQuestions(newQuestions);
        onUpdate(newQuestions);
    };

    const updateQuestionField = (index: number, field: keyof BoxMatchingItem, value: any) => {
        const updatedQuestion = { ...localQuestions[index], [field]: value };
        updateQuestion(index, updatedQuestion);
    };

    const updateOption = (questionIndex: number, optionIndex: number, field: 'label' | 'value', value: string) => {
        const updatedQuestion = { ...localQuestions[questionIndex] };
        updatedQuestion.options[optionIndex] = {
            ...updatedQuestion.options[optionIndex],
            [field]: value
        };
        updateQuestion(questionIndex, updatedQuestion);
    };

    const addOption = (questionIndex: number) => {
        const updatedQuestion = { ...localQuestions[questionIndex] };
        const newLabel = String.fromCharCode(65 + updatedQuestion.options.length);
        updatedQuestion.options.push({ label: newLabel, value: '' });
        updateQuestion(questionIndex, updatedQuestion);
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const updatedQuestion = { ...localQuestions[questionIndex] };
        updatedQuestion.options.splice(optionIndex, 1);
        updatedQuestion.options.forEach((option, index) => {
            option.label = String.fromCharCode(65 + index);
        });
        updateQuestion(questionIndex, updatedQuestion);
    };

    const updateBoxQuestion = (questionIndex: number, boxQuestionIndex: number, field: 'question_number' | 'topic' | 'answer', value: string | number) => {
        const updatedQuestion = { ...localQuestions[questionIndex] };
        updatedQuestion.questions[boxQuestionIndex] = {
            ...updatedQuestion.questions[boxQuestionIndex],
            [field]: value
        };
        updateQuestion(questionIndex, updatedQuestion);
    };

    const addBoxQuestion = (questionIndex: number) => {
        const updatedQuestion = { ...localQuestions[questionIndex] };
        const nextNumber = updatedQuestion.questions.length + 1;
        updatedQuestion.questions.push({
            question_number: nextNumber,
            topic: '',
            answer: ''
        });
        updateQuestion(questionIndex, updatedQuestion);
    };

    const removeBoxQuestion = (questionIndex: number, boxQuestionIndex: number) => {
        const updatedQuestion = { ...localQuestions[questionIndex] };
        updatedQuestion.questions.splice(boxQuestionIndex, 1);
        updatedQuestion.questions.forEach((q, index) => {
            q.question_number = index + 1;
        });
        updateQuestion(questionIndex, updatedQuestion);
    };

    return (
        <div className="space-y-6">
            {localQuestions.map((question, questionIndex) => (
                <div key={questionIndex} className="card bg-base-100 p-4 border">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium">Box Matching Question {questionIndex + 1}</h4>
                        <button
                            type="button"
                            onClick={() => removeQuestion(questionIndex)}
                            className="btn btn-error btn-sm"
                        >
                            Remove Question
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Instructions</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered"
                                value={question.instructions}
                                onChange={(e) => updateQuestionField(questionIndex, 'instructions', e.target.value)}
                                placeholder="Enter the instructions for the box matching question..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Options Title</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={question.options_title || ''}
                                    onChange={(e) => updateQuestionField(questionIndex, 'options_title', e.target.value)}
                                    placeholder="e.g., Opinions, Features, etc."
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Question Title</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={question.question_title || ''}
                                    onChange={(e) => updateQuestionField(questionIndex, 'question_title', e.target.value)}
                                    placeholder="e.g., Food trends, Locations, etc."
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Box Options</span>
                            </label>
                            <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex gap-2 items-center">
                                        <span className="font-medium w-8">{option.label}</span>
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1"
                                            value={option.value}
                                            onChange={(e) => updateOption(questionIndex, optionIndex, 'value', e.target.value)}
                                            placeholder={`Option ${option.label}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOption(questionIndex, optionIndex)}
                                            className="btn btn-error btn-sm"
                                            disabled={question.options.length <= 2}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addOption(questionIndex)}
                                    className="btn btn-outline btn-sm"
                                >
                                    Add Option
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Questions to Match</span>
                            </label>
                            <div className="space-y-2">
                                {question.questions.map((boxQuestion, boxQuestionIndex) => (
                                    <div key={boxQuestionIndex} className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            className="input input-bordered w-20"
                                            value={boxQuestion.question_number}
                                            onChange={(e) => updateBoxQuestion(questionIndex, boxQuestionIndex, 'question_number', parseInt(e.target.value))}
                                        />
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1"
                                            value={boxQuestion.topic}
                                            onChange={(e) => updateBoxQuestion(questionIndex, boxQuestionIndex, 'topic', e.target.value)}
                                            placeholder="Topic/question text"
                                        />
                                        <select
                                            className="select select-bordered"
                                            value={boxQuestion.answer}
                                            onChange={(e) => updateBoxQuestion(questionIndex, boxQuestionIndex, 'answer', e.target.value)}
                                        >
                                            <option value="">Select answer</option>
                                            {question.options.map((option) => (
                                                <option key={option.label} value={option.label}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeBoxQuestion(questionIndex, boxQuestionIndex)}
                                            className="btn btn-error btn-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addBoxQuestion(questionIndex)}
                                    className="btn btn-outline btn-sm"
                                >
                                    Add Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addQuestion}
                className="btn btn-primary"
            >
                Add Box Matching Question
            </button>
        </div>
    );
};

export default BoxMatchingGroupForm;
