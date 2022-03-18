import {Client, Message} from 'discord.js';
import {DiscordCommandHandler} from '../handlers/discordCommand.handler';
import {DiscordNotifierService} from '../services/discordNotifier.service';
import Storage from '../services/storage.service';
import {DISCORD_CONFIGS} from "../configs/configs";

export class DiscordClient extends Client {
    private _commands: DiscordCommandHandler = new DiscordCommandHandler(this);
    public static notifier: DiscordNotifierService;

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
        DiscordClient.notifier = new DiscordNotifierService(this);
    }

    private onMessage(message: Message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(DISCORD_CONFIGS.PREFIX)) return;
        const [cmd, ...args] = message.content.slice(DISCORD_CONFIGS.PREFIX.length).split(' ');
        const command = this._commands.get(cmd);
        console.log(cmd, command, "3333333333333333");
        if (!command) return;

        if (!Storage.config.discordOperators.includes(message.author.id)) return message.reply('Missing permission');
        command.run(this, message, args);
    }
}