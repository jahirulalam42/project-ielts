"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getReadingTest } from "@/services/data";

interface ReadingTest {
  id: string;
  title: string;
  type: string;
}

const page: React.FC = () => {
  const [readingData, setReadingData] = useState<ReadingTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to determine badge color based on test type
  const getBadgeClass = (type: any) => {
    switch (type.toLowerCase()) {
      case "academic":
        return "badge-primary";
      case "general":
        return "badge-secondary";
      case "practice":
        return "badge-accent";
      default:
        return "badge-info";
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReadingTest();
        setReadingData(data.data);
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
    //   <h1 className="text-4xl font-bold text-center my-8 text-primary">
    //     Reading Tests
    //   </h1>

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
    //     {readingData?.map((data: any) => {
    //       const { _id, title, type } = data;
    //       return (
    //         <div
    //           key={_id}
    //           className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
    //         >
    //           <div className="card-body">
    //             <div className="flex items-center justify-between">
    //               <h2 className="card-title text-2xl">{title}</h2>
    //               <p>{type}</p>
    //             </div>
    //             <div className="card-actions justify-end mt-4">
    //               <Link
    //                 href={`/test/reading/${_id}`}
    //                 className="btn btn-primary btn-sm"
    //               >
    //                 Start Test
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   className="h-4 w-4 ml-2"
    //                   fill="none"
    //                   viewBox="0 0 24 24"
    //                   stroke="currentColor"
    //                 >
    //                   <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     strokeWidth="2"
    //                     d="M9 5l7 7-7 7"
    //                   />
    //                 </svg>
    //               </Link>
    //             </div>
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>

    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          IELTS Reading Tests
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Practice with authentic reading materials and improve your
          comprehension skills
        </p>
        <div className="bg-white p-4 rounded-lg shadow-md inline-flex items-center">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Tests</div>
              <div className="stat-value text-primary">
                {readingData?.length || 0}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Average Duration</div>
              <div className="stat-value text-secondary">60 min</div>
            </div>
            <div className="stat">
              <div className="stat-title">Questions</div>
              <div className="stat-value text-accent">40</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-sm btn-active">All Tests</button>
            <button className="btn btn-sm">Academic</button>
            <button className="btn btn-sm">General</button>
            <button className="btn btn-sm">Recent</button>
          </div>

          <div className="join">
            <div>
              <div>
                <input
                  className="input input-bordered join-item"
                  placeholder="Search tests..."
                />
              </div>
            </div>
            <select className="select select-bordered join-item">
              <option disabled defaultValue={"popular"}>
                Filter
              </option>
              <option value={"popular"}>Most Popular</option>
              <option value={"newest"}>Newest First</option>
              <option value={"difficulty"}>By Difficulty</option>
            </select>
            <div className="indicator">
              <button className="btn join-item">Search</button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Cards Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {readingData?.map((data: any) => {
            const {
              _id,
              title,
              type,
              duration = 60,
              questions = 40,
              difficulty = "medium",
            } = data;

            return (
              <div
                key={_id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`badge ${getBadgeClass(type)}`}>{type}</div>
                    {getDifficultyBadge(difficulty)}
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h2 className="card-title text-xl text-gray-800">
                      {title}
                    </h2>
                  </div>

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
                      {duration} min
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
                      {questions} questions
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Completion</span>
                      <span className="text-sm font-medium text-indigo-600">
                        25%
                      </span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value="25"
                      max="100"
                    ></progress>
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <Link
                      href={`/test/reading/${_id}`}
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
            );
          })}
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

      {/* Test Preparation Tips */}
      <div className="max-w-4xl mx-auto mt-16 bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6">
          Reading Test Tips
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Skim First</h3>
              <p className="text-gray-600">
                Quickly skim through the text to get the main idea before
                reading questions.
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Keyword Scanning
              </h3>
              <p className="text-gray-600">
                Look for keywords in questions and scan the text to find
                matching information.
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
                Time Management
              </h3>
              <p className="text-gray-600">
                Spend no more than 20 minutes per passage to ensure you complete
                all sections.
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Paraphrasing</h3>
              <p className="text-gray-600">
                Answers often use synonyms and paraphrased versions of the text.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
