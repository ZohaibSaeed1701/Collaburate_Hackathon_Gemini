"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Message {
  type: "user" | "bot";
  text: string;
}

export default function ChatBot() {
  const [file, setFile] = useState<File | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get("pdfUrl") || "";

  useEffect(() => {
    if (!pdfUrl) return;
    // Avoid client-side fetch to bypass CORS; rely on server-side fetch via api/chat-with-notes.
    setFile(null);
  }, [searchParams, pdfUrl]);

  const handleSubmit = async () => {
    if (!question || fileLoading) return;
    if (!pdfUrl && !file) {
      setError("Attach a file or open via a published lecture link.");
      return;
    }
    setError("");

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("pdfUrl", pdfUrl);
    formData.append("question", question);

    setChat((prev) => [...prev, { type: "user", text: question }]);
    setLoading(true);
    setQuestion("");

    try {
      const response = await fetch("/api/chat-with-notes", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.answer) {
        const msg = data.message || "Error fetching answer.";
        throw new Error(msg);
      }

      setChat((prev) => [...prev, { type: "bot", text: data.answer }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error fetching answer.";
      setChat((prev) => [...prev, { type: "bot", text: msg }]);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 text-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 backdrop-blur shadow-2xl p-8 lg:p-10">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-indigo-200 via-white to-emerald-200 opacity-60" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-sm">
                Student RAG Chat
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Ask anything grounded in your lecture notes.
              </h1>
              <p className="text-gray-600 text-sm">
                Upload a PDF or follow the shared link from your teacher. All answers are generated
                from the uploaded notes through the secure proxy to FastAPI.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                <Badge text="Proxy protected" />
                <Badge text="PDF & TXT" />
                <Badge text="Grounded answers" />
                <Badge text="Chat-ready" />
              </div>
            </div>
            <div className="relative rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-lg p-6 space-y-3">
              <p className="text-xs font-semibold text-indigo-600 uppercase">Upload or linked</p>
              <p className="text-sm text-gray-700">
                {pdfUrl
                  ? "Using shared lecture PDF via secure proxy."
                  : file
                  ? `Attached: ${file.name}`
                  : "Attach a PDF/TXT to chat with notes."}
              </p>
              <label className="w-full cursor-pointer">
                <span className="inline-flex px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700">
                  {file ? "Change file" : "Attach file"}
                </span>
                <input
                  type="file"
                  accept=".txt,.pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
              <p className="text-[11px] text-gray-500">
                Tip: When opened from a published lecture, the PDF auto-loads. You can swap it here.
              </p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-gray-200 shadow-lg p-5 flex flex-col h-[70vh]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase">Conversation</p>
                <p className="text-sm text-gray-600">
                  {fileLoading
                    ? "Loading attached notes..."
                    : file || pdfUrl
                    ? "Chat grounded in your notes"
                    : "Attach notes to start chatting"}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                {fileLoading ? "Loading..." : loading ? "Thinking..." : "Ready"}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
              {chat.length === 0 && (
                <div className="text-sm text-gray-500 text-center mt-6">
                  No messages yet. Ask your first question!
                </div>
              )}
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow ${
                      msg.type === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-100">
              {error && (
                <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-2">
                  {error}
                </div>
              )}
              <textarea
                placeholder="Ask a question about the notes..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading || (!file && !pdfUrl) || !question || fileLoading}
                  className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 disabled:opacity-60 w-full sm:w-auto"
                >
                  {loading ? "Thinking..." : "Send"}
                </button>
                <p className="text-xs text-gray-600">
                  Attach notes first; answers stay grounded in your uploaded PDF.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 shadow-lg p-5 space-y-4 h-fit">
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase">Guidance</p>
              <p className="text-sm text-gray-700">
                Ask for summaries, key points, definitions, or explanations from the notes.
              </p>
            </div>
            <div className="grid gap-2">
              {["Summarize the main concepts", "List key formulas", "Explain section 2", "Give a quiz-style question"].map(
                (s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuestion(s)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm hover:border-indigo-300 hover:bg-white transition"
                  >
                    {s}
                  </button>
                )
              )}
            </div>
            <div className="text-xs text-gray-500">
              Your file stays local to this chat session and is proxied server-side to the AI.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-800 shadow-sm">
      {text}
    </span>
  );
}
