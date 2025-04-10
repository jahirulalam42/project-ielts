'use client'
import React, { useState } from 'react';

// Define types for the test structure
interface Option {
    label: string;
    value: string;
}

interface Blank {
    blank_number: number;
    input_type: string;
    answer: string;
}

interface Question {
    question_number?: number;
    question_numbers?: number[];
    question: string;
    answer?: string | string[];
    options?: Option[];
    input_type: string;
    min_selection?: number;
    max_selection?: number;
    correct_mapping?: Record<string, string>;
    instruction?: string;
    text?: string;
    blanks?: Blank[];
    passage?: string;
    answers?: Record<string, string>;
}

interface Passage {
    title: string;
    instructions: string;
    passage_title: string;
    passage_subtitle: string;
    passage: string[];
    image: string;
    questions: Record<string, Question[]>[];
}

interface Test {
    title: string;
    type: 'academic' | 'general';
    duration: number;
    parts: Passage[];
}

const questionTypes = [
    'true_false_not_given',
    'fill_in_the_blanks',
    'matching_headings',
    'paragraph_matching',
    'multiple_mcq',
    'passage_fill_in_the_blanks',
    'mcq',
    'summary_fill_in_the_blanks',
    'fill_in_the_blanks_with_subtitle',
];

const TestCreationPage: React.FC = () => {
    const [test, setTest] = useState<Test>({
        title: '',
        type: 'academic',
        duration: 60,
        parts: [],
    });
    const [currentPassageIndex, setCurrentPassageIndex] = useState<number | null>(null);
    const [currentQuestionType, setCurrentQuestionType] = useState<string>('');
    const [questionCount, setQuestionCount] = useState<number>(1);

    const addPassage = () => {
        setTest({
            ...test,
            parts: [
                ...test.parts,
                {
                    title: '',
                    instructions: '',
                    passage_title: '',
                    passage_subtitle: '',
                    passage: [],
                    image: '',
                    questions: [],
                },
            ],
        });
        setCurrentPassageIndex(test.parts.length);
    };

    const addParagraph = (passageIndex: number) => {
        const updatedParts = [...test.parts];
        updatedParts[passageIndex].passage.push('');
        setTest({ ...test, parts: updatedParts });
    };

    const updatePassageField = (passageIndex: number, field: keyof Passage, value: string) => {
        const updatedParts = [...test.parts];
        if (field === 'title' || field === 'instructions' || field === 'passage_title' || field === 'passage_subtitle' || field === 'image') {
            updatedParts[passageIndex][field] = value;
        } else if (field === 'passage') {
            updatedParts[passageIndex][field] = value.split('\n'); // Assuming passage is split by newlines
        }
        setTest({ ...test, parts: updatedParts });
    };

    const updateParagraph = (passageIndex: number, paraIndex: number, value: string) => {
        const updatedParts = [...test.parts];
        updatedParts[passageIndex].passage[paraIndex] = value;
        setTest({ ...test, parts: updatedParts });
    };

    const addQuestionGroup = (passageIndex: number) => {
        if (!currentQuestionType || questionCount < 1) return;
        const updatedParts = [...test.parts];
        const newQuestions: Question[] = [];

        if (currentQuestionType === 'passage_fill_in_the_blanks') {
            newQuestions.push({
                instruction: '',
                text: '',
                blanks: Array(questionCount).fill(null).map((_, i) => ({
                    blank_number: i + 1,
                    input_type: 'text',
                    answer: '',
                })),
                input_type: 'text',
                question: ''
            });
        } else if (currentQuestionType === 'summary_fill_in_the_blanks') {
            newQuestions.push({
                question_numbers: Array(questionCount).fill(null).map((_, i) => i + 1),
                passage: '',
                answers: {},
                options: [],
                input_type: 'drag_and_drop',
                question: ''
            });
        } else if (currentQuestionType === 'fill_in_the_blanks_with_subtitle') {
            newQuestions.push({
                question: '',
                input_type: 'text',
                blanks: [],
            });
        } else {
            for (let i = 0; i < questionCount; i++) {
                let question: Question;
                if (currentQuestionType === 'true_false_not_given') {
                    question = { question_number: i + 1, question: '', answer: 'True', input_type: 'dropdown' };
                } else if (currentQuestionType === 'fill_in_the_blanks') {
                    question = { question_number: i + 1, question: '', answer: '', input_type: 'text' };
                } else if (currentQuestionType === 'matching_headings' || currentQuestionType === 'paragraph_matching') {
                    question = {
                        question_number: i + 1,
                        question: '',
                        answer: '',
                        options: updatedParts[passageIndex].passage.map((_, idx) => ({ label: String.fromCharCode(65 + idx), value: String.fromCharCode(65 + idx) })),
                        input_type: 'dropdown',
                    };
                } else if (currentQuestionType === 'multiple_mcq') {
                    question = {
                        question_numbers: [i + 1],
                        question: '',
                        options: [],
                        input_type: 'checkbox',
                        min_selection: 2,
                        max_selection: 2,
                        correct_mapping: {},
                    };
                } else if (currentQuestionType === 'mcq') {
                    question = {
                        question_number: i + 1,
                        question: '',
                        answer: [],
                        options: [],
                        input_type: 'radio',
                        min_selection: 1,
                        max_selection: 1,
                    };
                } else {
                    continue;
                }
                newQuestions.push(question);
            }
        }

        updatedParts[passageIndex].questions.push({ [currentQuestionType]: newQuestions });
        setTest({ ...test, parts: updatedParts });
        setCurrentQuestionType('');
        setQuestionCount(1);
    };

    const renderQuestionInput = (questionType: string, questions: Question[], passageIndex: number, groupIndex: number) => {
        const updateQuestion = (field: string, value: any, qIndex: number) => {
            const updatedParts = [...test.parts];
            updatedParts[passageIndex].questions[groupIndex][questionType][qIndex][field as keyof Question] = value;
            setTest({ ...test, parts: updatedParts });
        };

        switch (questionType) {
            case 'true_false_not_given':
                return questions.map((q, idx) => (
                    <div key={idx} className="mb-2">
                        <input
                            type="text"
                            placeholder="Question"
                            value={q.question}
                            onChange={(e) => updateQuestion('question', e.target.value, idx)}
                            className="border p-2 mr-2"
                        />
                        <select
                            value={q.answer as string}
                            onChange={(e) => updateQuestion('answer', e.target.value, idx)}
                            className="border p-2"
                        >
                            <option>True</option>
                            <option>False</option>
                            <option>Not Given</option>
                        </select>
                    </div>
                ));
            case 'fill_in_the_blanks':
                return questions.map((q, idx) => (
                    <div key={idx} className="mb-2">
                        <input
                            type="text"
                            placeholder="Question with blank (e.g., The ___ is red)"
                            value={q.question}
                            onChange={(e) => updateQuestion('question', e.target.value, idx)}
                            className="border p-2 mr-2"
                        />
                        <input
                            type="text"
                            placeholder="Answer"
                            value={q.answer as string}
                            onChange={(e) => updateQuestion('answer', e.target.value, idx)}
                            className="border p-2"
                        />
                    </div>
                ));
            case 'matching_headings':
            case 'paragraph_matching':
                return questions.map((q, idx) => (
                    <div key={idx} className="mb-2">
                        <input
                            type="text"
                            placeholder="Heading/Statement"
                            value={q.question}
                            onChange={(e) => updateQuestion('question', e.target.value, idx)}
                            className="border p-2 mr-2"
                        />
                        <select
                            value={q.answer as string}
                            onChange={(e) => updateQuestion('answer', e.target.value, idx)}
                            className="border p-2"
                        >
                            {q.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                ));
            case 'multiple_mcq':
                return questions.map((q, idx) => (
                    <div key={idx} className="mb-2">
                        <input
                            type="text"
                            placeholder="Question"
                            value={q.question}
                            onChange={(e) => updateQuestion('question', e.target.value, idx)}
                            className="border p-2 mb-2"
                        />
                        {/* Add options and correct_mapping inputs as needed */}
                    </div>
                ));
            case 'mcq':
                return questions.map((q, idx) => (
                    <div key={idx} className="mb-2">
                        <input
                            type="text"
                            placeholder="Question"
                            value={q.question}
                            onChange={(e) => updateQuestion('question', e.target.value, idx)}
                            className="border p-2 mb-2"
                        />
                        {/* Add options and answer inputs as needed */}
                    </div>
                ));
            case 'passage_fill_in_the_blanks':
                return questions.map((q, idx) => (
                    <div key={idx} className="mb-2">
                        <input
                            type="text"
                            placeholder="Instruction"
                            value={q.instruction || ''}
                            onChange={(e) => updateQuestion('instruction', e.target.value, idx)}
                            className="border p-2 mb-2 w-full"
                        />
                        <textarea
                            placeholder="Text with blanks (e.g., The {blank_number: 1} is red)"
                            value={q.text || ''}
                            onChange={(e) => updateQuestion('text', e.target.value, idx)}
                            className="border p-2 mb-2 w-full"
                        />
                        {q.blanks?.map((blank, bIdx) => (
                            <input
                                key={bIdx}
                                type="text"
                                placeholder={`Answer for blank ${blank.blank_number}`}
                                value={blank.answer}
                                onChange={(e) => {
                                    const updatedParts = [...test.parts];
                                    updatedParts[passageIndex].questions[groupIndex][questionType][idx].blanks![bIdx].answer = e.target.value;
                                    setTest({ ...test, parts: updatedParts });
                                }}
                                className="border p-2 mr-2"
                            />
                        ))}
                    </div>
                ));
            case 'summary_fill_in_the_blanks':
                return questions.map((q, idx) => (
                    <div key={idx} className="mb-2">
                        <textarea
                            placeholder="Passage with blanks (e.g., The {31} is red)"
                            value={q.passage || ''}
                            onChange={(e) => updateQuestion('passage', e.target.value, idx)}
                            className="border p-2 mb-2 w-full"
                        />
                        {/* Add answers and options inputs as needed */}
                    </div>
                ));
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create IELTS Test</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Test Title"
                    value={test.title}
                    onChange={(e) => setTest({ ...test, title: e.target.value })}
                    className="border p-2 mr-2"
                />
                <select
                    value={test.type}
                    onChange={(e) => setTest({ ...test, type: e.target.value as 'academic' | 'general' })}
                    className="border p-2 mr-2"
                >
                    <option value="academic">Academic</option>
                    <option value="general">General</option>
                </select>
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={test.duration}
                    onChange={(e) => setTest({ ...test, duration: parseInt(e.target.value) })}
                    className="border p-2"
                />
            </div>
            <button onClick={addPassage} className="bg-blue-500 text-white p-2 rounded mb-4 mx-2">Add Passage</button>
            {test.parts.map((passage, passageIndex) => (
                <div key={passageIndex} className="border p-4 mb-4">
                    <h2 className="text-xl font-semibold">Passage {passageIndex + 1}</h2>
                    <input
                        type="text"
                        placeholder="Title (e.g., READING PASSAGE 1)"
                        value={passage.title}
                        onChange={(e) => updatePassageField(passageIndex, 'title', e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />
                    <textarea
                        placeholder="Instructions"
                        value={passage.instructions}
                        onChange={(e) => updatePassageField(passageIndex, 'instructions', e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Passage Title"
                        value={passage.passage_title}
                        onChange={(e) => updatePassageField(passageIndex, 'passage_title', e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Passage Subtitle"
                        value={passage.passage_subtitle}
                        onChange={(e) => updatePassageField(passageIndex, 'passage_subtitle', e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />
                    <div className="mb-2">
                        {passage.passage.map((para, paraIndex) => (
                            <textarea
                                key={paraIndex}
                                placeholder={`Paragraph ${String.fromCharCode(65 + paraIndex)}`}
                                value={para}
                                onChange={(e) => updateParagraph(passageIndex, paraIndex, e.target.value)}
                                className="border p-2 mb-2 w-full"
                            />
                        ))}
                        <button onClick={() => addParagraph(passageIndex)} className="bg-green-500 text-white p-2 rounded">Add Paragraph</button>
                    </div>
                    <div className="mb-2">
                        <select
                            value={currentQuestionType}
                            onChange={(e) => setCurrentQuestionType(e.target.value)}
                            className="border p-2 mr-2"
                        >
                            <option value="">Select Question Type</option>
                            {questionTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {currentQuestionType && currentQuestionType !== 'passage_fill_in_the_blanks' && currentQuestionType !== 'summary_fill_in_the_blanks' && (
                            <input
                                type="number"
                                min="1"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                className="border p-2 mr-2"
                            />
                        )}
                        <button onClick={() => addQuestionGroup(passageIndex)} className="bg-blue-500 text-white p-2 rounded">Add Questions</button>
                    </div>
                    {passage.questions.map((questionGroup, groupIndex) => {
                        const questionType = Object.keys(questionGroup)[0];
                        return (
                            <div key={groupIndex} className="border p-2 mb-2">
                                <h3 className="font-semibold">{questionType}</h3>
                                {renderQuestionInput(questionType, questionGroup[questionType], passageIndex, groupIndex)}
                            </div>
                        );
                    })}
                </div>
            ))}
            <button onClick={() => console.log(JSON.stringify(test, null, 2))} className="bg-purple-500 text-white p-2 rounded mx-2">Submit</button>
        </div>
    );
};

export default TestCreationPage;