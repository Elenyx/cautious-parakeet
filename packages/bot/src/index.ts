import { Client, GatewayIntentBits, Collection, Events } from "discord.js";
import { config } from "dotenv";
import { glob } from "glob";
import path from "path";
import fs from "fs";

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
    // Determine if we're running from compiled JS or source TS
    const isProduction = process.env.NODE_ENV === 'production' || !fs.existsSync(path.join(process.cwd(), 'src'));
    const sourceDir = isProduction ? 'dist' : 'src';
    const fileExtension = isProduction ? 'js' : 'ts';
    
    const commandsDir = path.join(process.cwd(), sourceDir, 'commands');
    const commandsPath = path.join(commandsDir, `*.${fileExtension}`).replace(/\\/g, '/');
    const commandFiles = await glob(commandsPath);
    
    console.log(`Loading ${commandFiles.length} commands from ${sourceDir} directory...`);
    
    for (const file of commandFiles) {
        try {
            let command;
            if (isProduction) {
                // Use relative path for production (compiled JS)
                const fileName = path.basename(file, '.js');
                command = await import(`./commands/${fileName}.js`);
            } else {
                // Convert Windows path to file:// URL for development (TS files)
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
    // Determine if we're running from compiled JS or source TS
    const isProduction = process.env.NODE_ENV === 'production' || !fs.existsSync(path.join(process.cwd(), 'src'));
    const sourceDir = isProduction ? 'dist' : 'src';
    const fileExtension = isProduction ? 'js' : 'ts';
    
    const eventsDir = path.join(process.cwd(), sourceDir, 'events');
    const eventsPath = path.join(eventsDir, `*.${fileExtension}`).replace(/\\/g, '/');
    const eventFiles = await glob(eventsPath);
    
    console.log(`Loading ${eventFiles.length} events from ${sourceDir} directory...`);
    
    for (const file of eventFiles) {
        try {
            let event;
            if (isProduction) {
                // Use relative path for production (compiled JS)
                const fileName = path.basename(file, '.js');
                event = await import(`./events/${fileName}.js`);
            } else {
                // Convert Windows path to file:// URL for development (TS files)
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