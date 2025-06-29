"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaChartBar,
  FaBook,
  FaHeadphones,
  FaEdit,
  FaMicrophone,
  FaCog,
  FaBell,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaSearch,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data
  const stats = [
    {
      name: "Reading Tests",
      link: "/admin/allReading",
      value: "24",
      icon: FaBook,
      color: "bg-blue-500",
    },
    {
      name: "Listening Tests",
      link: "/admin/allListening",
      value: "18",
      icon: FaHeadphones,
      color: "bg-green-500",
    },
    {
      name: "Writing Tests",
      link: "/admin/allWriting",
      value: "15",
      icon: FaEdit,
      color: "bg-yellow-500",
    },
    {
      name: "Speaking Tests",
      link: "/admin",
      value: "12",
      icon: FaMicrophone,
      color: "bg-purple-500",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      test: "Reading Test #5",
      action: "Updated",
      user: "Michael Chen",
      time: "15 min ago",
    },
    {
      id: 2,
      test: "Listening Test #3",
      action: "Created",
      user: "Emma Rodriguez",
      time: "32 min ago",
    },
    {
      id: 3,
      test: "Writing Task 2",
      action: "Modified",
      user: "David Kim",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-square btn-primary"
        >
          {sidebarOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      {/* <div
        className={`fixed inset-y-0 left-0 w-64 bg-base-100 shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static z-40 transition duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-base-300">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FaClipboardList className="text-primary" />
            <span>IELTS Admin</span>
          </h1>
        </div>

        <nav className="mt-6">
          <ul className="menu p-2">
            <li>
              <button
                className={`flex items-center ${
                  activePage === "dashboard" ? "active" : ""
                }`}
                onClick={() => setActivePage("dashboard")}
              >
                <FaChartBar />
                Dashboard
              </button>
            </li>

            <li className="menu-title mt-4">
              <span>Test Management</span>
            </li>

            <li>
              <button
                className={`flex items-center ${
                  activePage === "reading" ? "active" : ""
                }`}
                onClick={() => setActivePage("reading")}
              >
                <FaBook />
                Reading Tests
              </button>
            </li>

            <li>
              <button
                className={`flex items-center ${
                  activePage === "listening" ? "active" : ""
                }`}
                onClick={() => setActivePage("listening")}
              >
                <FaHeadphones />
                Listening Tests
              </button>
            </li>

            <li>
              <button
                className={`flex items-center ${
                  activePage === "writing" ? "active" : ""
                }`}
                onClick={() => setActivePage("writing")}
              >
                <FaEdit />
                Writing Tests
              </button>
            </li>

            <li>
              <button
                className={`flex items-center ${
                  activePage === "speaking" ? "active" : ""
                }`}
                onClick={() => setActivePage("speaking")}
              >
                <FaMicrophone />
                Speaking Tests
              </button>
            </li>

            <li className="menu-title mt-4">
              <span>Settings</span>
            </li>

            <li>
              <button
                className={`flex items-center ${
                  activePage === "settings" ? "active" : ""
                }`}
                onClick={() => setActivePage("settings")}
              >
                <FaCog />
                System Settings
              </button>
            </li>
          </ul>
        </nav>
      </div> */}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8 flex items-center justify-center flex-col gap-2">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-base-content/70">
              Manage IELTS tests and content
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base-content/70">{stat.name}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div
                      className={`p-3 rounded-full ${stat.color} text-white`}
                    >
                      <stat.icon className="text-xl" />
                    </div>
                  </div>
                  <div className="card-actions mt-4">
                    <Link href={stat.link}>
                      {" "}
                      <button className="btn btn-sm btn-outline">Manage</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent activity */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">Recent Activity</h2>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Test</th>
                        <th>Action</th>
                        <th>User</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((activity) => (
                        <tr key={activity.id}>
                          <td>{activity.test}</td>
                          <td>
                            <span className="badge badge-ghost">
                              {activity.action}
                            </span>
                          </td>
                          <td>{activity.user}</td>
                          <td>{activity.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary">View All Activity</button>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/admin/reading">
                    {" "}
                    <button className="btn btn-outline flex flex-col w-full h-24">
                      <FaBook className="text-2xl mb-2" />
                      <span>Add Reading Test</span>
                    </button>
                  </Link>

                  <Link href="/admin/listening">
                    <button className="btn btn-outline flex flex-col w-full h-24">
                      <FaHeadphones className="text-2xl mb-2" />
                      <span>Add Listening Test</span>
                    </button>
                  </Link>

                  <Link href="/admin/writing">
                    <button className="btn btn-outline flex flex-col w-full h-24">
                      <FaEdit className="text-2xl mb-2" />
                      <span>Add Writing Task</span>
                    </button>
                  </Link>

                  <Link href="/admin/speaking">
                    <button className="btn btn-outline flex flex-col w-full h-24">
                      <FaMicrophone className="text-2xl mb-2" />
                      <span>Add Speaking Test</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* User stats */}
          <div className="card bg-base-100 shadow mt-6">
            <div className="card-body">
              <h2 className="card-title">User Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stats bg-primary text-primary-content shadow">
                  <div className="stat">
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value">1,248</div>
                    <div className="stat-desc">↗︎ 12% this month</div>
                  </div>
                </div>
                <div className="stats bg-secondary text-secondary-content shadow">
                  <div className="stat">
                    <div className="stat-title">Active Users</div>
                    <div className="stat-value">842</div>
                    <div className="stat-desc">↗︎ 8% this month</div>
                  </div>
                </div>
                <div className="stats bg-accent text-accent-content shadow">
                  <div className="stat">
                    <div className="stat-title">Avg. Score</div>
                    <div className="stat-value">6.8</div>
                    <div className="stat-desc">↗︎ 0.3 this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
