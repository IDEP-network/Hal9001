import path from 'path';

import {BaseCommand} from '../bin/bin.command';
import {TelegramClient} from '../bin/bin.telegram';
import {UtilCommandsHandler} from '../utils/util.commandsHandler';

export class HandlerTelegramCommands {

    public store;

    constructor(public client: TelegramClient) {
        this.store = new Map();
    }

    async scan() {
        const commandFilesPaths = await UtilCommandsHandler.getCommandsFiles('telegram');
        commandFilesPaths.forEach(commandFilesPath => this.register.bind(this, commandFilesPath)());
    }

    async register(commandFilesPath: string) {
        try {
            const commandInstance: BaseCommand = await UtilCommandsHandler.createCommandsInstances(commandFilesPath);

            const {name} = path.parse(commandFilesPath);

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
            console.error(`CommandHandler >> Error while registering command ${commandFilesPath}`, e);
        }
    }
}