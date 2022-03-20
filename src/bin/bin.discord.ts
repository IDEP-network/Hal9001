import {Client, Message} from 'discord.js';

import {HandlerDiscordCommands} from '../commandsHandlers/handler.discordCommands';
import {ServiceDiscordNotifier} from '../services/service.discordNotifier';
import ServiceStorage from '../services/service.storage';
import {DISCORD_CONFIGS} from '../configs/configs';

export class DiscordClient extends Client {
    private _commands: HandlerDiscordCommands = new HandlerDiscordCommands(this);
    public static notifier: ServiceDiscordNotifier;

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
        DiscordClient.notifier = new ServiceDiscordNotifier(this);
    }

    private onMessage(message: Message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(DISCORD_CONFIGS.PREFIX)) return;
        const [cmd, ...args] = message.content.slice(DISCORD_CONFIGS.PREFIX.length).split(' ');
        const command = this._commands.get(cmd);
        if (!command) return;

        if (!ServiceStorage.config.d_operators.includes(message.author.id)) return message.reply('Missing permission');
        command.run(this, message, args);
    }
}