"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("teacher");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          phone_no: phone,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Sign up failed");
      }
      setMessage("Account created. Check email for OTP, then sign in.");
      setTimeout(() => router.push("/auth/signin"), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-indigo-600 uppercase">Create account</p>
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-sm text-gray-600">
            Register as a teacher or student to start using the portal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" value={firstName} onChange={setFirstName} />
          <Field label="Last name" value={lastName} onChange={setLastName} />
        </div>
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        <Field label="Phone" value={phone} onChange={setPhone} placeholder="e.g. 03XXXXXXXXX" />

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800">Role</label>
          <div className="flex gap-3">
            {(["teacher", "student"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-3 py-2 rounded border text-sm ${
                  role === r ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"
                }`}
              >
                {r[0].toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-indigo-600 font-semibold">
            Sign In
          </Link>
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
        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
