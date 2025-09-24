import { Client, GatewayIntentBits, Collection, Events } from "discord.js";
import { config } from "dotenv";
import { glob } from "glob";
import path from "path";

import { DatabaseManager } from "./database/DatabaseManager.js";
import { TranscriptUtil } from "./utils/TranscriptUtil.js";
import { ErrorLogger } from "./utils/ErrorLogger.js";

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const loadCommands = async () => {
    // Check if we're in production by examining the current directory
    // If this file is running from dist/, we're in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    const sourceDir = isProduction ? './dist' : './src';
    const fileExtension = isProduction ? 'js' : 'ts';
    const commandPattern = `${sourceDir}/commands/*.${fileExtension}`;
    
    const commandFiles = await glob(commandPattern);
    console.log(`Loading ${commandFiles.length} commands from ${sourceDir}... (production: ${isProduction})`);
    
    for (const file of commandFiles) {
        try {
            let command;
            if (isProduction) {
                // In production, use relative imports for compiled JS files
                const fileName = path.basename(file, '.js');
                command = await import(`./commands/${fileName}.js`);
            } else {
                // In development, use file:// URL for TS files
                const fileUrl = `file://${path.resolve(file).replace(/\\/g, '/')}`;
                command = await import(fileUrl);
            }
            
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                console.log(`Loaded command: ${command.data.name}`);
            }
        } catch (error) {
            console.error(`Error loading command from ${file}:`, error);
        }
    }
};

const loadEvents = async () => {
    // Check if we're in production by examining the current directory
    // If this file is running from dist/, we're in production
    const currentDir = __dirname || process.cwd();
    const isProduction = currentDir.includes('/dist') || currentDir.includes('\\dist') || 
                        process.env.NODE_ENV === 'production';
    
    const sourceDir = isProduction ? './dist' : './src';
    const fileExtension = isProduction ? 'js' : 'ts';
    const eventPattern = `${sourceDir}/events/*.${fileExtension}`;
    
    const eventFiles = await glob(eventPattern);
    console.log(`Loading ${eventFiles.length} events from ${sourceDir}... (production: ${isProduction})`);
    
    for (const file of eventFiles) {
        try {
            let event;
            if (isProduction) {
                // In production, use relative imports for compiled JS files
                const fileName = path.basename(file, '.js');
                event = await import(`./events/${fileName}.js`);
            } else {
                // In development, use file:// URL for TS files
                const fileUrl = `file://${path.resolve(file).replace(/\\/g, '/')}`;
                event = await import(fileUrl);
            }
            
            if (event.name && event.execute) {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                console.log(`Loaded event: ${event.name}`);
            }
        } catch (error) {
            console.error(`Error loading event from ${file}:`, error);
        }
    }
};

client.once(Events.ClientReady, () => {
    console.log("Bot is ready!");
    
    // Initialize utility classes with Discord client
    TranscriptUtil.getInstance().setClient(client);
    ErrorLogger.getInstance().setClient(client);
    console.log("Utility classes initialized with Discord client");
});



const init = async () => {
    try {
        console.log('Initializing SQLite database...');
        DatabaseManager.initialize();
        console.log('Database initialized successfully!');

        console.log('Loading commands and events...');
        await loadCommands();
        await loadEvents();
        
        console.log('Logging in to Discord...');
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('Failed to initialize bot:', error);
        process.exit(1);
    }
};

init();

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, { execute: (interaction: unknown) => Promise<void> }>;
    }
}