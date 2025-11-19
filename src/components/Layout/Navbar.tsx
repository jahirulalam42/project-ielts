// components/Navbar.tsx
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LoginButton from "../Auth/LoginButton";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { getSingleUser } from "@/services/data";
import userImage from "../../../public/images/user.jpg";
import NotificationBell from "@/components/Common/NotificationBell";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
  }
}

const Navbar: React.FC = () => {
  const pathName = usePathname();
  const { data } = useSession();
  const [userData, setUserData]: any = useState();

  // Navigation links data
  const navLinks = [
    { href: "/test/listening", label: "Listening" },
    { href: "/test/reading", label: "Reading" },
    { href: "/test/writing", label: "Writing" },
    { href: "/test/speaking", label: "Speaking" },
    {
      href: "/writing-samples",
      label: "Writing Samples",
      hasSubmenu: true,
      submenu: [
        { href: "/writing-samples", label: "All Samples" },
        { href: "/writing-samples?task=1", label: "Task 1" },
        { href: "/writing-samples?task=2", label: "Task 2" },
      ],
    },
  ];

  useEffect(() => {
    const fetchSingleUser = async () => {
      if (data) {
        const result = await getSingleUser(data?.user.id);
        setUserData(result?.data);
        return result;
      }
    };
    fetchSingleUser();
  }, [data]);

  return (
    <div>
      {!pathName.startsWith("/test/reading/") &&
        !pathName.startsWith("/test/writing/") &&
        !pathName.startsWith("/test/listening/") &&
        !pathName.startsWith("/admin") &&
        !pathName.startsWith("/user/") &&
        !pathName.startsWith("/writing-samples/") && (
          <nav className="bg-gray-200 border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4">
              <div className="navbar">
                {/* Logo */}
                <div className="navbar-start">
                  <Link href="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">I</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800 hidden sm:block">
                      IELTS<span className="text-red-700">Prep</span>
                    </span>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-center hidden lg:flex">
                  <ul className="menu menu-horizontal px-1 py-3 gap-2">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        {link.hasSubmenu ? (
                          <details>
                            <summary
                              className={`font-medium transition-colors duration-200 ${
                                pathName.startsWith(link.href)
                                  ? "text-red-700 bg-red-50 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {link.label}
                            </summary>
                            <ul className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 w-52 z-50">
                              {link.submenu?.map((subItem) => (
                                <li key={subItem.href}>
                                  <Link
                                    href={subItem.href}
                                    className={`text-gray-700 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-md transition-colors duration-200 ${
                                      pathName === subItem.href
                                        ? "bg-red-50 text-red-700 font-medium"
                                        : ""
                                    }`}
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </details>
                        ) : (
                          <Link
                            href={link.href}
                            className={`font-medium transition-colors duration-200 ${
                              pathName.startsWith(link.href)
                                ? "text-red-700 bg-red-50 font-semibold"
                                : "text-gray-600"
                            }`}
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right side controls */}
                <div className="navbar-end gap-2">
                  {data?.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="btn btn-sm btn-outline border-red-700 text-red-700 hover:bg-red-50 hover:border-red-800 hidden sm:inline-flex"
                    >
                      Admin Panel
                    </Link>
                  )}

                  {/* Mobile menu button */}
                  <div className="dropdown lg:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
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
                      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                    >
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          {link.hasSubmenu ? (
                            <>
                              <span
                                className={`font-medium ${
                                  pathName.startsWith(link.href)
                                    ? "text-red-700 bg-red-50 font-semibold"
                                    : "text-gray-600"
                                }`}
                              >
                                {link.label}
                              </span>
                              <ul className="p-2 bg-gray-50 rounded-md">
                                {link.submenu?.map((subItem) => (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      className={`text-gray-700 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-md transition-colors duration-200 ${
                                        pathName === subItem.href
                                          ? "bg-red-50 text-red-700 font-medium"
                                          : ""
                                      }`}
                                    >
                                      {subItem.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <Link
                              href={link.href}
                              className={`font-medium ${
                                pathName.startsWith(link.href)
                                  ? "text-red-700 bg-red-50 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {data && <NotificationBell />}

                  {/* User profile dropdown */}
                  {data ? (
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                      >
                        <div className="w-10 rounded-full bg-gray-100 border border-gray-200">
                          <img
                            alt="User Profile"
                            src={userData?.image || userImage.src}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52 border border-gray-200"
                      >
                        <li className="menu-title">
                          <span>Hello, {data.user.name}</span>
                        </li>
                        <div className="divider my-1"></div>
                        <li>
                          <Link href="/userDashboard">Dashboard</Link>
                        </li>
                        <li>
                          <Link href="/profile">Profile</Link>
                        </li>
                        <li>
                          <Link href="/settings">Settings</Link>
                        </li>
                        <div className="divider my-1"></div>
                        <li>
                          <LoginButton />
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="hidden sm:block">
                      <LoginButton />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}
    </div>
  );
};

export default Navbar;
