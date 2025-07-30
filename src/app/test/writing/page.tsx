"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getWritingTest } from "@/services/data";

const WritingPage: React.FC = () => {
  const [writingData, setWritingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = writingData.filter((test) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "academic" && test.type.toLowerCase().includes("academic")) ||
      (filter === "general" && test.type.toLowerCase().includes("general")) ||
      (filter === "task1" && test.type.toLowerCase().includes("task 1")) ||
      (filter === "task2" && test.type.toLowerCase().includes("task 2"));

    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.description &&
        test.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // const getDifficultyBadge = (difficulty: string) => {
  //   const colorMap: Record<string, string> = {
  //     easy: "badge-success",
  //     medium: "badge-warning",
  //     hard: "badge-error",
  //   };
  //   return (
  //     <span
  //       className={`badge gap-2 ${
  //         colorMap[difficulty.toLowerCase()] || "badge-info"
  //       }`}
  //     >
  //       {difficulty || "Not Rated"}
  //     </span>
  //   );
  // };

  const getTypeBadgeClass = (type: string) => {
    if (type.toLowerCase().includes("academic")) return "badge-accent";
    if (type.toLowerCase().includes("general")) return "badge-info";
    if (type.toLowerCase().includes("task 1")) return "badge-accent";
    if (type.toLowerCase().includes("task 2")) return "badge-info";
    return "badge-neutral";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWritingTest();
        setWritingData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-red-50">
      {/* Header Section */}
      <div className="bg-red-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            IELTS Writing Practice
          </h1>
          <p className="text-xl text-red-200 max-w-3xl mx-auto">
            Academic and General Training tests with expert evaluation criteria
          </p>
        </div>
      </div>

      {/* Stats & Controls */}
      <div className="max-w-6xl mx-auto -mt-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="stats bg-transparent shadow-none">
              <div className="stat">
                <div className="stat-title text-gray-600">Total Tests</div>
                <div className="stat-value text-red-700">
                  {writingData.length}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", "academic", "general"].map((filterType) => (
                <button
                  key={filterType}
                  className={`btn btn-sm capitalize ${
                    filter === filterType
                      ? "btn-active bg-red-800 text-white"
                      : "btn-ghost"
                  }`}
                  onClick={() => setFilter(filterType)}
                >
                  {filterType === "all"
                    ? "All Tests"
                    : filterType === "task1"
                    ? "Task 1"
                    : filterType === "task2"
                    ? "Task 2"
                    : filterType}
                </button>
              ))}
            </div>

            <div className="join flex-1 max-w-md">
              <input
                className="input input-bordered join-item w-full"
                placeholder="Search writing tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn join-item bg-red-800 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-red-600 mb-4"></span>
            <p className="text-lg text-gray-600">Loading writing tests...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg my-8">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
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
              <span>Error: {error}</span>
            </div>
          </div>
        ) : filteredTests.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div
                  key={test._id}
                  className="card bg-base-100 border border-gray-200 shadow-md hover:shadow-xl transition-all"
                >
                  <div className="card-body">
                    <div className="flex mb-3 justify-between items-start">
                      <div>
                        <h2 className="card-title text-xl text-gray-800">
                          {test.title}
                        </h2>
                      </div>
                      <div
                        className={`badge font-bold ${getTypeBadgeClass(
                          test.type
                        )}`}
                      >
                        {test.type}
                      </div>
                    </div>

                    <p className="text-gray-600 mt-2 mb-4">
                      {test.description ||
                        "Practice your writing skills with this IELTS task"}
                    </p>

                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {test.duration || 60} min
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {test.type.includes("Task 1")
                          ? "150 words"
                          : "250 words"}
                      </div>
                    </div>

                    {/* <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Your progress</span>
                        <span>0%</span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value="0"
                        max="100"
                      ></progress>
                    </div> */}

                    <div className="card-actions justify-end mt-6">
                      <Link
                        href={`/test/writing/${test._id}`}
                        className="btn bg-red-800 px-8 text-white"
                      >
                        Start Test
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <div className="join">
                <button className="join-item btn btn-outline">Previous</button>
                <button className="join-item btn btn-active">1</button>
                <button className="join-item btn">2</button>
                <button className="join-item btn">3</button>
                <button className="join-item btn btn-outline">Next</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No tests found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No tests match "${searchQuery}". Try different keywords.`
                : "No tests available in this category."}
            </p>
            <button
              className="btn btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Writing Task Examples */}
      <div className="max-w-6xl mx-auto mt-8 px-4 pb-16">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-red-700 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Writing Task Types
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="border-l-4 border-red-500 pl-4">
              <div className="flex items-center mb-3">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <span className="text-xl font-bold text-red-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Task 1</h3>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="badge badge-accent mr-2">Academic</span>
                  Visual Information
                </h4>
                <p className="text-gray-600 pl-10">
                  Describe visual information (graphs, charts, diagrams, or
                  processes) in your own words.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="badge badge-info mr-2">General</span>
                  Letter Writing
                </h4>
                <p className="text-gray-600 pl-10">
                  Write a letter responding to a given situation (formal,
                  semi-formal, or informal).
                </p>
              </div>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <div className="flex items-center mb-3">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <span className="text-xl font-bold text-red-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Task 2</h3>
              </div>

              <p className="text-gray-600 mb-4">
                Write an essay in response to a point of view, argument, or
                problem (both Academic and General Training).
              </p>

              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-sm text-red-700 italic">
                  "Some people believe that unpaid community service should be a
                  compulsory part of high school programs. To what extent do you
                  agree or disagree?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Tips Section */}
      {/* <div className="max-w-6xl mx-auto mt-8 px-4 pb-16">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-red-700 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              IELTS Writing Tips
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {[
              "Spend 5 minutes planning your essay structure before writing",
              "Use formal vocabulary and avoid colloquial expressions",
              "Address all parts of the question to score well on task achievement",
              "Allocate 20 minutes for Task 1 and 40 minutes for Task 2",
              "Include clear topic sentences in each paragraph",
              "Proofread for grammar and spelling errors in the last 5 minutes",
            ].map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-red-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default WritingPage;
