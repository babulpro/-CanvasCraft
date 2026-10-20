import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

// Initialize Cloudinary with CLOUDINARY_URL or individual credentials
const rawCloudinaryUrl = process.env.CLOUDINARY_URL || "";
// Strip surrounding quotes if present in .env
const cloudinaryUrl = rawCloudinaryUrl.replace(/^["']+|["']+$/g, "").trim();

if (cloudinaryUrl && cloudinaryUrl.startsWith("cloudinary://")) {
  try {
    const parsed = new URL(cloudinaryUrl);
    cloudinary.config({
      cloud_name: parsed.hostname,
      api_key: parsed.username,
      api_secret: parsed.password,
      secure: true,
    });
  } catch {
    cloudinary.config({ secure: true });
  }
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  const config = cloudinary.config();
  return Boolean(config.cloud_name && config.api_key && config.api_secret);
}

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  slotIndex?: number;
}

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  thumbnail_url?: string;
}

/**
 * Uploads a binary image buffer directly to Cloudinary via upload_stream.
 * Optimal for multipart/form-data file uploads (no base64 overhead).
 */
export async function uploadCanvasBuffer(
  buffer: Buffer,
  options?: UploadOptions
): Promise<CloudinaryUploadResult> {
  const folder = options?.folder || "canvascraft/custom_artworks";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options?.publicId,
        resource_type: "image",
        overwrite: true,
        tags: options?.tags || ["canvascraft", "production"],
        transformation: [
          {
            quality: "auto:best",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed."));
        }

        const thumbnailUrl = cloudinary.url(result.public_id, {
          width: 320,
          height: 320,
          crop: "limit",
          quality: "auto",
          fetch_format: "auto",
          secure: true,
        });

        resolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          thumbnail_url: thumbnailUrl,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Uploads a data URI or file path to Cloudinary with automatic WebP conversion.
 */
export async function uploadCanvasImage(
  dataUriOrPath: string,
  options?: UploadOptions
): Promise<CloudinaryUploadResult> {
  const folder = options?.folder || "canvascraft/custom_artworks";

  const response: UploadApiResponse = await cloudinary.uploader.upload(
    dataUriOrPath,
    {
      folder,
      public_id: options?.publicId,
      resource_type: "image",
      overwrite: true,
      tags: options?.tags || ["canvascraft", "production"],
      transformation: [
        {
          quality: "auto:best",
          fetch_format: "auto",
        },
      ],
    }
  );

  const thumbnailUrl = cloudinary.url(response.public_id, {
    width: 320,
    height: 320,
    crop: "limit",
    quality: "auto",
    fetch_format: "auto",
    secure: true,
  });

  return {
    url: response.url,
    secure_url: response.secure_url,
    public_id: response.public_id,
    width: response.width,
    height: response.height,
    format: response.format,
    bytes: response.bytes,
    thumbnail_url: thumbnailUrl,
  };
}

/**
 * Returns a transformed Cloudinary CDN URL for responsive viewing.
 */
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  }
): string {
  return cloudinary.url(publicId, {
    width: options?.width,
    height: options?.height,
    crop: options?.crop || "limit",
    quality: options?.quality || "auto",
    fetch_format: "auto",
    secure: true,
  });
}

export { cloudinary };
export default cloudinary;
