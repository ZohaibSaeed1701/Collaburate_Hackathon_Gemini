"use client";

import Link from "next/link";

const actions = [
  {
    title: "Create Lecture Notes",
    desc: "Record voice, upload slides, generate AI notes, and export PDFs.",
    href: "/lecture",
    color: "from-indigo-500/80 to-blue-500/80",
    accent: "🎙️",
    cta: "Start creating",
  },
  {
    title: "Publish & Manage",
    desc: "Review cloud PDFs, copy links, and keep students up to date.",
    href: "/student/lectures",
    color: "from-emerald-500/80 to-teal-500/80",
    accent: "🚀",
    cta: "View published",
  },
];

const highlights = [
  "Secure proxy to FastAPI",
  "Cloud PDFs (shareable links)",
  "Grounded answers for students",
  "Responsive, modern UI",
];

export default function TeacherPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 text-black">
      <div className="max-w-6xl mx-auto p-8 lg:p-12 space-y-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 backdrop-blur shadow-2xl p-8 lg:p-10">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-indigo-200 via-white to-emerald-200 opacity-60" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-sm">
                Teacher Portal
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Craft, refine, and publish lectures students love.
              </h1>
              <p className="text-gray-600">
                Upload slides or speak out your lecture, let AI prepare clean notes, publish to
                the cloud, and keep students engaged with chat-ready PDFs.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                {highlights.map((h) => (
                  <span
                    key={h}
                    className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-lg p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase">Quick Actions</p>
                    <p className="text-sm text-gray-600">Jump into what matters.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    Live
                  </span>
                </div>
                <div className="grid gap-3">
                  {actions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20`}
                      />
                      <div className="relative p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{action.accent}</span>
                          <span className="text-xs font-semibold text-indigo-700 group-hover:underline">
                            {action.cta} →
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{action.title}</p>
                        <p className="text-sm text-gray-700">{action.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20`}
              />
              <div className="relative p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{action.accent}</span>
                  <h2 className="text-xl font-semibold text-gray-900">{action.title}</h2>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{action.desc}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700 group-hover:underline">
                  <span>{action.cta}</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Snapshot stats (placeholder) */}
        <div className="grid md:grid-cols-3 gap-4">
          <Stat label="Published PDFs" value="—" hint="Cloud PDFs ready for students" />
          <Stat label="Active lectures" value="—" hint="Generated notes this week" />
          <Stat label="Student chats" value="—" hint="Conversations on your notes" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{hint}</p>
    </div>
  );
}
