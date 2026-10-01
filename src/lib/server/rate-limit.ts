import "server-only";

/**
 * Fixed-window-with-sliding-log rate limiter.
 *
 * The default store is in-memory: correct for a single long-running Node process and
 * a reasonable first line of defence on serverless (per-instance). For multi-instance
 * production, implement `RateLimitStore` on top of Redis/Upstash/Cloudflare KV and pass
 * it to `createRateLimiter` — the route code doesn't change.
 */

export interface RateLimitStore {
  /** Record a hit and return the timestamps inside the current window (including this one). */
  hit(key: string, now: number, windowMs: number): Promise<number[]>;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the oldest hit leaves the window. */
  retryAfter: number;
}

class MemoryStore implements RateLimitStore {
  private hits = new Map<string, number[]>();
  private lastSweep = 0;

  async hit(key: string, now: number, windowMs: number) {
    this.sweep(now, windowMs);
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    this.hits.set(key, recent);
    return recent;
  }

  /** Drop stale keys so the map can't grow without bound. */
  private sweep(now: number, windowMs: number) {
    if (now - this.lastSweep < windowMs) return;
    this.lastSweep = now;
    for (const [key, times] of this.hits) {
      if (times.every((t) => now - t >= windowMs)) this.hits.delete(key);
    }
  }
}

export function createRateLimiter(opts: {
  limit: number;
  windowMs: number;
  store?: RateLimitStore;
}) {
  const store = opts.store ?? new MemoryStore();
  return async function check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const hits = await store.hit(key, now, opts.windowMs);
    const allowed = hits.length <= opts.limit;
    const oldest = hits[0] ?? now;
    return {
      allowed,
      remaining: Math.max(0, opts.limit - hits.length),
      retryAfter: allowed ? 0 : Math.ceil((opts.windowMs - (now - oldest)) / 1000),
    };
  };
}

// Module-level singletons survive across requests within one server instance.
export const contactSubmitLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });
export const contactTokenLimiter = createRateLimiter({ limit: 30, windowMs: 10 * 60_000 });
