// components/Navbar.tsx
"use client";
import Link from "next/link";
import React from "react";
import LoginButton from "../Auth/LoginButton";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

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

  // Navigation links data
  const navLinks = [
    { href: "/test/listening", label: "Listening" },
    { href: "/test/reading", label: "Reading" },
    { href: "/test/writing", label: "Writing" },
    { href: "/test/speaking", label: "Speaking" },
  ];

  return (
    <div>
      {!pathName.startsWith("/test/reading/") &&
        !pathName.startsWith("/admin") && (
          <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              {/* Logo */}
              <div className="navbar-start">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">I</span>
                  </div>
                  <span className="text-2xl font-bold text-indigo-800 hidden sm:block">
                    IELTS
                  </span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal space-x-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                          pathName.startsWith(link.href)
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile menu button */}
              <div className="navbar-end flex gap-2 items-center">
                {data?.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="btn btn-sm btn-outline border-indigo-600 text-indigo-600 hover:bg-indigo-50 hidden sm:inline-flex"
                  >
                    Admin
                  </Link>
                )}

                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost lg:hidden"
                  >
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
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`${
                            pathName.startsWith(link.href)
                              ? "text-indigo-600 bg-indigo-50"
                              : ""
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {data?.user.role === "admin" && (
                      <li>
                        <Link href="/admin">Admin</Link>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="hidden sm:block">
                  <LoginButton />
                </div>
              </div>
            </div>
          </nav>
        )}
    </div>
  );
};

export default Navbar;
