import {TypeNodeException} from '../ts/types/type.nodeException';
import {InterfaceNodePayload} from '../ts/interfaces/interface.nodePayload';
import {DiscordClient} from '../bin/bin.discord';
import {CONSTANT_ALERTS_MESSAGES} from '../ts/constants/constant.alertsMessages';
import {CONFIGS, DISCORD_CONFIGS, TELEGRAM_CONFIGS} from '../configs/configs';
import {CONSTANT_ALERTS_STATES} from '../ts/constants/constant.alertsStates';
import {TelegramClient} from '../bin/bin.telegram';
import {UtilFetchNodeData} from '../utils/util.fetchNodeData';

class HelperMonitoring {

    async getNodeInfo(nodeAddress: string, nodeName: string): Promise<TypeNodeException | InterfaceNodePayload> {

        const response: any = await UtilFetchNodeData.getNodeStatus(nodeAddress);

        if (!response) return 'cannotAccessNodeAlert';

        const responseNetInfo: any = await UtilFetchNodeData.getNetInfo();

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
            if (DISCORD_CONFIGS.DISCORD_BOT_IS_ACTIVATED) {
                DiscordClient.notifier.generateAlert({
                    color: 'DEFAULT',
                    type: 'infoAlert',
                    nodeName: nodeName,
                    description: CONSTANT_ALERTS_MESSAGES.N_PEERS_IS_NULL
                }, true);
            }
            if (TELEGRAM_CONFIGS.TELEGRAM_BOT_IS_ACTIVATED) {
                TelegramClient.serviceTelegramNotifier.sendAlert({
                    type: 'infoAlert',
                    nodeName: nodeName,
                    description: CONSTANT_ALERTS_MESSAGES.N_PEERS_IS_NULL
                });
            }
        } else {
            if (peersAmount > CONFIGS.nodesBoundaryNumber) {
                if (DISCORD_CONFIGS.DISCORD_BOT_IS_ACTIVATED) {
                    DiscordClient.notifier.generateAlert({
                        color: 'DEFAULT',
                        type: 'infoAlert',
                        nodeName: nodeName,
                        description: CONSTANT_ALERTS_MESSAGES.N_PEERS_IS_MORE
                    }, true);
                }
                if (TELEGRAM_CONFIGS.TELEGRAM_BOT_IS_ACTIVATED) {
                    TelegramClient.serviceTelegramNotifier.sendAlert({
                        type: 'infoAlert',
                        nodeName: nodeName,
                        description: CONSTANT_ALERTS_MESSAGES.N_PEERS_IS_MORE
                    })
                }
                CONSTANT_ALERTS_STATES.infoAlert = false
                CONSTANT_ALERTS_STATES.minorAlert = true
            } else if (peersAmount < CONFIGS.nodesBoundaryNumber) {
                if (DISCORD_CONFIGS.DISCORD_BOT_IS_ACTIVATED) {
                    DiscordClient.notifier.generateAlert({
                        color: 'DEFAULT',
                        type: 'minorAlert',
                        nodeName: nodeName,
                        description: CONSTANT_ALERTS_MESSAGES.N_PEERS_IS_LESS
                    }, true);
                }
                if (TELEGRAM_CONFIGS.TELEGRAM_BOT_IS_ACTIVATED) {
                    TelegramClient.serviceTelegramNotifier.sendAlert({
                        type: 'minorAlert',
                        nodeName: nodeName,
                        description: CONSTANT_ALERTS_MESSAGES.N_PEERS_IS_LESS
                    });
                }
                CONSTANT_ALERTS_STATES.minorAlert = false
                CONSTANT_ALERTS_STATES.infoAlert = true
            } else {
                if (DISCORD_CONFIGS.DISCORD_BOT_IS_ACTIVATED) {
                    DiscordClient.notifier.generateAlert({
                        color: 'DEFAULT',
                        type: 'infoAlert',
                        nodeName: nodeName,
                        description: CONSTANT_ALERTS_MESSAGES.N_PEERS_IS_EQUAL
                    }, true);
                }
                if (TELEGRAM_CONFIGS.TELEGRAM_BOT_IS_ACTIVATED) {
                    TelegramClient.serviceTelegramNotifier.sendAlert({
                        type: 'infoAlert',
                        nodeName: nodeName,
                        description: CONSTANT_ALERTS_MESSAGES.N_PEERS_IS_EQUAL
                    })
                }
                CONSTANT_ALERTS_STATES.minorAlert = true
                CONSTANT_ALERTS_STATES.infoAlert = true
            }
        }
    }
}

export default new HelperMonitoring();