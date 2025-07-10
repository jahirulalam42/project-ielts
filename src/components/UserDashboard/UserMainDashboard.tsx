"use client";
import React, { useState, useMemo } from "react";
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
import { FaChartLine, FaHistory, FaBell } from "react-icons/fa";
import { useSession } from "next-auth/react";

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
  const [selectedSkill, setSelectedSkill] = useState<
    "listening" | "reading" | "writing" | "speaking"
  >("listening");
  const [timeRange, setTimeRange] = useState<"1m" | "3m" | "6m">("3m");

  const skills = [
    { id: "listening", name: "Listening", color: "bg-purple-500" },
    { id: "reading", name: "Reading", color: "bg-blue-500" },
    { id: "writing", name: "Writing", color: "bg-green-500" },
    { id: "speaking", name: "Speaking", color: "bg-orange-500" },
  ];

  const testHistory = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    return [
      {
        id: 1,
        date: new Date(y, m - 1, 15).toISOString().split("T")[0],
        listening: 7.5,
        reading: 7.0,
        writing: 6.5,
        speaking: 7.0,
      },
      {
        id: 2,
        date: new Date(y, m - 2, 28).toISOString().split("T")[0],
        listening: 7.0,
        reading: 7.5,
        writing: 7.0,
        speaking: 6.5,
      },
      {
        id: 3,
        date: new Date(y, m - 2, 15).toISOString().split("T")[0],
        listening: 7.0,
        reading: 7.0,
        writing: 6.5,
        speaking: 7.0,
      },
      {
        id: 4,
        date: new Date(y, m - 3, 5).toISOString().split("T")[0],
        listening: 6.5,
        reading: 7.0,
        writing: 6.0,
        speaking: 6.5,
      },
      {
        id: 5,
        date: new Date(y, m - 3, 22).toISOString().split("T")[0],
        listening: 6.0,
        reading: 6.5,
        writing: 6.0,
        speaking: 6.0,
      },
      {
        id: 6,
        date: new Date(y, m - 3, 10).toISOString().split("T")[0],
        listening: 6.0,
        reading: 6.5,
        writing: 5.5,
        speaking: 6.0,
      },
    ];
  }, []);

  // Filter by timeRange
  const filteredTests = useMemo(() => {
    const today = new Date();
    const cutoff = new Date();
    if (timeRange === "1m") cutoff.setMonth(cutoff.getMonth() - 1);
    else if (timeRange === "3m") cutoff.setMonth(cutoff.getMonth() - 3);
    else cutoff.setMonth(cutoff.getMonth() - 6);

    return testHistory
      .filter((t) => {
        const d = new Date(t.date);
        return d >= cutoff && d <= today;
      })
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  }, [testHistory, timeRange]);

  // min/max for y-axis
  const [minScore, maxScore] = useMemo(() => {
    if (filteredTests.length === 0) return [0, 9];
    const all = filteredTests.flatMap((t) => [
      t.listening,
      t.reading,
      t.writing,
      t.speaking,
    ]);
    return [
      Math.floor(Math.min(...all) - 0.5),
      Math.ceil(Math.max(...all) + 0.5),
    ];
  }, [filteredTests]);

  // Chart.js data & options
  const chartData = useMemo(() => {
    const labels = filteredTests.map((t) =>
      new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );
    const dataPoints = filteredTests.map((t) => t[selectedSkill]);
    return {
      labels,
      datasets: [
        {
          label: `${skills.find((s) => s.id === selectedSkill)?.name} Score`,
          data: dataPoints,
          fill: true,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99,102,241,0.2)",
          pointBackgroundColor: "#6366f1",
          tension: 0.3,
        },
      ],
    };
  }, [filteredTests, selectedSkill, skills]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: minScore,
          max: maxScore,
          title: { display: true, text: "Score" },
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
    [minScore, maxScore]
  );

  // Trend indicator
  const trend = (() => {
    if (filteredTests.length < 2) return "stable";
    const first = filteredTests[0][selectedSkill];
    const last = filteredTests[filteredTests.length - 1][selectedSkill];
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

  return (
    <div className="min-h-screen bg-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md p-5 text-white">
            <div className="text-sm opacity-80">Listening</div>
            <div className="text-3xl font-bold mt-1">
              {filteredTests.length
                ? filteredTests[filteredTests.length - 1].listening
                : "--"}
            </div>
            <div className="text-sm mt-2">Latest score</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-md p-5 text-white">
            <div className="text-sm opacity-80">Reading</div>
            <div className="text-3xl font-bold mt-1">
              {filteredTests.length
                ? filteredTests[filteredTests.length - 1].reading
                : "--"}
            </div>
            <div className="text-sm mt-2">Latest score</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md p-5 text-white">
            <div className="text-sm opacity-80">Writing</div>
            <div className="text-3xl font-bold mt-1">
              {filteredTests.length
                ? filteredTests[filteredTests.length - 1].writing
                : "--"}
            </div>
            <div className="text-sm mt-2">Latest score</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-md p-5 text-white">
            <div className="text-sm opacity-80">Speaking</div>
            <div className="text-3xl font-bold mt-1">
              {filteredTests.length
                ? filteredTests[filteredTests.length - 1].speaking
                : "--"}
            </div>
            <div className="text-sm mt-2">Latest score</div>
          </div>
        </div>

        {/* Skill & Range Select */}
        {/* Filters + Charts Layout */}
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
                        className={`btn btn-sm ${
                          selectedSkill === s.id ? "" : "btn-outline"
                        } ${
                          s.id === "listening"
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

                {/* Time Range Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Range
                  </label>
                  <select
                    className="select select-bordered w-full select-sm"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                  >
                    <option value="1m">1 Month</option>
                    <option value="3m">3 Months</option>
                    <option value="6m">6 Months</option>
                  </select>
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
                  Progress Over Time
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
                    {filteredTests.length} tests
                  </span>
                </div>
              </div>
              <div className="p-6 h-64">
                {filteredTests.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <FaChartLine className="text-4xl mb-4" />
                    <p>No test data available for the selected period</p>
                    <p className="text-sm mt-2">
                      Take some tests to see your progress
                    </p>
                  </div>
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </div>
            </div>

            {/* Recent History Table (keep as is) */}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Test History
            </h3>
          </div>
          <div className="p-1">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-gray-600 text-sm">
                    Test
                  </th>
                  <th className="py-3 px-4 text-center text-gray-600 text-sm">
                    Date
                  </th>
                  <th className="py-3 px-4 text-center text-gray-600 text-sm">
                    L
                  </th>
                  <th className="py-3 px-4 text-center text-gray-600 text-sm">
                    R
                  </th>
                  <th className="py-3 px-4 text-center text-gray-600 text-sm">
                    W
                  </th>
                  <th className="py-3 px-4 text-center text-gray-600 text-sm">
                    S
                  </th>
                  <th className="py-3 px-4 text-center text-gray-600 text-sm">
                    Overall
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test) => {
                  const overall = (
                    (test.listening +
                      test.reading +
                      test.writing +
                      test.speaking) /
                    4
                  ).toFixed(1);
                  return (
                    <tr key={test.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {test.id}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 text-sm">
                        {new Date(test.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      {(
                        ["listening", "reading", "writing", "speaking"] as const
                      ).map((skill) => (
                        <td key={skill} className="py-3 px-4 text-center">
                          <span
                            className={`font-medium ${
                              selectedSkill === skill
                                ? "text-purple-600"
                                : "text-gray-700"
                            }`}
                          >
                            {test[skill]}
                          </span>
                        </td>
                      ))}
                      <td className="py-3 px-4 text-center font-bold text-gray-900">
                        {overall}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredTests.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <FaHistory className="mx-auto text-3xl mb-2" />
                <p>No test history available</p>
              </div>
            )}
            <div className="p-4 border-t border-gray-100">
              <button className="btn btn-outline w-full">
                View All Test Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
