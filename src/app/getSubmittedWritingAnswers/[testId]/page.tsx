"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getSubmitWritingTest, updateWritingEvaluation } from "@/services/data";
import { useSession } from "next-auth/react";
import { evaluateWritingAnswer } from "@/services/ai";

// Define TypeScript interfaces
interface Answer {
  partId: string;
  question: string;
  response: string;
  instructions: string[];
  evaluation?: Evaluation;
}

interface Submission {
  _id: string;
  userId: string;
  testId: string;
  answers: Answer[];
  submittedAt: string;
  __v: number;
}

interface Evaluation {
  score: number;
  feedback: {
    taskAchievement: string;
    coherenceAndCohesion: string;
    lexicalResource: string;
    grammaticalRangeAndAccuracy: string;
  };
  overallFeedback: string;
}

const SubmissionPage = () => {
  const params = useParams();
  const { testId } = params;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Record<string, Evaluation>>(
    {}
  );
  const [evaluating, setEvaluating] = useState<Record<string, boolean>>({});
  const { data: session } = useSession();
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const testIdStr = Array.isArray(testId) ? testId[0] : testId;

        if (!testIdStr || !session?.user?.id) {
          console.log("Missing testId or userId:", {
            testId: testIdStr,
            userId: session?.user?.id,
          });
          return;
        }

        const response = await getSubmitWritingTest(testIdStr, session.user.id);
        if (response && response.success) {
          const submissionData = response.data;
          if (!submissionData) {
            console.error("No data in response");
            setError("No submission data found");
            return;
          }

          setSubmission(submissionData);
          setError(null);

          if (submissionData.answers && Array.isArray(submissionData.answers)) {
            for (const answer of submissionData.answers) {
              if (!answer.evaluation) {
                try {
                  setEvaluating((prev) => ({ ...prev, [answer.partId]: true }));
                  const evaluation = await evaluateWritingAnswer(
                    answer.question,
                    answer.response,
                    answer.instructions
                  );
                  setEvaluations((prev) => ({
                    ...prev,
                    [answer.partId]: evaluation,
                  }));
                  await updateWritingEvaluation(
                    testIdStr,
                    session.user.id,
                    answer.partId,
                    evaluation
                  );
                } catch (error) {
                  setError("Failed to evaluate some answers");
                } finally {
                  setEvaluating((prev) => ({
                    ...prev,
                    [answer.partId]: false,
                  }));
                }
              } else {
                setEvaluations((prev) => ({
                  ...prev,
                  [answer.partId]: answer.evaluation,
                }));
              }
            }
          }
        } else {
          setError("No data received from server");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [testId, session?.user?.id]);

  useEffect(() => {
    if (
      submission &&
      submission.answers.length > 0 &&
      Object.keys(evaluations).length === submission.answers.length
    ) {
      const score = submission.answers.reduce((total, answer) => {
        const evalResult = evaluations[answer.partId];
        return total + (evalResult?.score || 0);
      }, 0);

      // Save totalScore to DB
      if (submission) {
        const saveTotalScore = async () => {
          try {
            await fetch("/api/submitAnswers/submitWritingAnswers", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                submissionId: submission?._id,
                totalScore: score,
              }),
            });

            setTotalScore(score);
            console.log("Fetch Success!");
          } catch (err) {
            console.error("Failed to save totalScore", err);
          }
        };

        saveTotalScore();
      }
    }
  }, [evaluations, submission]);

  console.log("Submission and Total Score", { submission, totalScore });

  // Function to calculate the total score
  //   const getTotalScore = () => {
  //     return (
  //       submission?.answers.reduce((total, answer) => {
  //         const evaluation = evaluations[answer.partId];
  //         if (evaluation && evaluation.score) {
  //           return total + evaluation.score;
  //         }
  //         setTotalScore(total);
  //         return total;
  //       }, 0) || 0
  //     );
  //   };

  if (loading) {
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

  if (!submission) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-warning max-w-md">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>No submission found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h1 className="card-title text-3xl mb-4">Writing Test Submission</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="badge badge-info">
              Submitted: {submission?.submittedAt}
            </div>
            <div className="badge badge-primary">
              Test ID: {submission?.testId}
            </div>
          </div>

          {/* Display the Total Score */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-4">Total Score</h2>
            <p className="text-xl font-bold">Score: {totalScore}</p>
          </div>

          {submission?.answers?.map((answer, index) => (
            <div key={answer.partId} className="mb-8">
              <div className="divider"></div>
              <h2 className="text-2xl font-semibold mb-4">Task {index + 1}</h2>

              <div className="bg-base-200 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Question:</h3>
                <div className="prose max-w-none mb-4">
                  <p className="mb-2">{answer.question}</p>
                </div>

                <div className="mt-4 bg-neutral text-neutral-content p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Instructions:</h4>
                  <ul className="list-disc pl-5">
                    {answer.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Your Response:</h3>
                  <div className="p-4 border border-gray-300 rounded-lg bg-white">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800">
                      {answer.response}
                    </pre>
                  </div>
                  <div className="mt-2 text-right text-sm text-gray-500">
                    Word Count: {answer.response.trim().split(/\s+/).length}
                  </div>
                </div>

                <div className="mt-6">
                  {evaluating[answer.partId] ? (
                    <div className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Evaluating your answer...
                    </div>
                  ) : evaluations[answer.partId] ? (
                    <div className="mt-4 p-4 bg-base-100 rounded-lg shadow">
                      <h4 className="text-lg font-semibold mb-2">
                        Evaluation Results
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p>
                            <b>Task Achievement:</b>{" "}
                            {
                              evaluations[answer.partId].feedback
                                .taskAchievement
                            }
                          </p>
                          <br />
                          <p>
                            <b>Coherence & Cohesion:</b>{" "}
                            {
                              evaluations[answer.partId].feedback
                                .coherenceAndCohesion
                            }
                          </p>
                          <br />
                          <p>
                            <b>Lexical Resource:</b>{" "}
                            {
                              evaluations[answer.partId].feedback
                                .lexicalResource
                            }
                          </p>
                          <br />
                          <p>
                            <b>Grammatical Range:</b>{" "}
                            {
                              evaluations[answer.partId].feedback
                                .grammaticalRangeAndAccuracy
                            }
                          </p>
                          <br />
                        </div>
                        <div>
                          <p className="text-xl font-bold">
                            Final Band Score: {evaluations[answer.partId].score}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h5 className="font-semibold">Overall Feedback:</h5>
                        <p className="mt-2">
                          {evaluations[answer.partId].overallFeedback}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionPage;
