require('fix-esm').register()
import { DiscordClient } from "./bin/Discord";
import config from "./config";
import { Monitoring } from "./services/Monitoring";
import Redis from "./services/Redis"


process.on('uncaughtException', (e) => {
	console.error(e);
});

process.on('unhandledRejection', (e) => {
	console.error(e);
});

(async () => {
    await Redis.connect();
    await Redis.loadConfig()
    const client = new DiscordClient();
    client.login(config.discordToken);
    client.on('ready', () => {
        const monitor = new Monitoring()
    })
})()
