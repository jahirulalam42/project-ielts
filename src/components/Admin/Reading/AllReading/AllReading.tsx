// components/Admin/Reading/AllReading/AllReading.tsx
import { deleteReadingTest, editReadingTest } from "@/services/data";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
// import { ReadingTest } from "@/types/reading"; // Define your types

const AllReading: React.FC<any> = ({ readingData, setReadingData }) => {
  const [selectedTest, setSelectedTest]: any = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedTest, setEditedTest] = useState<any>(null);

  const handleEdit = (test: any) => {
    setSelectedTest(test);
    // Initialize editedTest with a deep copy of the selected test
    setEditedTest(JSON.parse(JSON.stringify(test)));
    setShowEditModal(true);
  };

  const handleDelete = (test: any) => {
    setSelectedTest(test);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTest) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteReadingTest(selectedTest._id);

      // Update state to remove the deleted item
      setReadingData((prev: any) =>
        prev.filter((test: any) => test._id !== selectedTest._id)
      );

      toast.success("Reading test deleted successfully");

      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err instanceof Error ? err.message : "Delete operation failed");
      toast.error("Delete operation failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // const saveChanges = async () => {
  //   await editReadingTest(selectedTest._id, editedTest)
  //   console.log("Saving changes for:", selectedTest?._id);
  //   console.log('Edited Test', editedTest)
  //   setShowEditModal(false);
  // };

  const saveChanges = async () => {
    if (!editedTest) return;

    try {
      await editReadingTest(selectedTest._id, editedTest); // Use editedTest, not readingData

      console.log('Edited test', editedTest)

      // Update the readingData state with the edited test
      setReadingData((prev: any) =>
        prev.map((test: any) =>
          test._id === selectedTest._id ? editedTest : test
        )
      );

      toast.success("Reading test updated successfully");
      setShowEditModal(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update operation failed");
    }
  };

  const handleQuestionChange = (
    partIndex: number,
    groupIndex: number,
    qIndex: number,
    field: string,
    value: any
  ) => {
    setEditedTest((prev: any) => {
      // if (!prev) return null;

      // Create a deep copy of the test
      const newTest = JSON.parse(JSON.stringify(prev));

      // Get the question type key for this group
      const questionType = Object.keys(newTest.parts[partIndex].questions[groupIndex])[0];

      // Update the specific question field
      newTest.parts[partIndex].questions[groupIndex][questionType][qIndex][field] = value;

      return newTest;
    });
  };

  const handleTestFieldChange = (field, value) => {
    setEditedTest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePartFieldChange = (partIndex, field, value) => {
    setEditedTest(prev => {
      const newTest = { ...prev };
      newTest.parts = [...newTest.parts];
      newTest.parts[partIndex] = {
        ...newTest.parts[partIndex],
        [field]: value
      };
      return newTest;
    });
  };

  const handlePassageParagraphChange = (partIndex, paraIndex, value) => {
    setEditedTest(prev => {
      const newTest = { ...prev };
      newTest.parts = [...newTest.parts];
      newTest.parts[partIndex] = {
        ...newTest.parts[partIndex],
        passage: [...newTest.parts[partIndex].passage]
      };
      newTest.parts[partIndex].passage[paraIndex] = value;
      return newTest;
    });
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Reading Tests Manager
        </h1>
        <Link href={`/admin/reading`}>
          <button className="btn btn-primary">+ Add New Test</button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-4 px-6">Test Title</th>
              <th className="text-center py-4 px-6">Type</th>
              <th className="text-center py-4 px-6">Duration (min)</th>
              <th className="text-center py-4 px-6">Passages</th>
              <th className="text-center py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {readingData.map((test: any) => (
              <tr key={test._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{test.title}</td>
                <td className="text-center py-4 px-6">
                  <span className="badge badge-info">{test.type}</span>
                </td>
                <td className="text-center py-4 px-6">{test.duration}</td>
                <td className="text-center py-4 px-6">
                  <span className="badge badge-outline">
                    {test.parts.length} passages
                  </span>
                </td>
                <td className="text-center py-4 px-6">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(test)}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(test)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Delete
                    </button>
                    <button className="btn btn-sm btn-outline">Preview</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedTest && editedTest && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-2xl mb-4">Edit Reading Test</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Test Title</span>
                </label>
                <input
                  type="text"
                  value={editedTest.title || ''}  // ✅ Use editedTest and value
                  onChange={(e) => handleTestFieldChange('title', e.target.value)}  // ✅ Add onChange
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Duration (minutes)</span>
                </label>
                <input
                  type="number"
                  value={editedTest.duration || ''}  // ✅ Use editedTest
                  onChange={(e) => handleTestFieldChange('duration', parseInt(e.target.value))}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="label">
                <span className="label-text">Test Type</span>
              </label>
              <div className="flex space-x-4">
                <label className="cursor-pointer label">
                  <input
                    type="radio"
                    name="type"
                    checked={editedTest.type === "academic"}  // ✅ Use checked instead of defaultChecked
                    onChange={() => handleTestFieldChange('type', 'academic')}
                    className="radio radio-primary"
                  />
                  <span className="label-text ml-2">Academic</span>
                </label>
                <label className="cursor-pointer label">
                  <input
                    type="radio"
                    name="type"
                    checked={editedTest.type === "general"}  // ✅ Use checked
                    onChange={() => handleTestFieldChange('type', 'general')}
                    className="radio radio-primary"
                  />
                  <span className="label-text ml-2">General</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Passages</h4>
              <div className="space-y-4">
                {editedTest.parts.map((part, partIndex) => (  // ✅ Use editedTest.parts
                  <div
                    key={partIndex}
                    className="collapse collapse-arrow bg-base-200 border border-base-300"
                  >
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title font-medium">
                      Passage {partIndex + 1}: {part.passage_title || "Untitled"}
                    </div>
                    <div className="collapse-content pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Passage Title</span>
                          </label>
                          <input
                            type="text"
                            value={part.passage_title || ''}  // ✅ Use value
                            onChange={(e) => handlePartFieldChange(partIndex, 'passage_title', e.target.value)}
                            className="input input-bordered w-full"
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Passage Subtitle</span>
                          </label>
                          <input
                            type="text"
                            value={part.passage_subtitle || ''}
                            onChange={(e) => handlePartFieldChange(partIndex, 'passage_subtitle', e.target.value)}
                            className="input input-bordered w-full"
                          />
                        </div>
                      </div>

                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Instructions</span>
                        </label>
                        <textarea
                          value={part.instructions || ''}  // ✅ Use value
                          onChange={(e) => handlePartFieldChange(partIndex, 'instructions', e.target.value)}
                          className="textarea textarea-bordered h-24 w-full"
                        />
                      </div>

                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Passage Content</span>
                        </label>
                        <div className="space-y-2">
                          {part.passage.map((paragraph, paraIndex) => (
                            <div key={paraIndex} className="flex items-start gap-2">
                              <span className="badge badge-neutral mt-1">{paraIndex + 1}</span>
                              <textarea
                                value={paragraph || ''}  // ✅ Use value
                                onChange={(e) => handlePassageParagraphChange(partIndex, paraIndex, e.target.value)}
                                className="textarea textarea-bordered w-full h-32"
                              />
                            </div>
                          ))}
                        </div>
                        <button className="btn btn-sm btn-outline mt-2">
                          + Add Paragraph
                        </button>
                      </div>

                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Image URL</span>
                        </label>
                        <input
                          type="text"
                          value={part.image || ""}  // ✅ Use value
                          onChange={(e) => handlePartFieldChange(partIndex, 'image', e.target.value)}
                          className="input input-bordered w-full"
                          placeholder="https://example.com/image.png"
                        />
                      </div>

                      {/* Questions section remains the same as your existing handleQuestionChange already works */}
                      <div className="mt-6">
                        <h5 className="text-md font-semibold mb-3">Questions</h5>
                        <div className="space-y-4">
                          {part.questions.map((questionGroup, groupIndex) => {
                            const questionType = Object.keys(questionGroup)[0];
                            const questions = questionGroup[questionType];

                            return (
                              <div
                                key={groupIndex}
                                className="collapse collapse-arrow bg-base-100 border border-base-300"
                              >
                                <input type="checkbox" />
                                <div className="collapse-title font-medium">
                                  {formatQuestionType(questionType)} ({questions.length} questions)
                                </div>
                                <div className="collapse-content pt-4">
                                  <div className="space-y-6">
                                    {questions.map((question, qIndex) => (
                                      <div key={qIndex} className="border rounded-lg p-4 bg-base-100">
                                        <div className="flex justify-between items-start mb-3">
                                          <div className="badge badge-primary">
                                            Question {getQuestionNumber(question) || qIndex + 1}
                                          </div>
                                          <button className="btn btn-xs btn-error">Delete</button>
                                        </div>

                                        <div className="form-control mb-3">
                                          <label className="label">
                                            <span className="label-text">Question Text</span>
                                          </label>
                                          <textarea
                                            value={question.question || ""}  // ✅ Use value instead of defaultValue
                                            onChange={(e) => handleQuestionChange(partIndex, groupIndex, qIndex, 'question', e.target.value)}
                                            className="textarea textarea-bordered w-full"
                                          />
                                        </div>

                                        {renderQuestionFields(
                                          questionType,
                                          question,
                                          partIndex,
                                          groupIndex,
                                          qIndex,
                                          handleQuestionChange
                                        )}
                                      </div>
                                    ))}
                                    <button className="btn btn-sm btn-outline">
                                      + Add Question to this Type
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline mt-4">
                + Add New Passage
              </button>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTest && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-xl">Confirm Deletion</h3>

            {error && (
              <div className="alert alert-error mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <p className="py-4">
              Are you sure you want to delete the reading test:
              <span className="font-semibold"> {selectedTest.title}</span>?
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                className="btn btn-error"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    Deleting...
                    <span className="loading loading-spinner loading-xs ml-2"></span>
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AllReading;


// Helper function to format question type names
const formatQuestionType = (type: string) => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to get question number
const getQuestionNumber = (question: any) => {
  if (question.question_number) return question.question_number;
  if (question.question_numbers) return question.question_numbers.join('-');
  return null;
};

// Render question type specific fields
const renderQuestionFields = (
  type: string,
  question: any,
  partIndex: number,
  groupIndex: number,
  qIndex: number,
  handleQuestionChange: (partIndex: number, groupIndex: number, qIndex: number, field: string, value: any) => void
) => {
  // Helper function to simplify onChange calls
  const handleChange = (field: string, value: any) => {
    handleQuestionChange(partIndex, groupIndex, qIndex, field, value);
  };

  // Helper for nested blank changes
  const handleBlankChange = (blankIndex: number, field: string, value: any) => {
    const newBlanks = [...question.blanks];
    newBlanks[blankIndex] = { ...newBlanks[blankIndex], [field]: value };
    handleChange('blanks', newBlanks);
  };

  // Helper for option changes
  const handleOptionChange = (optIndex: number, field: string, value: any) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = { ...newOptions[optIndex], [field]: value };
    handleChange('options', newOptions);
  };

  // Helper for nested question changes
  const handleSubQuestionChange = (subQIndex: number, field: string, value: any) => {
    const newQuestions = [...question.questions];
    newQuestions[subQIndex] = { ...newQuestions[subQIndex], [field]: value };
    handleChange('questions', newQuestions);
  };

  switch (type) {
    case 'true_false_not_given':
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Answer</span>
            </label>
            <select
              value={question.answer}
              onChange={(e) => handleChange('answer', e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="True">True</option>
              <option value="False">False</option>
              <option value="Not Given">Not Given</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange('input_type', e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="dropdown">Dropdown</option>
              <option value="radio">Radio Buttons</option>
            </select>
          </div>
        </div>
      );

    case 'fill_in_the_blanks':
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Answer</span>
            </label>
            <input
              type="text"
              value={question.answer}
              onChange={(e) => handleChange('answer', e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange('input_type', e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="text">Text Input</option>
              <option value="number">Number Input</option>
            </select>
          </div>
        </div>
      );

    case 'matching_headings':
    case 'paragraph_matching':
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Answer</span>
            </label>
            <input
              type="text"
              value={question.answer}
              onChange={(e) => handleChange('answer', e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            <div className="space-y-2">
              {question.options.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleOptionChange(optIndex, 'label', e.target.value)}
                    className="input input-bordered input-sm w-full"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleOptionChange(optIndex, 'value', e.target.value)}
                    className="input input-bordered input-sm w-20"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-xs btn-outline mt-2"
              onClick={() => handleChange('options', [...question.options, { label: '', value: '' }])}
            >
              + Add Option
            </button>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange('input_type', e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="dropdown">Dropdown</option>
              <option value="drag_and_drop">Drag and Drop</option>
            </select>
          </div>
        </div>
      );

    case 'multiple_mcq':
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Question Numbers</span>
            </label>
            <input
              type="text"
              value={question.question_numbers.join(', ')}
              onChange={(e) => handleChange('question_numbers', e.target.value.split(',').map((n: string) => n.trim()))}
              className="input input-bordered w-full"
              placeholder="Comma separated numbers (e.g., 9,10)"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            <div className="space-y-2">
              {question.options.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleOptionChange(optIndex, 'label', e.target.value)}
                    className="input input-bordered input-sm w-full"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleOptionChange(optIndex, 'value', e.target.value)}
                    className="input input-bordered input-sm w-20"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-xs btn-outline mt-2"
              onClick={() => handleChange('options', [...question.options, { label: '', value: '' }])}
            >
              + Add Option
            </button>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Correct Answers</span>
            </label>
            <input
              type="text"
              value={question.correct_mapping.join(', ')}
              onChange={(e) => handleChange('correct_mapping', e.target.value.split(',').map((v: string) => v.trim()))}
              className="input input-bordered w-full"
              placeholder="Comma separated values (e.g., A,B)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Min Selection</span>
              </label>
              <input
                type="number"
                value={question.min_selection}
                onChange={(e) => handleChange('min_selection', parseInt(e.target.value))}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Max Selection</span>
              </label>
              <input
                type="number"
                value={question.max_selection}
                onChange={(e) => handleChange('max_selection', parseInt(e.target.value))}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange('input_type', e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="checkbox">Checkbox</option>
              <option value="multi-select">Multi-select</option>
            </select>
          </div>
        </div>
      );

    case 'passage_fill_in_the_blanks':
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Instruction</span>
            </label>
            <textarea
              value={question.instruction}
              onChange={(e) => handleChange('instruction', e.target.value)}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Passage with Blanks</span>
            </label>
            <textarea
              value={question.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="textarea textarea-bordered w-full h-32"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Question Numbers</span>
            </label>
            <input
              type="text"
              value={question.question_number.join(', ')}
              onChange={(e) => handleChange('question_number', e.target.value.split(',').map((n: string) => parseInt(n.trim())))}
              className="input input-bordered w-full"
              placeholder="Comma separated numbers (e.g., 13,14)"
            />
          </div>

          <div className="space-y-2">
            {question.blanks.map((blank: any, blankIndex: number) => (
              <div key={blankIndex} className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                <span className="badge badge-neutral">Blank {blank.blank_number}</span>
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text">Answer</span>
                  </label>
                  <input
                    type="text"
                    value={blank.answer}
                    onChange={(e) => handleBlankChange(blankIndex, 'answer', e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="w-40">
                  <label className="label">
                    <span className="label-text">Input Type</span>
                  </label>
                  <select
                    value={blank.input_type}
                    onChange={(e) => handleBlankChange(blankIndex, 'input_type', e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'mcq':
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Answer</span>
            </label>
            <input
              type="text"
              value={question.answer[0]}
              onChange={(e) => handleChange('answer', [e.target.value])}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            <div className="space-y-2">
              {question.options.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleOptionChange(optIndex, 'label', e.target.value)}
                    className="input input-bordered input-sm w-full"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleOptionChange(optIndex, 'value', e.target.value)}
                    className="input input-bordered input-sm w-20"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-xs btn-outline mt-2"
              onClick={() => handleChange('options', [...question.options, { label: '', value: '' }])}
            >
              + Add Option
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Min Selection</span>
              </label>
              <input
                type="number"
                value={question.min_selection}
                onChange={(e) => handleChange('min_selection', parseInt(e.target.value))}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Max Selection</span>
              </label>
              <input
                type="number"
                value={question.max_selection}
                onChange={(e) => handleChange('max_selection', parseInt(e.target.value))}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange('input_type', e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="radio">Radio Buttons</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>
        </div>
      );

    case 'summary_fill_in_the_blanks':
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Passage with Blanks</span>
            </label>
            <textarea
              value={question.passage}
              onChange={(e) => handleChange('passage', e.target.value)}
              className="textarea textarea-bordered w-full h-32"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Question Numbers</span>
            </label>
            <input
              type="text"
              value={question.question_numbers.join(', ')}
              onChange={(e) => handleChange('question_numbers', e.target.value.split(',').map((n: string) => parseInt(n.trim())))}
              className="input input-bordered w-full"
              placeholder="Comma separated numbers (e.g., 17,18)"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            <div className="space-y-2">
              {question.options.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleOptionChange(optIndex, 'label', e.target.value)}
                    className="input input-bordered input-sm w-full"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleOptionChange(optIndex, 'value', e.target.value)}
                    className="input input-bordered input-sm w-20"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-xs btn-outline mt-2"
              onClick={() => handleChange('options', [...question.options, { label: '', value: '' }])}
            >
              + Add Option
            </button>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Correct Answers</span>
            </label>
            <input
              type="text"
              value={question.answers.join(', ')}
              onChange={(e) => handleChange('answers', e.target.value.split(',').map((v: string) => v.trim()))}
              className="input input-bordered w-full"
              placeholder="Comma separated values (e.g., A,C)"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange('input_type', e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="drag_and_drop">Drag and Drop</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>
        </div>
      );

    case 'fill_in_the_blanks_with_subtitle':
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={question.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Subtitle</span>
            </label>
            <input
              type="text"
              value={question.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Content with Blanks</span>
            </label>
            <div className="space-y-2">
              {question.extra.map((text: string, textIndex: number) => (
                <textarea
                  key={textIndex}
                  value={text}
                  onChange={(e) => {
                    const newExtra = [...question.extra];
                    newExtra[textIndex] = e.target.value;
                    handleChange('extra', newExtra);
                  }}
                  className="textarea textarea-bordered w-full"
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {question.questions.map((q: any, qIndex: number) => (
              <div key={qIndex} className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                <span className="badge badge-neutral">Q{q.question_number}</span>
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text">Answer</span>
                  </label>
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => handleSubQuestionChange(qIndex, 'answer', e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="w-40">
                  <label className="label">
                    <span className="label-text">Input Type</span>
                  </label>
                  <select
                    value={q.input_type}
                    onChange={(e) => handleSubQuestionChange(qIndex, 'input_type', e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Custom editor for this question type not implemented yet</span>
        </div>
      );
  }
};
