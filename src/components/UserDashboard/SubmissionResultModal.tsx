import React, { useEffect, useState } from "react";
import { getSubmitReadingTest } from "@/services/data";

interface SubmissionResultModalProps {
  testId: string;
  userId: string;
  onClose: () => void;
}

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
}

const SubmissionResultModal: React.FC<SubmissionResultModalProps> = ({ testId, userId, onClose }) => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Debug logging
    console.log('SubmissionResultModal: testId:', testId, 'userId:', userId);
    if (!testId || !userId) {
      setError('Missing testId or userId.');
      setLoading(false);
      return;
    }
    const fetchSubmission = async () => {
      try {
        const response = await getSubmitReadingTest(testId, userId);
        console.log('API response:', response);
        if (response.success) {
          const data = Array.isArray(response.data)
            ? response.data[0]
            : response.data;
          setSubmission(data || null);
          setError(null);
        } else {
          setError("Failed to fetch submission data: " + (response.message || 'No data.'));
        }
      } catch (err: any) {
        setError("An error occurred while fetching data: " + (err?.message || err));
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [testId, userId]);

  // Group answers by questionGroup and maintain order
  const groupedAnswers = submission?.answers.reduce(
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
  ) || {};

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full relative">
        <button className="absolute top-2 right-2 btn btn-sm btn-circle" onClick={onClose}>
          ✕
        </button>
        <div className="container mx-auto p-4">
          {loading && <div className="text-center p-4">Loading...</div>}
          {error && <div className="text-center p-4 text-error">{error}</div>}
          {!loading && !error && !submission && (
            <div className="text-center p-4">No submission data available</div>
          )}
          {!loading && !error && submission && (
            <>
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
                      <th className="font-bold text-black">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedGroups.map(([groupKey, answers]) => {
                      // For grouped answers (multiple MCQ)
                      if (answers[0].questionGroup) {
                        const selectedAnswers = answers
                          .map((a) => a.value)
                          .filter(Boolean)
                          .join(", ");
                        const correctAnswers = answers
                          .map((a) => a.answerText)
                          .filter(Boolean)
                          .join(", ");
                        const isGroupCorrect = answers.every((a) => a.isCorrect);
                        const partialCorrectness = getPartialCorrectness(answers);

                        return (
                          <tr key={groupKey} className="bg-base-200">
                            <td>{answers[0].questionGroup.join(", ")}</td>
                            <td>{selectedAnswers}</td>
                            <td>{correctAnswers}</td>
                            <td
                              className={
                                isGroupCorrect ? "text-success" : "text-warning"
                              }
                            >
                              {isGroupCorrect ? "✅" : `⚠️ (${partialCorrectness})`}
                            </td>
                          </tr>
                        );
                      }

                      // For individual answers
                      return answers.map((answer, index) => (
                        <tr key={`${groupKey}-${index}`}>
                          <td>{answer.questionId}</td>
                          <td>{answer.value || "Not answered"}</td>
                          <td>{answer.answerText as string}</td>
                          <td
                            className={answer.isCorrect ? "text-success" : "text-error"}
                          >
                            {answer.isCorrect ? "✅" : "❌"}
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionResultModal; 