import {Message} from "discord.js";
import {DiscordClient} from "./Discord";
import {ICommandOptions} from "../ts/interfaces/ICommandOption";
import {TelegramClient} from './Telegram';

export class BaseCommand {
    constructor(public options: ICommandOptions) {
    }

    async run(client: DiscordClient | TelegramClient, message: Message, args: string[]): Promise<any> {
    }
}