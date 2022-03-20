import path from 'path';
import {Collection} from 'discord.js';

import {BaseCommand} from '../bin/bin.command';
import {DiscordClient} from '../bin/bin.discord';
import {UtilCommandsHandler} from '../utils/util.commandsHandler';

export class HandlerDiscordCommands extends Collection<string, BaseCommand> {
    public aliases: Collection<string, string> = new Collection<string, string>();

    constructor(public client: DiscordClient) {
        super();
    }

    async scan() {
        const commandFilesPaths = await UtilCommandsHandler.getCommandsFiles('discord');
        commandFilesPaths.forEach(commandFilesPath => this.register.bind(this, commandFilesPath)());
    }

    async register(commandFilesPath: string) {
        try {
            const commandInstance: BaseCommand = await UtilCommandsHandler.createCommandsInstances(commandFilesPath);

            const {name} = path.parse(commandFilesPath);

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
            console.error(`CommandHandler >> Error while registering command ${commandFilesPath}`, e);
        }
    }
}