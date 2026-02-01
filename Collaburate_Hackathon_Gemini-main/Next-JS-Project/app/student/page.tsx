"use client";

import Link from "next/link";

const options = [
  {
    title: "Published Lectures",
    desc: "View and download PDFs saved by teachers; open chat with each lecture.",
    href: "/student/lectures",
    color: "from-green-500/80 to-emerald-500/80",
  },
  {
    title: "Ask with Custom Notes",
    desc: "Upload a PDF or text and chat with it directly.",
    href: "/chat",
    color: "from-sky-500/80 to-blue-500/80",
  },
];

export default function StudentPortal() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold text-green-600 uppercase">Student</p>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600">
            Browse published lectures or upload your own notes to chat.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          {options.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-10 group-hover:opacity-20`}
              />
              <div className="p-6 space-y-3 relative z-10">
                <h2 className="text-xl font-semibold">{opt.title}</h2>
                <p className="text-sm text-gray-700">{opt.desc}</p>
                <span className="text-sm font-semibold text-indigo-600 group-hover:underline">
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
