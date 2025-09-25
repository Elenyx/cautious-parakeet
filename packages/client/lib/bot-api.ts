/**
 * Utility functions for making authenticated requests to the bot service
 */

/**
 * Custom error class for bot API authentication failures
 */
export class BotApiAuthError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'BotApiAuthError';
  }
}

/**
 * Custom error class for bot API connection failures
 */
export class BotApiConnectionError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'BotApiConnectionError';
  }
}

/**
 * Creates headers for authenticated requests to the bot service
 * @returns Headers object with Authorization header if API_SECRET is configured
 */
function createBotApiHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const apiSecret = process.env.API_SECRET;
  if (apiSecret) {
    headers['Authorization'] = `Bearer ${apiSecret}`;
  } else {
    console.warn('[BOT-API] API_SECRET not configured - requests will be unauthenticated');
  }

  return headers;
}

/**
 * Makes an authenticated GET request to the bot service
 * @param endpoint - The API endpoint (e.g., '/api/stats')
 * @param options - Additional fetch options
 * @returns Promise<Response>
 * @throws {BotApiConnectionError} When the request fails due to network issues
 * @throws {BotApiAuthError} When the request fails due to authentication issues
 */
export async function botApiGet(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const base = process.env.BOT_API_BASE_URL;
  if (!base) {
    throw new BotApiConnectionError('BOT_API_BASE_URL not configured');
  }

  const url = `${base}${endpoint}`;
  const headers = {
    ...createBotApiHeaders(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      ...options,
      headers,
    });

    // Handle authentication errors
    if (response.status === 401) {
      throw new BotApiAuthError('Authentication failed - invalid or missing API_SECRET', response.status);
    }

    if (response.status === 403) {
      throw new BotApiAuthError('Access forbidden - insufficient permissions', response.status);
    }

    return response;
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof BotApiAuthError || error instanceof BotApiConnectionError) {
      throw error;
    }

    // Handle network/connection errors
    throw new BotApiConnectionError(
      `Failed to connect to bot service at ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    );
  }
}

/**
 * Makes an authenticated POST request to the bot service
 * @param endpoint - The API endpoint (e.g., '/api/bot/presence')
 * @param body - Request body data
 * @param options - Additional fetch options
 * @returns Promise<Response>
 * @throws {BotApiConnectionError} When the request fails due to network issues
 * @throws {BotApiAuthError} When the request fails due to authentication issues
 */
export async function botApiPost(endpoint: string, body?: unknown, options: RequestInit = {}): Promise<Response> {
  const base = process.env.BOT_API_BASE_URL;
  if (!base) {
    throw new BotApiConnectionError('BOT_API_BASE_URL not configured');
  }

  const url = `${base}${endpoint}`;
  const headers = {
    ...createBotApiHeaders(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
      headers,
    });

    // Handle authentication errors
    if (response.status === 401) {
      throw new BotApiAuthError('Authentication failed - invalid or missing API_SECRET', response.status);
    }

    if (response.status === 403) {
      throw new BotApiAuthError('Access forbidden - insufficient permissions', response.status);
    }

    return response;
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof BotApiAuthError || error instanceof BotApiConnectionError) {
      throw error;
    }

    // Handle network/connection errors
    throw new BotApiConnectionError(
      `Failed to connect to bot service at ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    );
  }
}

/**
 * Makes an authenticated request to the bot service health endpoint
 * @returns Promise<Response>
 * @throws {BotApiConnectionError} When the request fails due to network issues
 */
export async function botApiHealth(): Promise<Response> {
  const base = process.env.BOT_API_BASE_URL;
  if (!base) {
    throw new BotApiConnectionError('BOT_API_BASE_URL not configured');
  }

  const url = `${base}/health`;

  try {
    // Health endpoint is public, no authentication needed
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    // Handle network/connection errors
    throw new BotApiConnectionError(
      `Failed to connect to bot service health endpoint at ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    );
  }
}