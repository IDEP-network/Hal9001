import {Message, MessageEmbed} from 'discord.js'
import {BaseCommand} from '../bin/Command'
import {DiscordClient} from '../bin/Discord'

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
                .setDescription(`
                    **Usage** - \` operators \`
                    config operators add <@mention>
                    config operators remove <@mention>
                    config operators view
                    
                    **Usage** - \` nodes \`
                    config nodes add <node_address> <?name>
                    config nodes remove <name>
                    config nodes view
                    
                    **Usage** - \` cycleTime \`
                    config cycleTime set <time in seconds>
                    config cycleTime view
                    
                    **Usage** - \` notifyCycleTime \`
                    config notifyCycleTime set <time in seconds>
                    config notifyCycleTime view
                `)
            ]
        })
    }
}