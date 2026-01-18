import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/app/lib/databaseConnection";
import Lecture from "@/app/models/lecture.model";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const lectures = await Lecture.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, lectures });
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const form = await request.formData();
    const title = (form.get("title") as string) || "Lecture Notes";
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "PDF file is required" },
        { status: 400 }
      );
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { success: false, message: "Cloudinary env vars missing" },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.byteLength === 0) {
      return NextResponse.json(
        { success: false, message: "Generated PDF is empty. Please regenerate notes." },
        { status: 400 }
      );
    }

    const uploadResult = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          // Use auto to ensure correct content-type for inline PDF viewing
          resource_type: "auto",
          folder: "lecture-notes",
          format: "pdf",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ secure_url: result.secure_url });
        }
      );
      stream.end(buffer);
    });

    const doc = await Lecture.create({ title, pdfUrl: uploadResult.secure_url });

    return NextResponse.json(
      { success: true, lecture: doc },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload lecture failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload lecture" },
      { status: 500 }
    );
  }
}
