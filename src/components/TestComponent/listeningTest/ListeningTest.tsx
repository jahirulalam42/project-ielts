"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import SubFillInTheBlanks from "../Common/SubFillInTheBlanks";
import McqSingle from "../Common/McqSingle";
import McqMultiple from "../Common/McqMultiple";
import BoxMatching from "../Common/BoxMatching";
import Map from "../Common/Map";
import { postSubmitListeningTest } from "@/services/data";
import { useRouter } from "next/navigation";

interface ListeningTestProps {
  test: {
    id: string;
    title: string;
    type: string;
    duration: number;
    audioUrl: string;
    parts: Array<{
      title: string;
      questions: Array<{
        fill_in_the_blanks_with_subtitle?: any[];
        mcq?: any[];
        map?: any[];
      }>;
    }>;
  };
}

const ListeningTest: React.FC<any> = ({ test }) => {
  const router = useRouter();
  const [answers, setAnswers] = useState<any>({});
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60); // Convert minutes to seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const { data: session }: any = useSession();

  const currentPart = test.parts[currentPartIndex];

  // Function to get all question numbers for each part
  const getPartQuestionNumbers = () => {
    const partQuestions: { [key: number]: number[] } = {};

    test.parts.forEach((part: any, partIndex: number) => {
      const questionNumbers: number[] = [];

      part.questions.forEach((questionSet: any) => {
        if (questionSet.fill_in_the_blanks_with_subtitle) {
          questionSet.fill_in_the_blanks_with_subtitle.forEach(
            (blankSet: any) => {
              blankSet.questions?.forEach((q: any) => {
                questionNumbers.push(q.question_number);
              });
            }
          );
        }
        if (questionSet.mcq) {
          questionSet.mcq.forEach((q: any) => {
            questionNumbers.push(q.question_number);
          });
        }
        if (questionSet.multiple_mcq) {
          questionSet.multiple_mcq.forEach((q: any) => {
            q.question_numbers.forEach((num: number) => {
              questionNumbers.push(num);
            });
          });
        }
        if (questionSet.box_matching) {
          questionSet.box_matching.forEach((q: any) => {
            q.questions.forEach((boxQuestion: any) => {
              questionNumbers.push(boxQuestion.question_number);
            });
          });
        }
        if (questionSet.map) {
          questionSet.map.forEach((mapSet: any) => {
            mapSet.questions.forEach((q: any) => {
              questionNumbers.push(q.question_number);
            });
          });
        }
      });

      partQuestions[partIndex] = questionNumbers.sort((a, b) => a - b);
    });

    return partQuestions;
  };

  const partQuestions = getPartQuestionNumbers();

  useEffect(() => {
    // Initialize answers state
    const initialAnswers: any = {};
    test.parts.forEach((part: any) => {
      part.questions.forEach((questionSet: any) => {
        if (questionSet.fill_in_the_blanks_with_subtitle) {
          questionSet.fill_in_the_blanks_with_subtitle.forEach(
            (blankSet: any) => {
              blankSet.questions?.forEach((q: any) => {
                initialAnswers[`${q.question_number}`] = {
                  value: "",
                  answerText: q.answer,
                  isCorrect: false,
                };
              });
            }
          );
        }
        if (questionSet.mcq) {
          questionSet.mcq.forEach((q: any) => {
            initialAnswers[`${q.question_number}`] = {
              value: "",
              answerText: q.answer,
              isCorrect: false,
            };
          });
        }
        if (questionSet.multiple_mcq) {
          questionSet.multiple_mcq.forEach((q: any) => {
            q.question_numbers.forEach((num: number) => {
              initialAnswers[`${num}`] = {
                value: "",
                answerText: q.correct_mapping[q.question_numbers.indexOf(num)],
                isCorrect: false,
                questionGroup: q.question_numbers, // Add questionGroup for multiple MCQ
              };
            });
          });
        }
        if (questionSet.box_matching) {
          questionSet.box_matching.forEach((q: any) => {
            q.questions.forEach((boxQuestion: any) => {
              initialAnswers[`${boxQuestion.question_number}`] = {
                value: "",
                answerText: boxQuestion.answer,
                isCorrect: false,
              };
            });
          });
        }
        if (questionSet.map) {
          questionSet.map.forEach((mapSet: any) => {
            mapSet.questions.forEach((q: any) => {
              initialAnswers[`${q.question_number}`] = {
                value: "",
                answerText: q.answer,
                isCorrect: false,
              };
            });
          });
        }
      });
    });
    setAnswers(initialAnswers);
  }, [test.parts]);

  const handleAnswerChange = (
    questionId: number,
    value: string,
    inputType: string,
    answer: string,
    isCorrect?: boolean,
    questionGroup?: number[]
  ) => {
    setAnswers((prev: any) => ({
      ...prev,
      [`${questionId}`]: {
        value,
        answerText: answer,
        isCorrect: isCorrect,
        questionType: inputType,
        questionGroup: questionGroup, // Add questionGroup for multiple MCQ
      },
    }));
  };

  const handleQuestionFocus = (questionId: number) => {
    setCurrentQuestionNumber(questionId);
  };

  // Navigate to a specific question number (switch part if needed and smooth-scroll to question)
  const handleQuestionNavigation = (questionNumber: number, partIndex: number) => {
    setCurrentPartIndex(partIndex);
    setCurrentQuestionNumber(questionNumber);

    // Delay to allow the part content to render before measuring/scrolling
    setTimeout(() => {
      // Locate the RIGHT-side questions container (listening layout mirrors reading)
      let questionsContainer: any = null;

      const candidates = document.querySelectorAll('.lg\\:h-\\[80vh\\].lg\\:overflow-y-auto');
      for (let c of candidates as any) {
        if (
          (c as HTMLElement).querySelector('[id^="question-"]') ||
          (c as HTMLElement).textContent?.includes('Question')
        ) {
          questionsContainer = c;
          break;
        }
      }
      if (!questionsContainer) {
        // fallback by border-l (right side)
        questionsContainer = document.querySelector('.lg\\:h-\\[80vh\\].lg\\:overflow-y-auto.border-l');
      }
      if (!questionsContainer) return;

      // Find specific question container by direct id first
      let questionElement = document.getElementById(`question-${questionNumber}`) as HTMLElement | null;

      // If not found, search a group container that includes this number
      if (!questionElement) {
        const groups = (questionsContainer as HTMLElement).querySelectorAll('[data-question-numbers]');
        for (let g of Array.from(groups)) {
          const list = (g as HTMLElement).getAttribute('data-question-numbers')?.split(',') || [];
          if (list.includes(String(questionNumber))) {
            questionElement = g as HTMLElement;
            break;
          }
        }
      }

      if (!questionElement) return;

      // Compute relative position and do a single smooth scroll (avoid jitter)
      const containerRect = (questionsContainer as HTMLElement).getBoundingClientRect();
      const elRect = questionElement.getBoundingClientRect();
      const relativeTop = elRect.top - containerRect.top;
      (questionsContainer as HTMLElement).scrollTo({
        top: (questionsContainer as HTMLElement).scrollTop + relativeTop - 50,
        behavior: 'smooth'
      });

      // Do not auto-click radio/checkbox; only focus non-choice inputs
      setTimeout(() => {
        const hasChoice = questionElement.querySelector('input[type="radio"], input[type="checkbox"]');
        if (!hasChoice) {
          const firstInput = questionElement.querySelector('input, textarea, select, button') as HTMLElement | null;
          if (firstInput) {
            firstInput.focus();
            if ((firstInput as HTMLInputElement).tagName === 'INPUT' && (firstInput as HTMLInputElement).type === 'text') {
              (firstInput as HTMLInputElement).select();
            }
          }
        }
      }, 50);
    }, 300);
  };

  const handleNextPart = () => {
    if (currentPartIndex < test.parts.length - 1) {
      setCurrentPartIndex((prev) => prev + 1);
      // Set current question to first question of next part
      const nextPartQuestions = partQuestions[currentPartIndex + 1];
      if (nextPartQuestions && nextPartQuestions.length > 0) {
        setCurrentQuestionNumber(nextPartQuestions[0]);
      }
    }
  };

  const handlePrevPart = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev) => prev - 1);
      // Set current question to first question of previous part
      const prevPartQuestions = partQuestions[currentPartIndex - 1];
      if (prevPartQuestions && prevPartQuestions.length > 0) {
        setCurrentQuestionNumber(prevPartQuestions[0]);
      }
    }
  };

  // Scroll to top whenever the part changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Scroll main page to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Also scroll the questions panel (right side) to top
      const questionsContainer = document.querySelector('.lg\\:h-\\[80vh\\].lg\\:overflow-y-auto.border-l');
      if (questionsContainer) {
        questionsContainer.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentPartIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionTime = new Date();

    const totalPoint = Object.values(answers).filter(
      (answer: any) => answer.isCorrect === true
    ).length;

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]: any) => ({
        questionId: parseInt(questionId),
        value: answer.value,
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
        questionType: answer.questionType || "fill_in_the_blanks",
        questionGroup: answer.questionGroup, // Include questionGroup for multiple MCQ
      })
    );

    const testData = {
      userId: session?.user?.id,
      testId: test._id,
      answers: formattedAnswers,
      totalScore: totalPoint,
      submittedAt: submissionTime.toLocaleString(),
    };

    try {
      // TODO: Implement your submission API call here
      // const res = await postSubmitListeningTest(testData);

      const res = await postSubmitListeningTest(testData);

      console.log("This is Test Data", testData);
      console.log("Result", res);

      toast.success("Submission successful!");
      router.push(`/getSubmittedListeningAnswers/${testData.testId}`);
    } catch (error: any) {
      toast.error(`Submission failed: ${error.message}`);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTimeUp(true);
      handleSubmit(new Event("submit") as any);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container mx-auto p-4 min-h-screen pb-32">
        {/* Test Header */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h1 className="card-title text-3xl">{test.title}</h1>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg">Type: {test.type}</p>
                <p className="text-lg">Duration: {test.duration} minutes</p>
              </div>
              <div className="badge badge-primary">
                Part {currentPartIndex + 1} of {test.parts.length}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-lg font-bold">
                Time Left: {formatTime(timeLeft)}
              </div>
              {isTimeUp && (
                <div className="text-lg text-red-500 font-bold">Time's up!</div>
              )}
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <audio controls className="w-full">
              <source src={test.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>

        {/* Questions Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">{currentPart.title}</h2>
            <div className="space-y-6">
              {currentPart.questions?.map((questionSet: any, index: any) => {
                // gather question ids within this set to aid navigation
                const ids: number[] = [];
                if (questionSet.fill_in_the_blanks_with_subtitle) {
                  questionSet.fill_in_the_blanks_with_subtitle.forEach((blankSet: any) => {
                    blankSet.questions?.forEach((q: any) => ids.push(q.question_number));
                  });
                }
                if (questionSet.mcq) {
                  questionSet.mcq.forEach((q: any) => ids.push(q.question_number));
                }
                if (questionSet.multiple_mcq) {
                  questionSet.multiple_mcq.forEach((q: any) => {
                    if (Array.isArray(q.question_numbers)) q.question_numbers.forEach((n: number) => ids.push(n));
                    else if (q.question_number) ids.push(q.question_number);
                  });
                }
                if (questionSet.box_matching) {
                  questionSet.box_matching.forEach((q: any) => {
                    q.questions?.forEach((bq: any) => ids.push(bq.question_number));
                  });
                }
                if (questionSet.map) {
                  questionSet.map.forEach((m: any) => {
                    m.questions?.forEach((q: any) => ids.push(q.question_number));
                  });
                }
                const firstId = ids[0] || index + 1;

                return (
                <div key={index} id={`question-${firstId}`} data-question-numbers={ids.join(',')}>
                  {questionSet.fill_in_the_blanks_with_subtitle && (
                    <SubFillInTheBlanks
                      instructions={questionSet.instruction}
                      question={questionSet.fill_in_the_blanks_with_subtitle}
                      handleAnswerChange={handleAnswerChange}
                      handleQuestionFocus={handleQuestionFocus}
                    />
                  )}
                  {questionSet.mcq && (
                    <McqSingle
                      instructions={questionSet.instruction}
                      question={questionSet.mcq}
                      answers={answers}
                      handleAnswerChange={handleAnswerChange}
                      handleQuestionFocus={handleQuestionFocus}
                    />
                  )}
                  {questionSet.multiple_mcq && (
                    <McqMultiple
                      instructions={questionSet.instruction}
                      question={questionSet.multiple_mcq}
                      answers={answers}
                      handleAnswerChange={handleAnswerChange}
                      handleQuestionFocus={handleQuestionFocus}
                    />
                  )}
                  {questionSet.box_matching && (
                    <BoxMatching
                      instructions={questionSet.instruction}
                      question={questionSet.box_matching}
                      handleAnswerChange={handleAnswerChange}
                      handleQuestionFocus={handleQuestionFocus}
                    />
                  )}
                  {questionSet.map && (
                    <Map
                      question={questionSet.map[0]}
                      handleAnswerChange={handleAnswerChange}
                      handleQuestionFocus={handleQuestionFocus}
                      answers={answers}
                    />
                  )}
                </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevPart}
                disabled={currentPartIndex === 0}
                className="btn btn-secondary"
                type="button"
              >
                Previous
              </button>
              <button
                onClick={handleNextPart}
                disabled={currentPartIndex === test.parts.length - 1}
                className="btn bg-red-600 hover:bg-red-700 border-0"
                type="button"
              >
                Next
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-success mt-6 w-full">
              Submit Test
            </button>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>

      {/* Fixed Question Navigation Panel at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="px-4 py-2">
          <div className="flex justify-between">
            {test.parts.map((part: any, partIndex: number) => (
              <div key={partIndex} className="flex-1 flex justify-center">
                <div className="border-2 border-gray-300 rounded-lg p-2 flex flex-wrap gap-1 justify-center">
                  {partQuestions[partIndex]?.map((questionNumber: number) => {
                    const hasAnswered =
                      answers[questionNumber]?.value &&
                      answers[questionNumber]?.value.trim() !== "";

                    return (
                      <button
                        key={`${questionNumber}-${partIndex}`}
                        type="button"
                        className={`w-8 h-8 text-xs rounded border transition-colors ${
                          questionNumber === currentQuestionNumber
                            ? "bg-blue-500 text-white border-blue-500"
                            : hasAnswered
                            ? "bg-green-200 text-green-700 border-green-400 hover:bg-green-300"
                            : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                        }`}
                        onClick={() => handleQuestionNavigation(questionNumber, partIndex)}
                      >
                        {questionNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default ListeningTest;
