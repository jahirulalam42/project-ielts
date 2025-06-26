// components/Admin/Reading/AllReading/AllReading.tsx
import { deleteReadingTest } from "@/services/data";
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

  const handleEdit = (test: any) => {
    setSelectedTest(test);
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

  const saveChanges = () => {
    console.log("Saving changes for:", selectedTest?._id);
    setShowEditModal(false);
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
      {showEditModal && selectedTest && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-2xl mb-4">Edit Reading Test</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Test Title</span>
                </label>
                <input
                  type="text"
                  defaultValue={selectedTest.title}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Duration (minutes)</span>
                </label>
                <input
                  type="number"
                  defaultValue={selectedTest.duration}
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
                    defaultChecked={selectedTest.type === "academic"}
                    className="radio radio-primary"
                  />
                  <span className="label-text ml-2">Academic</span>
                </label>
                <label className="cursor-pointer label">
                  <input
                    type="radio"
                    name="type"
                    defaultChecked={selectedTest.type === "general"}
                    className="radio radio-primary"
                  />
                  <span className="label-text ml-2">General</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Passages</h4>
              <div className="space-y-4">
                {selectedTest.parts.map((part: any, index: any) => (
                  <div
                    key={index}
                    className="collapse collapse-arrow bg-base-200"
                  >
                    <input type="checkbox" />
                    <div className="collapse-title font-medium">
                      Passage {index + 1}: {part.passage_title || "Untitled"}
                    </div>
                    <div className="collapse-content">
                      <div className="form-control mb-3">
                        <label className="label">
                          <span className="label-text">Passage Title</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={part.passage_title}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Instructions</span>
                        </label>
                        <textarea
                          defaultValue={part.instructions}
                          className="textarea textarea-bordered h-24"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
