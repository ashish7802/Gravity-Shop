import { NextResponse } from "next/server";
import { logger } from "./logger";

export class ApiError extends Error {
  public statusCode: number;
  public context?: Record<string, unknown>;

  constructor(message: string, statusCode: number = 500, context?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.context = context;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorHandler(handler: (req: Request, ...args: any[]) => Promise<NextResponse>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: Request, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        logger.warn(`API Error: ${error.message}`, { path: req.url, status: error.statusCode, ...error.context });
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }

      const err = error as { name?: string; message?: string };
      // Database offline graceful fallback
      if (
        err?.name?.includes("Mongo") ||
        err?.name === "MongooseError" ||
        err?.message?.includes("buffering timed out") ||
        err?.message?.includes("ECONNREFUSED") ||
        err?.message?.includes("connect")
      ) {
        logger.warn(`[AI Studio] Database offline — returning fallback response: ${err.message}`);
        const url = new URL(req.url);
        const path = url.pathname;
        if (req.method === "GET") {
          return NextResponse.json(path.endsWith("s") || path.endsWith("s/") ? [] : {});
        }
        return NextResponse.json(
          { error: "Service temporarily operating in offline demonstration mode." },
          { status: 200 }
        );
      }

      // Unhandled System Errors
      const reqId = crypto.randomUUID();
      logger.error("Unhandled API Exception", error, { path: req.url, method: req.method, reqId });
      
      return NextResponse.json(
        { error: "Internal Server Error", reqId },
        { status: 500 }
      );
    }
  };
}
