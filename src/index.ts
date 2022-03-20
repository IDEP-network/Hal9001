require('fix-esm').register();

import {TelegramClient} from './bin/bin.telegram';
import {DISCORD_CONFIGS, TELEGRAM_CONFIGS} from './configs/configs';
import ServiceRedis from './services/service.redis';
import {ServiceMonitoring} from './services/service.monitoring';
import {DiscordClient} from './bin/bin.discord';


process.on('uncaughtException', (e) => {
    console.error(e);
});

process.on('unhandledRejection', (e) => {
    console.error(e);
});

(async () => {

    await ServiceRedis.client.connect();
    await ServiceRedis.loadConfig();

    if (DISCORD_CONFIGS.DISCORD_BOT_IS_ACTIVATED && TELEGRAM_CONFIGS.TELEGRAM_BOT_IS_ACTIVATED) {
        const telegramClient = new TelegramClient(TELEGRAM_CONFIGS.TOKEN);
        await telegramClient.launch();
        telegramClient.onReady();

        const client = new DiscordClient();
        await client.login(DISCORD_CONFIGS.TOKEN);
        client.on('ready', () => {
            new ServiceMonitoring();
        });
    } else if (DISCORD_CONFIGS.DISCORD_BOT_IS_ACTIVATED && !TELEGRAM_CONFIGS.TELEGRAM_BOT_IS_ACTIVATED) {
        const client = new DiscordClient();
        await client.login(DISCORD_CONFIGS.TOKEN);
        client.on('ready', () => {
            new ServiceMonitoring();
        });
    } else if (!DISCORD_CONFIGS.DISCORD_BOT_IS_ACTIVATED && TELEGRAM_CONFIGS.TELEGRAM_BOT_IS_ACTIVATED) {
        const telegramClient = new TelegramClient(TELEGRAM_CONFIGS.TOKEN);
        await telegramClient.launch();
        telegramClient.onReady();
        new ServiceMonitoring();
    }
})();