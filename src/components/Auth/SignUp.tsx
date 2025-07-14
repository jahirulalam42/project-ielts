// components/SignUp.tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { postUser } from "@/services/data";
import { ToastContainer, toast } from "react-toastify";
import { redirect } from "next/navigation";

interface SignUpData {
  username: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  bio: string;
  role: string;
}

const SignUp = () => {
  //   const router = useRouter();
  const [form, setForm] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    bio: "",
    role: "user",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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

      const res = await postUser(JSON.stringify(form));
      console.log("sign up", res);

      if (res.success) {
        toast.success("User has been Created!");
      }

      // On success, redirect or clear form
      redirect("/");
    } catch (err: any) {
      setError(err.message);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl">Create your account</h2>

          {error && (
            <div className="alert alert-error shadow-lg mb-4">
              <div>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="label">
                <span className="label-text">Username *</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
                placeholder="e.g. johndoe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text">Password *</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
                placeholder="••••••••"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Location */}
            <div>
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="City, Country"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                placeholder="Tell us a bit about yourself..."
                rows={3}
              />
            </div>

            {/* Role */}
            {/* <div>
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div> */}

            <div className="mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-4">
            Already have an account?{" "}
            <a onClick={() => signIn()} className="link link-primary">
              Log in
            </a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
