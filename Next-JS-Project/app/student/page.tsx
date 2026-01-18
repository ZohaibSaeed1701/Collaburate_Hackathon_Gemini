"use client";

import Link from "next/link";

const options = [
  {
    title: "Published Lectures",
    desc: "Download published PDFs from teachers or open a chat with each lecture.",
    href: "/student/lectures",
    color: "from-green-500/80 to-emerald-500/80",
    accent: "📚",
    cta: "Open lectures",
  },
  {
    title: "Ask with Custom Notes",
    desc: "Upload a PDF or text and chat with it directly.",
    href: "/chat",
    color: "from-sky-500/80 to-blue-500/80",
    accent: "💬",
    cta: "Start chat",
  },
];

export default function StudentPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 text-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 space-y-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 backdrop-blur shadow-2xl p-8 lg:p-10">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-indigo-200 via-white to-emerald-200 opacity-60" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-sm">
                Student Portal
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Learn faster with published notes and chat-ready PDFs.
              </h1>
              <p className="text-gray-600 text-sm">
                Download teacher-published lectures or chat directly with any PDF using our RAG
                pipeline. All traffic stays secure via the Next.js proxy.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                <Badge text="Download ready" />
                <Badge text="Chat grounded in notes" />
                <Badge text="Secure proxy" />
              </div>
            </div>
            <Link
              href="/student/lectures"
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
            >
              View published lectures
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {options.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-10 group-hover:opacity-20`}
              />
              <div className="relative p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.accent}</span>
                  <h2 className="text-xl font-semibold text-gray-900">{opt.title}</h2>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{opt.desc}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700 group-hover:underline">
                  <span>{opt.cta || "Open"}</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info strip */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 grid md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-xs uppercase font-semibold text-indigo-600">Download</p>
            <p>Grab PDFs published by your teachers—ready for offline study.</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-indigo-600">Chat</p>
            <p>Ask questions grounded in the exact content of the notes.</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-indigo-600">Secure</p>
            <p>All requests go through the Next.js proxy; no direct backend exposure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-800 shadow-sm">
      {text}
    </span>
  );
}