import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "https://mock-url.upstash.io",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "mock_token",
  }),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});
