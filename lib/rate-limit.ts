// In-memory rate limiting fallback for AI Studio environment
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const ratelimit = {
  limit: async (identifier: string) => {
    const now = Date.now();
    const windowMs = 10 * 1000; // 10 seconds
    const maxRequests = 10;

    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: now + windowMs,
      };
    }

    if (record.count >= maxRequests) {
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: record.resetTime,
      };
    }

    record.count += 1;
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - record.count,
      reset: record.resetTime,
    };
  },
};
