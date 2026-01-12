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
    <div className="flex h-screen items-center justify-center bg-slate-50 px-4 py-4 font-sans text-slate-900 antialiased overflow-hidden">
      <div className="flex w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 md:flex-row h-[95vh] max-h-[900px]">
        {/* LEFT PANEL: Premium Dark Theme */}
        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-slate-900 px-8 py-8 text-slate-50 md:w-[42%] lg:px-10 lg:py-10">
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

          <div className="relative z-10 mt-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold leading-tight text-white lg:text-3xl">
                Your journey to Band 7+ starts here.
              </h2>
              <p className="mt-3 text-sm text-slate-300 lg:text-base">
                Join a community of 12,000+ aspirants and access tools designed
                to fast-track your success.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-slate-300">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm">
                  AI-powered writing corrections for faster feedback.
                </p>
              </div>
              <div className="flex items-start gap-3 text-slate-300">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm">
                  Personalized study plans based on your weak areas.
                </p>
              </div>
              <div className="flex items-start gap-3 text-slate-300">
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm">
                  Unlimited mock tests simulating the real exam environment.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 hidden text-xs text-slate-400 md:block mt-4">
            Prepare for the future. Prepare with us.
          </div>
        </div>

        {/* RIGHT PANEL: Form */}
        <div className="flex w-full flex-col justify-center bg-white px-6 py-6 md:w-[58%] lg:px-12 lg:py-8 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-2xl">
                Create your account
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Get started today for free. No credit card required.
              </p>
            </div>

            {/* Sign Up Method Tabs */}
            <div className="mb-4">
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveMethod("oauth")}
                  className={`flex-1 pb-2.5 text-xs font-medium transition-colors ${
                    activeMethod === "oauth"
                      ? "border-b-2 border-rose-500 text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Quick Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMethod("email")}
                  className={`flex-1 pb-2.5 text-xs font-medium transition-colors ${
                    activeMethod === "email"
                      ? "border-b-2 border-rose-500 text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  With Email
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-start rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
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
                  <span className="font-semibold">Sign up failed</span>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* OAuth Section */}
            {activeMethod === "oauth" && (
              <div className="space-y-3">
                <p className="text-center text-xs text-slate-500">
                  Sign up instantly with your existing account
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn("google")}
                    className="group relative flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
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
                    className="group relative flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
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
              </div>
            )}

            {/* Email Sign Up Section */}
            {activeMethod === "email" && (
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="name@example.com"
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-rose-500 focus:ring-rose-500/20 focus:outline-none text-sm"
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
                      <span className="text-xs text-slate-400">
                        Min. 8 characters
                      </span>
                    </div>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      placeholder="Create a strong password"
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-rose-500 focus:ring-rose-500/20 focus:outline-none text-sm"
                      autoComplete="new-password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-lg border border-transparent bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={loading}
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
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-slate-500">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-slate-900 hover:text-rose-600"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-slate-900 hover:text-rose-600"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            )}

            {/* Switch to Sign In */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/user/signin"
                  className="font-semibold text-slate-900 transition-colors hover:text-rose-600"
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
