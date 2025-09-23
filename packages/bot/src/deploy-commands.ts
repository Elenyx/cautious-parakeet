import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { config } from 'dotenv';
import { glob } from 'glob';
import path from 'path';

config();

async function deployCommands() {
    const commands = [];
    
    // Use process.cwd() to get the current working directory and build the path from src
    const commandsDir = path.join(process.cwd(), 'src', 'commands');
    const commandsPath = path.join(commandsDir, '*.ts').replace(/\\/g, '/');
    
    console.log(`Looking for commands in: ${commandsPath}`);
    console.log(`Commands directory exists: ${require('fs').existsSync(commandsDir)}`);
    
    const commandFiles = await glob(commandsPath);
    console.log(`Found ${commandFiles.length} command files:`, commandFiles);

    for (const file of commandFiles) {
        try {
            // Convert Windows path to file:// URL for proper import
            const fileUrl = `file://${path.resolve(file).replace(/\\/g, '/')}`;
            const command = await import(fileUrl);
            if (command.data) {
                commands.push(command.data.toJSON());
                console.log(`Loaded command: ${command.data.name}`);
            } else {
                console.warn(`Command file ${file} does not export 'data'`);
            }
        } catch (error) {
            console.error(`Error loading command from ${file}:`, error);
        }
    }

    console.log(`Total commands to deploy: ${commands.length}`);

    if (commands.length === 0) {
        console.error('No commands found to deploy!');
        return;
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    try {
        console.log('Started refreshing application (/) commands.');

        const result = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
            { body: commands },
        );

        console.log(`Successfully reloaded ${Array.isArray(result) ? result.length : 0} application (/) commands.`);
    } catch (error) {
        console.error('Error deploying commands:', error);
    }
}

deployCommands();