"use client";
import { useEffect, useState, useRef, useCallback } from 'react';
import { redirect, useParams } from 'next/navigation';
import { getSingleWritingTest, postSubmitWritingTest } from '@/services/data';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


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
  _id: string;
  type: string;
  duration: number;
  parts: TestPart[];
}

export default function WritingTestPage() {
  const params = useParams();
  const [test, setTest] = useState<WritingTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState(0);
  const [panelWidths, setPanelWidths] = useState<Record<number, number>>({
    0: 50,
    1: 50
  });
  const [isDragging, setIsDragging] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const router = useRouter();

  // Function to count words
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleMouseDown = (e: React.MouseEvent, taskIndex: number) => {
    setIsDragging(true);
    setCurrentTaskIndex(taskIndex);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || currentTaskIndex === null) return;

    const containers = document.querySelectorAll('.split-container');
    const container = containers[currentTaskIndex];
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limit the width between 20% and 80%
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setPanelWidths(prev => ({
        ...prev,
        [currentTaskIndex]: newLeftWidth
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setCurrentTaskIndex(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentTaskIndex]);

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

  const handleResponseChange = (partId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [partId]: value
    }));
    // Update word count
    setWordCounts(prev => ({
      ...prev,
      [partId]: countWords(value)
    }));
  };

  // Submit handler with requested data structure
  const handleSubmit = async () => {
    if (!test) return;

    const submissionTime = new Date();

    // Create answers array in the requested format
    const answers = test.parts.map(part => ({
      partId: part._id,
      question: part.Question.join(' '), // Combine question array
      response: responses[part._id] || '',
      instructions: part.instruction
    }));

    // Create test data object exactly as requested
    const testData = {
      userId: session?.user?.id,
      testId: test._id,
      answers: answers,
      submittedAt: submissionTime.toLocaleString(),
    };

    console.log("Test Submission Data:", testData);

    try {
      const data = await postSubmitWritingTest(testData);
      console.log(data.success);
      if (data.success) {
        toast.success("Test Submitted successfully!");
        router.push(`/getSubmittedWritingAnswers/${testData.testId}`);
        // Optionally, redirect or reset the form
      } else {
        toast.error("Failed to submit test. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the test.");
    }
  };


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

          {/* Tab Content */}
          {test.parts.map((part: TestPart, index: number) => (
            <div 
              key={part._id} 
              className={`mb-8 ${activeTab === index ? 'block' : 'hidden'}`}
            >
              <div className="divider"></div>
              <h2 className="text-2xl font-semibold mb-4">{part.title}</h2>
              
              <div className="split-container flex relative">
                {/* Left Side - Question and Instructions */}
                <div 
                  className="bg-base-200 p-6 rounded-lg overflow-auto"
                  style={{ width: `${panelWidths[index]}%` }}
                >
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
                </div>

                {/* Resizer */}
                <div
                  className={`w-1 bg-base-300 hover:bg-primary cursor-col-resize transition-colors ${
                    isDragging && currentTaskIndex === index ? 'bg-primary' : ''
                  }`}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                />

                {/* Right Side - Input Area */}
                <div 
                  className="bg-base-200 p-6 rounded-lg overflow-auto"
                  style={{ width: `${100 - panelWidths[index]}%` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Your Response:</label>
                    <div className="text-sm">
                      Word count: {wordCounts[part._id] || 0}
                    </div>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full h-[calc(100vh-300px)]"
                    placeholder="Write your response here..."
                    value={responses[part._id] || ''}
                    onChange={(e) => handleResponseChange(part._id, e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-8 flex justify-end gap-4">
            <button className="btn btn-primary" onClick={() => handleSubmit()}>
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

      {/* Sticky Bottom Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-100 shadow-lg border-t">
        <div className="container mx-auto">
          <div className="flex w-full">
            <button 
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 0 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 hover:bg-base-300'
              }`}
              onClick={() => setActiveTab(0)}
            >
              Task 1
            </button>
            <button 
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 1 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 hover:bg-base-300'
              }`}
              onClick={() => setActiveTab(1)}
            >
              Task 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}