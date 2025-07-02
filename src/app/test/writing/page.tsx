"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getWritingTest } from "@/services/data"; // You'll need to create this service

interface WritingTest {
  _id: string;
  title: string;
  type: string;
  duration: number;
}

const WritingPage: React.FC = () => {
  const [writingData, setWritingData] = useState<WritingTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = writingData.filter((test: any) => {
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
    if (type.toLowerCase().includes("academic")) return "badge-primary";
    if (type.toLowerCase().includes("general")) return "badge-secondary";
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
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error max-w-md">
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
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    // <div className="container mx-auto p-4 min-h-screen">
    //     <h1 className="text-4xl font-bold text-center my-8 text-primary">
    //         Writing Tests
    //     </h1>

    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
    //         {writingData?.map((test) => {
    //             const { _id, title, type, duration } = test;
    //             return (
    //                 <div
    //                     key={_id}
    //                     className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
    //                 >
    //                     <div className="card-body">
    //                         <div className="flex flex-col gap-2">
    //                             <h2 className="card-title text-2xl">{title}</h2>
    //                             <div className="flex flex-wrap gap-2">
    //                                 <div className="badge badge-info">{type}</div>
    //                                 <div className="badge badge-warning">
    //                                     {duration} minutes
    //                                 </div>
    //                             </div>
    //                         </div>
    //                         <div className="card-actions justify-end mt-4">
    //                             <Link
    //                                 href={`/test/writing/${_id}`}
    //                                 className="btn btn-primary btn-sm"
    //                             >
    //                                 Start Test
    //                                 <svg
    //                                     xmlns="http://www.w3.org/2000/svg"
    //                                     className="h-4 w-4 ml-2"
    //                                     fill="none"
    //                                     viewBox="0 0 24 24"
    //                                     stroke="currentColor"
    //                                 >
    //                                     <path
    //                                         strokeLinecap="round"
    //                                         strokeLinejoin="round"
    //                                         strokeWidth="2"
    //                                         d="M9 5l7 7-7 7"
    //                                     />
    //                                 </svg>
    //                             </Link>
    //                         </div>
    //                     </div>
    //                 </div>
    //             );
    //         })}
    //     </div>
    // </div>

    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          IELTS Writing Tests
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Practice with authentic writing tasks and get expert feedback
        </p>

        <div className="bg-white p-4 rounded-lg shadow-md inline-flex items-center">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Tests</div>
              <div className="stat-value text-primary">
                {writingData.length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Task Types</div>
              <div className="stat-value text-secondary">2</div>
            </div>
            <div className="stat">
              <div className="stat-title">Duration</div>
              <div className="stat-value text-accent">60 min</div>
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
                filter === "academic" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("academic")}
            >
              Academic
            </button>
            <button
              className={`btn btn-sm ${
                filter === "general" ? "btn-active" : ""
              }`}
              onClick={() => setFilter("general")}
            >
              General
            </button>
            <button
              className={`btn btn-sm ${filter === "task1" ? "btn-active" : ""}`}
              onClick={() => setFilter("task1")}
            >
              Task 1
            </button>
            <button
              className={`btn btn-sm ${filter === "task2" ? "btn-active" : ""}`}
              onClick={() => setFilter("task2")}
            >
              Task 2
            </button>
          </div>

          <div className="join w-full md:w-auto">
            <div className="w-full">
              <input
                className="input input-bordered join-item w-full"
                placeholder="Search writing tests..."
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

      {filteredTests.length > 0 ? (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTests.map((test: any) => (
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    </div>
                    <h2 className="card-title text-xl text-gray-800">
                      {test.title}
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {test.description ||
                      "Practice your writing skills with this IELTS task"}
                  </p>

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
                      {test.duration || 60} min
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {test.type.includes("Task 1") ? "150 words" : "250 words"}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Completion</span>
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
                      href={`/test/writing/${test._id}`}
                      className="btn btn-primary px-6 flex items-center"
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
            No writing tests found
          </h2>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? `No tests match your search for "${searchQuery}". Try different keywords.`
              : "There are currently no writing tests available in this category."}
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

      {/* Test Preparation Tips */}
      <div className="max-w-4xl mx-auto mt-16 bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6">
          Writing Test Tips
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
                    d="M9 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-6m-7 4l5-5m0 0l-5-5m5 5H1"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Plan Your Response
              </h3>
              <p className="text-gray-600">
                Spend 5 minutes planning your essay structure before writing.
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
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Use Academic Vocabulary
              </h3>
              <p className="text-gray-600">
                Demonstrate range with formal vocabulary and avoid colloquial
                language.
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Address All Parts
              </h3>
              <p className="text-gray-600">
                Ensure you fully answer all parts of the question to score well
                on task achievement.
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Time Management
              </h3>
              <p className="text-gray-600">
                Spend 20 minutes on Task 1 and 40 minutes on Task 2.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Writing Task Examples */}
      <div className="max-w-4xl mx-auto mt-12 bg-indigo-50 rounded-xl shadow-md p-8 border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Task Types</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                <span className="text-xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Task 1</h3>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Academic</h4>
              <p className="text-gray-600">
                Describe visual information (graphs, charts, diagrams, or
                processes) in your own words.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                General Training
              </h4>
              <p className="text-gray-600">
                Write a letter responding to a given situation (formal,
                semi-formal, or informal).
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                <span className="text-xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Task 2</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Write an essay in response to a point of view, argument, or
              problem.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                "Some people believe that unpaid community service should be a
                compulsory part of high school programs. To what extent do you
                agree or disagree?"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingPage;
