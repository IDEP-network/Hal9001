import {DiscordClient} from '../bin/bin.discord';
import ServiceStorage from './service.storage';
import MonitoringHelper from '../helpers/helper.monitoring';
import {TelegramClient} from '../bin/bin.telegram';
import ServiceRedis from './service.redis';
import {DISCORD_CONFIGS, TELEGRAM_CONFIGS} from '../configs/configs';

export class ServiceMonitoring {

    constructor() {
        this.cycleTimeout();
    }

    cycleTimeout() {
        console.log(`Monitoring >> Cycle is processed, the next cycle through ${ServiceStorage.config.cycleTime}`);
        this.monitoringStart();
        setTimeout(() => this.cycleTimeout(), ServiceStorage.config.cycleTime * 1000)
    }

    async monitoringStart() {
        console.log(`Monitoring >> Cycle entered`);
        const nodes = await ServiceRedis.getNodes();
        for (const nodeName in nodes) {
            const nodeAddress = nodes[nodeName];
            const nodeInfo = await MonitoringHelper.getNodeInfo(nodeAddress, nodeName);
            if (typeof nodeInfo == 'string') {
                console.log(`Monitoring >> FATAL: CannotAccessNodeAlert`);
                if (DISCORD_CONFIGS.DISCORD_BOT_IS_ACTIVATED) {
                    DiscordClient.notifier.generateAlert({
                        color: 'DARK_RED',
                        type: 'cannotAccessNodeAlert',
                        nodeName: nodeName
                    }, true);
                }
                if (TELEGRAM_CONFIGS.TELEGRAM_BOT_IS_ACTIVATED) {
                    TelegramClient.serviceTelegramNotifier.sendAlert({type: "cannotAccessNodeAlert", nodeName: nodeName})
                }
                continue;
            }
            MonitoringHelper.compareAmountOfPeersWithBoundary(nodeInfo?.n_peers, nodeName);
            console.log(`Monitoring >> Payload from ${nodeAddress}: `, nodeInfo)
            ServiceRedis.setNodeData(nodeAddress, nodeInfo);
        }
    }
} 