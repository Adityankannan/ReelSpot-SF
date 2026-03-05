import { describe, it, expect, vi, afterEach } from "vitest";
import { logger } from "./logger";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function spyOnConsole() {
  return {
    debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
    info: vi.spyOn(console, "info").mockImplementation(() => {}),
    warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
    error: vi.spyOn(console, "error").mockImplementation(() => {}),
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logger.info calls console.info with the [ReelSpotSF][INFO] prefix", () => {
    const spies = spyOnConsole();
    logger.info("test message");
    expect(spies.info).toHaveBeenCalledOnce();
    expect(spies.info).toHaveBeenCalledWith(
      "[ReelSpotSF][INFO]",
      "test message",
    );
  });

  it("logger.warn calls console.warn with the [ReelSpotSF][WARN] prefix", () => {
    const spies = spyOnConsole();
    logger.warn("something unexpected");
    expect(spies.warn).toHaveBeenCalledOnce();
    expect(spies.warn).toHaveBeenCalledWith(
      "[ReelSpotSF][WARN]",
      "something unexpected",
    );
  });

  it("logger.error calls console.error with the [ReelSpotSF][ERROR] prefix", () => {
    const spies = spyOnConsole();
    logger.error("something broke");
    expect(spies.error).toHaveBeenCalledOnce();
    expect(spies.error).toHaveBeenCalledWith(
      "[ReelSpotSF][ERROR]",
      "something broke",
    );
  });

  it("logger.debug calls console.debug in non-production environments", () => {
    const spies = spyOnConsole();
    logger.debug("detailed trace");
    // Vitest runs with import.meta.env.PROD === false, so debug is emitted.
    expect(spies.debug).toHaveBeenCalledOnce();
    expect(spies.debug).toHaveBeenCalledWith(
      "[ReelSpotSF][DEBUG]",
      "detailed trace",
    );
  });

  it("forwards an optional context object as a third argument", () => {
    const spies = spyOnConsole();
    const ctx = { movieCount: 42 };
    logger.info("data loaded", ctx);
    expect(spies.info).toHaveBeenCalledWith(
      "[ReelSpotSF][INFO]",
      "data loaded",
      ctx,
    );
  });

  it("omits the context argument when none is provided", () => {
    const spies = spyOnConsole();
    logger.info("no context");
    const callArgs = spies.info.mock.calls[0];
    // Should only have two arguments: prefix + message
    expect(callArgs).toHaveLength(2);
  });

  it("logger.info does not call other console methods", () => {
    const spies = spyOnConsole();
    logger.info("only info");
    expect(spies.debug).not.toHaveBeenCalled();
    expect(spies.warn).not.toHaveBeenCalled();
    expect(spies.error).not.toHaveBeenCalled();
  });
});
