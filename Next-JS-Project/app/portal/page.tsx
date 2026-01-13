"use client";

import Link from "next/link";

const cards = [
  {
    title: "Student Portal",
    desc: "Browse published lectures, download PDFs, and chat with notes.",
    href: "/student",
    color: "from-green-500/80 to-emerald-500/80",
  },
  {
    title: "Teacher Portal",
    desc: "Record lectures, generate notes, publish to cloud, and manage content.",
    href: "/teacher",
    color: "from-indigo-500/80 to-blue-500/80",
  },
];

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-indigo-600">Choose portal</p>
          <h1 className="text-3xl font-bold">Where do you want to go?</h1>
          <p className="text-gray-600">
            Students can browse and chat with published lectures. Teachers can create,
            refine, and publish notes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20`}
              />
              <div className="p-6 space-y-3 relative z-10">
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="text-sm text-gray-700">{card.desc}</p>
                <span className="text-sm font-semibold text-indigo-600 group-hover:underline">
                  Enter →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
