import {TelegramClient} from '../bin/bin.telegram';
import ServiceStorage from './service.storage';
import {CONFIGS, TELEGRAM_CONFIGS} from '../configs/configs';
import {InterfaceEmbed} from '../ts/interfaces/interface.embed';
import TelegramHelper from '../helpers/helper.telegram';
import {ALERTS_STATES} from '../ts/constants/constant.alertsStates';

export class ServiceTelegramNotifier {

    constructor(public client: TelegramClient) {
        this.aliveStart()
    }

    aliveStart() {
        this.sendAlert({'type': 'aliveAlert'})
        setTimeout(() => this.aliveStart(), ServiceStorage.config.notifyCycleTime * 1000)
    }

    generateMsg({type, nodeName, payload, description}: InterfaceEmbed, mentioneds: string[]) {

        TelegramHelper.resetContent();

        if (mentioneds.length) TelegramHelper.setMentioneds(mentioneds);

        if (nodeName) {
            TelegramHelper.setAuthor(nodeName)
        }

        TelegramHelper.setTitle(`Alert -> ${type.replace('Alert', '')} \n`);

        if (description) {
            TelegramHelper.setDescription(description)
        }

        if (payload) {
            TelegramHelper.setAuthor(payload.name)
            payload.catching_up ? TelegramHelper.setField('Catching Up', 'Yes') : TelegramHelper.setField('Catching Up', 'No')
            TelegramHelper.setField('Voting Power', payload.voting_power)
            TelegramHelper.setField('Network Peers', payload.n_peers)
        }

        return TelegramHelper.getContent()
    }

    sendAlert(alert: InterfaceEmbed) {
        if (!ALERTS_STATES[alert.type]) return;
        this.client.telegram.sendMessage(TELEGRAM_CONFIGS.CHANNEL, this.generateMsg({
            type: alert.type,
            nodeName: alert.nodeName,
            description: alert.description,
            payload: alert.payload
        }, ServiceStorage.config.telegramOperators), {parse_mode: 'HTML'});
    }
}
