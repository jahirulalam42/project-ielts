import { TestPart, QuestionGroup } from './listeningTest';
import QuestionGroupEditor from './QuestionGroupEditor';

interface PartFormProps {
    part: TestPart;
    partIndex: number;
    updatePart: (index: number, part: TestPart) => void;
    removePart: (index: number) => void;
    isLast: boolean;
}

const PartForm = ({ part, partIndex, updatePart, removePart, isLast }: PartFormProps) => {
    // Helper function to get total question count across all question groups
    const getTotalQuestionCount = () => {
        return part.questions.reduce((total, group) => {
            if ('fill_in_the_blanks_with_subtitle' in group) {
                return total + group.fill_in_the_blanks_with_subtitle.reduce((sectionTotal, section) => {
                    return sectionTotal + section.questions.length;
                }, 0);
            } else if ('mcq' in group) {
                return total + group.mcq.length;
            } else if ('map' in group) {
                return total + group.map.reduce((mapTotal, mapItem) => {
                    return mapTotal + mapItem.questions.length;
                }, 0);
            }
            return total;
        }, 0);
    };

    // Helper function to renumber all questions globally across all question groups
    const renumberAllQuestions = (questions: QuestionGroup[]) => {
        let globalQuestionNumber = 1;
        
        return questions.map(group => {
            if ('fill_in_the_blanks_with_subtitle' in group) {
                return {
                    ...group,
                    fill_in_the_blanks_with_subtitle: group.fill_in_the_blanks_with_subtitle.map(section => ({
                        ...section,
                        questions: section.questions.map(question => ({
                            ...question,
                            question_number: globalQuestionNumber++
                        }))
                    }))
                };
            } else if ('mcq' in group) {
                return {
                    ...group,
                    mcq: group.mcq.map(question => ({
                        ...question,
                        question_number: globalQuestionNumber++
                    }))
                };
            } else if ('map' in group) {
                return {
                    ...group,
                    map: group.map.map(mapItem => ({
                        ...mapItem,
                        questions: mapItem.questions.map(question => ({
                            ...question,
                            question_number: globalQuestionNumber++
                        }))
                    }))
                };
            }
            return group;
        });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updatePart(partIndex, { ...part, title: e.target.value });
    };

    const addQuestionGroup = (type: 'fill' | 'mcq' | 'map') => {
        const nextQuestionNumber = getTotalQuestionCount() + 1;
        let newGroup;

        switch (type) {
            case 'fill':
                newGroup = {
                    fill_in_the_blanks_with_subtitle: [{
                        title: '',
                        subtitle: '',
                        extra: [],
                        questions: []
                    }]
                };
                break;
            case 'mcq':
                newGroup = {
                    mcq: [{
                        question_number: nextQuestionNumber,
                        question: '',
                        answer: '',
                        options: [
                            { label: 'A', value: '' },
                            { label: 'B', value: '' },
                            { label: 'C', value: '' }
                        ],
                        input_type: 'radio',
                        min_selection: 1,
                        max_selection: 1
                    }]
                };
                break;
            case 'map':
                newGroup = {
                    map: [{
                        title: '',
                        image: '',
                        labels: ['A', 'B', 'C'],
                        questions: []
                    }]
                };
                break;
            default:
                return;
        }

        updatePart(partIndex, {
            ...part,
            questions: [...part.questions, newGroup]
        });
    };

    const updateQuestionGroup = (index: number, group: QuestionGroup) => {
        const updatedQuestions = [...part.questions];
        updatedQuestions[index] = group;
        
        // Renumber all questions globally after any update
        const renumberedQuestions = renumberAllQuestions(updatedQuestions);
        updatePart(partIndex, { ...part, questions: renumberedQuestions });
    };

    const removeQuestionGroup = (index: number) => {
        const updatedQuestions = part.questions.filter((_, i) => i !== index);
        
        // Renumber all questions globally after removal
        const renumberedQuestions = renumberAllQuestions(updatedQuestions);
        updatePart(partIndex, { ...part, questions: renumberedQuestions });
    };

    return (
        <div className="card bg-base-100 shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Part {partIndex + 1}</h2>
                {!isLast && (
                    <button
                        type="button"
                        onClick={() => removePart(partIndex)}
                        className="btn btn-error btn-sm"
                    >
                        Remove Part
                    </button>
                )}
            </div>

            <div className="form-control mb-6">
                <label className="label">
                    <span className="label-text text-black">Part Title</span>
                </label>
                <input
                    type="text"
                    className="input input-bordered border-black"
                    value={part.title}
                    onChange={handleTitleChange}
                    required
                />
            </div>

            <div className="space-y-8">
                {part.questions.map((group, groupIndex) => (
                    <QuestionGroupEditor
                        key={groupIndex}
                        group={group}
                        groupIndex={groupIndex}
                        updateGroup={updateQuestionGroup}
                        removeGroup={removeQuestionGroup}
                    />
                ))}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={() => addQuestionGroup('fill')}
                    className="btn btn-outline"
                >
                    Add Fill-in-Blanks
                </button>
                <button
                    type="button"
                    onClick={() => addQuestionGroup('mcq')}
                    className="btn btn-outline"
                >
                    Add MCQ
                </button>
                <button
                    type="button"
                    onClick={() => addQuestionGroup('map')}
                    className="btn btn-outline"
                >
                    Add Map Questions
                </button>
            </div>
        </div>
    );
};

export default PartForm;