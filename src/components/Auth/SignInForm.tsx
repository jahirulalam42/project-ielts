import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

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

    setLoading(false);
    if (res?.error) {
      setError("Invalid Email or Password!");
    } else {
      const encodedNext = encodeURIComponent(callbackUrl);
      router.push(`/user/onboarding?next=${encodedNext}`);
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
                  “The mock tests and analytics lifted my confidence to attempt
                  IELTS Academic. I secured an overall band 7.5.”
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
                className={`btn btn-primary w-full border-0 bg-rose-500 text-white shadow-lg shadow-rose-200 transition duration-200 hover:bg-rose-600 ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
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
                  className="btn btn-outline border-gray-200 text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="btn btn-outline border-gray-200 text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                >
                  Facebook
                </button>
                <button
                  type="button"
                  className="btn btn-outline border-gray-200 text-gray-600 hover:border-rose-200 hover:bg-rose-50"
                >
                  LinkedIn
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don’t have an account?{" "}
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
