import { Message, PermissionResolvable } from "discord.js";
import { normalize } from "path";
import { DiscordClient } from "./Discord";

export class BaseCommand {
  constructor(public options: ICommandOptions) {
    
  }

  async run(client: DiscordClient, message: Message, args: string[]): Promise<any> {}
}

export interface ICommandOptions {
  name: string | null,
  aliases: string[]
}