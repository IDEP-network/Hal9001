import {Message, MessageEmbed} from 'discord.js';
import {v4} from 'uuid';

import {BaseCommand} from '../bin/bin.command';
import {DiscordClient} from '../bin/bin.discord';
import ServiceStorage from '../services/service.storage';
import ServiceRedis from '../services/service.redis';
import {CONSTANT_DISCORD_COMMAND_MESSAGES} from '../ts/constants/constant.discordCommandMessages';

export default class CommandDiscordConfig extends BaseCommand {

    constructor() {
        super({name: 'config', aliases: ['ni']})
    }

    async run(client: DiscordClient, message: Message, args: string[]) {

        const availabeKeys = ['d_operators', 'nodes', 'cycleTime', 'notifyCycleTime'];
        if (args.length < 2 || !availabeKeys.includes(args[0])) return message.reply({
            embeds: [new MessageEmbed()
                .setColor('RED')
                .setTitle(`Invalid usage`)
                .setDescription(CONSTANT_DISCORD_COMMAND_MESSAGES.CONFIGS)
            ]
        })

        const config = ServiceStorage.config;

        if (args[1] == 'view' && args.length == 2) {
            let value = ServiceStorage.config[args[0]];
            if (!value) value = 'Key not found'
            console.log(value)
            if (args[0] == 'd_operators') {
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
            case 'd_operators': {
                let target = message.mentions.members.first();
                if (!target) return message.reply('Invalid target');
                if (action == 'add') {
                    config.d_operators.push(target.user.id);
                    description = description + `\n **${target.user}** added!`
                }
                if (action == 'remove') {
                    config.d_operators = config.d_operators.filter(op => op != target.user.id)
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
                    let node = ServiceStorage.config.nodes[target];
                    if (!node) return message.reply('Invalid node');
                    delete config.nodes[target];
                    ServiceRedis.removeNode(target)
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

        ServiceStorage.config = config;
        ServiceRedis.writeConfig(config);
    }
}