import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  resource_type: string;
  [key: string]: unknown;
}

export const uploadBufferToCloudinary = (buffer: Buffer, folder: string, resourceType: "auto" | "image" | "raw" = "auto"): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as CloudinaryUploadResult);
      }
    );

    uploadStream.end(buffer);
  });
};

// Utility to destroy an asset (for replacement)
export const destroyCloudinaryAsset = async (publicId: string, resourceType: "image" | "raw" = "image") => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Failed to delete asset from Cloudinary", error);
  }
};
