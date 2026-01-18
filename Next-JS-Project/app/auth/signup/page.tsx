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
  const [otp, setOtp] = useState("");
  const [otpPhase, setOtpPhase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (!otpPhase) {
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
        setMessage("OTP sent. Please verify within 30 minutes.");
        setOtpPhase(true);
      } else {
        const res = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "OTP verification failed");
        }
        setMessage("Account verified. Redirecting to sign in...");
        setTimeout(() => router.push("/auth/signin"), 1200);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-center">
        <div className="relative h-full">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-blue-200 via-white to-emerald-200 opacity-60" />
          <div className="relative rounded-3xl border border-blue-100 bg-white/80 backdrop-blur shadow-2xl p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-sm">
              Create & Verify
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Start teaching or learning with confidence.
            </h2>
            <p className="text-gray-600 text-sm">
              Sign up, get your OTP (valid 30 minutes), verify, and access Collaburate’s
              secure AI notes and chat experience.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <Badge text="OTP-valid 30 mins" />
              <Badge text="Proxy protected" />
              <Badge text="Cloud PDFs" />
              <Badge text="Grounded answers" />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-xl p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-600 uppercase">Sign up</p>
              <h1 className="text-2xl font-bold text-gray-900">
                {otpPhase ? "Verify your account" : "Create your account"}
              </h1>
              <p className="text-sm text-gray-600">
                {otpPhase
                  ? "Enter the OTP sent to your email. It expires in 30 minutes."
                  : "Register as a teacher or student to access the portal."}
              </p>
            </div>

            {!otpPhase ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" value={firstName} onChange={setFirstName} />
                  <Field label="Last name" value={lastName} onChange={setLastName} />
                </div>
                <Field label="Email" value={email} onChange={setEmail} type="email" />
                <Field label="Password" value={password} onChange={setPassword} type="password" />
                <Field
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder="e.g. 03XXXXXXXXX"
                />

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-800">Role</label>
                  <div className="flex gap-3">
                    {(["teacher", "student"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`px-3 py-2 rounded border text-sm ${
                          role === r
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {r[0].toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Field label="Enter OTP" value={otp} onChange={setOtp} placeholder="6-digit code" />
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-60 shadow-lg"
            >
              {loading
                ? otpPhase
                  ? "Verifying..."
                  : "Creating..."
                : otpPhase
                ? "Verify OTP"
                : "Create Account"}
            </button>

            <div className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-indigo-600 font-semibold hover:underline">
                Sign In
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
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      />
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white border border-emerald-100 text-sm text-emerald-700 shadow-sm">
      {text}
    </span>
  );
}
