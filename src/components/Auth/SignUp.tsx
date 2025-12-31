"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { postUser } from "@/services/data";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface SignUpData {
  email: string;
  password: string;
  role: string;
}

const SignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState<SignUpData>({
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState<"oauth" | "email">("oauth");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const usernameFallback =
        form.email?.split("@")[0] || `ielts_user_${Date.now()}`;

      const payload = {
        username: usernameFallback,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const res = await postUser(JSON.stringify(payload));
      console.log("sign up", res);

      if (res.success) {
        toast.success("Account created successfully! 🎉", {
          onClose: () => router.push("/user/signin"),
          autoClose: 2000,
        });
      } else {
        throw new Error(res.error || "Failed to create account");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, {
      callbackUrl: `/api/auth/oauth-redirect?callbackUrl=${encodeURIComponent(
        "/user/onboarding"
      )}`,
      redirect: true,
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="mx-auto flex h-full max-w-5xl items-center px-4 py-4 sm:px-6 lg:px-12">
        <div className="grid w-full max-h-[95vh] overflow-hidden rounded-3xl border border-rose-100/70 bg-white/95 shadow-2xl backdrop-blur-md md:grid-cols-[1.05fr,1fr]">
          {/* Left Column - Benefits */}
          <div className="relative hidden bg-[radial-gradient(circle_at_top_left,_#fb7185,_transparent_55%),_radial-gradient(circle_at_bottom_right,_#fda4af,_transparent_50%)] p-8 text-gray-900 md:flex md:flex-col md:justify-between overflow-y-auto max-h-[95vh]">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-medium tracking-wide text-gray-900">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                IELTS Prep Workspace
              </span>
              <h2 className="text-2xl font-semibold leading-snug text-gray-900">
                Join thousands of candidates achieving their target band scores.
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed text-gray-700">
                <li className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Unlimited timed mock tests with detailed analytics
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    AI-powered speaking evaluations and writing corrections
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Personalized study planner tailored to your goals</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
                <p className="text-sm leading-relaxed text-gray-700">
                  "The quick sign-up and personalized study plan helped me go
                  from Band 6 to 7.5 in just 8 weeks. The mock tests were
                  incredibly accurate!"
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-900">
                  — Rohan Kumar · Band 7.5
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-700">
                <span className="h-1 w-14 rounded-full bg-gray-800/60" />
                Trusted by learners in 40+ countries
              </div>
            </div>
          </div>

          {/* Right Column - Sign Up Form */}
          <div className="flex flex-col justify-center bg-white px-6 py-6 sm:px-10 md:px-12 overflow-y-auto max-h-[95vh]">
            <div className="mb-6">
              <div className="flex items-center gap-3 text-sm text-rose-500">
                <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
                Start your IELTS journey
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-gray-900 md:text-3xl">
                Create your account
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Join our community and get personalized study recommendations
                based on your goals.
              </p>
            </div>

            {/* Sign Up Method Tabs */}
            <div className="mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveMethod("oauth")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    activeMethod === "oauth"
                      ? "border-b-2 border-rose-500 text-rose-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Quick Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMethod("email")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    activeMethod === "email"
                      ? "border-b-2 border-rose-500 text-rose-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  With Email
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            {/* OAuth Section */}
            {activeMethod === "oauth" && (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Sign up instantly with your existing account
                  </p>
                </div>

                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn("google")}
                    className="btn btn-outline border-gray-200 text-gray-700 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center gap-3 py-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                    <span>Continue with Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn("linkedin")}
                    className="btn btn-outline border-gray-200 text-gray-700 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center gap-3 py-3"
                  >
                    <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>Continue with LinkedIn</span>
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By continuing, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-rose-500 hover:text-rose-600"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-rose-500 hover:text-rose-600"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Email Sign Up Section */}
            {activeMethod === "email" && (
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="input input-bordered w-full bg-white text-gray-900 focus:border-rose-400 focus:ring focus:ring-rose-100"
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">
                        Password
                      </span>
                      <span className="text-xs text-gray-400">
                        Minimum 8 characters
                      </span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      placeholder="Create a strong password"
                      className="input input-bordered w-full bg-white text-gray-900 focus:border-rose-400 focus:ring focus:ring-rose-100"
                      autoComplete="new-password"
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
                        Creating your account…
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By creating an account, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-rose-500 hover:text-rose-600"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-rose-500 hover:text-rose-600"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Switch to Sign In */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/user/signin"
                  className="font-medium text-rose-500 hover:text-rose-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
