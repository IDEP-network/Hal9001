import { Client, Message } from "discord.js";
import config from "../config";
import { CommandHandler } from "../handlers/commandHandler";
import { Notifier } from "../services/Notifier";
import Storage from "../services/Storage";

export class DiscordClient extends Client {
    private _commands: CommandHandler = new CommandHandler(this);
    public notifier: Notifier;
    static instance: DiscordClient;
    constructor() {
        super({
            intents: ['GUILDS', 'GUILD_MESSAGES']
        })
        DiscordClient.instance = this;
        this.on('ready', this.onReady.bind(this));
        this.on('messageCreate', this.onMessage.bind(this));
    }

    private onReady() {
        console.log(`Discord >> Logged as ${this?.user.tag}`)
        this._commands.scan()
        this.notifier = new Notifier(this);
    }

    private onMessage(message: Message) {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.prefix)) return;
        let [cmd, ...args] = message.content.slice(config.prefix.length).split(' ');
        
        let command = this._commands.get(cmd);
        console.log(cmd, command)
        if(!command) return;
        
        if(!Storage.config.operators.includes(message.author.id)) return message.reply('Missing permission')
        command.run(this, message, args);
    }
}