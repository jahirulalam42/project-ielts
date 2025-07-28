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
          <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              {/* Logo */}
              <div className="navbar-start">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">I</span>
                  </div>
                  <Link href={"/"}>
                    <span className="text-2xl font-bold text-indigo-800 hidden sm:block">
                      IELTS
                    </span>
                  </Link>
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

                {!data ? (
                  <div className="hidden sm:block">
                    <LoginButton />
                  </div>
                ) : (
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-10 rounded-full">
                        <img
                          alt="User Image"
                          // src=
                          src={userData?.image || userImage.src}
                        />
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                      <li>
                        <Link
                          href={"/userDashboard"}
                          className="justify-between"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link href={"/profile"} className="justify-between">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <a>Settings</a>
                      </li>
                      <li>
                        <LoginButton />
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
    </div>
  );
};

export default Navbar;
