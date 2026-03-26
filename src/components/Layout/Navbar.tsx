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
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
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

  const hideForUserRoute =
    pathName.startsWith("/user/") &&
    pathName !== "/user/signin" &&
    pathName !== "/user/signin/" &&
    pathName !== "/user/signup" &&
    pathName !== "/user/signup/";

  return (
    <div>
      {!pathName.startsWith("/test/reading/") &&
        !pathName.startsWith("/test/writing/") &&
        !pathName.startsWith("/test/listening/") &&
        !pathName.startsWith("/admin") &&
        !hideForUserRoute &&
        !pathName.startsWith("/writing-samples/") && (
          <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-4">
              <div className="navbar py-2">
                {/* Logo */}
                <div className="navbar-start">
                  <Link 
                    href="/" 
                    className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-red-500/50 group-hover:scale-110">
                      <span className="text-white font-bold text-xl">I</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800 hidden sm:block transition-colors duration-300 group-hover:text-gray-900">
                      IELTS<span className="text-red-700 group-hover:text-red-600 transition-colors duration-300">Prep</span>
                    </span>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-center hidden lg:flex">
                  <ul className="menu menu-horizontal px-1 py-3 gap-1">
                    {navLinks.map((link) => (
                      <li key={link.href} className="relative group">
                        {link.hasSubmenu ? (
                          <>
                            <div
                              className={`font-medium px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer relative inline-block ${
                                pathName.startsWith(link.href)
                                  ? "text-red-700 font-semibold"
                                  : "text-gray-700 hover:text-red-600"
                              }`}
                            >
                              <span className="relative z-10">{link.label}</span>
                              {pathName.startsWith(link.href) ? (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></span>
                              ) : (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                              )}
                            </div>
                            <ul className="absolute left-0 top-full py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 w-56 z-50 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              {link.submenu?.map((subItem) => (
                                <li key={subItem.href} className="px-2.5">
                                  <Link
                                    href={subItem.href}
                                    className={`px-3 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:translate-x-1 block ${
                                      pathName === subItem.href
                                        ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-medium shadow-sm"
                                        : "text-gray-700 hover:bg-red-50 hover:text-red-700"
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
                            className={`font-medium px-4 py-2 rounded-lg transition-all duration-300 relative group inline-block ${
                              pathName.startsWith(link.href)
                                ? "text-red-700 font-semibold"
                                : "text-gray-700 hover:text-red-600"
                            }`}
                          >
                            <span className="relative z-10">{link.label}</span>
                            {pathName.startsWith(link.href) ? (
                              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full animate-in slide-in-from-left duration-300"></span>
                            ) : (
                              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right side controls */}
                <div className="navbar-end gap-3">
                  {data?.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="btn btn-sm btn-outline border-red-700 text-red-700 hover:bg-red-700 hover:text-white hover:border-red-700 hidden sm:inline-flex transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      Admin Panel
                    </Link>
                  )}

                  {/* Mobile menu button */}
                  <div className="dropdown lg:hidden">
                    <div 
                      tabIndex={0} 
                      role="button" 
                      className="btn btn-ghost rounded-lg transition-all duration-300 hover:bg-gray-100 active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transition-transform duration-300"
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
                      className="menu menu-sm dropdown-content bg-white/95 backdrop-blur-md rounded-xl z-50 mt-3 w-52 p-2 shadow-xl border border-gray-200/50 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          {link.hasSubmenu ? (
                            <>
                              <span
                                className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                                  pathName.startsWith(link.href)
                                    ? "text-red-700 bg-red-50 font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {link.label}
                              </span>
                              <ul className="p-2 bg-gray-50/50 rounded-lg mt-1">
                                {link.submenu?.map((subItem) => (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      className={`px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:translate-x-1 ${
                                        pathName === subItem.href
                                          ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-medium shadow-sm"
                                          : "text-gray-700 hover:bg-red-50 hover:text-red-700"
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
                              className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                                pathName.startsWith(link.href)
                                  ? "text-red-700 bg-red-50 font-semibold"
                                  : "text-gray-700 hover:bg-gray-100"
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
                        className="btn btn-ghost btn-circle avatar transition-all duration-300 hover:scale-110 active:scale-95"
                      >
                        <div className="w-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-300 shadow-md transition-all duration-300 hover:shadow-lg hover:border-red-400 ring-2 ring-transparent hover:ring-red-200">
                          <img
                            alt="User Profile"
                            src={userData?.image || userImage.src}
                            className="object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-xl bg-white/95 backdrop-blur-md rounded-xl w-52 border border-gray-200/50 animate-in fade-in slide-in-from-top-2 duration-300"
                      >
                        <li className="menu-title">
                          <span className="text-gray-700 font-semibold">Hello, {data.user.name}</span>
                        </li>
                        <div className="divider my-1"></div>
                        <li>
                          <Link 
                            href="/userDashboard"
                            className="transition-all duration-300 transform hover:scale-105 hover:translate-x-1 hover:text-red-700"
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href="/profile"
                            className="transition-all duration-300 transform hover:scale-105 hover:translate-x-1 hover:text-red-700"
                          >
                            Profile
                          </Link>
                        </li>
                        {/* <li>
                          <Link href="/settings">Settings</Link>
                        </li> */}
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
