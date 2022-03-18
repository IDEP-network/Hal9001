require('fix-esm').register()
import {TelegramClient} from './bin/Telegram';
import {BOTS_ACTIVATE, DISCORD_CONFIGS, TELEGRAM_CONFIGS} from './configs/configs';
import Redis from './services/redis.service'
import {MonitoringService} from './services/monitoring.service';
import {DiscordClient} from './bin/Discord';


process.on('uncaughtException', (e) => {
    console.error(e);
});

process.on('unhandledRejection', (e) => {
    console.error(e);
});

(async () => {
    // if (BOTS_ACTIVATE.DISCORD_BOT_IS_ACTIVATED && BOTS_ACTIVATE.TELEGRAM_BOT_IS_ACTIVATED) {
    await Redis.connect();
    await Redis.loadConfig();

    const telegramClient = new TelegramClient(TELEGRAM_CONFIGS.TOKEN);
    await telegramClient.launch();
    telegramClient.onReady();

    const client = new DiscordClient();
    client.login(DISCORD_CONFIGS.TOKEN);
    client.on('ready', () => {
        new MonitoringService();
    });

})();