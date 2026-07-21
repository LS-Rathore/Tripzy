/**
 * Smart In-Memory Cache Service
 * 
 * Production-grade caching layer for AI-generated responses.
 * Uses an in-memory Map with TTL (time-to-live) expiration.
 * Drop-in replaceable with Redis in production by swapping the storage backend.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class CacheService {
  private store = new Map<string, CacheEntry<unknown>>();
  private defaultTTL: number; // seconds
  private hits = 0;
  private misses = 0;

  constructor(defaultTTLSeconds = 3600) { // 1 hour default
    this.defaultTTL = defaultTTLSeconds;

    // Periodically clean expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Generate a deterministic cache key from an object.
   * Sorts keys to ensure { a:1, b:2 } and { b:2, a:1 } produce the same key.
   */
  generateKey(prefix: string, params: Record<string, unknown>): string {
    const sorted = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        const val = params[key];
        // Normalize arrays by sorting them
        acc[key] = Array.isArray(val) ? [...val].sort() : val;
        return acc;
      }, {} as Record<string, unknown>);

    return `${prefix}:${JSON.stringify(sorted)}`;
  }

  /**
   * Get a cached value. Returns null if not found or expired.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.data;
  }

  /**
   * Set a cached value with optional custom TTL.
   */
  set<T>(key: string, data: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds ?? this.defaultTTL;
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  /**
   * Remove expired entries from the store.
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.log(`[Cache] Cleaned ${cleaned} expired entries. ${this.store.size} remaining.`);
    }
  }

  /**
   * Get cache statistics for monitoring.
   */
  getStats() {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0
        ? ((this.hits / (this.hits + this.misses)) * 100).toFixed(1) + '%'
        : 'N/A',
    };
  }
}

// Singleton instance — shared across all services
// Concepts are cached for 2 hours, itineraries for 1 hour
export const conceptCache = new CacheService(2 * 3600);    // 2h TTL
export const itineraryCache = new CacheService(1 * 3600);   // 1h TTL

export default CacheService;
