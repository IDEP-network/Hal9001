import {Message} from 'discord.js';

import {DiscordClient} from './bin.discord';
import {InterfaceCommandOptions} from '../ts/interfaces/interface.commandOption';
import {TelegramClient} from './bin.telegram';

export class BaseCommand {

    constructor(public options: InterfaceCommandOptions) {}

    async run(client: DiscordClient | TelegramClient, message: Message, args: string[]): Promise<any> {}
}