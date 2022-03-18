import {Message, MessageEmbed} from 'discord.js'
import {v4} from 'uuid'
import {BaseCommand} from '../bin/Command'
import {DiscordClient} from '../bin/Discord'
import Redis from '../services/Redis'
import Storage from '../services/Storage'

export default class ConfigCommand extends BaseCommand {
    constructor() {
        super({
            name: 'config',
            aliases: ['ni']
        })
    }

    async run(client: DiscordClient, message: Message, args: string[]) {

        const availabeKeys = ['operators', 'nodes', 'cycleTime', 'notifyCycleTime'];
        if (args.length < 2 || !availabeKeys.includes(args[0])) return message.reply({
            embeds: [new MessageEmbed()
                .setColor('RED')
                .setTitle(`Invalid usage`)
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

        const config = Storage.config;

        // key [action] value

        if (args[1] == 'view' && args.length == 2) {
            let value = Storage.config[args[0]];
            if (!value) value = 'Key not found'
            console.log(value)
            if (args[0] == 'operators') {
                value = value.map(val => `<@${val}>`).join(', ')
            }
            if (args[0] == 'nodes') {
                value = Object.keys(value).map(key => `**${key}**: ${value[key]}`).join('\n')
            }
            // @ts-ignore
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle(`View - ${args[0]}`)
                        .setDescription(`
                            ${value}
                        `)
                ]
            })
        }

        const action = args[1];
        let description = `
            **${action.toUpperCase()} -> ${args[0]}**
        `

        switch (args[0]) {
            case 'operators': {
                let target = message.mentions.members.first();
                if (!target) return message.reply('Invalid target');
                if (action == 'add') {
                    config.discordOperators.push(target.user.id);
                    description = description + `\n **${target.user}** added!`
                }
                if (action == 'remove') {
                    config.discordOperators = config.discordOperators.filter(op => op != target.user.id)
                    description = description + `\n **${target.user}** removed!`
                }
                break;
            }
            case 'nodes': {
                if (action == 'add') {
                    const node = args[2];
                    const name = args.length == 4 ? args[3] : v4()

                    description = description + `\n **${node}** (\`${name}\`) added!`
                    config.nodes[name] = node;
                }
                if (action == 'remove') {
                    const target = args[2]
                    let node = Storage.config.nodes[target];
                    if (!node) return message.reply('Invalid node');
                    delete config.nodes[target];
                    Redis.removeNode(target)
                    description = description + `\n  **${node}** (\`${target}\`) removed!`
                }
                break;
            }
            case 'cycleTime': {
                const time = parseInt(args[2]);
                if (action == 'set') {
                    config.cycleTime = time;
                    description = description + `\n cycleTime -> ${time}sec`
                }
                break;
            }
            case 'notifyCycleTime': {
                const time = parseInt(args[2]);
                if (action == 'set') {
                    config.notifyCycleTime = time;
                    description = description + `\n notifyCycleTime -> ${time}sec`
                }
                break;
            }
        }

        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(description)
            ]
        })

        console.log(config);

        Storage.config = config;
        Redis.writeConfig(config);
    }
}