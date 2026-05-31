type LogLevel = "info" | "warn" | "error";

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  error?: Error | unknown;
}

const log = (level: LogLevel, { message, context, error }: LogPayload) => {
  const timestamp = new Date().toISOString();
  
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...context,
    ...(error instanceof Error ? { error_name: error.name, error_message: error.message, stack: error.stack } : { error }),
  };

  const serialized = JSON.stringify(logEntry);

  switch (level) {
    case "info":
      console.log(serialized);
      break;
    case "warn":
      console.warn(serialized);
      break;
    case "error":
      console.error(serialized);
      break;
  }
};

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => log("info", { message, context }),
  warn: (message: string, context?: Record<string, unknown>) => log("warn", { message, context }),
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => log("error", { message, error, context }),
};
