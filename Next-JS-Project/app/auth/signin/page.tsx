"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Sign in failed");
      }
      const role = (data.role as string) || "";
      if (role === "teacher") {
        router.push("/teacher");
      } else if (role === "student") {
        router.push("/student");
      } else {
        router.push("/portal");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-center">
        <div className="relative h-full">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-indigo-200 via-white to-emerald-100 opacity-60" />
          <div className="relative rounded-3xl border border-indigo-100 bg-white/80 backdrop-blur shadow-2xl p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-sm">
              Secure Access
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600 text-sm">
              Sign in to manage lectures, publish notes, and chat with course material.
              Protected via Next.js proxy to FastAPI—your credentials stay server-side.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <Badge text="Proxy protected" />
              <Badge text="Cloud PDFs" />
              <Badge text="Grounded answers" />
              <Badge text="Responsive UI" />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-xl p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-indigo-600 uppercase">Sign in</p>
              <h1 className="text-2xl font-bold text-gray-900">Continue to Collaburate</h1>
              <p className="text-sm text-gray-600">Use your email and password to enter.</p>
            </div>

            <Field label="Email" value={email} onChange={setEmail} type="email" />
            <Field label="Password" value={password} onChange={setPassword} type="password" />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 shadow-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-sm text-center text-gray-600">
              New here?{" "}
              <Link href="/auth/signup" className="text-indigo-600 font-semibold hover:underline">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
      />
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
      {text}
    </span>
  );
}
