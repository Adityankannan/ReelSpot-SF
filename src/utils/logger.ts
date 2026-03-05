/**
 * Lightweight structured logger for ReelSpot SF.
 *
 * Usage:
 *   import { logger } from "../utils/logger";
 *   logger.info("Data loaded", { movieCount: 42 });
 *
 * Levels (lowest → highest severity):
 *   debug  – verbose diagnostics, suppressed in production builds
 *   info   – normal lifecycle events (fetch started, data loaded, …)
 *   warn   – recoverable anomalies (unexpected shape, slow request, …)
 *   error  – unrecoverable failures (network error, API error, …)
 *
 * To integrate a remote logging service (e.g. Sentry, Datadog), replace the
 * console calls inside `emit` with the SDK's reporting methods.
 */

type Level = "debug" | "info" | "warn" | "error";

function emit(level: Level, message: string, context?: unknown): void {
  // Suppress debug-level messages in production bundles.
  if (import.meta.env.PROD && level === "debug") return;

  const prefix = `[ReelSpotSF][${level.toUpperCase()}]`;
  const args: unknown[] =
    context !== undefined ? [prefix, message, context] : [prefix, message];

  switch (level) {
    case "debug":
      console.debug(...args);
      break;
    case "info":
      console.info(...args);
      break;
    case "warn":
      console.warn(...args);
      break;
    case "error":
      console.error(...args);
      break;
  }
}

export const logger = {
  /** Verbose diagnostics — suppressed in production. */
  debug: (message: string, context?: unknown) =>
    emit("debug", message, context),
  /** Normal lifecycle events. */
  info: (message: string, context?: unknown) => emit("info", message, context),
  /** Recoverable anomalies. */
  warn: (message: string, context?: unknown) => emit("warn", message, context),
  /** Unrecoverable failures. */
  error: (message: string, context?: unknown) =>
    emit("error", message, context),
};
