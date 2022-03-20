import {BaseCommand} from '../bin/bin.command'
import ServiceStorage from '../services/service.storage'
import {InterfaceNodePayload} from '../ts/interfaces/interface.nodePayload';
import {TelegramClient} from '../bin/bin.telegram';
import ServiceRedis from '../services/service.redis';

export default class CommandTelegramNodeInfo extends BaseCommand {

    constructor() {
        super({name: 'node_info', aliases: ['ni']})
    }

    async run(client: TelegramClient, message, args: string[]) {
        const availableNodes = Object.keys(ServiceStorage.config.nodes);
        if (!availableNodes.includes(args[0])) {
            // @ts-ignore
            return TelegramClient.serviceTelegramNotifier.sendAlert({
                type: 'aliveAlert',
                description: `Available nodes: \n${availableNodes.map(node => ` ${node} `).join(', ')}`
            });
        }

        const nodeAddress = ServiceStorage.config.nodes[args[0]];
        const nodeInfo: InterfaceNodePayload = await ServiceRedis.getNodeData(nodeAddress);

        if (!nodeInfo) return TelegramClient.serviceTelegramNotifier.sendAlert({
            type: 'infoAlert',
            description: `Node with address \` ${nodeAddress} \` never be scanned`
        });

        TelegramClient.serviceTelegramNotifier.sendAlert({
            type: 'infoAlert', description: `
                **Catching Up**: \` ${nodeInfo.catching_up} \`
                **Node Peers**: \` ${nodeInfo.n_peers} \`
                **Voting Power**: \` ${nodeInfo.voting_power} \`
                **Status**: \` ${nodeInfo.exception || 'no'} \`
             `
        });
    }
}