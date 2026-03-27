"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getReadingQuestions, getSubmitReadingTest } from "@/services/data";
import { useSession } from "next-auth/react";
import ReadingReview from "@/components/TestComponent/readingTest/ReadingReview";

// Define TypeScript interfaces for the data structure
interface Submission {
  _id: string;
  userId: string;
  testId: string;
  answers: Answer[];
  submittedAt: string;
  totalScore: number;
  __v: number;
}

interface Answer {
  questionId: number | any[];
  value?: string;
  answers?: any[];
  answerText: string | any[];
  isCorrect: boolean;
  questionGroup?: number[];
  questionType?: string;
}

const SubmissionPage = () => {
  const Params = useParams();
  const { testId } = Params;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [readingTest, setReadingTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session }: any = useSession();
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);

  console.log("Submission", submission);

  console.log("user id", session?.user?.id);

  console.log(testId, "submissionId");

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await getSubmitReadingTest(testId, session?.user?.id);
        console.log("Response", response);

        if (response.success) {
          // Handle array response or single object
          const data = Array.isArray(response.data)
            ? response.data[0] // Take first element if array
            : response.data;

          setSubmission(data || null); // Handle empty data
          setError(null); // Clear previous errors
        } else {
          setError("Failed to fetch submission data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    if (testId && session?.user?.id) {
      fetchSubmission();
    } else {
      setLoading(false);
    }
  }, [testId, session?.user?.id]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        if (!testId) return;
        const res = await getReadingQuestions(testId);
        if (res?.success) setReadingTest(res.data);
      } catch (e) {
        // keep table working even if review fails
        console.error("Failed to fetch reading test for review", e);
      }
    };
    fetchTest();
  }, [testId]);

  // Handle loading and error states
  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-error">{error}</div>;
  if (!submission)
    return <div className="text-center p-4">No submission data available</div>;

  const toggleExpanded = (key: string) => {
    setExpandedRowKey((prev) => (prev === key ? null : key));
  };

  const formatMaybeArray = (value: unknown) => {
    if (Array.isArray(value)) return value.filter(Boolean).join(", ");
    if (value === null || value === undefined) return "";
    return String(value);
  };

  const renderUserAnswerControl = (answer: Answer, variantKey: string) => {
    const userValue = formatMaybeArray(answer.value);
    const correctValue = formatMaybeArray(answer.answerText);
    const qType = answer.questionType || "";

    // True/False/Not Given
    if (qType.toLowerCase().includes("true") || qType.toLowerCase().includes("false")) {
      const tfOptions = ["True", "False", "Not Given"];
      const safeUserValue = tfOptions.includes(userValue) ? userValue : "";
      const safeCorrectValue = tfOptions.includes(correctValue) ? correctValue : "";
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="form-control">
            <div className="label py-0">
              <span className="label-text text-xs font-semibold text-gray-600">
                Your answer
              </span>
            </div>
            <select className="select select-bordered" disabled value={safeUserValue}>
              <option value="">(not answered)</option>
              <option value="True">True</option>
              <option value="False">False</option>
              <option value="Not Given">Not Given</option>
            </select>
          </div>
          <div className="form-control">
            <div className="label py-0">
              <span className="label-text text-xs font-semibold text-gray-600">
                Correct answer
              </span>
            </div>
            <select
              className="select select-bordered bg-base-100"
              disabled
              value={safeCorrectValue}
            >
              <option value="">(no correct answer)</option>
              <option value="True">True</option>
              <option value="False">False</option>
              <option value="Not Given">Not Given</option>
            </select>
          </div>
        </div>
      );
    }

    // Fill in the blanks
    if (qType.toLowerCase().includes("fill")) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="form-control">
            <div className="label py-0">
              <span className="label-text text-xs font-semibold text-gray-600">
                Your answer
              </span>
            </div>
            <input
              key={`${variantKey}-user-fill`}
              type="text"
              className="input input-bordered"
              disabled
              value={userValue}
              placeholder="(not answered)"
            />
          </div>
          <div className="form-control">
            <div className="label py-0">
              <span className="label-text text-xs font-semibold text-gray-600">
                Correct answer
              </span>
            </div>
            <input
              key={`${variantKey}-correct-fill`}
              type="text"
              className="input input-bordered bg-base-100"
              disabled
              value={correctValue}
              placeholder="(not answered)"
            />
          </div>
        </div>
      );
    }

    // MCQ / Matching / others: we don't have the full option list here,
    // so we present answers as disabled pills similar to "selection boxes".
    const isCorrect = !!answer.isCorrect;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="form-control">
          <div className="label py-0">
            <span className="label-text text-xs font-semibold text-gray-600">
              Your answer
            </span>
          </div>
          <div
            className={`rounded-lg p-3 border ${
              isCorrect ? "border-success/40 bg-success/10" : "border-warning/40 bg-warning/10"
            }`}
          >
            {userValue ? (
              <div className="flex flex-wrap gap-2">
                {userValue.split(",").map((v, i) => (
                  <span key={`${variantKey}-user-pill-${i}`} className="badge badge-sm badge-primary badge-outline">
                    {v.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">(not answered)</span>
            )}
          </div>
        </div>
        <div className="form-control">
          <div className="label py-0">
            <span className="label-text text-xs font-semibold text-gray-600">
              Correct answer
            </span>
          </div>
          <div className="rounded-lg p-3 border border-gray-300 bg-base-100">
            {correctValue ? (
              <div className="flex flex-wrap gap-2">
                {correctValue.split(",").map((v, i) => (
                  <span key={`${variantKey}-correct-pill-${i}`} className="badge badge-sm badge-success badge-outline">
                    {v.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">(no correct answer)</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Group answers by questionGroup and maintain order
  const groupedAnswers = submission.answers.reduce(
    (acc: { [key: string]: Answer[] }, answer) => {
      if (answer.questionGroup) {
        const groupKey = answer.questionGroup.join("-");
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(answer);
      } else {
        const key = answer?.questionId?.toString();
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(answer);
      }
      return acc;
    },
    {}
  );

  // Sort groups by their first question number
  const sortedGroups = Object.entries(groupedAnswers).sort(([keyA], [keyB]) => {
    const numA = parseInt(keyA.split("-")[0]);
    const numB = parseInt(keyB.split("-")[0]);
    return numA - numB;
  });

  // Function to calculate partial correctness
  const getPartialCorrectness = (answers: Answer[]) => {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalCount = answers.length;
    return `${correctCount}/${totalCount}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Submitted Answers</h1>

      {/* Total Score Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">
            Total Score: {submission.totalScore} / 40
          </h2>
          <p>
            Submitted at: {new Date(submission.submittedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Answers Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="font-bold text-black">Question</th>
              <th className="font-bold text-black">Your Answer</th>
              <th className="font-bold text-black">Correct Answer</th>
              <th className="font-bold text-black">Type</th>
              <th className="font-bold text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedGroups.map(([groupKey, answers]: any) => {
              // For grouped answers (multiple MCQ)
              if (answers[0].questionGroup) {
                const selectedAnswers = answers
                  .map((a: any) => a.value)
                  .filter(Boolean)
                  .join(", ");
                const correctAnswers = answers
                  .map((a: any) => a.answerText)
                  .filter(Boolean)
                  .join(", ");
                const isGroupCorrect = answers.every((a: any) => a.isCorrect);
                const partialCorrectness = getPartialCorrectness(answers);
                const rowKey = `group:${groupKey}`;

                return (
                  <>
                    <tr
                      key={groupKey}
                      onClick={() => toggleExpanded(rowKey)}
                      className="cursor-pointer"
                      aria-expanded={expandedRowKey === rowKey}
                      title="Click to reveal details"
                    >
                      <td>{answers[0].questionGroup.join(", ")}</td>
                      <td>{selectedAnswers || "Not answered"}</td>
                      <td>{correctAnswers}</td>
                      <td>{answers[0].questionType || " "}</td>
                      <td className={isGroupCorrect ? "text-success" : "text-warning"}>
                        {isGroupCorrect ? "✅" : `⚠️ (${partialCorrectness})`}
                      </td>
                    </tr>
                    {expandedRowKey === rowKey && (
                      <tr>
                        <td colSpan={5}>
                          <div className="bg-base-200 rounded-lg p-4 mt-1">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                              <div className="font-semibold">
                                Multiple question set ({answers[0].questionGroup.join(", ")})
                              </div>
                              <div className={isGroupCorrect ? "text-success" : "text-warning"}>
                                {isGroupCorrect ? "Correct ✅" : `Partial (${partialCorrectness})`}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              {answers.map((answer: Answer, idx: number) => {
                                const perRowKey = `${rowKey}:q:${answer.questionId ?? idx}`;
                                return (
                                  <div key={perRowKey} className="rounded-md border border-gray-300 bg-base-100 p-3">
                                    <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                                      <div className="text-sm font-semibold">
                                        Question {Array.isArray(answer.questionId) ? answer.questionId.join(", ") : answer.questionId}
                                      </div>
                                      <div className={answer.isCorrect ? "text-success" : "text-error"}>
                                        {answer.isCorrect ? "✅ Correct" : "❌ Wrong"}
                                      </div>
                                    </div>
                                    {renderUserAnswerControl(answer, perRowKey)}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              }

              // For individual answers
              return answers.map((answer: any, index: any) => {
                const rowKey = `single:${groupKey}:${answer.questionId ?? index}`;
                return (
                  <React.Fragment key={rowKey}>
                    <tr
                      key={`${groupKey}-${index}`}
                      onClick={() => toggleExpanded(rowKey)}
                      className="cursor-pointer"
                      aria-expanded={expandedRowKey === rowKey}
                      title="Click to reveal details"
                    >
                      <td>{answer.questionId}</td>
                      <td>{answer.value || "Not answered"}</td>
                      <td>{answer.answerText as string}</td>
                      <td>{answer.questionType || " "}</td>
                      <td className={answer.isCorrect ? "text-success" : "text-error"}>
                        {answer.isCorrect ? "✅" : "❌"}
                      </td>
                    </tr>
                    {expandedRowKey === rowKey && (
                      <tr>
                        <td colSpan={5}>
                          <div className="bg-base-200 rounded-lg p-4 mt-1">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                              <div className="font-semibold">
                                Question {answer.questionId} - {answer.questionType || " "}
                              </div>
                              <div className={answer.isCorrect ? "text-success" : "text-error"}>
                                {answer.isCorrect ? "Correct ✅" : "Wrong ❌"}
                              </div>
                            </div>
                            {renderUserAnswerControl(answer, rowKey)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* Review Interface (same as test layout, but pre-filled + read-only) */}
      {readingTest && submission?.answers && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Review (same interface)</h2>
          <ReadingReview test={readingTest} submissionAnswers={submission.answers as any} />
        </div>
      )}
    </div>
  );
};

export default SubmissionPage;
