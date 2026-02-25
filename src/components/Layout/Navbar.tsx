// components/Navbar.tsx
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LoginButton from "../Auth/LoginButton";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
  const router = useRouter();

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
                      <button
                        tabIndex={0}
                        type="button"
                        className="flex items-center gap-2 rounded-full border border-rose-100 bg-white/90 px-2 py-1 shadow-sm hover:border-rose-300 hover:bg-rose-50/80 hover:shadow-md transition-all duration-200"
                      >
                        <div className="relative h-9 w-9 rounded-full overflow-hidden border border-rose-100 bg-rose-50">
                          <img
                            alt="User profile"
                            src={userData?.image || userImage.src}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 rounded-full ring-1 ring-white/40" />
                        </div>
                        <div className="hidden md:flex flex-col items-start leading-tight max-w-[120px]">
                          <span className="text-xs font-semibold text-gray-800 truncate">
                            {data.user.name}
                          </span>
                        </div>
                        <svg
                          className="hidden md:block h-3.5 w-3.5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div
                        tabIndex={0}
                        className="dropdown-content mt-3 w-64 rounded-2xl border border-rose-100 bg-white/95 p-3 shadow-[0_18px_45px_rgba(248,113,113,0.18)] backdrop-blur-md z-[100]"
                      >
                        <div className="flex items-center gap-3 pb-3 border-b border-rose-100/80 mb-3">
                          <div className="h-9 w-9 rounded-full overflow-hidden border border-rose-100 bg-rose-50">
                            <img
                              alt="User profile"
                              src={userData?.image || userImage.src}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {data.user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {data.user.email}
                            </p>
                          </div>
                        </div>

                        <ul className="space-y-1.5 text-sm">
                          <li>
                            <Link
                              href="/userDashboard"
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150"
                            >
                              <span>Dashboard</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/profile"
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150"
                            >
                              <span>Profile</span>
                            </Link>
                          </li>
                        </ul>

                        <button
                          type="button"
                          onClick={async () => {
                            await signOut({ redirect: false });
                            router.push("/");
                          }}
                          className="mt-3 w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150 border-t border-rose-100/80"
                        >
                          Sign out
                        </button>
                      </div>
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
