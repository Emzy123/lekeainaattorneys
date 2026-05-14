import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 5 requests per 1 minute
// Note: Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in environment variables.
// If these are not present, it will fail gracefully or throw an error depending on usage.
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});
