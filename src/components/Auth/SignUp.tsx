"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { postUser } from "@/services/data";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
// import { redirect } from "next/navigation";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      //   const res = await fetch("/api/auth/signup", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(form),
      //   });

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
        toast.success("User has been Created!", {
          onClose: () => router.push("/user/signin"),
          autoClose: 2000, // ensure the toast auto-dismisses
        });
      }

      // On success, redirect or clear form
      // redirect("/user/signin");
    } catch (err: any) {
      setError(err.message);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="grid w-full overflow-hidden rounded-3xl border border-rose-100/70 bg-white/95 shadow-2xl backdrop-blur-md md:grid-cols-[1.05fr,1fr]">
          <div className="hidden bg-white/90 p-10 md:flex md:flex-col md:justify-between">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1 text-sm font-medium tracking-wide text-rose-600">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Create your IELTS workspace
              </span>
              <h2 className="text-3xl font-semibold leading-snug text-gray-900">
                Join thousands of candidates fast-tracking their band score.
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 rounded-full bg-rose-400" />
                  Unlimited timed mock tests and analytics
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 rounded-full bg-rose-400" />
                  Speaking rooms, writing correction, crash courses
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 rounded-full bg-rose-400" />
                  Personalised planner tuned to your target score
                </li>
              </ul>
            </div>
            <div className="space-y-3 text-sm text-gray-500">
              <p className="leading-relaxed">
                “The zero-friction sign-up got me in within seconds. Within a
                week I had a plan, daily reminders, and a coach for writing
                tasks.”
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                — Aisha Rahman · Band 7.5
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-white px-6 py-10 sm:px-10 md:px-12">
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-rose-500">
                <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
                Get started in seconds
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                Create your account
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Sign up once to unlock practice resources, band score insights,
                and personal coaching.
              </p>
            </div>

            {error && (
              <div className="alert alert-error mb-6">
                <span>{error}</span>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="btn btn-outline border-gray-200 text-gray-700 hover:border-rose-200 hover:bg-rose-50"
              >
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                onClick={() => signIn("apple")}
                className="btn btn-outline border-gray-200 text-gray-700 hover:border-rose-200 hover:bg-rose-50"
              >
                <span>Continue with Apple</span>
              </button>
            </div>

            <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-gray-400">
              <span className="flex-1 border-b border-dashed border-gray-200" />
              or sign up with email
              <span className="flex-1 border-b border-dashed border-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Create a strong password"
                  className="input input-bordered w-full bg-white text-gray-900 focus:border-rose-400 focus:ring focus:ring-rose-100"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full border-0 bg-rose-500 text-white shadow-lg shadow-rose-200 transition duration-200 hover:bg-rose-600 ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Creating your account…" : "Continue"}
              </button>
            </form>

            <p className="mt-6 text-xs text-gray-400">
              By continuing you agree to receive important exam reminders and
              prep tips. You can opt out anytime.
            </p>

            <p className="mt-8 text-center text-sm text-gray-500">
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
      <ToastContainer />
    </div>
  );
};

export default SignUp;
