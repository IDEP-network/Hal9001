import {Telegraf, Context } from 'telegraf';
import {TelegramNotifier} from '../services/TelegramNotifier';
// import {Notifier} from '../services/Notifier';

export class TelegramClient extends Telegraf {

    public static telegramNotifier: TelegramNotifier;

    constructor(token: string) {
        if (token === undefined) {
            throw new Error('TELEGRAM BOT TOKEN must be provided!')
        }
        super(token);
        // this.on('message', (ctx: Context ) => {
        //     console.log(ctx?.message, "telegramm messageee")
        //     if(ctx?.message?.from.is_bot) return;
        // });
    }

    onReady() {
        console.log(`Telegram >> Logged as ${this.botInfo.username}`);
        TelegramClient.telegramNotifier = new TelegramNotifier(this);
        this.telegram.getMe().then((botInfo) => {
            // this.command.name = botInfo.username;

            this.command('m', (ctx) => ctx.replyWithHTML("helpResponse"));
        });
        // this.command('s', (ctx) => {
        //     console.log(ctx.message)
        //     ctx.reply('Bot started.')
        // });
        // this.onMessage();
    }

    onMessage() {
        this.command('start', async (ctx) => {
            ctx.webhookReply = false;
            await ctx.replyWithHTML("Hello")
            await ctx.replyWithHTML("This")
            await ctx.replyWithHTML("Should")
            await ctx.replyWithHTML("Send")
            await ctx.replyWithHTML("Sequentially")
            ctx.webhookReply = true;
            await ctx.replyWithHTML("This")
        })
        this.command('help', (ctx ) => {
            console.log(ctx?.message, "telegramm messageee")
            if(ctx?.message?.from.is_bot) return;
        });

        // if (!message.content.startsWith(DISCORD_CONFIGS.PREFIX)) return;
        // const [cmd, ...args] = message.content.slice(DISCORD_CONFIGS.PREFIX.length).split(' ');
        // const command = this._commands.get(cmd);
        // console.log(cmd, command);
        // if (!command) return;
        //
        // if (!Storage.config.discordOperators.includes(message.author.id)) return message.reply('Missing permission');
        // command.run(this, message, args);
    }
}