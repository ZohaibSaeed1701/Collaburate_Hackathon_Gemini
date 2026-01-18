"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Lecture = {
  _id: string;
  title: string;
  pdfUrl: string;
  createdAt: string;
};

export default function PublishedLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/lectures");
        if (!res.ok) throw new Error("Failed to load lectures");
        const data = await res.json();
        setLectures(data.lectures || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return lectures;
    const term = search.toLowerCase();
    return lectures.filter((l) => l.title.toLowerCase().includes(term));
  }, [lectures, search]);

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      /* swallow */
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 text-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 backdrop-blur shadow-2xl p-8 lg:p-10">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-indigo-200 via-white to-emerald-200 opacity-60" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-sm">
                Published Notes
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Your published lectures, ready to share, download, or chat.
              </h1>
              <p className="text-gray-600 text-sm">
                Every saved PDF is listed here. Open to view, download for offline, or let students
                chat with the notes instantly.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                <Badge text="Cloud PDF" />
                <Badge text="Chat-ready" />
                <Badge text="Shareable link" />
                <Badge text="Search & filter" />
              </div>
            </div>
            <Link
              href="/lecture"
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
            >
              + Create new notes
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="text-xs text-gray-600">
            Showing {filtered.length} of {lectures.length} published notes
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-3"
              >
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center space-y-3">
            <p className="text-lg font-semibold text-gray-900">No published notes found</p>
            <p className="text-sm text-gray-600">
              Create a new lecture or adjust your search to see results.
            </p>
            <Link
              href="/lecture"
              className="inline-flex px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
            >
              Create lecture notes
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((lec) => (
              <div
                key={lec._id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{lec.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(lec.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                    Published
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                  <Badge text="PDF" />
                  <Badge text="Chat-ready" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/api/lectures/download?pdfUrl=${encodeURIComponent(lec.pdfUrl)}`}
                    target="_blank"
                    className="flex-1 min-w-[130px] px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold text-center shadow hover:bg-indigo-700"
                  >
                    Download
                  </Link>
                  <Link
                    href={`/chat?pdfUrl=${encodeURIComponent(lec.pdfUrl)}`}
                    className="flex-1 min-w-[130px] px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold text-center shadow hover:bg-emerald-700"
                  >
                    Chat
                  </Link>
                  <button
                    onClick={() => handleCopy(lec.pdfUrl, lec._id)}
                    className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-indigo-300"
                  >
                    {copiedId === lec._id ? "Copied" : "Copy link"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
