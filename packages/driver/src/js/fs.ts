import type { Backend } from "@zenfs/core";
import * as zenfs from "@zenfs/core";
import { Errno, ErrnoError, Stats } from "@zenfs/core";
import { log, tag } from "./logger";

class FetchError extends Error {
  constructor(
    public readonly response: Response,
    message?: string,
  ) {
    super(message || `${response.status}: ${response.statusText}`);
  }
}

function statsToMetadata(stats: zenfs.StatsLike) {
  return {
    atimeMs: stats.atimeMs,
    mtimeMs: stats.mtimeMs,
    ctimeMs: stats.ctimeMs,
    birthtimeMs: stats.birthtimeMs,
    uid: stats.uid,
    gid: stats.gid,
    size: stats.size,
    mode: stats.mode,
    ino: stats.ino,
  };
}