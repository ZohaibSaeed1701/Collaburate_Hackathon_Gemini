// @ts-nocheck
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/databaseConnection";
import Lecture from "@/app/models/lecture.model";

const PY_BACKEND_URL =
  process.env.PY_BACKEND_URL || "http://127.0.0.1:8000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const incomingForm = await request.formData();
    const forwardForm = new FormData();

    const pdfUrl = incomingForm.get("pdfUrl");
    const origin = new URL(request.url).origin;

    for (const [key, value] of incomingForm.entries()) {
      if (key === "pdfUrl") continue; // handled separately
      if (typeof value === "string") {
        forwardForm.append(key, value);
      } else if (value instanceof File) {
        forwardForm.append(key, value, value.name);
      }
    }

    if (!forwardForm.get("file") && typeof pdfUrl === "string") {
      await dbConnect();
      const lecture = await Lecture.findOne({ pdfUrl }).lean();
      if (lecture?.notesMarkdown) {
        const textBlob = new Blob([lecture.notesMarkdown], {
          type: "text/plain",
        });
        forwardForm.append("file", textBlob, "lecture_notes.txt");
      }

      const isCloudinary = pdfUrl.includes("res.cloudinary.com");
      const remote =
        forwardForm.get("file") !== null
          ? null
          : isCloudinary
          ? await fetch(
              `${origin}/api/lectures/download?pdfUrl=${encodeURIComponent(pdfUrl)}`
            )
          : await fetch(pdfUrl);

      if (remote && !remote.ok) {
        return NextResponse.json(
          { status: 400, message: "Unable to fetch lecture PDF" },
          { status: 400 }
        );
      }
      if (remote) {
        const blob = await remote.blob();
        const filename = pdfUrl.split("/").pop() || "lecture.pdf";
        forwardForm.append("file", blob, filename);
      }
    }

    if (!forwardForm.get("file")) {
      return NextResponse.json(
        { status: 400, message: "File or pdfUrl required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${PY_BACKEND_URL}/chat-with-notes`, {
      method: "POST",
      body: forwardForm,
      cache: "no-store",
    });

    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, { status: response.status });
    } catch {
      return NextResponse.json(
        { status: response.status, message: text || "Backend error" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Proxy /chat-with-notes failed:", error);
    return NextResponse.json(
      { status: 500, message: "Failed to reach AI service" },
      { status: 500 }
    );
  }
}
