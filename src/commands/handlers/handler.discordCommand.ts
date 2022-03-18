import path from 'path';
import {promisify} from 'util';
import glob from 'glob';
import {Collection} from 'discord.js';

import {BaseCommand} from '../../bin/bin.command';
import {DiscordClient} from '../../bin/bin.discord';

export class HandlerDiscordCommand extends Collection<string, BaseCommand> {
    public aliases: Collection<string, string> = new Collection<string, string>();

    constructor(public client: DiscordClient) {
        super();
    }

    async scan() {
        const pathName = path.normalize(__dirname + '/../commands');
        const commandFiles = await promisify(glob)(pathName + '/command.discord.*.{ts,js}');
        commandFiles.forEach(commandPath => this.register.bind(this, commandPath)());
    }

    async register(commandPath: string) {
        try {
            const commandModule = await import(commandPath).then(item => item.default);
            const commandInstance: BaseCommand = new commandModule();
            const {name} = path.parse(commandPath);

            let commandName = name;
            if (commandInstance.options.name) commandName = commandInstance.options.name;

            this.set(commandName, commandInstance);

            console.log(`CommandHandler >> Registering command ${commandName}...`);

            if (commandInstance.options.aliases.length > 0) {
                for (const alias of commandInstance.options.aliases) {
                    this.aliases.set(alias, commandName);
                }
            }
        } catch (e) {
            console.error(`CommandHandler >> Error while registering command ${commandPath}`, e);
        }
    }
}