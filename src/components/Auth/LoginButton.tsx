"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <div className="flex gap-2">
      <button
        className="text-red-700 font-medium hover:text-red-900 transition-colors"
        onClick={() => signIn()}
      >
        Sign In
      </button>
      <Link href={"/user/signup"}>
        <button className="btn bg-red-600 text-white hover:bg-red-700 px-5 py-2 rounded-lg transition-colors shadow-md">
          Get Started
        </button>
      </Link>
    </div>
  );
}
