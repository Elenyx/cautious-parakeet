/**
 * Cache metrics tracking service
 */
export class CacheMetrics {
    private static instance: CacheMetrics;
    private metrics: Map<string, {
        hits: number;
        misses: number;
        totalRequests: number;
        lastAccessed: Date;
        averageResponseTime: number;
        totalResponseTime: number;
    }> = new Map();

    private constructor() {}

    /**
     * Get singleton instance
     */
    public static getInstance(): CacheMetrics {
        if (!CacheMetrics.instance) {
            CacheMetrics.instance = new CacheMetrics();
        }
        return CacheMetrics.instance;
    }

    /**
     * Record a cache hit
     */
    recordHit(key: string, responseTime: number = 0): void {
        const metric = this.getOrCreateMetric(key);
        metric.hits++;
        metric.totalRequests++;
        metric.lastAccessed = new Date();
        this.updateResponseTime(metric, responseTime);
    }

    /**
     * Record a cache miss
     */
    recordMiss(key: string, responseTime: number = 0): void {
        const metric = this.getOrCreateMetric(key);
        metric.misses++;
        metric.totalRequests++;
        metric.lastAccessed = new Date();
        this.updateResponseTime(metric, responseTime);
    }

    /**
     * Get or create metric entry
     */
    private getOrCreateMetric(key: string) {
        if (!this.metrics.has(key)) {
            this.metrics.set(key, {
                hits: 0,
                misses: 0,
                totalRequests: 0,
                lastAccessed: new Date(),
                averageResponseTime: 0,
                totalResponseTime: 0,
            });
        }
        return this.metrics.get(key)!;
    }

    /**
     * Update response time metrics
     */
    private updateResponseTime(metric: any, responseTime: number): void {
        metric.totalResponseTime += responseTime;
        metric.averageResponseTime = metric.totalResponseTime / metric.totalRequests;
    }

    /**
     * Get cache hit rate for a specific key
     */
    getHitRate(key: string): number {
        const metric = this.metrics.get(key);
        if (!metric || metric.totalRequests === 0) {
            return 0;
        }
        return (metric.hits / metric.totalRequests) * 100;
    }

    /**
     * Get overall cache statistics
     */
    getOverallStats(): {
        totalRequests: number;
        totalHits: number;
        totalMisses: number;
        overallHitRate: number;
        averageResponseTime: number;
    } {
        let totalRequests = 0;
        let totalHits = 0;
        let totalMisses = 0;
        let totalResponseTime = 0;

        for (const metric of this.metrics.values()) {
            totalRequests += metric.totalRequests;
            totalHits += metric.hits;
            totalMisses += metric.misses;
            totalResponseTime += metric.totalResponseTime;
        }

        return {
            totalRequests,
            totalHits,
            totalMisses,
            overallHitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
            averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
        };
    }

    /**
     * Get detailed metrics for all keys
     */
    getDetailedMetrics(): Record<string, {
        hits: number;
        misses: number;
        totalRequests: number;
        hitRate: number;
        lastAccessed: string;
        averageResponseTime: number;
    }> {
        const result: Record<string, any> = {};

        for (const [key, metric] of this.metrics.entries()) {
            result[key] = {
                hits: metric.hits,
                misses: metric.misses,
                totalRequests: metric.totalRequests,
                hitRate: this.getHitRate(key),
                lastAccessed: metric.lastAccessed.toISOString(),
                averageResponseTime: metric.averageResponseTime,
            };
        }

        return result;
    }

    /**
     * Get top performing cache keys
     */
    getTopPerformers(limit: number = 10): Array<{
        key: string;
        hitRate: number;
        totalRequests: number;
        averageResponseTime: number;
    }> {
        const entries = Array.from(this.metrics.entries())
            .map(([key, metric]) => ({
                key,
                hitRate: this.getHitRate(key),
                totalRequests: metric.totalRequests,
                averageResponseTime: metric.averageResponseTime,
            }))
            .sort((a, b) => b.hitRate - a.hitRate)
            .slice(0, limit);

        return entries;
    }

    /**
     * Get worst performing cache keys
     */
    getWorstPerformers(limit: number = 10): Array<{
        key: string;
        hitRate: number;
        totalRequests: number;
        averageResponseTime: number;
    }> {
        const entries = Array.from(this.metrics.entries())
            .map(([key, metric]) => ({
                key,
                hitRate: this.getHitRate(key),
                totalRequests: metric.totalRequests,
                averageResponseTime: metric.averageResponseTime,
            }))
            .filter(entry => entry.totalRequests > 0)
            .sort((a, b) => a.hitRate - b.hitRate)
            .slice(0, limit);

        return entries;
    }

    /**
     * Reset metrics for a specific key
     */
    resetMetrics(key: string): void {
        this.metrics.delete(key);
    }

    /**
     * Reset all metrics
     */
    resetAllMetrics(): void {
        this.metrics.clear();
    }

    /**
     * Get metrics summary for logging
     */
    getSummary(): string {
        const stats = this.getOverallStats();
        return `Cache Metrics - Requests: ${stats.totalRequests}, Hit Rate: ${stats.overallHitRate.toFixed(2)}%, Avg Response: ${stats.averageResponseTime.toFixed(2)}ms`;
    }
}