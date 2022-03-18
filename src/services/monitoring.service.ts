import {DiscordClient} from '../bin/Discord';
import Redis from './redis.service';
import Storage from './storage.service';
import MonitoringHelper from '../helpers/monitoring.helper';
import {TelegramClient} from '../bin/Telegram';

export class MonitoringService {
    constructor() {
        this.cycleTimeout();
    }

    cycleTimeout() {
        console.log(`Monitoring >> Cycle is processed, the next cycle through ${Storage.config.cycleTime}`);
        this.monitoringStart();
        setTimeout(() => this.cycleTimeout(), Storage.config.cycleTime * 1000)
    }

    async monitoringStart() {
        console.log(`Monitoring >> Cycle entered`);
        const nodes = await Redis.getNodes();
        for (const nodeName in nodes) {
            const nodeAddress = nodes[nodeName];
            const nodeInfo = await MonitoringHelper.getNodeInfo(nodeAddress, nodeName);
            if (typeof nodeInfo == 'string') {
                console.log(`Monitoring >> FATAL: CannotAccessNodeAlert`);
                DiscordClient.notifier.generateAlert({
                    color: 'DARK_RED',
                    type: 'cannotAccessNodeAlert',
                    nodeName: nodeName
                }, true);
                TelegramClient.telegramNotifier.sendAlert({type:"cannotAccessNodeAlert", nodeName: nodeName})
                // TelegramClient.telegramNotifier
                continue;
            }
            MonitoringHelper.compareAmountOfPeersWithBoundary(nodeInfo?.n_peers, nodeName);
            // let telBot = new Telegram(telegramConfig.telegramToken)
            // telBot.sendMsg();
            console.log(`Monitoring >> Payload from ${nodeAddress}: `, nodeInfo)
            Redis.setNodeData(nodeAddress, nodeInfo);
        }
    }
} 