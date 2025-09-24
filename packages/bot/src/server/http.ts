import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { Client } from 'discord.js';
import { TicketDAO } from '../database/TicketDAO';

/**
 * Starts a lightweight HTTP server to expose dashboard data endpoints.
 * This avoids adding external server dependencies and serves JSON for the client app to consume.
 *
 * Endpoints:
 * - GET /health -> { ok: true }
 * - GET /api/stats -> { activeTickets, connectedServers, resolvedToday, avgResponse }
 * - GET /api/activity -> Array feed of recent ticket events across guilds
 * - GET /api/guilds/:id -> { activeTickets } for a specific guild
 *
 * The server listens on PORT env var (Railway) or 3001 by default.
 */
export async function startHttpServer(client: Client): Promise<void> {
  const ticketDAO = new TicketDAO();
  const port = Number(process.env.PORT) || 3001;

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      console.log(`[HTTP] ${req.method} ${req.url} from ${req.socket.remoteAddress}:${req.socket.remotePort}`);
      // Basic CORS for local/dev tools; Next.js proxies server-side so this is minimal.
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url || '/', `http://${req.headers.host}`);
      const pathname = url.pathname;

      if (req.method !== 'GET') {
        sendJSON(res, 405, { error: 'Method Not Allowed' });
        return;
      }

      if (pathname === '/health') {
        sendJSON(res, 200, { ok: true });
        return;
      }

      if (pathname === '/api/stats') {
        const data = await getStats(client, ticketDAO);
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
  const diffSec = Math.max(1, Math.floor((nowMs - thenMs) / 1000));
  if (diffSec < 60) return `${diffSec} seconds ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minutes ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hours ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} days ago`;
}