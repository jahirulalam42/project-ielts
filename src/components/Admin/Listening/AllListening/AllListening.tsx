"use client";
import { deleteListeningTest } from "@/services/data";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const AllListening = ({ listeningData, setListeningData }: any) => {
  const [selectedTest, setSelectedTest]: any = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedTest, setEditedTest] = useState<any>(null);

  const handleDelete = (test: any) => {
    setSelectedTest(test);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTest) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteListeningTest(selectedTest._id);

      // Update state to remove the deleted item
      setListeningData((prev: any) =>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Listening Tests Manager
        </h1>
        <Link href={`/admin/listening`}>
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
            {listeningData.map((test: any) => (
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
                      //   onClick={() => handleEdit(test)}
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
      {showEditModal && selectedTest && editedTest && <div>Edit Modal</div>}

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

export default AllListening;
