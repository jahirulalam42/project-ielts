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
        className="btn btn-sm btn-soft text-primary font-bold"
        onClick={() => signIn()}
      >
        Sign in
      </button>
      <Link href={"/user/signup"}>
        <button className="btn btn-sm btn-primary">Sign Up</button>
      </Link>
    </div>
  );
}
