"use client";

import Link from "next/link";

const actions = [
  {
    title: "Create & Refine Notes",
    desc: "Record voice or upload slides, generate notes, and publish to cloud.",
    href: "/lecture",
    color: "from-indigo-500/80 to-blue-500/80",
  },
  {
    title: "Published Lectures",
    desc: "Review cloud PDFs already published (same list students see).",
    href: "/student/lectures",
    color: "from-purple-500/80 to-pink-500/80",
  },
];

export default function TeacherPortal() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold text-indigo-600 uppercase">Teacher</p>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-600">
            Generate lecture notes and publish PDFs for your students.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20`}
              />
              <div className="p-6 space-y-3 relative z-10">
                <h2 className="text-xl font-semibold">{action.title}</h2>
                <p className="text-sm text-gray-700">{action.desc}</p>
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
