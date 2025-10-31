"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from '@/components/Common/Loader';
import { getSubmitWritingTest, getSingleWritingTest } from "@/services/data";
import { useSession } from "next-auth/react";

// Define TypeScript interfaces
interface Answer {
  partId: string;
  question: string;
  response: string;
  instructions: string[];
  image?: string;
}

interface Submission {
  _id: string;
  userId: string;
  testId: string;
  answers: Answer[];
  submittedAt: string;
  __v: number;
}

interface OriginalTestPart {
  title: string;
  subtitle: string;
  Question: string[];
  instruction: string[];
  image: string;
  _id: string;
}

interface OriginalTest {
  title: string;
  _id: string;
  type: string;
  duration: number;
  parts: OriginalTestPart[];
}

const SubmissionPage = () => {
  const params = useParams();
  const { testId } = params;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [originalTest, setOriginalTest] = useState<OriginalTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Helper function to get image for an answer
  const getImageForAnswer = (answer: Answer, index: number): string | undefined => {
    // First try to get image from submission
    if (answer.image) {
      return answer.image;
    }
    
    // If no image in submission, try to get from original test
    if (originalTest && originalTest.parts && originalTest.parts[index]) {
      return originalTest.parts[index].image;
    }
    
    return undefined;
  };

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
        console.log("Raw submission response:", response);
        
        if (response && response.success) {
          const submissionData = response.data;
          if (!submissionData) {
            console.error("No data in response");
            setError("No submission data found");
            return;
          }

          console.log("Submission data:", submissionData);
          console.log("Answers:", submissionData.answers);
          
          // Check if answers have images
          if (submissionData.answers) {
            submissionData.answers.forEach((answer: any, index: number) => {
              console.log(`Answer ${index + 1}:`, {
                question: answer.question,
                image: answer.image,
                hasImage: !!answer.image
              });
            });
          }

          setSubmission(submissionData);

          // Fetch original test data to get images if missing
          try {
            const originalTestResponse = await getSingleWritingTest(testIdStr);
            if (originalTestResponse && originalTestResponse.success) {
              setOriginalTest(originalTestResponse.data);
              console.log("Original test data:", originalTestResponse.data);
            }
          } catch (err) {
            console.error("Failed to fetch original test data:", err);
          }

          setError(null);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader message="Loading writing submissions..." />
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

          {submission?.answers?.map((answer, index) => (
            <div key={answer.partId} className="mb-8">
              <div className="divider"></div>
              <h2 className="text-2xl font-semibold mb-4">Task {index + 1}</h2>

              <div className="bg-base-200 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Question:</h3>
                <div className="prose max-w-none mb-4">
                  <p className="mb-2">{answer.question}</p>
                </div>

                {getImageForAnswer(answer, index) && (
                  <div className="my-4">
                    <img
                      src={getImageForAnswer(answer, index)}
                      alt="Question Image"
                      className="rounded-lg max-w-full h-auto mx-auto"
                      onError={(e) => console.error("Image failed to load:", getImageForAnswer(answer, index))}
                      onLoad={() => console.log("Image loaded successfully:", getImageForAnswer(answer, index))}
                    />
                  </div>
                )}
                {!getImageForAnswer(answer, index) && (
                  <div className="my-4 p-2 bg-yellow-100 text-yellow-800 rounded">
                    Debug: No image found for this answer. 
                    Submission image: {JSON.stringify(answer.image)} | 
                    Original test image: {originalTest?.parts?.[index]?.image || 'N/A'}
                  </div>
                )}

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
                    Word Count: {answer.response.trim().split(/\s+/).filter(word => word.length > 0).length}
                  </div>
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
