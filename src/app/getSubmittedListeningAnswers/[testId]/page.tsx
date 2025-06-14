"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getSubmitListeningTest } from "@/services/data";

// Define TypeScript interfaces for clarity
interface Submission {
  _id: string;
  userId: string;
  testId: string;
  answers: AnswerGroup[];
  submittedAt: string;
  totalScore: number;
  __v: number;
}

interface AnswerEntry {
  questionId: string;
  value: string;
  answerText: string;
  isCorrect: boolean;
  numericId: number;
}

interface AnswerGroup {
  [key: string]: {
    value: string;
    answerText: string;
    isCorrect: boolean;
  };
}

const SubmissionPage = () => {
  const params = useParams();
  const { testId }: any = params;
  const { data: session, status } = useSession();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await getSubmitListeningTest(
          testId,
          session?.user?.id
        );
        console.log("Response", response);

        if (response.success) {
          const data = Array.isArray(response.data)
            ? response.data[0]
            : response.data;

          setSubmission(data || null);
          setError(null);
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
  }, [testId, session?.user?.id, status]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-error">{error}</div>;
  if (!submission)
    return <div className="text-center p-4">No submission data available</div>;

  // Convert the single object in `answers` array to a flat list
  const answersObject = submission.answers[0] || {};
  const individualAnswers: AnswerEntry[] = Object.entries(answersObject)
    .map(([key, value]: [string, any]) => ({
      questionId: key,
      value: value.value,
      answerText: value.answerText,
      isCorrect: value.isCorrect,
      numericId: parseInt(key.replace(/^\D+/g, "")) || 0,
    }))
    .sort((a, b) => a.numericId - b.numericId);

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
              <th>Question</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Correct</th>
            </tr>
          </thead>
          <tbody>
            {individualAnswers.map((answer, index) => (
              <tr key={index}>
                <td>{answer.questionId}</td>
                <td>{answer.value || "Not answered"}</td>
                <td>{answer.answerText}</td>
                <td
                  className={answer.isCorrect ? "text-success" : "text-error"}
                >
                  {answer.isCorrect ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionPage;
