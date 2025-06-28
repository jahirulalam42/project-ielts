import { deleteWritingTest, updateWritingTest } from "@/services/data";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const AllWriting = ({ writingData, setWritingData }: any) => {
  const [selectedTest, setSelectedTest]: any = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localWritingData, setLocalWritingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    title: "",
    type: "Academic",
    duration: 60,
    parts: [
      {
        title: "",
        subtitle: "",
        Question: [""],
        instruction: [""],
        image: "",
      },
    ],
  });

  useEffect(() => {
    if (writingData) {
      setLocalWritingData([...writingData]);
      setIsLoading(false);
    }
  }, [writingData]);

  // Initialize form data when a test is selected for editing
  useEffect(() => {
    if (selectedTest && showEditModal) {
      setFormData({
        ...selectedTest,
        parts: selectedTest.parts.map((part: any) => ({
          ...part,
          Question: [...part.Question],
          instruction: [...part.instruction],
        })),
      });
    }
  }, [selectedTest, showEditModal]);

  const handleEdit = (test: any) => {
    setSelectedTest(test);
    setShowEditModal(true);
  };

  const handleDelete = (test: any) => {
    setSelectedTest(test);
    setShowDeleteModal(true);
  };

  // Initialize form data when a test is selected for editing
  useEffect(() => {
    if (selectedTest && showEditModal) {
      setFormData({
        ...selectedTest,
        parts: selectedTest.parts.map((part: any) => ({
          ...part,
          Question: [...part.Question],
          instruction: [...part.instruction],
        })),
      });
    }
  }, [selectedTest, showEditModal]);

  //   const handleEdit = (test: any) => {
  //     setSelectedTest(test);
  //     setShowEditModal(true);
  //   };

  //   const handleDelete = (test: any) => {
  //     setSelectedTest(test);
  //     setShowDeleteModal(true);
  //   };

  // Handle top-level field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "duration" ? parseInt(value) : value,
    });
  };

  // Handle part field changes
  const handlePartChange = (index: number, field: string, value: string) => {
    const updatedParts = [...formData.parts];
    updatedParts[index] = {
      ...updatedParts[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  // Handle question/instruction array changes
  const handleArrayChange = (
    partIndex: number,
    field: string,
    itemIndex: number,
    value: string
  ) => {
    const updatedParts = [...formData.parts];
    const updatedArray = [...updatedParts[partIndex][field]];
    updatedArray[itemIndex] = value;

    updatedParts[partIndex] = {
      ...updatedParts[partIndex],
      [field]: updatedArray,
    };

    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  // Add new item to question/instruction array
  const addArrayItem = (partIndex: number, field: string) => {
    const updatedParts = [...formData.parts];
    updatedParts[partIndex] = {
      ...updatedParts[partIndex],
      [field]: [...updatedParts[partIndex][field], ""],
    };

    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  // Remove item from question/instruction array
  const removeArrayItem = (
    partIndex: number,
    field: string,
    itemIndex: number
  ) => {
    if (formData.parts[partIndex][field].length <= 1) return;

    const updatedParts = [...formData.parts];
    const updatedArray = [...updatedParts[partIndex][field]];
    updatedArray.splice(itemIndex, 1);

    updatedParts[partIndex] = {
      ...updatedParts[partIndex],
      [field]: updatedArray,
    };

    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  // Add new part
  const addPart = () => {
    setFormData({
      ...formData,
      parts: [
        ...formData.parts,
        {
          title: "",
          subtitle: "",
          Question: [""],
          instruction: [""],
          image: "",
        },
      ],
    });
  };

  // Remove part
  const removePart = (index: number) => {
    if (formData.parts.length <= 1) return;

    const updatedParts = [...formData.parts];
    updatedParts.splice(index, 1);

    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Update the test in the database
      const updatedTest = await updateWritingTest(selectedTest._id, formData);

      // Update LOCAL state immediately
      const updatedData = localWritingData.map((test) =>
        test._id === selectedTest._id ? updatedTest : test
      );

      setLocalWritingData(updatedData);

      // Propagate update to parent component
      setWritingData(updatedData);

      toast.success("Writing test updated successfully");
      setShowEditModal(false);
    } catch (err) {
      console.error("Update failed:", err);
      setError(err instanceof Error ? err.message : "Update operation failed");
      toast.error("Failed to update writing test");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedTest) return;
    setIsDeleting(true);
    setError(null);

    try {
      await deleteWritingTest(selectedTest._id);

      // Update LOCAL state immediately
      const updatedData = localWritingData.filter(
        (test) => test._id !== selectedTest._id
      );
      setLocalWritingData(updatedData);

      // Propagate update to parent component
      setWritingData(updatedData);

      toast.success("Writing test deleted successfully");
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err instanceof Error ? err.message : "Delete operation failed");
      toast.error("Delete operation failed");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="ml-4">Loading writing tests...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Writing Tests Manager
        </h1>
        <Link href={`/admin/writing`}>
          <button className="btn btn-primary">+ Add New Test</button>
        </Link>
      </div>

      {localWritingData.length === 0 ? (
        <div className="alert alert-info">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>No writing tests found. Create your first test!</span>
        </div>
      ) : (
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
              {localWritingData.map((test: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{test.title}</td>
                  <td className="text-center py-4 px-6">
                    <span className="badge badge-info">{test.type}</span>
                  </td>
                  <td className="text-center py-4 px-6">{test.duration}</td>
                  <td className="text-center py-4 px-6">
                    <span className="badge badge-outline">
                      {test.parts?.length} passages
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
                      <button className="btn btn-sm btn-outline">
                        Preview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        {showEditModal && selectedTest && formData && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl h-5/6 overflow-y-auto">
              <h3 className="font-bold text-xl mb-4">Edit Writing Test</h3>

              {/* Test Level Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="label">
                    <span className="label-text">Test Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Test Type</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="Academic">Academic</option>
                    <option value="General">General Training</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              {/* Parts Section */}
              <div className="divider">Parts</div>

              <div className="space-y-6">
                {formData.parts.map((part: any, partIndex: number) => (
                  <div
                    key={partIndex}
                    className="border rounded-lg p-4 bg-base-100"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold">
                        Part {partIndex + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removePart(partIndex)}
                        className="btn btn-sm btn-error"
                        disabled={formData.parts.length <= 1}
                      >
                        Remove Part
                      </button>
                    </div>

                    {/* Part Fields */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div>
                        <label className="label">
                          <span className="label-text">Part Title</span>
                        </label>
                        <input
                          type="text"
                          value={part.title}
                          onChange={(e) =>
                            handlePartChange(partIndex, "title", e.target.value)
                          }
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Part Subtitle</span>
                        </label>
                        <input
                          type="text"
                          value={part.subtitle}
                          onChange={(e) =>
                            handlePartChange(
                              partIndex,
                              "subtitle",
                              e.target.value
                            )
                          }
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Image URL</span>
                        </label>
                        <input
                          type="text"
                          value={part.image}
                          onChange={(e) =>
                            handlePartChange(partIndex, "image", e.target.value)
                          }
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>

                    {/* Questions Section */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Questions</h5>
                        <button
                          type="button"
                          onClick={() => addArrayItem(partIndex, "Question")}
                          className="btn btn-sm btn-primary"
                        >
                          + Add Question
                        </button>
                      </div>

                      {part.Question.map((question: string, qIndex: number) => (
                        <div
                          key={qIndex}
                          className="flex items-start gap-2 mb-2"
                        >
                          <textarea
                            value={question}
                            onChange={(e) =>
                              handleArrayChange(
                                partIndex,
                                "Question",
                                qIndex,
                                e.target.value
                              )
                            }
                            className="textarea textarea-bordered flex-grow"
                            rows={2}
                            placeholder="Question paragraph"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem(partIndex, "Question", qIndex)
                            }
                            className="btn btn-sm btn-error mt-1"
                            disabled={part.Question.length <= 1}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Instructions Section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Instructions</h5>
                        <button
                          type="button"
                          onClick={() => addArrayItem(partIndex, "instruction")}
                          className="btn btn-sm btn-primary"
                        >
                          + Add Instruction
                        </button>
                      </div>

                      {part.instruction.map(
                        (instruction: string, iIndex: number) => (
                          <div
                            key={iIndex}
                            className="flex items-start gap-2 mb-2"
                          >
                            <textarea
                              value={instruction}
                              onChange={(e) =>
                                handleArrayChange(
                                  partIndex,
                                  "instruction",
                                  iIndex,
                                  e.target.value
                                )
                              }
                              className="textarea textarea-bordered flex-grow"
                              rows={2}
                              placeholder="Instruction text"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem(
                                  partIndex,
                                  "instruction",
                                  iIndex
                                )
                              }
                              className="btn btn-sm btn-error mt-1"
                              disabled={part.instruction.length <= 1}
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPart}
                  className="btn btn-primary"
                >
                  + Add New Part
                </button>
              </div>

              {/* Error Message */}
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

              {/* Modal Actions */}
              <div className="modal-action mt-4">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      Saving...
                      <span className="loading loading-spinner loading-xs ml-2"></span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
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
                Are you sure you want to delete the writing test:
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
      </div>

      <ToastContainer />
    </div>
  );
};

export default AllWriting;
