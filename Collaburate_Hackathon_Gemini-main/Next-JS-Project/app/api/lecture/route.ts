import { NextResponse } from "next/server";

const PY_BACKEND_URL =
  process.env.PY_BACKEND_URL || "http://127.0.0.1:8000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const incomingForm = await request.formData();
    const forwardForm = new FormData();

    for (const [key, value] of incomingForm.entries()) {
      if (typeof value === "string") {
        forwardForm.append(key, value);
      } else if (value instanceof File) {
        forwardForm.append(key, value, value.name);
      }
    }

    const response = await fetch(`${PY_BACKEND_URL}/lecture`, {
      method: "POST",
      body: forwardForm,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy /lecture failed:", error);
    return NextResponse.json(
      { status: 500, message: "Failed to reach lecture service" },
      { status: 500 }
    );
  }
}
