"use client";
import { getSingleUser, updateUser } from "@/services/data";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData]: any = useState();

  const { data }: any = useSession();

  console.log("Session Data", data);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      await updateUser(data?.user.id, userData);
      toast.success("User Updated");
    } catch (err) {
      toast.error("Something went wrong");
    }
    // In a real app, you would submit to your backend here
    console.log("Profile updated:", userData);
  };

  useEffect(() => {
    const fetchSingleUser = async () => {
      if (data) {
        const result = await getSingleUser(data?.user.id);
        console.log("Single Data information", result);
        setUserData(result?.data);
        return result;
      }
    };
    fetchSingleUser();
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            User Profile
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? "Update your personal information"
              : "Manage your IELTS profile"}
          </p>
        </div>

        {userData ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-40 relative">
              <div className="absolute -bottom-16 left-8">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center shadow-lg">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src="https://img.daisyui.com/images/profile/demo/averagebulk@192.webp"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute right-6 top-6">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-light hover:bg-white/20 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost text-white hover:bg-white/20"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-6 pb-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="text-lg font-semibold text-gray-900">
                        {userData.username}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="text-gray-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {userData.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="text-gray-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {userData.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={userData.location}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="text-gray-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {userData.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="textarea textarea-bordered w-full focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-700">{userData.bio}</p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                  {/* <div className="text-sm text-gray-500">
                  <span className="font-medium">Member since:</span>{" "}
                  {userData.memberSince}
                </div> */}

                  {isEditing && (
                    <button
                      type="submit"
                      className="btn btn-primary px-8 py-3 font-medium"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        )}

        {/* Additional Info Section */}
        {/* {!isEditing && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">8.0</div>
              <div className="text-gray-600 mt-1">Target Band</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">15</div>
              <div className="text-gray-600 mt-1">Practice Tests Taken</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">87%</div>
              <div className="text-gray-600 mt-1">Learning Progress</div>
            </div>
          </div>
        )} */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
