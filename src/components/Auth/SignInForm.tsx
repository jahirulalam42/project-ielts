import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOnboardingData } from "@/services/data";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, {
      callbackUrl: `/api/auth/oauth-redirect?callbackUrl=${encodeURIComponent(
        callbackUrl
      )}`,
      redirect: true,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setLoading(false);
      if (res.error.includes("Please sign in with")) {
        setError(res.error);
      } else if (res.error.includes("Password not set")) {
        setError(res.error);
      } else {
        setError("Invalid Email or Password!");
      }
      return;
    }

    // Authentication Logic Preserved
    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const userData = await userResponse.json();
      const userId = userData?.data?.[0]?._id;
      const userRole = userData?.data?.[0]?.role;

      if (userRole === "admin") {
        setLoading(false);
        router.push(callbackUrl);
        return;
      }

      if (userId) {
        try {
          const onboardingResponse = await getOnboardingData(userId);
          const onboardingRecord = onboardingResponse?.data;
          const onboardingStatus = onboardingRecord?.status;

          if (onboardingRecord && onboardingStatus === "completed") {
            setLoading(false);
            router.push(callbackUrl);
            return;
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
        }
      }

      const encodedNext = encodeURIComponent(callbackUrl);
      router.push(`/user/onboarding?next=${encodedNext}`);
      setLoading(false);
    } catch (error) {
      console.error("Error after sign in:", error);
      try {
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );
        const userData = await userResponse.json();
        const userRole = userData?.data?.[0]?.role;

        if (userRole === "admin") {
          setLoading(false);
          router.push(callbackUrl);
          return;
        }
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
      const encodedNext = encodeURIComponent(callbackUrl);
      router.push(`/user/onboarding?next=${encodedNext}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans text-slate-900 antialiased">
      <div className="flex w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 md:flex-row">
        {/* LEFT PANEL: Premium Dark Theme */}
        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-slate-900 px-10 py-12 text-slate-50 md:w-[42%] lg:px-14 lg:py-16">
          {/* Abstract Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-rose-900 opacity-80"></div>
          <div className="absolute right-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-rose-600/20 blur-[100px]"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-white shadow-lg shadow-rose-900/40">
                <span className="font-serif text-xl font-bold">I</span>
              </div>
              <span className="text-xl font-medium tracking-wide text-slate-100">
                IELTS Workspace
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-16 space-y-10">
            <div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-white lg:text-4xl">
                Master the language of opportunity.
              </h2>
              <p className="mt-4 text-slate-300 lg:text-lg">
                Adaptive mock tests, AI-powered feedback, and personalized study
                plans designed to get you to Band 7+.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="mb-4 flex gap-1 text-rose-400">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="mb-3 text-sm italic text-slate-300">
                "The Speaking AI feedback is incredibly accurate. It helped me
                correct my pronunciation before the big day."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-700"></div>
                <div className="text-sm">
                  <p className="font-medium text-slate-200">Ahmed Al-Fayed</p>
                  <p className="text-xs text-slate-400">
                    Band 8.5 · General Training
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 hidden text-xs text-slate-400 md:block">
            Trusted by 12,000+ aspirants worldwide.
          </div>
        </div>

        {/* RIGHT PANEL: Clean Minimalist Form */}
        <div className="flex w-full flex-col justify-center bg-white px-8 py-12 md:w-[58%] lg:px-16 lg:py-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Please enter your details to access your dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                <svg
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <span className="font-semibold">Access Error</span>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-rose-500 focus:ring-rose-500/20 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@university.com"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/user/forgot-password"
                    className="text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-rose-500 focus:ring-rose-500/20 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg border border-transparent bg-slate-900 px-4 py-3 text-base font-medium text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin text-slate-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Providers */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                className="group relative flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn("linkedin")}
                className="group relative flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="#0077B5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/user/signup"
                className="font-semibold text-slate-900 transition-colors hover:text-rose-600"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
