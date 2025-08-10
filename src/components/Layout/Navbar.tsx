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
        !pathName.startsWith("/user/") && (
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
                  <ul className="menu menu-horizontal px-1 space-x-1">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`font-medium px-4 py-2 rounded-md transition-colors duration-200 btn btn-ghost rounded-btn ${
                            pathName.startsWith(link.href)
                              ? "text-red-700 bg-red-50 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {link.label}
                        </Link>
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
                  <div className="dropdown dropdown-end lg:hidden">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost btn-circle"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu menu-sm mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52 border border-gray-200"
                    >
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={`${
                              pathName.startsWith(link.href)
                                ? "active bg-red-50 text-red-700"
                                : ""
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                      {data?.user.role === "admin" && (
                        <li>
                          <Link href="/admin">Admin Panel</Link>
                        </li>
                      )}
                      {data && (
                        <>
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
                          <li>
                            <LoginButton />
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

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
