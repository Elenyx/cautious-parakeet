import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { Client } from 'discord.js';
import { TicketDAO } from '../database/TicketDAO';
import { DiscordApiService } from '../utils/DiscordApiService';
import { DatabaseManager } from '../database/DatabaseManager';

/**
 * Perform comprehensive health check for the bot service
 * @param client - Discord client instance
 * @returns Health check data
 */
async function performHealthCheck(client: Client): Promise<{
  ok: boolean;
  timestamp: string;
  services: {
    discord: {
      status: 'connected' | 'disconnected';
      guilds: number;
      uptime: number;
    };
    database: {
      status: 'connected' | 'disconnected';
      responseTime: number;
      error?: string;
    };
    bot: {
      status: 'ready' | 'not_ready';
      commands: number;
      events: number;
    };
  };
  uptime: number;
  version: string;
}> {
  const startTime = Date.now();
  
  // Check Discord connection
  const discordStatus = {
    status: client.isReady() ? 'connected' : 'disconnected' as const,
    guilds: client.guilds.cache.size,
    uptime: client.uptime || 0
  };

  // Check database connection
  let databaseStatus: {
    status: 'connected' | 'disconnected';
    responseTime: number;
    error?: string;
  } = {
    status: 'disconnected',
    responseTime: 0,
    error: undefined
  };

  try {
    console.log('[Health] Testing database connection...');
    const dbStartTime = Date.now();
    const dbManager = DatabaseManager.getInstance();
    await dbManager.query('SELECT 1 as health_check');
    const dbResponseTime = Date.now() - dbStartTime;
    console.log(`[Health] Database connection successful (${dbResponseTime}ms)`);
    databaseStatus = {
      status: 'connected',
      responseTime: dbResponseTime
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    console.error('[Health] Database connection failed:', errorMessage);
    databaseStatus = {
      status: 'disconnected',
      responseTime: 0,
      error: errorMessage
    };
  }

  // Check bot readiness and command/event counts
  const botStatus = {
    status: client.isReady() ? 'ready' : 'not_ready' as const,
    commands: client.commands?.size || 0,
    events: client.eventNames().length
  };

  const overallHealth = discordStatus.status === 'connected' && 
                       databaseStatus.status === 'connected' && 
                       botStatus.status === 'ready';

  return {
    ok: overallHealth,
    timestamp: new Date().toISOString(),
    services: {
      discord: {
        status: discordStatus.status as 'connected' | 'disconnected',
        guilds: discordStatus.guilds,
        uptime: discordStatus.uptime
      },
      database: databaseStatus,
      bot: {
        status: botStatus.status as 'ready' | 'not_ready',
        commands: botStatus.commands,
        events: botStatus.events
      }
    },
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  };
}

/**
 * Authentication middleware to validate API_SECRET
 * @param req - Incoming HTTP request
 * @returns true if authenticated, false otherwise
 */
function isAuthenticated(req: IncomingMessage): boolean {
  const apiSecret = process.env.API_SECRET;
  
  // If API_SECRET is not configured, log warning but allow access for backward compatibility
  if (!apiSecret) {
    console.warn('[AUTH] API_SECRET not configured - authentication disabled');
    return true;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return false;
  }

  // Support both "Bearer <token>" and "ApiKey <token>" formats
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7)
    : authHeader.startsWith('ApiKey ')
    ? authHeader.slice(7)
    : authHeader;

  return token === apiSecret;
}

/**
 * Starts a lightweight HTTP server to expose dashboard data endpoints.
 * This avoids adding external server dependencies and serves JSON for the client app to consume.
 *
 * Endpoints:
 * - GET /health -> { ok: true }
 * - GET /api/stats -> { activeTickets, connectedServers, resolvedToday, avgResponse }
 * - GET /api/activity -> Array feed of recent ticket events across guilds
 * - GET /api/guilds/:id -> { activeTickets } for a specific guild
 * - POST /api/bot/presence -> { presenceChecks: [{ guildId, present }] }
 *
 * The server listens on PORT env var (Railway) or 3001 by default.
 */
export async function startHttpServer(client: Client): Promise<void> {
  const ticketDAO = new TicketDAO();
  const port = Number(process.env.PORT) || 3001;
  
  // Initialize Discord API service with caching and rate limiting
  const discordApiService = DiscordApiService.initialize(client);

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      console.log(`[HTTP] ${req.method} ${req.url} from ${req.socket.remoteAddress}:${req.socket.remotePort}`);
      // Basic CORS for local/dev tools; Next.js proxies server-side so this is minimal.
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url || '/', `http://${req.headers.host}`);
      const pathname = url.pathname;
      const method = req.method;

      // Public endpoints (no authentication required)
      if (pathname === '/health') {
        try {
          console.log('[Health] Performing health check...');
          // Perform comprehensive health check
          const healthData = await performHealthCheck(client);
          console.log('[Health] Health check completed:', healthData.ok ? 'OK' : 'FAILED');
          sendJSON(res, 200, healthData);
          return;
        } catch (error) {
          console.error('[Health] Health check failed:', error);
          sendJSON(res, 503, { 
            ok: false, 
            error: 'Health check failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });
          return;
        }
      }

      // All other API endpoints require authentication
      if (pathname.startsWith('/api/')) {
        if (!isAuthenticated(req)) {
          console.warn(`[AUTH] Unauthorized access attempt to ${pathname} from ${req.socket.remoteAddress}`);
          sendJSON(res, 401, { error: 'Unauthorized - Invalid or missing API key' });
          return;
        }
      }

      // Handle POST /api/bot/presence
      if (req.method === 'POST' && pathname === '/api/bot/presence') {
        const body = await readRequestBody(req);
        try {
          const { guildIds } = JSON.parse(body);
          if (!Array.isArray(guildIds)) {
            sendJSON(res, 400, { error: 'Invalid guildIds array' });
            return;
          }
          const data = await discordApiService.checkBotPresence(guildIds);
          sendJSON(res, 200, data);
          return;
        } catch (parseErr) {
          sendJSON(res, 400, { error: 'Invalid JSON body' });
          return;
        }
      }

      // /api/metrics/cache/reset - Reset cache metrics (POST only)
      if (pathname === '/api/metrics/cache/reset') {
        if (method === 'POST') {
          discordApiService.resetCacheMetrics();
          sendJSON(res, 200, { message: 'Cache metrics reset successfully' });
          return;
        } else {
          sendJSON(res, 405, { error: 'Method Not Allowed' });
          return;
        }
      }

      if (req.method !== 'GET') {
        sendJSON(res, 405, { error: 'Method Not Allowed' });
        return;
      }

      if (pathname === '/api/stats') {
        const data = await getStats(client, ticketDAO);
        sendJSON(res, 200, data);
        return;
      }

      if (pathname === '/api/global-stats') {
        const data = await getGlobalStats(client, ticketDAO);
        sendJSON(res, 200, data);
        return;
      }

      if (pathname === '/api/activity') {
        // Support filtering by specific guild IDs via query string (e.g., ?guildIds=123,456)
        const guildIdsParam = url.searchParams.get('guildIds');
        const filter = guildIdsParam
          ? new Set(
              guildIdsParam
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          : undefined;
        const data = await getRecentActivityFeed(client, ticketDAO, filter);
        sendJSON(res, 200, data);
        return;
      }

      // /api/guilds/:id
      if (pathname.startsWith('/api/guilds/')) {
        const parts = pathname.split('/').filter(Boolean);
        const guildId = parts[2];
        if (!guildId) {
          sendJSON(res, 400, { error: 'Guild ID required' });
          return;
        }
        const openCount = await getGuildOpenTickets(ticketDAO, guildId);
        sendJSON(res, 200, { activeTickets: openCount });
        return;
      }

      // /api/cached/guilds - Get cached guild data
      if (pathname === '/api/cached/guilds') {
        const data = await discordApiService.getCachedGuilds();
        sendJSON(res, 200, data);
        return;
      }

      // /api/cached/guilds/:id - Get cached guild details
      if (pathname.startsWith('/api/cached/guilds/')) {
        const parts = pathname.split('/').filter(Boolean);
        const guildId = parts[3];
        if (!guildId) {
          sendJSON(res, 400, { error: 'Guild ID required' });
          return;
        }
        const data = await discordApiService.getCachedGuildData(guildId);
        if (!data) {
          sendJSON(res, 404, { error: 'Guild not found in cache' });
          return;
        }
        sendJSON(res, 200, data);
        return;
      }

      // /api/cached/guilds/:id/members - Get cached guild members
      if (pathname.startsWith('/api/cached/guilds/') && pathname.endsWith('/members')) {
        const parts = pathname.split('/').filter(Boolean);
        const guildId = parts[3];
        if (!guildId) {
          sendJSON(res, 400, { error: 'Guild ID required' });
          return;
        }
        const data = await discordApiService.getCachedGuildMembers(guildId);
        sendJSON(res, 200, data);
        return;
      }

      // /api/cached/guilds/:id/channels - Get cached guild channels
      if (pathname.startsWith('/api/cached/guilds/') && pathname.endsWith('/channels')) {
        const parts = pathname.split('/').filter(Boolean);
        const guildId = parts[3];
        if (!guildId) {
          sendJSON(res, 400, { error: 'Guild ID required' });
          return;
        }
        const data = await discordApiService.getCachedGuildChannels(guildId);
        sendJSON(res, 200, data);
        return;
      }

      // /api/cached/guilds/:id/roles - Get cached guild roles
      if (pathname.startsWith('/api/cached/guilds/') && pathname.endsWith('/roles')) {
        const parts = pathname.split('/').filter(Boolean);
        const guildId = parts[3];
        if (!guildId) {
          sendJSON(res, 400, { error: 'Guild ID required' });
          return;
        }
        const data = await discordApiService.getCachedGuildRoles(guildId);
        sendJSON(res, 200, data);
        return;
      }

      // /api/metrics/task-queue - Get task queue statistics
      if (pathname === '/api/metrics/task-queue') {
        const data = discordApiService.getTaskQueueStats();
        sendJSON(res, 200, data);
        return;
      }

      // /api/metrics/cache - Get cache metrics (GET only)
      if (pathname === '/api/metrics/cache' && method === 'GET') {
        const data = discordApiService.getCacheMetrics();
        sendJSON(res, 200, data);
        return;
      }

      sendJSON(res, 404, { error: 'Not Found' });
    } catch (err) {
      console.error('HTTP Server Error:', err);
      sendJSON(res, 500, { error: 'Internal Server Error' });
    }
  });

  server.on('connection', (socket) => {
    console.log(`🔌 New TCP connection from ${socket.remoteAddress}:${socket.remotePort}`);
  });

  await new Promise<void>((resolve, reject) => {
    // Explicitly bind to IPv4 to avoid IPv6/WSL loopback issues on Windows
    server.on('error', (err) => {
      console.error('🚨 HTTP server listen error:', err);
      reject(err as Error);
    });
    server.listen(port, '0.0.0.0', () => {
      const addr = server.address();
      console.log(`📡 Bot HTTP server listening on port ${port}`);
      console.log('📍 Server address info:', addr);
      resolve();
    });
  });
}

/**
 * Sends a JSON response with proper headers and status code.
 */
function sendJSON(res: ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body).toString(),
  });
  res.end(body);
}

/**
 * Computes aggregate dashboard statistics across all guilds the bot is in.
 */
async function getStats(client: Client, dao: TicketDAO): Promise<{
  activeTickets: number;
  connectedServers: number;
  resolvedToday: number;
  avgResponse: number; // minutes
}> {
  const guilds = client.guilds.cache;
  let activeTickets = 0;
  let resolvedToday = 0;
  let totalResolutionHours = 0;
  let resolvedCount = 0;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  // Iterate through guilds the bot is connected to
  for (const [guildId] of guilds) {
    const tickets = await dao.getGuildTickets(guildId);
    for (const t of tickets) {
      if (t.status === 'open') activeTickets++;
      if (t.status === 'closed' && t.closed_at) {
        const closedTime = new Date(t.closed_at).getTime();
        if (closedTime >= startOfToday.getTime()) {
          resolvedToday++;
        }
        if (t.created_at) {
          const createdTime = new Date(t.created_at).getTime();
          const hours = (closedTime - createdTime) / (1000 * 60 * 60);
          if (hours >= 0 && Number.isFinite(hours)) {
            totalResolutionHours += hours;
            resolvedCount++;
          }
        }
      }
    }
  }

  const avgResponseHours = resolvedCount > 0 ? totalResolutionHours / resolvedCount : 0;
  const avgResponseMinutes = Math.round(avgResponseHours * 60);

  return {
    activeTickets,
    connectedServers: guilds.size,
    resolvedToday,
    avgResponse: avgResponseMinutes,
  };
}

/**
 * Computes global statistics for the homepage display.
 */
async function getGlobalStats(client: Client, dao: TicketDAO): Promise<{
  activeServers: number;
  totalTicketsProcessed: number;
  uptime: number; // percentage
  communityMembers: number;
  dailyMessages: number;
}> {
  const guilds = client.guilds.cache;
  let totalTicketsProcessed = 0;
  let totalMembers = 0;

  // Count total tickets and members across all guilds
  for (const [guildId, guild] of guilds) {
    const tickets = await dao.getGuildTickets(guildId);
    totalTicketsProcessed += tickets.length;
    totalMembers += guild.memberCount;
  }

  // Calculate uptime percentage (simplified - in a real scenario you'd track actual uptime)
  const uptime = client.isReady() ? 99.9 : 0;

  // Estimate daily messages based on activity (simplified calculation)
  const dailyMessages = Math.max(100, Math.floor(totalMembers / 50));

  return {
    activeServers: guilds.size,
    totalTicketsProcessed,
    uptime,
    communityMembers: totalMembers,
    dailyMessages,
  };
}

/**
 * Returns the number of open tickets for a guild.
 */
async function getGuildOpenTickets(dao: TicketDAO, guildId: string): Promise<number> {
  const tickets = await dao.getGuildTickets(guildId);
  return tickets.filter((t) => t.status === 'open').length;
}

/**
 * Builds a feed of recent ticket activities across all guilds.
 * The feed includes ticket creations and resolutions within the last 48 hours.
 */
async function getRecentActivityFeed(client: Client, dao: TicketDAO, filterGuildIds?: Set<string>): Promise<Array<{
  id: string;
  title: string;
  server: string;
  time: string;
  guildId: string;
}>> {
  const now = new Date();
  const start = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const events: Array<{ id: string; title: string; server: string; time: string; ts: number; guildId: string }> = [];

  for (const [guildId] of client.guilds.cache) {
    // If filtering is enabled, skip guilds not in the filter set
    if (filterGuildIds && !filterGuildIds.has(guildId)) continue;

    const guild = client.guilds.cache.get(guildId);
    const guildName = guild?.name || 'Unknown Server';

    const tickets = await dao.getTicketsByDateRange(guildId, start, now);

    for (const t of tickets) {
      // Created event
      if (t.created_at) {
        const tsCreated = new Date(t.created_at).getTime();
        events.push({
          id: `created-${t.id ?? `${guildId}-${t.ticket_number}`}`,
          title: `New ticket created: ${t.ticket_type}`,
          server: guildName,
          time: formatRelative(tsCreated, Date.now()),
          ts: tsCreated,
          guildId,
        });
      }
      // Closed event
      if (t.closed_at) {
        const tsClosed = new Date(t.closed_at).getTime();
        events.push({
          id: `closed-${t.id ?? `${guildId}-${t.ticket_number}`}`,
          title: `Ticket #${t.ticket_number} resolved`,
          server: guildName,
          time: formatRelative(tsClosed, Date.now()),
          ts: tsClosed,
          guildId,
        });
      }
    }
  }

  // Sort descending by timestamp and limit to 25 items
  events.sort((a, b) => b.ts - a.ts);
  const limited = events.slice(0, 25).map((e) => ({ id: e.id, title: e.title, server: e.server, time: e.time, guildId: e.guildId }));
  return limited;
}

/**
 * Formats a timestamp into a human-readable relative time (e.g., "5 minutes ago").
 */
function formatRelative(thenMs: number, nowMs: number): string {
  const diffMs = nowMs - thenMs;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return 'just now';
}

/**
 * Reads the full request body from an IncomingMessage
 */
async function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}