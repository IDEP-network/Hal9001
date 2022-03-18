require('fix-esm').register();

import {TelegramClient} from './bin/bin.telegram';
import {BOTS_ACTIVATE, DISCORD_CONFIGS, TELEGRAM_CONFIGS} from './configs/configs';
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
    // if (BOTS_ACTIVATE.DISCORD_BOT_IS_ACTIVATED && BOTS_ACTIVATE.TELEGRAM_BOT_IS_ACTIVATED) {
    await ServiceRedis.connect();
    await ServiceRedis.loadConfig();

    const telegramClient = new TelegramClient(TELEGRAM_CONFIGS.TOKEN);
    await telegramClient.launch();
    telegramClient.onReady();

    const client = new DiscordClient();
    client.login(DISCORD_CONFIGS.TOKEN);
    client.on('ready', () => {
        new ServiceMonitoring();
    });

})();