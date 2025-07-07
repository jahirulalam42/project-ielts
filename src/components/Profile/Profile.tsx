"use client";
import React, { useState } from "react";

const Profile = () => {
  // State for user data and edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "London, UK",
    birthDate: "1995-08-15",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    memberSince: "January 2023",
    lastLogin: "2 hours ago",
  });

  // State for form data during editing
  const [formData, setFormData] = useState({ ...userData });

  // Handle input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  // Mock test history data
  const testHistory = [
    {
      id: 1,
      test: "IELTS Academic",
      date: "2023-11-15",
      score: "7.5",
      listening: 8.0,
      reading: 7.0,
      writing: 6.5,
      speaking: 7.5,
    },
    {
      id: 2,
      test: "IELTS General",
      date: "2023-08-22",
      score: "8.0",
      listening: 8.5,
      reading: 8.0,
      writing: 7.5,
      speaking: 8.0,
    },
    {
      id: 3,
      test: "IELTS Academic",
      date: "2023-05-10",
      score: "6.5",
      listening: 7.0,
      reading: 6.5,
      writing: 6.0,
      speaking: 6.5,
    },
  ];

  // Mock upcoming tests
  const upcomingTests = [
    {
      id: 1,
      test: "IELTS Academic",
      date: "2024-02-10",
      location: "London Test Center",
      time: "9:00 AM",
    },
    {
      id: 2,
      test: "IELTS Speaking Test",
      date: "2024-01-25",
      location: "Online",
      time: "2:30 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
          <div className="flex space-x-2">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
            <button className="btn btn-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="avatar mb-4">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={userData.profilePic} alt="Profile" />
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="form-control w-full mb-3">
                      <label className="label">
                        <span className="label-text">Full Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    <div className="form-control w-full mb-3">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    <div className="form-control w-full mb-3">
                      <label className="label">
                        <span className="label-text">Phone</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control w-full mb-3">
                      <label className="label">
                        <span className="label-text">Location</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control w-full mb-6">
                      <label className="label">
                        <span className="label-text">Date of Birth</span>
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="flex space-x-3 mt-4">
                      <button type="submit" className="btn btn-primary flex-1">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline flex-1"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="card-title text-2xl mb-1">
                      {userData.name}
                    </h2>
                    <p className="text-gray-600 mb-3">{userData.email}</p>

                    <div className="divider my-2"></div>

                    <div className="text-left w-full space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Phone:</span>
                        <span>{userData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Location:</span>
                        <span>{userData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Date of Birth:</span>
                        <span>
                          {new Date(userData.birthDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Member Since:</span>
                        <span>{userData.memberSince}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Last Login:</span>
                        <span>{userData.lastLogin}</span>
                      </div>
                    </div>

                    <div className="card-actions mt-6">
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </button>
                      <button className="btn btn-outline btn-block">
                        Change Password
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Test History */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Test History</h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Test Type</th>
                        <th>Date</th>
                        <th>Overall</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testHistory.map((test) => (
                        <tr key={test.id}>
                          <td>{test.test}</td>
                          <td>{new Date(test.date).toLocaleDateString()}</td>
                          <td>
                            <span className="badge badge-primary badge-lg">
                              {test.score}
                            </span>
                          </td>
                          <td>
                            <div className="flex space-x-1">
                              <div className="tooltip" data-tip="Listening">
                                <span className="badge badge-info">
                                  {test.listening}
                                </span>
                              </div>
                              <div className="tooltip" data-tip="Reading">
                                <span className="badge badge-success">
                                  {test.reading}
                                </span>
                              </div>
                              <div className="tooltip" data-tip="Writing">
                                <span className="badge badge-warning">
                                  {test.writing}
                                </span>
                              </div>
                              <div className="tooltip" data-tip="Speaking">
                                <span className="badge badge-error">
                                  {test.speaking}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="card bg-white shadow-xl border border-gray-200">
              <div className="card-body">
                <h2 className="card-title text-2xl font-semibold text-gray-800 mb-6">
                  IELTS Progress
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Target & Breakdown Section */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      Target Score: <span className="font-bold">8.0</span>
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Section Breakdown Card */}
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">
                          Section Breakdown
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            {
                              label: "Listening",
                              value: 80,
                              score: "8.0",
                              color: "blue-500",
                            },
                            {
                              label: "Reading",
                              value: 75,
                              score: "7.5",
                              color: "green-500",
                            },
                            {
                              label: "Writing",
                              value: 70,
                              score: "7.0",
                              color: "yellow-500",
                            },
                            {
                              label: "Speaking",
                              value: 75,
                              score: "7.5",
                              color: "red-500",
                            },
                          ].map(({ label, value, score, color }) => (
                            <div
                              key={label}
                              className="flex flex-col items-center"
                            >
                              <div
                                className={`radial-progress text-${color}`}
                                style={
                                  {
                                    "--value": value,
                                    "--size": "5rem",
                                    "--thickness": "8px",
                                  } as React.CSSProperties
                                }
                              >
                                <span className="text-md font-bold">
                                  {score}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600 mt-2">
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 text-center mt-4">
                          Individual section scores
                        </p>
                      </div>

                      {/* Score Summary */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="text-gray-700 text-sm mb-1">
                            Current average:{" "}
                            <span className="font-semibold">7.5</span>
                          </p>
                          <p className="text-gray-700 text-sm">
                            Need to improve by:{" "}
                            <span className="font-semibold">0.5</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="badge badge-info text-sm">
                            Listening: 8.0
                          </span>
                          <span className="badge badge-success text-sm">
                            Reading: 7.5
                          </span>
                          <span className="badge badge-warning text-sm">
                            Writing: 7.0
                          </span>
                          <span className="badge badge-error text-sm">
                            Speaking: 7.5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Study Progress Section */}
                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                      Study Progress
                    </h3>

                    {[
                      {
                        label: "Vocabulary",
                        value: 85,
                        color: "progress-success",
                      },
                      {
                        label: "Grammar",
                        value: 70,
                        color: "progress-success",
                      },
                      {
                        label: "Reading Comprehension",
                        value: 65,
                        color: "progress-warning",
                      },
                      {
                        label: "Writing Skills",
                        value: 60,
                        color: "progress-warning",
                      },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="mb-4">
                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span>{label}</span>
                          <span>{value}%</span>
                        </div>
                        <progress
                          className={`progress ${color} w-full`}
                          value={value}
                          max="100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
