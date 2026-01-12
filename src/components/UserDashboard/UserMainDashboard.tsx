"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";
import { FaChartLine } from "react-icons/fa";
import { useSession } from "next-auth/react";
import {
  getAllListeningAnswers,
  getAllReadingAnswers,
  getAllWritingAnswers,
  getAllSpeakingAnswers,
  getSingleUser,
  getOnboardingData,
} from "@/services/data";
import HistoryTable from "./HistoryTable";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  Title
);

const Dashboard = () => {
  const { data } = useSession();
  const [selectedSkill, setSelectedSkill] = useState<
    "listening" | "reading" | "writing" | "speaking"
  >("listening");

  // Store all test data for all skills
  const [allSkillData, setAllSkillData] = useState<{
    listening: any[];
    reading: any[];
    writing: any[];
    speaking: any[];
  }>({ listening: [], reading: [], writing: [], speaking: [] });
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);

  const skills = [
    { id: "listening", name: "Listening", color: "bg-purple-500" },
    { id: "reading", name: "Reading", color: "bg-blue-500" },
    { id: "writing", name: "Writing", color: "bg-green-500" },
    { id: "speaking", name: "Speaking", color: "bg-orange-500" },
  ];

  useEffect(() => {
    const fetchAllSkills = async () => {
      if (!data?.user?.id) return;
      setLoading(true);
      const userId = data.user.id;
      try {
        const [listening, reading, writing, speaking] = await Promise.all([
          getAllListeningAnswers(userId),
          getAllReadingAnswers(userId),
          getAllWritingAnswers(userId),
          getAllSpeakingAnswers(userId),
        ]);
        setAllSkillData({
          listening: listening?.data || [],
          reading: reading?.data || [],
          writing: writing?.data || [],
          speaking: speaking?.data || [],
        });
      } catch (error) {
        console.error("Error fetching all skill data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchUserData = async () => {
      if (!data?.user?.id) return;
      try {
        const result = await getSingleUser(data.user.id);
        setUserData(result?.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    const fetchOnboardingData = async () => {
      if (!data?.user?.id) return;
      try {
        const result = await getOnboardingData(data.user.id);
        setOnboardingData(result?.data);
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
        setOnboardingData(null);
      }
    };
    
    if (data?.user?.id) {
      fetchAllSkills();
      fetchUserData();
      fetchOnboardingData();
    }
  }, [data?.user]);

  // For the selected skill, build testHistory for chart/table as before
  const testHistory = useMemo(() => {
    const arr = allSkillData[selectedSkill] || [];
    return arr
      .map((test: any) => {
        let writingScore = 0;
        let speakingScore = 0;
        
        if (selectedSkill === 'writing' && Array.isArray(test.answers) && test.answers.length > 0) {
          // For writing, calculate total word count instead of score
          const totalWords = test.answers.reduce((sum: number, answer: any) => {
            const wordCount = answer.response?.trim().split(/\s+/).filter((word: string) => word.length > 0).length || 0;
            return sum + wordCount;
          }, 0);
          writingScore = totalWords;
        }
        
        if (selectedSkill === 'speaking') {
          // For speaking, use recording duration as the metric
          speakingScore = test.feedback?.recording_duration || 0;
        }
        
        return {
          ...test,
          id: test._id,
          date: new Date(test.submittedAt).toISOString().split("T")[0],
          listening: 0,
          reading: 0,
          writing: selectedSkill === 'writing' ? writingScore : 0,
          speaking: selectedSkill === 'speaking' ? speakingScore : 0,
          [selectedSkill]: selectedSkill === 'writing' ? writingScore : 
                          selectedSkill === 'speaking' ? speakingScore : test.totalScore,
        };
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [allSkillData, selectedSkill]);

  // min/max for y-axis
  const [minScore, maxScore] = useMemo(() => {
    if (testHistory.length === 0) return [0, 9];

    const all = testHistory.flatMap((t: any) => [
      t.listening,
      t.reading,
      t.writing,
      t.speaking,
    ]);

    return [
      Math.floor(Math.min(...all) - 0.5),
      Math.ceil(Math.max(...all) + 0.5),
    ];
  }, [testHistory]);

  // Chart.js data & options
  const chartData = useMemo(() => {
    // Reverse to show chronological order in chart (oldest to newest)
    const chronologicalTests = [...testHistory].reverse();

    const labels = chronologicalTests.map((t: any) =>
      new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );

    const dataPoints = chronologicalTests.map((t: any) => t[selectedSkill]);

    return {
      labels,
      datasets: [
        {
          label: selectedSkill === 'writing' 
            ? "Word Count Progression" 
            : selectedSkill === 'speaking'
            ? "Recording Duration (seconds)"
            : `${skills.find((s) => s.id === selectedSkill)?.name} Score`,
          data: dataPoints,
          fill: true,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99,102,241,0.2)",
          pointBackgroundColor: "#6366f1",
          tension: 0.3,
        },
      ],
    };
  }, [testHistory, selectedSkill, skills]);

  // Chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: minScore,
          max: maxScore,
          title: { 
            display: true, 
            text: selectedSkill === 'writing' ? "Word Count" : 
                  selectedSkill === 'speaking' ? "Duration (seconds)" : "Score" 
          },
        },
        x: {
          title: { display: true, text: "Test Date" },
        },
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
    }),
    [minScore, maxScore, selectedSkill]
  );

  // Trend indicator
  const trend = (() => {
    if (testHistory.length < 2) return "stable";
    const first = testHistory[testHistory.length - 1][selectedSkill];
    const last = testHistory[0][selectedSkill];
    if (last > first + 0.5) return "up";
    if (last < first - 0.5) return "down";
    return "stable";
  })();

  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
        ? "text-red-500"
        : "text-gray-500";

  // Generate personalized welcome message
  const getWelcomeMessage = () => {
    if (!userData?.username) return "Welcome back!";
    
    const username = userData.username;
    const messages: string[] = [];
    
    if (onboardingData?.status === "completed") {
      if (onboardingData.targetScore) {
        messages.push(`aiming for ${onboardingData.targetScore}`);
      }
      if (onboardingData.purpose) {
        messages.push(`preparing for ${onboardingData.purpose.toLowerCase()}`);
      }
      if (onboardingData.hardestModule && Array.isArray(onboardingData.hardestModule) && onboardingData.hardestModule.length > 0) {
        const modules = onboardingData.hardestModule.join(" and ");
        messages.push(`focusing on ${modules}`);
      }
    }
    
    if (messages.length > 0) {
      return `Welcome back, ${username}! You're ${messages.join(", ")}.`;
    }
    
    return `Welcome back, ${username}!`;
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Personalized Welcome Message */}
        {userData && (
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl shadow-lg p-6 md:p-8 mb-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {getWelcomeMessage()}
                </h2>
                {onboardingData?.status === "completed" && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {onboardingData.targetScore && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <span className="text-sm opacity-90">Target Score</span>
                        <div className="text-lg font-semibold">{onboardingData.targetScore}</div>
                      </div>
                    )}
                    {onboardingData.examDate || onboardingData.examDateType || onboardingData.customExamDate ? (
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <span className="text-sm opacity-90">Exam Date</span>
                        <div className="text-lg font-semibold">
                          {onboardingData.customExamDate || onboardingData.examDateType || onboardingData.examDate || "Not set"}
                        </div>
                      </div>
                    ) : null}
                    {onboardingData.targetCountries && 
                     Array.isArray(onboardingData.targetCountries) && 
                     onboardingData.targetCountries.length > 0 && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <span className="text-sm opacity-90">Target Region</span>
                        <div className="text-lg font-semibold">
                          {onboardingData.targetCountries.slice(0, 2).join(", ")}
                          {onboardingData.targetCountries.length > 2 && ` +${onboardingData.targetCountries.length - 2}`}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="hidden md:block ml-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              IELTS Progress Dashboard
            </h1>
            <p className="text-gray-600">
              Track your test scores and improvement over time
            </p>
          </div>
        </div>

        {/* Stats Cards - Highlight selected skill */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
          {skills.map((skill) => {
            const arr = allSkillData[skill.id as keyof typeof allSkillData] || [];
            
            // Calculate highest score properly for each skill
            let highestScore = 0;
            let scoreLabel = "Highest score";
            
            if (skill.id === 'writing') {
              // For writing, show total tests taken
              highestScore = arr.length;
              scoreLabel = "Total Tests Taken";
            } else if (skill.id === 'speaking') {
              // For speaking, show total tests taken and average duration
              highestScore = arr.length;
              scoreLabel = "Total Tests Taken";
            } else {
              // For other skills, use totalScore as before
              highestScore = arr.length > 0 ? Math.max(...arr.map((test: any) => {
                return test.totalScore || 0;
              })) : 0;
              scoreLabel = "Highest score";
            }
            
            const isSelected = selectedSkill === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill.id as any)}
                className={`cursor-pointer rounded-xl shadow-md p-5 text-white transition-all duration-300 ${isSelected
                  ? "ring-4 ring-white ring-opacity-80 transform scale-[1.02]"
                  : "opacity-70 hover:opacity-100"
                  } ${skill.id === "listening"
                    ? "bg-gradient-to-br from-purple-600 to-indigo-700"
                    : skill.id === "reading"
                      ? "bg-gradient-to-br from-blue-600 to-cyan-700"
                      : skill.id === "writing"
                        ? "bg-gradient-to-br from-green-600 to-emerald-700"
                        : "bg-gradient-to-br from-orange-600 to-amber-700"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm opacity-80">{skill.name}</div>
                    <div className="text-3xl font-bold mt-1">{highestScore}</div>
                    <div className="text-sm mt-2">{scoreLabel}</div>
                  </div>
                  {isSelected && (
                    <div className="bg-white bg-opacity-20 rounded-full p-1">
                      <div className="bg-white rounded-full w-2 h-2"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Skill & Range Select */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Filter Panel */}
          <div className="w-full lg:w-1/4">
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body p-5">
                <h2 className="card-title text-lg font-semibold mb-2">Skill</h2>

                {/* Skill Selector */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {skills.map((s) => (
                      <button
                        key={s.id}
                        className={`btn btn-sm ${selectedSkill === s.id ? "" : "btn-outline"
                          } ${s.id === "listening"
                            ? "btn-primary"
                            : s.id === "reading"
                              ? "btn-info"
                              : s.id === "writing"
                                ? "btn-success"
                                : "btn-warning"
                          }`}
                        onClick={() => setSelectedSkill(s.id as any)}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Data Info</h3>
                  <p className="text-xs text-gray-600">
                    Showing latest 10 tests for {selectedSkill} skill
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="w-full md:w-3/4 flex flex-col gap-6">
            {/* Chart Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Latest 10 Tests
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${trendColor}`}>
                    {trend === "up"
                      ? "↑ Improving"
                      : trend === "down"
                        ? "↓ Declining"
                        : "→ Stable"}
                  </span>
                  <span className="badge badge-outline">
                    {testHistory.length} tests
                  </span>
                </div>
              </div>
              <div className="p-6 h-64">
                {testHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <FaChartLine className="text-4xl mb-4" />
                    <p>No test data available</p>
                    <p className="text-sm mt-2">
                      Take some tests to see your progress
                    </p>
                  </div>
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent History Table */}
        <HistoryTable selectedSkill={selectedSkill} testHistory={testHistory} />
      </div>
    </div>
  );
};

export default Dashboard;
