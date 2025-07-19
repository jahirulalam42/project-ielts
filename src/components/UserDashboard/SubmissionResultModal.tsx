import React, { useEffect, useState } from "react";
import { getSubmitReadingTest, getSubmitWritingTest } from "@/services/data";

interface SubmissionResultModalProps {
  testId: string;
  userId: string;
  onClose: () => void;
  testType?: "reading" | "writing" | "listening" | "speaking";
}

interface Submission {
  _id: string;
  userId: string;
  testId: string;
  answers: Answer[];
  submittedAt: string;
  totalScore?: number;
  __v: number;
}

interface Answer {
  questionId?: number | any[];
  value?: string;
  answers?: any[];
  answerText?: string | any[];
  isCorrect?: boolean;
  questionGroup?: number[];
  // Writing specific fields
  partId?: string;
  question?: string;
  response?: string;
  instructions?: string[];
}

const SubmissionResultModal: React.FC<SubmissionResultModalProps> = ({ 
  testId, 
  userId, 
  onClose, 
  testType = "reading" 
}) => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('SubmissionResultModal: testId:', testId, 'userId:', userId, 'testType:', testType);
    if (!testId || !userId) {
      setError('Missing testId or userId.');
      setLoading(false);
      return;
    }
    
    const fetchSubmission = async () => {
      try {
        let response;
        if (testType === "writing") {
          console.log('Fetching writing test with:', { testId, userId });
          response = await getSubmitWritingTest(testId, userId);
        } else {
          console.log('Fetching reading test with:', { testId, userId });
          response = await getSubmitReadingTest(testId, userId);
        }
        
        console.log('API response:', response);
        if (response && response.success) {
          const data = Array.isArray(response.data)
            ? response.data[0]
            : response.data;
          setSubmission(data || null);
          setError(null);
        } else {
          setError("Failed to fetch submission data: " + (response?.message || 'No data.'));
        }
      } catch (err: any) {
        console.error('Error details:', err);
        setError("An error occurred while fetching data: " + (err?.message || err));
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [testId, userId, testType]);

  // Group answers by questionGroup and maintain order (for reading/listening)
  const groupedAnswers = submission?.answers.reduce(
    (acc: { [key: string]: Answer[] }, answer) => {
      if (answer.questionGroup) {
        const groupKey = answer.questionGroup.join("-");
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(answer);
      } else {
        const key = answer?.questionId?.toString() || 'unknown';
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

  // Function to count words
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-2 right-2 btn btn-sm btn-circle z-10" onClick={onClose}>
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
              
              {/* Writing Test Display */}
              {testType === "writing" && (
                <div className="card bg-base-100 shadow-xl mb-6">
                  <div className="card-body">
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="badge badge-info">
                        Submitted: {submission?.submittedAt}
                      </div>
                      <div className="badge badge-primary">
                        Test ID: {submission?.testId}
                      </div>
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
                              {answer.instructions?.map((instruction, idx) => (
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
                              Word Count: {countWords(answer.response || '')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reading/Listening Test Display */}
              {testType !== "writing" && (
                <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionResultModal; 