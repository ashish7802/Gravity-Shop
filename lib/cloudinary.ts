import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  resource_type: string;
  [key: string]: unknown;
}

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string,
  resourceType: "auto" | "image" | "raw" = "auto",
  mimeType: string = "image/png"
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve) => {
    const isConfigured = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (!isConfigured) {
      // In-memory base64 data URI fallback for local and preview environments
      const base64 = buffer.toString("base64");
      const dataUri = `data:${mimeType};base64,${base64}`;
      return resolve({
        secure_url: dataUri,
        public_id: "local_" + Math.random().toString(36).substring(2, 10),
        format: mimeType.split("/")[1] || "bin",
        bytes: buffer.length,
        resource_type: resourceType,
      });
    }

    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error || !result) {
            console.warn("[Cloudinary] Upload failed, falling back to data URL:", error?.message);
            const base64 = buffer.toString("base64");
            const dataUri = `data:${mimeType};base64,${base64}`;
            return resolve({
              secure_url: dataUri,
              public_id: "fallback_" + Math.random().toString(36).substring(2, 10),
              format: mimeType.split("/")[1] || "bin",
              bytes: buffer.length,
              resource_type: resourceType,
            });
          }
          resolve(result as CloudinaryUploadResult);
        }
      );

      uploadStream.end(buffer);
    } catch {
      const base64 = buffer.toString("base64");
      const dataUri = `data:${mimeType};base64,${base64}`;
      resolve({
        secure_url: dataUri,
        public_id: "fallback_" + Math.random().toString(36).substring(2, 10),
        format: mimeType.split("/")[1] || "bin",
        bytes: buffer.length,
        resource_type: resourceType,
      });
    }
  });
};

export const destroyCloudinaryAsset = async (publicId: string, resourceType: "image" | "raw" = "image") => {
  if (!publicId || publicId.startsWith("local_") || publicId.startsWith("fallback_")) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.warn("Failed to delete asset from Cloudinary", error);
  }
};
