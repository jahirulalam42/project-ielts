import { FillBlanksGroup } from './listeningTest';
import { useState } from 'react';

const FillBlanksGroupForm = ({
    group,
    updateGroup
}: {
    group: FillBlanksGroup;
    updateGroup: (group: FillBlanksGroup) => void;
}) => {
    const [localGroup, setLocalGroup] = useState<FillBlanksGroup>(group);

    const addSection = () => {
        setLocalGroup(prev => ({
            ...prev,
            content: [
                ...prev.content,
                { title: '', subtitle: '', extra: [''], questions: [] }
            ]
        }));
    };

    const updateSection = (index: number, field: keyof typeof localGroup.content[0], value: string) => {
        const updatedContent = [...localGroup.content];
        updatedContent[index] = { ...updatedContent[index], [field]: value };
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const updateExtraLine = (sectionIndex: number, lineIndex: number, value: string) => {
        const updatedContent = [...localGroup.content];
        const updatedExtra = [...updatedContent[sectionIndex].extra];
        updatedExtra[lineIndex] = value;
        updatedContent[sectionIndex] = {
            ...updatedContent[sectionIndex],
            extra: updatedExtra
        };
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const addExtraLine = (sectionIndex: number) => {
        const updatedContent = [...localGroup.content];
        updatedContent[sectionIndex].extra.push('');
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const addQuestion = (sectionIndex: number) => {
        const updatedContent = [...localGroup.content];
        const questions = updatedContent[sectionIndex].questions;
        const newQuestion = {
            question_number: questions.length + 1,
            answer: '',
            input_type: 'text'
        };
        updatedContent[sectionIndex].questions.push(newQuestion);
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    const updateQuestion = (sectionIndex: number, qIndex: number, field: string, value: string) => {
        const updatedContent = [...localGroup.content];
        const updatedQuestions = [...updatedContent[sectionIndex].questions];
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
        updatedContent[sectionIndex].questions = updatedQuestions;
        setLocalGroup({ ...localGroup, content: updatedContent });
    };

    // Save changes when leaving
    const handleBlur = () => {
        updateGroup(localGroup);
    };

    return (
        <div className="border rounded-lg p-4 bg-base-200" onBlur={handleBlur}>
            <div className="space-y-6">
                {localGroup.content.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="bg-base-100 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={section.title || ''}
                                    onChange={e => updateSection(sectionIndex, 'title', e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Subtitle</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={section.subtitle || ''}
                                    onChange={e => updateSection(sectionIndex, 'subtitle', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Content Lines</span>
                            </label>
                            <div className="space-y-2">
                                {section.extra.map((line, lineIndex) => (
                                    <input
                                        key={lineIndex}
                                        type="text"
                                        className="input input-bordered input-sm"
                                        value={line}
                                        onChange={e => updateExtraLine(sectionIndex, lineIndex, e.target.value)}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addExtraLine(sectionIndex)}
                                    className="btn btn-xs mt-2"
                                >
                                    Add Line
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Questions</span>
                            </label>
                            <div className="space-y-3">
                                {section.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="flex items-center gap-2">
                                        <span className="font-medium">Q{q.question_number}:</span>
                                        <input
                                            type="text"
                                            className="input input-bordered input-sm flex-1"
                                            placeholder="Answer"
                                            value={q.answer}
                                            onChange={e => updateQuestion(sectionIndex, qIndex, 'answer', e.target.value)}
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addQuestion(sectionIndex)}
                                    className="btn btn-xs mt-2"
                                >
                                    Add Question
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addSection}
                className="btn btn-sm mt-4"
            >
                Add New Section
            </button>
        </div>
    );
};

export default FillBlanksGroupForm;