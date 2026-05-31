import { logger } from "./logger";

const requiredEnvs = [
  "MONGODB_URI",
  "JWT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

export function validateEnv() {
  if (process.env.npm_lifecycle_event === "build" || process.env.NEXT_PHASE === "phase-production-build") {
    return;
  }

  const missing = requiredEnvs.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    logger.error(`FATAL ERROR: Missing required environment variables: ${missing.join(", ")}`);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      logger.warn("Skipping hard exit in non-production environment, but errors will occur.");
    }
  }
}
