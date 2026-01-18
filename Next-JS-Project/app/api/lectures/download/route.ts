import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseFromUrl(pdfUrl: string) {
  try {
    const url = new URL(pdfUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    // Expect: /<cloud>/raw/upload/v123456/lecture-notes/file.pdf
    // parts: [ "<cloud>", "raw", "upload", "v123456", "...path..." ]
    const resourceType = parts[1] || "raw";
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1 || uploadIdx + 1 >= parts.length) return null;
    const afterUpload = parts.slice(uploadIdx + 1); // v123/...path...
    // remove version if starts with v
    const withoutVersion =
      afterUpload[0]?.startsWith("v") ? afterUpload.slice(1) : afterUpload;
    if (withoutVersion.length === 0) return null;
    const filenameWithExt = withoutVersion.join("/");
    const lastDot = filenameWithExt.lastIndexOf(".");
    if (lastDot === -1) return null;
    const publicId = filenameWithExt.slice(0, lastDot);
    const format = filenameWithExt.slice(lastDot + 1);
    return { publicId, format, resourceType };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pdfUrl = searchParams.get("pdfUrl");

  if (!pdfUrl) {
    return NextResponse.json(
      { success: false, message: "pdfUrl is required" },
      { status: 400 }
    );
  }

  const parsed = parseFromUrl(pdfUrl);
  if (!parsed) {
    return NextResponse.json(
      { success: false, message: "Invalid Cloudinary URL" },
      { status: 400 }
    );
  }

  const { publicId, format, resourceType } = parsed;

  try {
    const signedUrl = cloudinary.utils.private_download_url(publicId, format, {
      resource_type: resourceType,
      type: "upload",
      attachment: false,
      expires_at: Math.floor(Date.now() / 1000) + 300,
    });

    const response = await fetch(signedUrl);
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { success: false, message: `Download failed: ${text || response.statusText}` },
        { status: 502 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${publicId.split("/").pop() || "lecture"}.pdf"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
