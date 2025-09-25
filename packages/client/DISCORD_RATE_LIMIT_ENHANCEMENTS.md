# Discord API Rate Limiting Enhancements

This document outlines the comprehensive enhancements made to our client code to implement Discord API best practices for rate limiting.

## Overview

Based on Discord's official rate limiting documentation, we've enhanced our client code with advanced rate limiting strategies, exponential backoff, request queuing, and proper header monitoring.

## Key Enhancements

### 1. Enhanced Rate Limiting Middleware (`lib/rate-limit.ts`)

#### Global Rate Limiting
- **50 requests per second limit** - Implements Discord's global rate limit
- Automatic counter reset every second
- Prevents exceeding Discord's global API limits

#### Per-Route Rate Limiting
- **Specific limits for different endpoints**:
  - `/users/@me/guilds`: 5 requests per minute
  - `/guilds`: 10 requests per minute  
  - `/channels`: 5 requests per minute
  - `/webhooks`: 30 requests per minute
- Route-specific counters with TTL-based expiration

#### Exponential Backoff Strategy
- **Intelligent retry logic** with exponential backoff
- Base delay of 1 second, doubling with each retry
- Maximum delay cap of 30 seconds
- **Jitter added** to prevent thundering herd problems
- Up to 3 retry attempts by default

#### Request Queuing System
- **Automatic queuing** when rate limits are hit
- Requests are queued instead of immediately failing
- Background processing of queued requests
- Respects both global and per-route limits

#### Header Monitoring
- **Proper parsing** of Discord rate limit headers:
  - `X-RateLimit-Remaining`: Tracks remaining requests
  - `X-RateLimit-Reset`: Tracks when limits reset
  - `Retry-After`: Handles 429 responses correctly
- **Proactive monitoring** with warnings when limits are low

### 2. Enhanced Discord API Client (`lib/discord-api-client.ts`)

#### Clean Interface
- **Singleton pattern** for consistent usage
- Type-safe interfaces for Discord objects
- Centralized error handling and logging

#### Built-in Caching
- **Automatic caching** of API responses
- Configurable TTL for different data types
- Cache invalidation methods
- Fallback to cached data on API failures

#### Permission Utilities
- **Helper methods** for checking guild permissions
- Filtering guilds by permission level
- Support for common Discord permissions

### 3. Updated API Routes

#### Guilds Route (`app/api/guilds/route.ts`)
- **Migrated to use enhanced Discord API client**
- Simplified code with better error handling
- Automatic fallback to cached data
- Proper rate limit error responses

## Discord API Best Practices Implemented

### ✅ Rate Limit Compliance
- **Global limit**: 50 requests/second
- **Per-route limits**: Respects endpoint-specific limits
- **Proper 429 handling**: Uses `Retry-After` header correctly

### ✅ Exponential Backoff
- **Progressive delays**: 1s → 2s → 4s → 8s → 16s → 30s max
- **Jitter**: Prevents synchronized retries
- **Max retries**: Configurable retry attempts

### ✅ Request Deduplication
- **Prevents duplicate requests** for identical API calls
- **Shared request promises** for concurrent identical requests
- **Automatic cleanup** of completed requests

### ✅ Header Monitoring
- **X-RateLimit-Remaining**: Tracks remaining requests
- **X-RateLimit-Reset**: Monitors reset times
- **Proactive warnings** when limits are low

### ✅ Caching Strategy
- **Reduces API calls** through intelligent caching
- **TTL-based expiration** for different data types
- **Fallback to cache** on API failures

### ✅ Error Handling
- **Graceful degradation** when APIs fail
- **Proper HTTP status codes** for different error types
- **User-friendly error messages**

## Usage Examples

### Basic Discord API Call
```typescript
import { discordApi } from '@/lib/discord-api-client';

// Get user's guilds with automatic rate limiting and caching
const guilds = await discordApi.getUserGuilds(accessToken, userId);

// Filter guilds by permission
const manageableGuilds = discordApi.filterGuildsByPermission(guilds, 'MANAGE_GUILD');
```

### Enhanced Rate-Limited Fetch
```typescript
import { discordApiFetch } from '@/lib/rate-limit';

// Fetch with automatic retry and rate limiting
const response = await discordApiFetch(
  'https://discord.com/api/v10/users/@me',
  { headers: { Authorization: `Bearer ${token}` } },
  'user-cache-key',
  600 // 10 minutes cache
);
```

## Performance Benefits

### Reduced API Calls
- **Intelligent caching** reduces redundant requests
- **Request deduplication** prevents duplicate calls
- **Queue system** batches requests efficiently

### Better User Experience
- **Faster responses** through caching
- **Graceful fallbacks** when APIs are slow
- **Automatic retries** with exponential backoff

### Improved Reliability
- **Rate limit compliance** prevents API blocks
- **Error recovery** with cached data fallbacks
- **Monitoring and logging** for debugging

## Configuration

### Environment Variables
```env
REDIS_URL=redis://localhost:6379  # Optional: for distributed caching
```

### Rate Limit Configuration
```typescript
// Per-route limits can be configured in rate-limit.ts
private static readonly PER_ROUTE_LIMITS = new Map([
  ['/users/@me/guilds', { limit: 5, window: 60000 }],
  // Add more routes as needed
]);
```

## Monitoring and Debugging

### Logging
- **Rate limit warnings** when approaching limits
- **Cache hit/miss logging** for performance monitoring
- **Error logging** with context for debugging

### Metrics
- **Request counts** per endpoint
- **Cache hit rates** for optimization
- **Rate limit violations** for monitoring

## Future Enhancements

### Potential Improvements
1. **Metrics collection** for rate limit usage
2. **Dynamic rate limit adjustment** based on Discord responses
3. **Circuit breaker pattern** for failing endpoints
4. **Request prioritization** in the queue system

### Discord API Updates
- **Monitor Discord API changes** for rate limit updates
- **Adapt to new endpoints** and their specific limits
- **Update caching strategies** based on API evolution

## Conclusion

These enhancements significantly improve our Discord API integration by:

- **Preventing rate limit violations** through proactive limiting
- **Improving performance** with intelligent caching
- **Enhancing reliability** with exponential backoff and queuing
- **Providing better user experience** with graceful error handling

The implementation follows Discord's official best practices and provides a robust foundation for scaling our Discord API usage.
