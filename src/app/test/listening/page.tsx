"use client";
import React, { useEffect, useState } from "react";
import listeningTests from "../../../../data/listening.json";
import Link from "next/link";
import { getListeningTests } from "@/services/data";

const page: React.FC = () => {
  const [listeningData, setListeningData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = listeningData.filter((test) => {
    const matchesFilter =
      filter === "all" || test.type.toLowerCase() === filter;
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Function to get difficulty badge
  const getDifficultyBadge = (difficulty: any) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return <span className="badge badge-success gap-2">Easy</span>;
      case "medium":
        return <span className="badge badge-warning gap-2">Medium</span>;
      case "hard":
        return <span className="badge badge-error gap-2">Hard</span>;
      default:
        return <span className="badge badge-info gap-2">Not Rated</span>;
    }
  };

  // Function to determine badge color based on test type
  const getBadgeClass = (type: any) => {
    switch (type.toLowerCase()) {
      case "section 1":
        return "badge-primary";
      case "section 2":
        return "badge-secondary";
      case "section 3":
        return "badge-accent";
      case "section 4":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListeningTests();
        setListeningData(data.data);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Listening data", listeningData);

  return (
    // <div className="container mx-auto p-4">
    //     <h1 className="text-4xl font-bold text-center mb-8 text-primary">
    //         IELTS Listening Tests
    //     </h1>

    //     {isLoading ? (
    //         <div className="flex justify-center items-center min-h-[400px]">
    //             <span className="loading loading-spinner loading-lg text-primary"></span>
    //         </div>
    //     ) : (
    //         <>
    //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //                 {listeningData.map((test) => (
    //                     <div
    //                         key={test._id}
    //                         className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200"
    //                     >
    //                         <div className="card-body">
    //                             <h2 className="card-title text-2xl mb-2">{test.title}</h2>
    //                             <p className="text-gray-600 mb-4">{test.description}</p>

    //                             <div className="flex items-center gap-2 mb-4">
    //                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" viewBox="0 0 20 20" fill="currentColor">
    //                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm1-8a1 1 0 10-2 0v3a1 1 0 00.293.707l1.414 1.414a1 1 0 001.414-1.414L11 11V8z" clipRule="evenodd" />
    //                                 </svg>
    //                                 <span className="font-medium">Duration: {test.duration} minutes</span>
    //                             </div>

    //                             <div className="card-actions justify-end">
    //                                 <Link
    //                                     href={`/test/listening/${test._id}`}
    //                                     className="btn btn-primary w-full"
    //                                 >
    //                                     Start Test
    //                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
    //                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
    //                                     </svg>
    //                                 </Link>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>

    //             {listeningData.length === 0 && (
    //                 <div className="text-center py-12">
    //                     <div className="text-2xl text-gray-500 mb-4">
    //                         No listening tests available
    //                     </div>
    //                     <div className="text-gray-400">
    //                         Check back later for new tests
    //                     </div>
    //                 </div>
    //             )}
    //         </>
    //     )}
    // </div>

    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          IELTS Listening Tests
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Practice with authentic audio recordings and improve your listening
          skills
        </p>

        <div className="bg-white p-4 rounded-lg shadow-md inline-flex items-center">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Tests</div>
              <div className="stat-value text-primary">
                {listeningData.length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Average Duration</div>
              <div className="stat-value text-secondary">30 min</div>
            </div>
            <div className="stat">
              <div className="stat-title">Sections</div>
              <div className="stat-value text-accent">4</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`btn btn-sm ${filter === "all" ? "btn-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Tests
            </button>
            <button
              className={`btn btn-sm ${
                filter === "section 1" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("section 1")}
            >
              Section 1
            </button>
            <button
              className={`btn btn-sm ${
                filter === "section 2" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("section 2")}
            >
              Section 2
            </button>
            <button
              className={`btn btn-sm ${
                filter === "section 3" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("section 3")}
            >
              Section 3
            </button>
            <button
              className={`btn btn-sm ${
                filter === "section 4" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("section 4")}
            >
              Section 4
            </button>
          </div>

          <div className="join w-full md:w-auto">
            <div className="w-full">
              <input
                className="input input-bordered join-item w-full"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="indicator">
              <button className="btn join-item">
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
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-lg text-gray-600">Loading listening tests...</p>
        </div>
      ) : (
        <>
          {filteredTests.length > 0 ? (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTests.map((test) => (
                  <div
                    key={test._id}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100"
                  >
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`badge ${getBadgeClass(test.type)}`}>
                          {test.type}
                        </div>
                        {getDifficultyBadge(test.difficulty)}
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0-11.314a5 5 0 00-1.414 1.414"
                            />
                          </svg>
                        </div>
                        <h2 className="card-title text-xl text-gray-800">
                          {test.title}
                        </h2>
                      </div>

                      <p className="text-gray-600 mb-4">{test.description}</p>

                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1 text-indigo-500"
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
                          {test.duration} min
                        </div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1 text-indigo-500"
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
                          {test.questions || 10} questions
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Completion
                          </span>
                          <span className="text-sm font-medium text-indigo-600">
                            0%
                          </span>
                        </div>
                        <progress
                          className="progress progress-primary w-full"
                          value="0"
                          max="100"
                        ></progress>
                      </div>

                      <div className="card-actions justify-end mt-6">
                        <Link
                          href={`/test/listening/${test._id}`}
                          className="btn btn-primary px-6 flex items-center"
                        >
                          Start Test
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="join grid grid-cols-2 md:flex justify-center mt-12">
                <button className="join-item btn btn-outline">Previous</button>
                <button className="join-item btn btn-active">1</button>
                <button className="join-item btn btn-outline">2</button>
                <button className="join-item btn btn-outline">3</button>
                <button className="join-item btn btn-outline">Next</button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center bg-white rounded-xl shadow-md p-12">
              <div className="flex justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400"
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No listening tests found
              </h2>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No tests match your search for "${searchQuery}". Try different keywords.`
                  : "There are currently no listening tests available in this category."}
              </p>
              <button
                className="btn btn-outline text-indigo-600 border-indigo-600"
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Test Preparation Tips */}
      <div className="max-w-4xl mx-auto mt-16 bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6">
          Listening Test Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0-11.314a5 5 0 00-1.414 1.414"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Predict Content
              </h3>
              <p className="text-gray-600">
                Use the time before each section to read questions and predict
                possible answers.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Focus on Keywords
              </h3>
              <p className="text-gray-600">
                Listen for keywords and synonyms that match the questions.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
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
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Check Spelling
              </h3>
              <p className="text-gray-600">
                Always double-check your spelling during the transfer time.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="mr-4 mt-1">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Note Speaker Changes
              </h3>
              <p className="text-gray-600">
                Pay attention when speakers change as new information often
                follows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
