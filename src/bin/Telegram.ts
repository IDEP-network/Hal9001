import {Telegraf, Context} from 'telegraf';
import {TelegramNotifierService} from '../services/telegramNotifier.service';
import {TELEGRAM_CONFIGS} from '../configs/configs';
import {TelegramCommandHandler} from '../handlers/telegramCommand.handler';
import StorageService from '../services/storage.service';

export class TelegramClient extends Telegraf {

    public static telegramNotifier: TelegramNotifierService;
    public static telegramCommandHandler: TelegramCommandHandler;

    constructor(token: string) {
        if (token === undefined) {
            throw new Error('TELEGRAM BOT TOKEN must be provided!')
        }
        super(token);
        this.onMessage();
    }

    onReady() {
        console.log(`Telegram >> Logged as ${this.botInfo.username}`);
        TelegramClient.telegramNotifier = new TelegramNotifierService(this);
        TelegramClient.telegramCommandHandler = new TelegramCommandHandler(this);
        TelegramClient.telegramCommandHandler.scan();
    }

    onMessage() {
        this.on('message', (ctx) => {

            if (ctx?.message?.from.is_bot) return;
            if (!ctx.message['text'].startsWith(TELEGRAM_CONFIGS.PREFIX)) return;
            console.log(ctx.message['text'])
            const [cmd, ...args] = ctx.message['text'].slice(TELEGRAM_CONFIGS.PREFIX.length).split(' ');
            const command = TelegramClient.telegramCommandHandler.store.get(cmd);
            console.log(cmd, command);
            if (!command) return;
            //
            if (!StorageService.config.telegramOperators.includes(ctx.message.from.first_name)) return ctx.replyWithHTML('Missing permission');
            command.run(this, ctx, args);

        });
    }
}