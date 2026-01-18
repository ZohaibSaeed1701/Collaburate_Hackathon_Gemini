import Image from "next/image";
import Link from "next/link";

const steps = [
  { title: "Upload", desc: "Drop slides or live transcript from class." },
  { title: "Generate", desc: "AI crafts clean, structured notes in minutes." },
  { title: "Publish & Chat", desc: "Save to cloud, share, and let students chat." },
];

const roles = [
  {
    title: "Teacher",
    desc: "Record, refine, publish to students in one flow.",
    href: "/teacher",
    badge: "Create & Publish",
  },
  {
    title: "Student",
    desc: "Browse lectures, download PDFs, and chat with notes.",
    href: "/student",
    badge: "Learn & Ask",
  },
];

const highlights = [
  "Proxy-protected APIs (Next → FastAPI)",
  "Cloud PDFs with reusable links",
  "Grounded answers with your notes",
  "Modern, responsive UI",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 text-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 space-y-16">
        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-indigo-100 text-xs font-semibold text-indigo-700 shadow-sm">
              Collaburate AI · Hackathon Edition
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
              Beautiful lecture intelligence for teachers and students.
            </h1>
            <p className="text-lg text-gray-600">
              Upload. Generate. Publish. Let students chat with trustworthy notes—securely
              routed through your Next.js proxy and FastAPI backend.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/signin"
                className="px-6 py-3 rounded-xl text-sm font-semibold shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-3 rounded-xl text-sm font-semibold border border-indigo-200 bg-white text-indigo-700 hover:border-indigo-300 shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              {highlights.map((h) => (
                <span
                  key={h}
                  className="px-3 py-1 rounded-full bg-white/70 border border-gray-200 shadow-sm"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-indigo-200 via-white to-blue-200 opacity-70" />
            <div className="relative rounded-3xl border border-indigo-100 bg-white/70 shadow-xl p-6 backdrop-blur">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-indigo-700">Live Preview</p>
                  <p className="text-xs text-gray-500">Lecture → Notes → Chat</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  Realtime
                </span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 overflow-hidden">
                <Image
                  src="/window.svg"
                  alt="Dashboard preview"
                  fill
                  className="object-contain p-6"
                  priority
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-gray-700">
                {steps.map((s) => (
                  <div
                    key={s.title}
                    className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm"
                  >
                    <p className="font-semibold text-gray-900">{s.title}</p>
                    <p className="text-gray-600 mt-1 leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Link
              key={role.href}
              href={role.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-blue-100 opacity-60 group-hover:opacity-80" />
              <div className="relative p-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-sm">
                  {role.badge}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">{role.title}</h2>
                <p className="text-sm text-gray-700">{role.desc}</p>
                <span className="text-sm font-semibold text-indigo-700 group-hover:underline">
                  Enter →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Steps */}
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase">Flow</p>
              <h3 className="text-xl font-bold text-gray-900">
                From lecture to student chat in three beats
              </h3>
            </div>
            <Link
              href="/portal"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow"
            >
              Go to Portal
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((s, idx) => (
              <div
                key={s.title}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                  {idx + 1}
                </div>
                <p className="mt-3 text-lg font-semibold text-gray-900">{s.title}</p>
                <p className="text-sm text-gray-700 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 shadow-sm p-6 space-y-3">
          <p className="text-xs font-semibold text-indigo-700 uppercase">Why it wins</p>
          <h3 className="text-xl font-bold text-gray-900">
            Secure, production-ready, and hackathon-worthy polish.
          </h3>
          <div className="flex flex-wrap gap-2">
            {highlights.map((h) => (
              <span
                key={h}
                className="px-3 py-1 rounded-full bg-white border border-indigo-100 text-sm text-gray-800 shadow-sm"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
