"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Lecture = {
  _id: string;
  title: string;
  pdfUrl: string;
  createdAt: string;
};

export default function StudentLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <div className="p-6">Loading lectures...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Student Lecture Dashboard</h1>
        {lectures.length === 0 && <p>No lectures yet.</p>}
        <div className="grid md:grid-cols-2 gap-4">
          {lectures.map((lec) => (
            <div key={lec._id} className="bg-white p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{lec.title}</h2>
                <span className="text-xs text-gray-500">
                  {new Date(lec.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-3">
                <a
                  href={lec.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
                >
                  View / Download
                </a>
                <Link
                  href={`/chat?pdfUrl=${encodeURIComponent(lec.pdfUrl)}`}
                  className="px-3 py-2 bg-green-600 text-white rounded text-sm"
                >
                  Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
