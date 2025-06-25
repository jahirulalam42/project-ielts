// components/Admin/Reading/AllReading/AllReading.tsx
import { deleteReadingTest } from "@/services/data";
import React, { useState } from "react";
// import { ReadingTest } from "@/types/reading"; // Define your types



const AllReading: React.FC<any> = ({ readingData }) => {
    const [selectedTest, setSelectedTest]: any = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleEdit = (test: any) => {
        setSelectedTest(test);
        setShowEditModal(true);
    };

    const handleDelete = (test: any) => {
        setSelectedTest(test);
        setShowDeleteModal(true);
    };

    // Dummy handlers for now
    const confirmDelete = async () => {
        console.log("Deleting test:", selectedTest?._id);
        await deleteReadingTest(selectedTest._id);
        setShowDeleteModal(false);
    };

    const saveChanges = () => {
        console.log("Saving changes for:", selectedTest?._id);
        setShowEditModal(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Reading Tests Manager</h1>
                <button className="btn btn-primary">
                    + Add New Test
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
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
                                    <div key={index} className="collapse collapse-arrow bg-base-200">
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
                            <button
                                className="btn btn-primary"
                                onClick={saveChanges}
                            >
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
                        <p className="py-4">
                            Are you sure you want to delete the reading test:
                            <span className="font-semibold"> {selectedTest.title}</span>?
                            <br />
                            <span className="text-error">This action cannot be undone.</span>
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={confirmDelete}
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllReading;