"use client";

import SignInForm from "@/components/Auth/SignInForm";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading sign-in form…</div>}>
      <SignInForm />
    </Suspense>
  );
}
