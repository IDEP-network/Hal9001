import {Message} from "discord.js";
import {DiscordClient} from "./Discord";
import {ICommandOptions} from "../interfaces/ICommandOption";

export class BaseCommand {
    constructor(public options: ICommandOptions) {
    }

    async run(client: DiscordClient, message: Message, args: string[]): Promise<any> {
    }
}