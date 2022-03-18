import {Collection} from 'discord.js';
import {DiscordClient} from '../bin/Discord';
import path from 'path';
import glob from 'glob';
import {promisify} from 'util';
import {BaseCommand} from '../bin/Command';
import {TelegramClient} from '../bin/Telegram';

export class TelegramCommandHandler {
    public store;

    // public aliases: Collection<string, string> = new Collection<string, string>();

    constructor(public client: TelegramClient) {
        this.store = new Map();
    }

    async scan() {
        const pathName = path.normalize(__dirname + '/../commands');
        const commandFiles = await promisify(glob)(pathName + '/**/*.telegram.{ts,js}');
        console.log(commandFiles, "filessssss")
        commandFiles.forEach(commandPath => this.register.bind(this, commandPath)());
    }

    async register(commandPath: string) {
        try {
            const commandModule = await import(commandPath).then(item => item.default);
            const commandInstance: BaseCommand = new commandModule();
            const {name} = path.parse(commandPath);

            let commandName = name;
            if (commandInstance.options.name) commandName = commandInstance.options.name;

            this.store.set(commandName, commandInstance);

            console.log(`CommandHandler >> Registering command ${commandName}...`);

            if (commandInstance.options.aliases.length > 0) {
                for (const alias of commandInstance.options.aliases) {
                    this.store.set(alias, commandName);
                }
            }
        } catch (e) {
            console.error(`CommandHandler >> Error while registering command ${commandPath}`, e);
        }
    }
}