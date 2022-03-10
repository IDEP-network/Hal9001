require('fix-esm').register()
import {TelegramNotifier} from './services/TelegramNotifier';
import Redis from './services/Redis'
import {connectionsConfig} from './Config';
import {Monitoring} from './services/Monitoring';
import {DiscordClient} from './bin/Discord';


process.on('uncaughtException', (e) => {
    console.error(e);
});

process.on('unhandledRejection', (e) => {
    console.error(e);
});

(async () => {
    await Redis.connect();
    await Redis.loadConfig();
    const client = new DiscordClient();
    client.login(connectionsConfig.discordToken);
    client.on('ready', () => {
        new Monitoring()
    })
    new TelegramNotifier();
})()