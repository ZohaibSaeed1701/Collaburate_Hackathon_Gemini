"use client";

import { useState, useEffect, useRef } from "react";
import MarkdownIt from "markdown-it";
import katex from "katex";
import "katex/dist/katex.min.css";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type FileEvent = React.ChangeEvent<HTMLInputElement>;

export default function LecturePage() {
  const [transcript, setTranscript] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  const md = new MarkdownIt();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = () => {
    recognitionRef.current?.start();
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = window.setInterval(
      () => setRecordingTime((p) => p + 1),
      1000
    );
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const handleFileChange = (e: FileEvent) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!transcript.trim() && !file) {
      alert("Please record lecture or upload slides first.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (transcript.trim()) formData.append("text", transcript);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/lecture", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponse(data.text || data.content || "");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildPdfBlob = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const html = md.render(response);
    const div = document.createElement("div");
    div.innerHTML = html;
    div.style.padding = "40px";
    div.style.color = "#000";

    const worker: any = (html2pdf as any)()
      .from(div)
      .set({
        filename: "LectureNotes.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4" },
      });

    const blob: Blob = await worker.outputPdf("blob");
    return blob;
  };

  const downloadPDF = async () => {
    if (!response) return;
    setIsGeneratingPDF(true);
    try {
      const blob = await buildPdfBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LectureNotes.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const saveToCloud = async () => {
    if (!response) return;
    setIsSaving(true);
    try {
      const blob = await buildPdfBlob();
      const formData = new FormData();
      formData.append("title", "Lecture Notes");
      formData.append("file", blob, "LectureNotes.pdf");

      const res = await fetch("/api/lectures", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }
      alert("Lecture saved to cloud successfully");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 text-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 backdrop-blur shadow-2xl p-8 lg:p-10">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-indigo-200 via-white to-emerald-200 opacity-60" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-sm">
                Create Lecture Notes
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Speak, upload, and publish polished notes in minutes.
              </h1>
              <p className="text-gray-600">
                Capture your lecture with voice or slides, let AI structure it, render Markdown,
                and publish a cloud PDF ready for students to download or chat with.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                <Badge text="Proxy to FastAPI" />
                <Badge text="Cloud PDF ready" />
                <Badge text="Markdown preview" />
                <Badge text="Student chat-ready" />
              </div>
            </div>
            <div className="relative rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase">Status</p>
                  <p className="text-sm text-gray-600">
                    {isSubmitting ? "Processing..." : response ? "Notes ready" : "Awaiting input"}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  {response ? "Generated" : isSubmitting ? "Running" : "Idle"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs text-gray-700">
                <Info label="Recording" value={isRecording ? "Live" : "Stopped"} />
                <Info label="Transcript" value={transcript ? "Captured" : "Empty"} />
                <Info label="Slides" value={file ? "Attached" : "None"} />
              </div>
              <div className="text-xs text-gray-500">
                Tip: You can use either voice transcript or upload slides—or both for richer notes.
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase">
                    Voice capture
                  </p>
                  <p className="text-sm text-gray-700">Record your lecture live.</p>
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  {formatTime(recordingTime)}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold disabled:opacity-50 shadow"
                >
                  Start
                </button>
                <button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="flex-1 px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold disabled:opacity-50 shadow"
                >
                  Stop
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-3">
              <p className="text-xs font-semibold text-indigo-600 uppercase">Upload slides</p>
              <input
                type="file"
                onChange={handleFileChange}
                className="text-sm text-gray-700"
              />
              {file && <p className="text-xs text-gray-600">Attached: {file.name}</p>}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase">
                    Live transcript
                  </p>
                  <p className="text-sm text-gray-700">Edit any time before sending.</p>
                </div>
                <span className="text-xs text-gray-500">Autosaves in state</span>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={8}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-60 w-full sm:w-auto"
              >
                {isSubmitting ? "Processing..." : "Send to AI & Prepare Notes"}
              </button>
              <p className="text-xs text-gray-600">
                Attach slides or rely on voice — both are supported for richer notes.
              </p>
            </div>
          </div>
        </div>

        {/* Output */}
        {response && (
          <div className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6 space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase">
                  AI Generated Notes
                </p>
                <h2 className="text-2xl font-bold text-gray-900">Ready for your class</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold shadow hover:bg-teal-700"
                >
                  {isGeneratingPDF ? "Generating..." : "Download PDF"}
                </button>
                <button
                  onClick={saveToCloud}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 disabled:opacity-60"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save & Publish"}
                </button>
              </div>
            </div>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: md.render(response) }}
            />

            <details className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <summary className="cursor-pointer font-semibold text-gray-800">
                View Raw Markdown
              </summary>
              <pre className="mt-2 p-4 bg-white rounded text-sm border border-gray-100 overflow-auto">
                {response}
              </pre>
            </details>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
