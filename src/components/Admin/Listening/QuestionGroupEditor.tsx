import { QuestionGroup, FillBlanksGroup, MCQGroup, MapGroup } from './listeningTest';
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

    const renderForm = () => {
        switch (group.type) {
            case 'fill_in_the_blanks_with_subtitle':
                return (
                    <FillBlanksGroupForm
                        group={group as FillBlanksGroup}
                        updateGroup={handleGroupUpdate}
                    />
                );
            case 'mcq':
                return (
                    <MCQGroupForm
                        group={group as MCQGroup}
                        updateGroup={handleGroupUpdate}
                    />
                );
            case 'map':
                return (
                    <MapGroupForm
                        group={group as MapGroup}
                        updateGroup={handleGroupUpdate}
                    />
                );
            default:
                return <div>Unsupported question type</div>;
        }
    };

    return (
        <div className="card bg-base-200 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                    {group.type === 'fill_in_the_blanks_with_subtitle' && 'Fill in the Blanks'}
                    {group.type === 'mcq' && 'Multiple Choice Questions'}
                    {group.type === 'map' && 'Map Questions'}
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