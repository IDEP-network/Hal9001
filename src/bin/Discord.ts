import {Client, Message} from 'discord.js';
import {CommandHandler} from '../handlers/CommandHandler';
import {Notifier} from '../services/Notifier';
import Storage from '../services/Storage';
import {DISCORD_CONFIGS} from "../configs/configs";

export class DiscordClient extends Client {
    private _commands: CommandHandler = new CommandHandler(this);
    public static notifier: Notifier;

    constructor() {
        super({
            intents: ['GUILDS', 'GUILD_MESSAGES']
        });
        this.on('ready', this.onReady.bind(this));
        this.on('messageCreate', this.onMessage.bind(this));
    }

    private onReady() {
        console.log(`Discord >> Logged as ${this?.user.tag}`);
        this._commands.scan();
        DiscordClient.notifier = new Notifier(this);
    }

    private onMessage(message: Message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(DISCORD_CONFIGS.PREFIX)) return;
        const [cmd, ...args] = message.content.slice(DISCORD_CONFIGS.PREFIX.length).split(' ');
        const command = this._commands.get(cmd);
        console.log(cmd, command);
        if (!command) return;

        if (!Storage.config.discordOperators.includes(message.author.id)) return message.reply('Missing permission');
        command.run(this, message, args);
    }
}