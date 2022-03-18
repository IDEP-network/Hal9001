import {Message} from 'discord.js'
import {BaseCommand} from '../bin/Command'
import Redis from '../services/redis.service'
import Storage from '../services/storage.service'
import {INodePayload} from '../ts/interfaces/INodePayload';
import {TelegramClient} from '../bin/Telegram';

export default class NodeInfoTelegram extends BaseCommand {
    constructor() {
        super({
            name: 'node_info',
            aliases: ['ni']
        })
    }

    async run(client: TelegramClient, message: Message, args: string[]) {
        const availableNodes = Object.keys(Storage.config.nodes);
        if (!availableNodes.includes(args[0])) {
            // @ts-ignore
            return TelegramClient.telegramNotifier.sendAlert({
                type: 'aliveAlert',
                description: `Available nodes: \n${availableNodes.map(node => ` ${node} `).join(', ')}`
            });
        }

        const nodeAddress = Storage.config.nodes[args[0]];
        const nodeInfo: INodePayload = await Redis.getNodeData(nodeAddress);

        if (!nodeInfo) return TelegramClient.telegramNotifier.sendAlert({
            type: 'infoAlert',
            description: `Node with address \` ${nodeAddress} \` never be scanned`
        });

        TelegramClient.telegramNotifier.sendAlert({
            type: 'infoAlert', description: `
                **Catching Up**: \` ${nodeInfo.catching_up} \`
                **Node Peers**: \` ${nodeInfo.n_peers} \`
                **Voting Power**: \` ${nodeInfo.voting_power} \`
                **Status**: \` ${nodeInfo.exception || 'no'} \`
             `
        });
    }
}