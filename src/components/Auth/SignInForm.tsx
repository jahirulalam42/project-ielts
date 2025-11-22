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

  // Add OAuth handler function
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

      // Handle specific error cases
      if (res.error.includes("Please sign in with")) {
        setError(res.error); // Show the specific OAuth provider message
      } else if (res.error.includes("Password not set")) {
        setError(res.error);
      } else {
        setError("Invalid Email or Password!");
      }
      return;
    }

    // If sign in successful, get user ID and check onboarding status
    try {
      // Get user ID by calling login API (we already validated credentials above)
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

      // Skip onboarding for admin users
      if (userRole === "admin") {
        setLoading(false);
        router.push(callbackUrl);
        return;
      }

      if (userId) {
        // Check onboarding status
        try {
          const onboardingResponse = await getOnboardingData(userId);
          const onboardingRecord = onboardingResponse?.data;
          const onboardingStatus = onboardingRecord?.status;

          // Only if onboarding is completed, skip the onboarding page
          // If skipped, user must see onboarding again until they submit
          if (onboardingRecord && onboardingStatus === "completed") {
            setLoading(false);
            router.push(callbackUrl);
            return;
          }
        } catch (error) {
          // If error checking onboarding, proceed to onboarding page
          console.error("Error checking onboarding status:", error);
        }
      }

      // If no onboarding record, status is skipped, or not completed, go to onboarding page
      const encodedNext = encodeURIComponent(callbackUrl);
      router.push(`/user/onboarding?next=${encodedNext}`);
      setLoading(false);
    } catch (error) {
      console.error("Error after sign in:", error);
      // Fallback: check if user is admin, otherwise redirect to onboarding
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
      // Fallback: redirect to onboarding
      const encodedNext = encodeURIComponent(callbackUrl);
      router.push(`/user/onboarding?next=${encodedNext}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="grid w-full overflow-hidden rounded-3xl border border-rose-100/70 bg-white/95 shadow-2xl backdrop-blur-md md:grid-cols-[1.1fr,1fr]">
          <div className="relative hidden bg-[radial-gradient(circle_at_top_left,_#fb7185,_transparent_55%),_radial-gradient(circle_at_bottom_right,_#fda4af,_transparent_50%)] p-10 text-gray-900 md:flex md:flex-col md:justify-between">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-medium tracking-wide text-gray-900">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                IELTS Prep Workspace
              </span>
              <h2 className="text-3xl font-semibold leading-snug text-gray-900">
                Plan, practise, and polish every module with one dedicated
                dashboard.
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                Personalised study paths, adaptive difficulty ladders, and daily
                streak reminders keep you exam ready.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/90 p-5 shadow-lg backdrop-blur">
                <p className="text-sm leading-relaxed text-gray-700">
                  "The mock tests and analytics lifted my confidence to attempt
                  IELTS Academic. I secured an overall band 7.5."
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-900">
                  — Priya Sharma · Ahmedabad
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-700">
                <span className="h-1 w-14 rounded-full bg-gray-800/60" />
                Trusted by learners in 40+ countries
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] font-medium text-gray-700">
              <span className="rounded-full border border-gray-500/40 px-4 py-1">
                Timed mock tests
              </span>
              <span className="rounded-full border border-gray-500/40 px-4 py-1">
                Speaking evaluations
              </span>
              <span className="rounded-full border border-gray-500/40 px-4 py-1">
                Smart review notes
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-white px-6 py-10 sm:px-10 md:px-12 lg:px-14">
            <div className="mb-9">
              <div className="flex items-center gap-3 text-sm text-rose-500">
                <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
                Welcome back
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900 md:text-4xl">
                Sign in to continue your prep
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                Access your personalised study plan, analyse past tests, and
                join live speaking rooms with fellow aspirants.
              </p>
            </div>

            {error && (
              <div className="alert alert-error mb-6">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-white text-gray-900 focus:border-rose-400 focus:ring focus:ring-rose-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Password
                  </span>
                  <Link
                    href="/user/forgot-password"
                    className="text-sm font-medium text-rose-500 hover:text-rose-600"
                  >
                    Forgot?
                  </Link>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full bg-white text-gray-900 focus:border-rose-400 focus:ring focus:ring-rose-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full border-0 bg-rose-500 text-white shadow-lg shadow-rose-200 transition duration-200 hover:bg-rose-600 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-400">
                <span className="flex-1 border-b border-dashed border-gray-200" />
                Or continue with
                <span className="flex-1 border-b border-dashed border-gray-200" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn("google")}
                  className="btn btn-outline border-gray-200 text-gray-600 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  className="btn btn-outline border-gray-200 text-gray-600 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </button>
                <button
                  type="button"
                  className="btn btn-outline border-gray-200 text-gray-600 hover:border-rose-200 hover:bg-rose-50 opacity-50 cursor-not-allowed"
                  disabled
                >
                  Facebook
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/user/signup"
                className="font-medium text-rose-500 hover:text-rose-600"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
