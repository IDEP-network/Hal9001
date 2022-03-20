import {Message, MessageEmbed} from 'discord.js'

import {BaseCommand} from '../bin/bin.command';
import {DiscordClient} from '../bin/bin.discord';
import {CONSTANT_DISCORD_COMMAND_MESSAGES} from '../ts/constants/constant.discordCommandMessages';

export default class HelpCommand extends BaseCommand {

    constructor() {
        super({
            name: 'help',
            aliases: ['ni']
        })
    }

    run(client: DiscordClient, message: Message, args: string[]) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`Help`)
                .setDescription(CONSTANT_DISCORD_COMMAND_MESSAGES.HELP)
            ]
        });
    }
}