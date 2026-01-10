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
      const res = await fetch("http://localhost:8000/lecture", {
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

  const downloadPDF = async () => {
    if (!response) return;
    setIsGeneratingPDF(true);

    const html2pdf = (await import("html2pdf.js")).default;
    const html = md.render(response);

    const div = document.createElement("div");
    div.innerHTML = html;
    div.style.padding = "40px";
    div.style.color = "#000";

    await (html2pdf as any)()
      .from(div)
      .set({
        filename: "LectureNotes.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4" },
      })
      .save();

    setIsGeneratingPDF(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Teacher Lecture Dashboard</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Voice Recording</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              Start
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
            >
              Stop
            </button>
            <span className="ml-auto font-mono">
              {formatTime(recordingTime)}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Live Transcript</h2>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={6}
            className="w-full border p-3 rounded font-mono"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Upload Slides</h2>
          <input type="file" onChange={handleFileChange} />
          {file && <p className="mt-2 text-sm">{file.name}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 text-white rounded font-semibold disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Send to AI & Prepare Notes"}
        </button>

        {response && (
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">AI Generated Notes</h2>
              <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-teal-600 text-white rounded"
              >
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </button>
            </div>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: md.render(response) }}
            />

            <details>
              <summary className="cursor-pointer font-semibold">
                View Raw Markdown
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-sm">
                {response}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
