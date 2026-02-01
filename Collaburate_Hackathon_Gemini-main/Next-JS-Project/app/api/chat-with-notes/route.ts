// @ts-nocheck
import { NextResponse } from "next/server";

const PY_BACKEND_URL =
  process.env.PY_BACKEND_URL || "http://127.0.0.1:8000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const incomingForm = await request.formData();
    const forwardForm = new FormData();

    const pdfUrl = incomingForm.get("pdfUrl");

    for (const [key, value] of incomingForm.entries()) {
      if (key === "pdfUrl") continue; // handled separately
      if (typeof value === "string") {
        forwardForm.append(key, value);
      } else if (value instanceof File) {
        forwardForm.append(key, value, value.name);
      }
    }

    if (!forwardForm.get("file") && typeof pdfUrl === "string") {
      const remote = await fetch(pdfUrl);
      if (!remote.ok) {
        return NextResponse.json(
          { status: 400, message: "Unable to fetch lecture PDF" },
          { status: 400 }
        );
      }
      const blob = await remote.blob();
      const filename = pdfUrl.split("/").pop() || "lecture.pdf";
      forwardForm.append("file", blob, filename);
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
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy /chat-with-notes failed:", error);
    return NextResponse.json(
      { status: 500, message: "Failed to reach AI service" },
      { status: 500 }
    );
  }
}
