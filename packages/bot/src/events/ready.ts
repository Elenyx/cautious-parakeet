import { ActivityType, Client, Events } from "discord.js";
import { logger } from "../utils/logger.js";

export const name = Events.ClientReady;

// Array of different presence configurations
const presenceConfigs = [
    {
        name: "TicketMesh",
        state: "Created with Love",
        type: ActivityType.Custom,
    },
    {
        name: "Support Tickets",
        state: "Helping users 24/7",
        type: ActivityType.Custom,
    },
    {
        name: "Discord Servers",
        state: "Managing communities",
        type: ActivityType.Custom,
    },
    {
        name: "Bot Commands",
        state: "Ready to assist",
        type: ActivityType.Custom,
    },
    {
        name: "Ticket System",
        state: "Streamlining support",
        type: ActivityType.Custom,
    },
    {
        name: "Discord.js",
        state: "Powered by Discord.js",
        type: ActivityType.Custom,
    },
];

let currentPresenceIndex = 0;

/**
 * Set the bot's presence with the current configuration
 */
function setPresence(client: Client) {
    if (!client.user) {
        logger.error("Client user is not set.");
        return;
    }

    const presence = presenceConfigs[currentPresenceIndex];
    
    client.user.setPresence({
        activities: [presence],
        status: "online",
    });

    logger.info(`Presence set: ${presence.name} - ${presence.state}`);
}

/**
 * Rotate to the next presence configuration
 */
function rotatePresence(client: Client) {
    currentPresenceIndex = (currentPresenceIndex + 1) % presenceConfigs.length;
    setPresence(client);
}

/**
 * Handle client ready event to set bot presence and start rotation
 */
export async function execute(client: Client) {
    try {
        if (!client.user) {
            logger.error("Client user is not set.");
            return;
        }
        
        logger.info("Bot is ready! Setting initial presence...");
        
        // Set initial presence
        setPresence(client);
        
        // Start rotating presence every hour (3600000 ms)
        setInterval(() => {
            rotatePresence(client);
        }, 3600000);
        
        logger.success("Bot presence rotation started - will change every hour");
        
    } catch (err) {
        logger.error("Error setting up bot presence:", err);
    }
}
