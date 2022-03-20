import {Telegraf, Context} from 'telegraf';

import {TELEGRAM_CONFIGS} from '../configs/configs';
import {HandlerTelegramCommands} from '../commandsHandlers/handler.telegramCommands';
import StorageService from '../services/service.storage';
import {ServiceTelegramNotifier} from '../services/service.telegramNotifier';

export class TelegramClient extends Telegraf {

    public static serviceTelegramNotifier: ServiceTelegramNotifier;
    public static handlerTelegramCommands: HandlerTelegramCommands;

    constructor(token: string) {
        if (token === undefined) {
            throw new Error('TELEGRAM BOT TOKEN must be provided!')
        }
        super(token);
        this.onMessage();
    }

    onReady() {
        console.log(`Telegram >> Logged as ${this.botInfo.username}`);
        TelegramClient.serviceTelegramNotifier = new ServiceTelegramNotifier(this);
        TelegramClient.handlerTelegramCommands = new HandlerTelegramCommands(this);
        TelegramClient.handlerTelegramCommands.scan();
    }

    onMessage() {
        this.on('message', (ctx) => {
            if (ctx?.message?.from.is_bot) return;
            if (!ctx.message['text'].startsWith(TELEGRAM_CONFIGS.PREFIX)) return;
            console.log(ctx.message['text'])
            const [cmd, ...args] = ctx.message['text'].slice(TELEGRAM_CONFIGS.PREFIX.length).split(' ');
            const command = TelegramClient.handlerTelegramCommands.store.get(cmd);
            console.log(cmd, command);
            if (!command) return;
            if (!StorageService.config.t_operators.includes(ctx.message.from.first_name)) return ctx.replyWithHTML('Missing permission');
            command.run(this, ctx, args);
        });
    }
}