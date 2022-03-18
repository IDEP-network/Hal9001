import {Message, MessageEmbed} from 'discord.js'
import {BaseCommand} from '../bin/Command'
import {DiscordClient} from '../bin/Discord'
import Redis from '../services/Redis'
import Storage from '../services/Storage'
import {INodePayload} from "../ts/interfaces/INodePayload";

export default class NodeInfoCommand extends BaseCommand {
    constructor() {
        super({
            name: 'node_info',
            aliases: ['ni']
        })
    }

    async run(client: DiscordClient, message: Message, args: string[]) {
        // const nodeInfo = Redis.getNodeData()
        const availableNodes = Object.keys(Storage.config.nodes);
        if (!availableNodes.includes(args[0])) {
            // @ts-ignore
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle('Invalid node name')
                        .setDescription(`Available nodes: \n${availableNodes.map(node => `\` ${node} \``).join(', ')}`)
                ]
            })
        }

        const nodeAddress = Storage.config.nodes[args[0]];
        const nodeInfo: INodePayload = await Redis.getNodeData(nodeAddress);

        if (!nodeInfo) return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`Node with address \` ${nodeAddress} \` never be scanned`)
            ]
        });

        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`Node - ${args[0]}`)
            .setDescription(`
                **Catching Up**: \` ${nodeInfo.catching_up} \` 
                **Node Peers**: \` ${nodeInfo.n_peers} \` 
                **Voting Power**: \` ${nodeInfo.voting_power} \` 
                **Status**: \` ${nodeInfo.exception || 'no'} \` 
            `);

        message.reply({
            embeds: [embed]
        })
    }
}