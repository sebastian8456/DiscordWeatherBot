import { REST, Routes } from 'discord.js';
import "dotenv/config";
import fs from 'fs';
import path from'path';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const commands = [];
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env['token']);

// Grab all the command folders from the commands directory created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
        const fileURL = pathToFileURL(filePath).href;
		const command = await import(fileURL);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


// deploy commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// refresh all commands in the guild
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env['app_id'], process.env['guild_id']),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// Catch and log any errors
		console.error(error);
	}
})();