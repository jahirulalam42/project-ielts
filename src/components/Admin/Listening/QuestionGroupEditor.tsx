import { QuestionGroup, FillBlanksGroup, MCQGroup, MapGroup, MCQItem } from './listeningTest';
import FillBlanksGroupForm from './FillBlanksGroupForm';
import MCQGroupForm from './MCQGroupForm';
import MapGroupForm from './MapGroupForm';

interface QuestionGroupEditorProps {
    group: QuestionGroup;
    groupIndex: number;
    updateGroup: (index: number, group: QuestionGroup) => void;
    removeGroup: (index: number) => void;
}

const QuestionGroupEditor = ({
    group,
    groupIndex,
    updateGroup,
    removeGroup
}: QuestionGroupEditorProps) => {
    const handleGroupUpdate = (updatedGroup: QuestionGroup) => {
        updateGroup(groupIndex, updatedGroup);
    };

    const handleMCQUpdate = (questions: MCQItem[]) => {
        // Format the MCQ questions to match listening.json structure exactly
        const updatedGroup = {
            mcq: questions
        };
        updateGroup(groupIndex, updatedGroup);
    };

    const renderForm = () => {
        if ('mcq' in group) {
            return (
                <MCQGroupForm
                    questions={group.mcq || []}
                    onUpdate={handleMCQUpdate}
                />
            );
        }
        
        if ('map' in group) {
            return (
                <MapGroupForm
                    group={group as MapGroup}
                    updateGroup={handleGroupUpdate}
                />
            );
        }

        if ('fill_in_the_blanks_with_subtitle' in group) {
            return (
                <FillBlanksGroupForm
                    group={group as FillBlanksGroup}
                    updateGroup={handleGroupUpdate}
                />
            );
        }

        return <div>Unsupported question type</div>;
    };

    return (
        <div className="card bg-base-200 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                    {'mcq' in group && 'Multiple Choice Questions'}
                    {'map' in group && 'Map Questions'}
                    {'fill_in_the_blanks_with_subtitle' in group && 'Fill in the Blanks'}
                </h3>
                <button
                    type="button"
                    onClick={() => removeGroup(groupIndex)}
                    className="btn btn-error btn-sm"
                >
                    Remove
                </button>
            </div>

            {renderForm()}
        </div>
    );
};

export default QuestionGroupEditor;