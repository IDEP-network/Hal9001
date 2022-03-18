import fetch from 'node-fetch';

import {TypeNodeException} from '../ts/types/type.nodeException';
import {InterfaceNodePayload} from '../ts/interfaces/interface.nodePayload';
import {DiscordClient} from '../bin/bin.discord';
import {ALERTS_MESSAGES} from '../ts/constants/constant.alertsMessages';
import {CONFIGS} from '../configs/configs';
import {ALERTS_STATES} from '../ts/constants/constant.alertsStates';
import {TelegramClient} from '../bin/bin.telegram';

class HelperMonitoring {

    async getNodeInfo(nodeAddress: string, nodeName: string): Promise<TypeNodeException | InterfaceNodePayload> {
        const apiUrl = `http://${nodeAddress}`;
        const response: any = await fetch(`${apiUrl}/status`).then(res => res.json()).catch(e => (null));
        if (!response) return 'cannotAccessNodeAlert';

        const responseNetInfo: any = await fetch(`${apiUrl}/net_info`).then(res => res.json());

        const catching_up = response.result.sync_info.catching_up;

        const payload: InterfaceNodePayload = {
            catching_up,
            n_peers: responseNetInfo.result.n_peers,
            voting_power: response.result.validator_info.voting_power,
            exception: 'isNotCatchingUp',
            name: nodeName,
            address: nodeAddress
        };

        if (catching_up) {
            payload.exception = 'isCatchingUpAlert'
        }

        return payload;
    }

    compareAmountOfPeersWithBoundary(peersAmount, nodeName) {
        if (typeof peersAmount === 'undefined' || peersAmount === null) {
            DiscordClient.notifier.generateAlert({
                color: 'DEFAULT',
                type: 'infoAlert',
                nodeName: nodeName,
                description: ALERTS_MESSAGES.N_PEERS_IS_NULL
            }, true)
            TelegramClient.telegramNotifier.sendAlert({
                type: 'infoAlert',
                nodeName: nodeName,
                description: ALERTS_MESSAGES.N_PEERS_IS_NULL
            })
        } else {
            if (peersAmount > CONFIGS.nodesBoundaryNumber) {
                DiscordClient.notifier.generateAlert({
                    color: 'DEFAULT',
                    type: 'infoAlert',
                    nodeName: nodeName,
                    description: ALERTS_MESSAGES.N_PEERS_IS_MORE
                }, true)
                TelegramClient.telegramNotifier.sendAlert({
                    type: 'infoAlert',
                    nodeName: nodeName,
                    description: ALERTS_MESSAGES.N_PEERS_IS_MORE
                })
                ALERTS_STATES.infoAlert = false
                ALERTS_STATES.minorAlert = true
            } else if (peersAmount < CONFIGS.nodesBoundaryNumber) {
                DiscordClient.notifier.generateAlert({
                    color: 'DEFAULT',
                    type: 'minorAlert',
                    nodeName: nodeName,
                    description: ALERTS_MESSAGES.N_PEERS_IS_LESS
                }, true)
                TelegramClient.telegramNotifier.sendAlert({
                    type: 'minorAlert',
                    nodeName: nodeName,
                    description: ALERTS_MESSAGES.N_PEERS_IS_LESS
                })
                ALERTS_STATES.minorAlert = false
                ALERTS_STATES.infoAlert = true
            } else {
                DiscordClient.notifier.generateAlert({
                    color: 'DEFAULT',
                    type: 'infoAlert',
                    nodeName: nodeName,
                    description: ALERTS_MESSAGES.N_PEERS_IS_EQUAL
                }, true)
                TelegramClient.telegramNotifier.sendAlert({
                    type: 'infoAlert',
                    nodeName: nodeName,
                    description: ALERTS_MESSAGES.N_PEERS_IS_EQUAL
                })
                ALERTS_STATES.minorAlert = true
                ALERTS_STATES.infoAlert = true
            }
        }
    }
}

export default new HelperMonitoring();