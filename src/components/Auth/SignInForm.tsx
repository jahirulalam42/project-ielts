import React from "react";

import { useState } from "react";
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
      router.push(callbackUrl);
    }
  };
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
        <div className="card w-full max-w-md shadow-lg bg-base-100">
          <div className="card-body">
            <h1 className="card-title text-2xl">Sign In</h1>

            {error && (
              <div className="alert alert-error mt-2">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4 mt-4">
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="text-sm text-center mt-6">
              Don’t have an account?{" "}
              <a href="/user/signup" className="link link-primary">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
