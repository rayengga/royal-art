/**
 * Simple in-process rate limiter (per IP, resets after `windowMs`).
 * For multi-instance deployments replace the Map with Redis.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  /** Window length in milliseconds */
  windowMs: number
  /** Max requests per window */
  max: number
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max } = options

  return function check(ip: string): { allowed: boolean; retryAfter: number } {
    const now = Date.now()
    const entry = store.get(ip)

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs })
      return { allowed: true, retryAfter: 0 }
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      return { allowed: false, retryAfter }
    }

    entry.count += 1
    return { allowed: true, retryAfter: 0 }
  }
}

// Prune stale entries every 5 minutes to prevent memory growth
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60 * 1000)
