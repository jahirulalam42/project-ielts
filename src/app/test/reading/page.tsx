"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getReadingTest } from "@/services/data";

const ReadingPage: React.FC = () => {
  const [readingData, setReadingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = readingData.filter((test) => {
    const matchesFilter =
      filter === "all" || test.type.toLowerCase() === filter;
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchQuery.toLowerCase());
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

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      academic: "badge-accent",
      general: "badge-info",
      practice: "badge-accent",
    };
    return typeMap[type.toLowerCase()] || "badge-neutral";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReadingTest();
        setReadingData(data.data);
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
            IELTS Reading Practice
          </h1>
          <p className="text-xl text-red-200 max-w-3xl mx-auto">
            Academic and General Training tests with authentic reading passages
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
                  {readingData.length}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", "academic", "general"].map((testType) => (
                <button
                  key={testType}
                  className={`btn btn-sm capitalize ${
                    filter === testType
                      ? "btn-active bg-red-800 text-white"
                      : "btn-ghost"
                  }`}
                  onClick={() => setFilter(testType)}
                >
                  {testType.replace("all", "All Tests")}
                </button>
              ))}
            </div>

            <div className="join flex-1 max-w-md">
              <input
                className="input input-bordered join-item w-full"
                placeholder="Search tests..."
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
            <p className="text-lg text-gray-600">Loading reading tests...</p>
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
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h2 className="card-title text-xl text-gray-800">
                          {test.title}
                        </h2>
                      </div>
                      <div
                        className={`badge font-bold ${getTypeBadge(test.type)}`}
                      >
                        {test.type}
                      </div>
                    </div>

                    {test.description && (
                      <p className="text-gray-600 mt-2 mb-4">
                        {test.description}
                      </p>
                    )}

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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                        {test.questions || 40} questions
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
                        href={`/test/reading/${test._id}`}
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

      {/* Test Tips Section */}
      <div className="max-w-6xl mx-auto mt-16 px-4 pb-16">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              IELTS Reading Tips
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {[
              "Skim passages first to understand main ideas before reading questions",
              "Scan for keywords and synonyms in both questions and passages",
              "Allocate 20 minutes per passage to manage time effectively",
              "Look for paraphrased versions of question content in the text",
              "Practice different question types (multiple choice, T/F/NG, matching headings)",
              "Improve vocabulary to better understand academic texts",
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
      </div>
    </div>
  );
};

export default ReadingPage;
