import fetch from 'node-fetch';
import {DiscordClient} from '../bin/Discord';
import {discordOptions} from '../Config';
import {AlertMessages} from '../constants/AlertMessages';
import {INodePayload} from '../interfaces/INodePayload';
import notificationConfig from '../NotificationConfig';
import {NodeException} from '../types/NodeException';
import Redis from './Redis';
import Storage from './Storage';

export class Monitoring {
    constructor() {
        this.cycleTimeout();
    }

    cycleTimeout() {
        console.log(`Monitoring >> Cycle is processed, the next cycle through ${Storage.config.cycleTime}`)
        this.cycleEnter();
        setTimeout(this.cycleTimeout.bind(this), Storage.config.cycleTime * 1000)
    }

    async cycleEnter() {
        console.log(`Motitoring >> Cycle entered`)
        const nodes = await Redis.getNodes();
        for (const nodeName in nodes) {
            const nodeAddress = nodes[nodeName];
            const nodeInfo = await this.getNodeInfo(nodeAddress, nodeName);
            if (typeof nodeInfo == 'string') {
                console.log(`Motoring >> FATAL: CannotAccessNodeAlert`)
                DiscordClient.notifier.generateAlert({
                    color: 'DARK_RED',
                    type: 'cannotAccessNodeAlert',
                    nodeName: nodeName
                }, true)
                continue;
            }
            this._compareAmountOfPeersWithBoundary(nodeInfo?.n_peers, nodeName)
            // let telBot = new Telegram(telegramConfig.telegramToken)
            // telBot.sendMsg();
            console.log(`Monitoring >> Payload from ${nodeAddress}: `, nodeInfo)
            Redis.setNodeData(nodeAddress, nodeInfo);
        }
    }

    async getNodeInfo(nodeAddress: string, nodeName: string): Promise<NodeException | INodePayload> {
        const apiUrl = `http://${nodeAddress}`
        const response: any = await fetch(`${apiUrl}/status`).then(res => res.json()).catch(e => (null))
        if (!response) return 'cannotAccessNodeAlert';

        const responseNetInfo: any = await fetch(`${apiUrl}/net_info`).then(res => res.json());

        const catching_up = response.result.sync_info.catching_up;

        const payload: INodePayload = {
            catching_up,
            n_peers: responseNetInfo.result.n_peers,
            voting_power: response.result.validator_info.voting_power,
            exception: 'isNotCatchingUp',
            name: nodeName,
            address: nodeAddress
        }

        if (catching_up) {
            payload.exception = 'isCatchingUpAlert'
        }

        return payload;
    }

    _compareAmountOfPeersWithBoundary(peersAmount, nodeName) {
        if (typeof peersAmount === 'undefined' || peersAmount === null) {
            DiscordClient.notifier.generateAlert({
                color: 'DEFAULT',
                type: 'infoAlert',
                nodeName: nodeName,
                description: AlertMessages.N_PEERSISNULL
            }, true)
        } else {
            if (peersAmount > discordOptions.D2) {
                DiscordClient.notifier.generateAlert({
                    color: 'DEFAULT',
                    type: 'infoAlert',
                    nodeName: nodeName,
                    description: AlertMessages.N_PEERSISMORE
                }, true)
                notificationConfig.infoAlert = false
                notificationConfig.minorAlert = true
            } else if (peersAmount < discordOptions.D2) {
                DiscordClient.notifier.generateAlert({
                    color: 'DEFAULT',
                    type: 'minorAlert',
                    nodeName: nodeName,
                    description: AlertMessages.N_PEERSISLESS
                }, true)
                notificationConfig.minorAlert = false
                notificationConfig.infoAlert = true
            } else {
                DiscordClient.notifier.generateAlert({
                    color: 'DEFAULT',
                    type: 'infoAlert',
                    nodeName: nodeName,
                    description: AlertMessages.N_PEERSISEQUAL
                }, true)
                notificationConfig.minorAlert = true
                notificationConfig.infoAlert = true
            }
        }
    }
} 