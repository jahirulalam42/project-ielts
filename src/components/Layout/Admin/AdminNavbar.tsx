"use client";
import LoginButton from "@/components/Auth/LoginButton";
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
  FaCaretDown,
  FaHome,
  FaMusic,
} from "react-icons/fa";

const AdminNavbar = () => {
  const [activePage, setActivePage] = useState("dashboard");
  return (
    <div className="navbar bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-4 shadow-xl">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>

        <div className="flex flex-row gap-2">
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label
                htmlFor="my-drawer"
                className="btn btn-square btn-ghost drawer-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>

              <div
                className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-indigo-900 to-purple-900 text-white transform transition-transform duration-300 lg:translate-x-0 translate-x-0`}
              >
                <div className="flex flex-col h-full">
                  {/* Sidebar header */}
                  <div className="p-6 border-b border-indigo-700">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                      <FaClipboardList className="text-purple-300" />
                      <span>IELTS Admin</span>
                    </h1>
                    <p className="text-xs text-purple-300 mt-1">
                      Dashboard v2.1
                    </p>
                  </div>

                  {/* Sidebar navigation */}
                  <nav className="flex-1 overflow-y-auto py-4 px-2">
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/admin"
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            activePage === "dashboard"
                              ? "bg-purple-700 text-white shadow-md"
                              : "text-purple-200 hover:bg-purple-800"
                          }`}
                          onClick={() => setActivePage("dashboard")}
                        >
                          <FaChartBar className="text-lg" />
                          <span>Dashboard</span>
                        </Link>
                      </li>

                      <li className="mt-6 px-3">
                        <h3 className="text-xs uppercase tracking-wider text-purple-400">
                          Test Management
                        </h3>
                      </li>

                      <li>
                        <Link
                          href="/admin/allReading"
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            activePage === "reading"
                              ? "bg-purple-700 text-white shadow-md"
                              : "text-purple-200 hover:bg-purple-800"
                          }`}
                          onClick={() => setActivePage("reading")}
                        >
                          <FaBook className="text-lg" />
                          <span>Reading Tests</span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/admin/allListening"
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            activePage === "listening"
                              ? "bg-purple-700 text-white shadow-md"
                              : "text-purple-200 hover:bg-purple-800"
                          }`}
                          onClick={() => setActivePage("listening")}
                        >
                          <FaHeadphones className="text-lg" />
                          <span>Listening Tests</span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/admin/allWriting"
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            activePage === "writing"
                              ? "bg-purple-700 text-white shadow-md"
                              : "text-purple-200 hover:bg-purple-800"
                          }`}
                          onClick={() => setActivePage("writing")}
                        >
                          <FaEdit className="text-lg" />
                          <span>Writing Tests</span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/admin/speaking"
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            activePage === "speaking"
                              ? "bg-purple-700 text-white shadow-md"
                              : "text-purple-200 hover:bg-purple-800"
                          }`}
                          onClick={() => setActivePage("speaking")}
                        >
                          <FaMicrophone className="text-lg" />
                          <span>Speaking Tests</span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/admin/audio-management"
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            activePage === "audio-management"
                              ? "bg-purple-700 text-white shadow-md"
                              : "text-purple-200 hover:bg-purple-800"
                          }`}
                          onClick={() => setActivePage("audio-management")}
                        >
                          <FaMusic className="text-lg" />
                          <span>Audio Management</span>
                        </Link>
                      </li>

                      <li className="mt-6 px-3">
                        <h3 className="text-xs uppercase tracking-wider text-purple-400">
                          User Management
                        </h3>
                      </li>

                      <li>
                        <Link
                          href="/admin/users"
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            activePage === "userManage"
                              ? "bg-purple-700 text-white shadow-md"
                              : "text-purple-200 hover:bg-purple-800"
                          }`}
                          onClick={() => setActivePage("userManage")}
                        >
                          <FaUser className="text-lg" />
                          <span>Users</span>
                        </Link>
                      </li>

                      <li className="mt-6 px-3">
                        <h3 className="text-xs uppercase tracking-wider text-purple-400">
                          Settings
                        </h3>
                      </li>

                      <li>
                        <Link
                          href="/admin/settings"
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            activePage === "settings"
                              ? "bg-purple-700 text-white shadow-md"
                              : "text-purple-200 hover:bg-purple-800"
                          }`}
                          onClick={() => setActivePage("settings")}
                        >
                          <FaCog className="text-lg" />
                          <span>System Settings</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>

                  {/* Sidebar footer */}
                  <div className="p-4 border-t border-indigo-700 text-center">
                    <div className="badge badge-success gap-2">Online</div>
                    <p className="text-xs text-purple-300 mt-2">
                      © 2023 IELTS Admin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="flex items-center gap-2">
          {/* <div className="bg-white p-2 rounded-lg">
            <FaClipboardList className="text-indigo-700 text-xl" />
          </div> */}
          <h1 className="text-xl font-bold">IELTS Admin</h1>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <div className="relative w-96">
          <div className="join w-full">
            <input
              type="text"
              placeholder="Search tests, users, settings..."
              className="input input-bordered join-item w-full bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button className="btn join-item bg-indigo-600 border-indigo-600 hover:bg-indigo-700 text-white">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="navbar-end flex gap-4">
        {/* Home button */}
        <Link
          href="/"
          className="btn btn-sm btn-outline btn-accent hidden md:flex"
        >
          <FaHome className="mr-1" /> Main Site
        </Link>

        {/* Notifications dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FaBell className="text-xl" />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="dropdown-content z-50 mt-4 card card-compact w-72 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">Notifications</span>
              <div className="mt-2 space-y-2">
                <div className="alert alert-info p-2">
                  <span>New speaking test submission</span>
                </div>
                <div className="alert p-2">
                  <span>System update scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User profile dropdown */}
        <div className="dropdown dropdown-end text-black">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/profile/demo/averagebulk@192.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <LoginButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
