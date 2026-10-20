import { NextResponse } from "next/server";
import { uploadCanvasBuffer, uploadCanvasImage, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudinary credentials not configured. Please verify CLOUDINARY_URL in your .env file.",
          configured: false,
        },
        { status: 503 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const slot = formData.get("slotIndex") as string | null;
      const slotIndex = slot ? parseInt(slot, 10) : undefined;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No image file provided in form data." },
          { status: 400 }
        );
      }

      // Convert file stream to binary buffer for upload_stream
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await uploadCanvasBuffer(buffer, {
        folder: "canvascraft/artworks",
        slotIndex,
        tags: ["canvascraft", "production", file.name || "artwork"],
      });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        thumbnailUrl: result.thumbnail_url || result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        fileName: file.name,
        slotIndex,
      });
    }

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const imagePayload = body.dataUri || body.image || null;
      const fileName = body.fileName;
      const slotIndex = body.slotIndex;

      if (!imagePayload) {
        return NextResponse.json(
          { success: false, error: "Missing dataUri in request body." },
          { status: 400 }
        );
      }

      const result = await uploadCanvasImage(imagePayload, {
        folder: "canvascraft/artworks",
        slotIndex,
        tags: ["canvascraft", "production", ...(fileName ? [fileName] : [])],
      });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        thumbnailUrl: result.thumbnail_url || result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        fileName,
        slotIndex,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unsupported Content-Type. Use multipart/form-data or application/json.",
      },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to upload image to Cloudinary.";
    console.error("[Cloudinary Upload Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const configured = isCloudinaryConfigured();
  return NextResponse.json({
    status: "ok",
    service: "CanvasCraft Cloudinary Image Service",
    configured,
    message: configured
      ? "Cloudinary is active and ready for canvas uploads."
      : "Cloudinary is waiting for valid CLOUDINARY_URL in .env.",
  });
}
