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

const AdminNavbar = () => {
  const [activePage, setActivePage] = useState("dashboard");
  return (
    <div className="navbar bg-base-100 border-b border-black">
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

              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                <div className="py-4 border-b border-base-300">
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    <FaClipboardList className="text-primary" />
                    <span>IELTS Admin</span>
                  </h1>
                </div>

                <li>
                  <button
                    className={`flex items-center ${activePage === "dashboard" ? "active" : ""
                      }`}
                    onClick={() => setActivePage("dashboard")}
                  >
                    <FaChartBar />
                    <Link href="/admin">Dashboard</Link>
                  </button>
                </li>

                <li className="menu-title mt-4">
                  <span>Test Management</span>
                </li>

                <li>
                  <button
                    className={`flex items-center ${activePage === "reading" ? "active" : ""
                      }`}
                    onClick={() => setActivePage("reading")}
                  >
                    <FaBook />

                    <Link href="/admin/reading">Reading Tests</Link>
                  </button>
                </li>

                <li>
                  <button
                    className={`flex items-center ${activePage === "listening" ? "active" : ""
                      }`}
                    onClick={() => setActivePage("listening")}
                  >
                    <FaHeadphones />

                    <Link href="/admin/listening">Listening Tests</Link>
                  </button>
                </li>

                <li>
                  <button
                    className={`flex items-center ${activePage === "writing" ? "active" : ""
                      }`}
                    onClick={() => setActivePage("writing")}
                  >
                    <FaEdit />

                    <Link href="/admin/writing">Writing Tests</Link>
                  </button>
                </li>

                <li>
                  <button
                    className={`flex items-center ${activePage === "speaking" ? "active" : ""
                      }`}
                    onClick={() => setActivePage("speaking")}
                  >
                    <FaMicrophone />

                    <Link href="/admin/speaking">Speaking Tests</Link>
                  </button>
                </li>

                <li className="menu-title mt-4">
                  <span>Settings</span>
                </li>

                <li>
                  <button
                    className={`flex items-center ${activePage === "settings" ? "active" : ""
                      }`}
                    onClick={() => setActivePage("settings")}
                  >
                    <FaCog />

                    <Link href="/admin">System Settings</Link>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <div className="relative w-64">
          <div className="join w-full">
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered join-item w-full"
            />
            <button className="btn join-item">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
      <div className="navbar-end flex gap-2">
        <div>
          <Link href={"/"} className="btn">
            Main
          </Link>
          <a className="btn">Button</a>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
          >
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

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
