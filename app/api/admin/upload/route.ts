import { NextResponse } from "next/server";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { ApiError, withErrorHandler } from "@/lib/api-error";

// 50MB Limit
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_3D_MIME = ["model/gltf-binary", "model/gltf+json", "application/octet-stream"]; // .glb / .gltf
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_3D_SIZE = 50 * 1024 * 1024; // 50MB

export const POST = withErrorHandler(async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as "image" | "model" | null; // "image" or "model"

  if (!file || !type) {
    throw new ApiError("Missing file or type parameter", 400);
  }

  const mimeType = file.type || "application/octet-stream"; // fallback for some .glb uploads
  const size = file.size;

  // Validation
  if (type === "image") {
    if (!ALLOWED_IMAGE_MIME.includes(mimeType)) {
      throw new ApiError(`Invalid image MIME type: ${mimeType}`, 400);
    }
    if (size > MAX_IMAGE_SIZE) {
      throw new ApiError("Image exceeds 10MB limit", 400);
    }
  } else if (type === "model") {
    // Relaxed MIME check for 3D files because browsers often send application/octet-stream for .glb
    if (!ALLOWED_3D_MIME.includes(mimeType) && !file.name.endsWith(".glb") && !file.name.endsWith(".gltf")) {
      throw new ApiError(`Invalid 3D MIME type: ${mimeType}`, 400);
    }
    if (size > MAX_3D_SIZE) {
      throw new ApiError("3D model exceeds 50MB limit", 400);
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Determine target folder and resource type
  const folder = type === "model" ? "gravity-shop/models" : "gravity-shop/images";
  const uploadResult = await uploadBufferToCloudinary(buffer, folder, "auto");

  return NextResponse.json({
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    format: uploadResult.format,
    size: uploadResult.bytes,
    originalFilename: file.name,
    resourceType: uploadResult.resource_type
  }, { status: 200 });
});
