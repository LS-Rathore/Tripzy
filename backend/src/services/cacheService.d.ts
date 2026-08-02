/**
 * Smart In-Memory Cache Service
 *
 * Production-grade caching layer for AI-generated responses.
 * Uses an in-memory Map with TTL (time-to-live) expiration.
 * Drop-in replaceable with Redis in production by swapping the storage backend.
 */
declare class CacheService {
    private store;
    private defaultTTL;
    private hits;
    private misses;
    constructor(defaultTTLSeconds?: number);
    /**
     * Generate a deterministic cache key from an object.
     * Sorts keys to ensure { a:1, b:2 } and { b:2, a:1 } produce the same key.
     */
    generateKey(prefix: string, params: Record<string, unknown>): string;
    /**
     * Get a cached value. Returns null if not found or expired.
     */
    get<T>(key: string): T | null;
    /**
     * Set a cached value with optional custom TTL.
     */
    set<T>(key: string, data: T, ttlSeconds?: number): void;
    /**
     * Remove expired entries from the store.
     */
    private cleanup;
    /**
     * Get cache statistics for monitoring.
     */
    getStats(): {
        size: number;
        hits: number;
        misses: number;
        hitRate: string;
    };
}
export declare const conceptCache: CacheService;
export declare const itineraryCache: CacheService;
export default CacheService;
//# sourceMappingURL=cacheService.d.ts.map