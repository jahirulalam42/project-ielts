"use client";
import { getAllUsers } from "@/services/data";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaChartBar,
  FaBook,
  FaHeadphones,
  FaEdit,
  FaMicrophone,
  FaCog,
  FaBell,
  FaTimes,
  FaSearch,
  FaUser,
  FaClipboardList,
  FaPlusCircle,
  FaBars,
} from "react-icons/fa";
import { toast } from "react-toastify";

// Main Dashboard Component
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [users, setUsers]: any = useState();

  // Mock data for the enhanced dashboard
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
      link: "/admin/speaking",
      value: "12",
      icon: FaMicrophone,
      color: "bg-purple-500",
    },
    {
      name: "Total Users",
      link: "/admin/users",
      value: users?.length || 0,
      icon: FaUser,
      color: "bg-indigo-500",
    },
    {
      name: "New Tests This Week",
      link: "/admin/allTests",
      value: "7",
      icon: FaPlusCircle,
      color: "bg-pink-500",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        setUsers(result?.data || []);
      } catch (err) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-base-200 px-20">
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : ""
        }`}
      >
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-base-content/70">
              Manage IELTS Tests and Content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                      <button className="btn btn-sm btn-outline">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Quick Actions Card */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/admin/reading">
                    <button className="btn btn-primary flex flex-col w-full h-24">
                      <FaPlusCircle className="text-2xl mb-2" />
                      <span>Add Reading Test</span>
                    </button>
                  </Link>
                  <Link href="/admin/listening">
                    <button className="btn btn-primary flex flex-col w-full h-24">
                      <FaPlusCircle className="text-2xl mb-2" />
                      <span>Add Listening Test</span>
                    </button>
                  </Link>
                  <Link href="/admin/writing">
                    <button className="btn btn-primary flex flex-col w-full h-24">
                      <FaPlusCircle className="text-2xl mb-2" />
                      <span>Add Writing Task</span>
                    </button>
                  </Link>
                  <Link href="/admin/speaking">
                    <button className="btn btn-primary flex flex-col w-full h-24">
                      <FaPlusCircle className="text-2xl mb-2" />
                      <span>Add Speaking Test</span>
                    </button>
                  </Link>
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
