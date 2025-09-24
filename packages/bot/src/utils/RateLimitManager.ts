import { RedisService } from './RedisService';

/**
 * Rate limit manager for Discord API requests
 */
export class RateLimitManager {
    private redis: RedisService;
    private static instance: RateLimitManager;

    private constructor() {
        this.redis = RedisService.getInstance();
    }

    /**
     * Get singleton instance of RateLimitManager
     */
    public static getInstance(): RateLimitManager {
        if (!RateLimitManager.instance) {
            RateLimitManager.instance = new RateLimitManager();
        }
        return RateLimitManager.instance;
    }

    /**
     * Check if we can make a request to Discord API
     */
    async canMakeRequest(endpoint: string): Promise<{ canProceed: boolean; retryAfter?: number }> {
        const canProceed = await this.redis.canMakeRequest(endpoint);
        
        if (!canProceed) {
            const retryAfter = await this.redis.getRateLimitTTL(endpoint);
            return { canProceed: false, retryAfter };
        }
        
        return { canProceed: true };
    }

    /**
     * Handle rate limit response from Discord API
     */
    async handleRateLimit(endpoint: string, retryAfterSeconds: number): Promise<void> {
        console.warn(`Rate limited on ${endpoint}, retry after ${retryAfterSeconds} seconds`);
        await this.redis.setRateLimit(endpoint, retryAfterSeconds);
    }

    /**
     * Execute a Discord API request with rate limiting
     */
    async executeWithRateLimit<T>(
        endpoint: string,
        requestFn: () => Promise<T>,
        maxRetries: number = 3
    ): Promise<T> {
        let retries = 0;
        
        while (retries < maxRetries) {
            const { canProceed, retryAfter } = await this.canMakeRequest(endpoint);
            
            if (!canProceed && retryAfter && retryAfter > 0) {
                console.log(`Waiting ${retryAfter} seconds before retrying ${endpoint}`);
                await this.sleep(retryAfter * 1000);
                retries++;
                continue;
            }
            
            try {
                return await requestFn();
            } catch (error: any) {
                // Check if it's a rate limit error
                if (error.status === 429) {
                    const retryAfterMs = error.retryAfter || 1000;
                    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
                    
                    await this.handleRateLimit(endpoint, retryAfterSeconds);
                    retries++;
                    
                    if (retries < maxRetries) {
                        console.log(`Rate limited, retrying in ${retryAfterSeconds} seconds (attempt ${retries}/${maxRetries})`);
                        await this.sleep(retryAfterMs);
                        continue;
                    }
                }
                
                throw error;
            }
        }
        
        throw new Error(`Max retries (${maxRetries}) exceeded for ${endpoint}`);
    }

    /**
     * Sleep for specified milliseconds
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get rate limit status for multiple endpoints
     */
    async getRateLimitStatus(endpoints: string[]): Promise<{ [endpoint: string]: { limited: boolean; retryAfter?: number } }> {
        const status: { [endpoint: string]: { limited: boolean; retryAfter?: number } } = {};
        
        for (const endpoint of endpoints) {
            const canProceed = await this.redis.canMakeRequest(endpoint);
            if (!canProceed) {
                const retryAfter = await this.redis.getRateLimitTTL(endpoint);
                status[endpoint] = { limited: true, retryAfter };
            } else {
                status[endpoint] = { limited: false };
            }
        }
        
        return status;
    }

    /**
     * Clear rate limit for an endpoint (for testing purposes)
     */
    async clearRateLimit(endpoint: string): Promise<void> {
        await this.redis.setRateLimit(endpoint, 0);
    }
}