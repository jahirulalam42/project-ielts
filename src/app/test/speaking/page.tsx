"use client";
import React, { useEffect, useState } from "react";
import { getSpeakingTests } from "@/services/data";
import Link from "next/link";
import { FaMicrophone, FaClock, FaPlay, FaPause, FaStop } from "react-icons/fa";

interface SpeakingTest {
  _id: string;
  title: string;
  type: "part1" | "part2" | "part3" | "full_test";
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  total_duration: number;
  questions: Array<{
    question_number: number;
    question: string;
    question_type: string;
    speaking_time: number;
  }>;
}

const SpeakingPage: React.FC = () => {
  const [speakingData, setSpeakingData] = useState<SpeakingTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"part1" | "part2" | "part3" | "full_test">("part1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSpeakingTests();
        setSpeakingData(data.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTests = speakingData.filter(test => test.type === activeTab);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return <span className="badge badge-success gap-2">Easy</span>;
      case "medium":
        return <span className="badge badge-warning gap-2">Medium</span>;
      case "hard":
        return <span className="badge badge-error gap-2">Hard</span>;
      default:
        return <span className="badge badge-info gap-2">Not Rated</span>;
    }
  };

  const getTabInfo = (tab: string) => {
    switch (tab) {
      case "part1":
        return {
          title: "Part 1: Personal Questions",
          description: "Short personal questions about familiar topics",
          duration: "4-5 minutes",
          icon: "🎤"
        };
      case "part2":
        return {
          title: "Part 2: Cue Card",
          description: "1 minute preparation + 2 minutes speaking",
          duration: "3-4 minutes",
          icon: "📝"
        };
      case "part3":
        return {
          title: "Part 3: Discussion",
          description: "Follow-up questions and deeper discussion",
          duration: "4-5 minutes",
          icon: "💬"
        };
      case "full_test":
        return {
          title: "Full Test",
          description: "Complete IELTS Speaking test (Parts 1-3)",
          duration: "11-14 minutes",
          icon: "📋"
        };
      default:
        return { title: "", description: "", duration: "", icon: "" };
    }
  };

  if (isLoading) {
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

  const tabInfo = getTabInfo(activeTab);

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          IELTS Speaking Tests
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Practice your speaking skills with authentic IELTS-style questions
        </p>

        <div className="bg-white p-4 rounded-lg shadow-md inline-flex items-center">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Tests</div>
              <div className="stat-value text-primary">
                {speakingData.length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Test Types</div>
              <div className="stat-value text-secondary">4</div>
            </div>
            <div className="stat">
              <div className="stat-title">Duration</div>
              <div className="stat-value text-accent">11-14 min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="tabs tabs-boxed justify-center">
          {[
            { key: "part1", label: "Part 1" },
            { key: "part2", label: "Part 2" },
            { key: "part3", label: "Part 3" },
            { key: "full_test", label: "Full Test" }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 text-center">
          <div className="text-4xl mb-2">{tabInfo.icon}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {tabInfo.title}
          </h2>
          <p className="text-gray-600 mb-2">{tabInfo.description}</p>
          <div className="badge badge-info gap-2">
            <FaClock className="h-4 w-4" />
            {tabInfo.duration}
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="max-w-4xl mx-auto">
        {filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="card-title text-lg">{test.title}</h3>
                    {getDifficultyBadge(test.difficulty)}
                  </div>
                  
                  {test.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {test.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <FaMicrophone className="text-info h-4 w-4" />
                    <span className="text-sm text-gray-600">
                      {test.questions.length} question{test.questions.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <FaClock className="text-warning h-4 w-4" />
                    <span className="text-sm text-gray-600">
                      {test.total_duration} minutes
                    </span>
                  </div>

                  <div className="card-actions justify-end">
                    <Link
                      href={`/test/speaking/${test._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Start Test
                      <FaPlay className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎤</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No {activeTab.replace('_', ' ')} tests available
            </h3>
            <p className="text-gray-500">
              Check back later for new speaking tests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingPage; 