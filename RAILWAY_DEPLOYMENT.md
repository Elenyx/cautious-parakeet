# Railway Deployment Guide for TicketMesh

This guide will help you deploy your TicketMesh Discord bot on Railway.

## Prerequisites

1. A Railway account (https://railway.app)
2. Your Discord bot token and application ID
3. This repository pushed to GitHub

## Environment Variables

You need to set the following environment variables in Railway:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Your Discord bot token | 
| `DISCORD_CLIENT_ID` | Your Discord application/client ID |
| `NODE_ENV` | Environment mode | `production` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | Port for health checks | `3000` | `3000` |
| `DATABASE_URL` | SQLite database path | `./data/tickets.db` | `./data/tickets.db` |

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub with the Railway configuration files:
- `railway.toml` - Railway deployment configuration
- `Dockerfile` - Container configuration
- `RAILWAY_DEPLOYMENT.md` - This documentation

### 2. Create a New Railway Project

1. Go to [Railway](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository (`Elenyx/cautious-parakeet`)

### 3. Configure Environment Variables

1. In your Railway project dashboard, go to the "Variables" tab
2. Add the required environment variables listed above
3. Make sure to set `NODE_ENV=production`

### 4. Deploy

Railway will automatically:
1. Build your application using the Dockerfile
2. Install dependencies with pnpm
3. Build the TypeScript code
4. Start the bot with `pnpm run start`

### 5. Monitor Deployment

1. Check the "Deployments" tab for build logs
2. Monitor the "Logs" tab for runtime logs
3. Verify your bot comes online in Discord

## Database

The bot uses SQLite and will automatically:
- Create the database file at startup
- Run migrations to set up tables
- Store data persistently in the Railway volume

## Health Checks

The Dockerfile includes a basic health check that runs every 30 seconds to ensure the container is healthy.

## Troubleshooting

### Common Issues

1. **Bot doesn't start**: Check environment variables are set correctly
2. **Database errors**: Ensure the data directory has write permissions
3. **Discord connection fails**: Verify your bot token is valid and the bot is added to your server

### Viewing Logs

Use Railway's built-in log viewer to monitor:
- Application startup
- Database initialization
- Discord connection status
- Command execution
- Error messages

### Redeployment

To redeploy after code changes:
1. Push changes to your GitHub repository
2. Railway will automatically trigger a new deployment
3. Monitor the deployment in the Railway dashboard

## Support

If you encounter issues:
1. Check the Railway logs for error messages
2. Verify all environment variables are set correctly
3. Ensure your Discord bot has the necessary permissions in your server
4. Check that your bot token hasn't expired

## Performance Notes

- Railway provides 512MB RAM and 1 vCPU for free tier
- SQLite database is suitable for small to medium Discord servers
- Consider upgrading to a paid plan for larger servers or higher availability requirements