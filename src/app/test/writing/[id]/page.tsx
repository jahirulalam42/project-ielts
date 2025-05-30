"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSingleWritingTest } from '@/services/data';

interface TestPart {
  title: string;
  subtitle: string;
  Question: string[];
  instruction: string[];
  image: string;
  _id: string;
}

interface WritingTest {
  title: string;
  type: string;
  duration: number;
  parts: TestPart[];
}

export default function WritingTestPage() {
  const params = useParams();
  const [test, setTest] = useState<WritingTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await getSingleWritingTest(params.id);
        if (data.success) {
          setTest(data.data);
        }
      } catch (err) {
        setError('Failed to fetch writing test');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [params.id]);

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

  if (!test) {
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
          <span>Test not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h1 className="card-title text-3xl mb-4">{test.title}</h1>
          <div className="flex gap-4 mb-6">
            <div className="badge badge-info">{test.type}</div>
            <div className="badge badge-warning">
              Duration: {test.duration} minutes
            </div>
          </div>

          {test.parts.map((part: TestPart) => (
            <div key={part._id} className="mb-8">
              <div className="divider"></div>
              <h2 className="text-2xl font-semibold mb-4">{part.title}</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">{part.subtitle}</h3>

                <div className="prose max-w-none mb-4">
                  {Array.isArray(part.Question) && part.Question.length > 0 ? (
                    part.Question.map((question, index) => (
                      <p key={index} className="mb-2">{question}</p>
                    ))
                  ) : (
                    <p>No questions available.</p>
                  )}
                </div>

                {part.image && (
                  <div className="my-4">
                    <img
                      src={part.image}
                      alt={part.title}
                      className="rounded-lg max-w-full h-auto mx-auto"
                    />
                  </div>
                )}

                <div className="mt-6 bg-neutral text-neutral-content p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Instructions:</h4>
                  {Array.isArray(part.instruction) && part.instruction.length > 0 ? (
                    part.instruction.map((instruction, index) => (
                      <p key={index}>{instruction}</p>
                    ))
                  ) : (
                    <p>No instructions available.</p>
                  )}
                </div>

                <div className="mt-6">
                  <textarea
                    className="textarea textarea-bordered w-full h-64"
                    placeholder="Write your response here..."
                  ></textarea>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-8 flex justify-end gap-4">
            <button className="btn btn-primary">
              Submit Test
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
