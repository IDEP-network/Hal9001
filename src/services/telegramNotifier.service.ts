import {TelegramClient} from '../bin/Telegram';
import Storage from './storage.service';
import {CONFIGS, TELEGRAM_CONFIGS} from '../configs/configs';
import {IEmbed} from '../ts/interfaces/IEmbed';
import TelegramHelper from '../helpers/telegram.helper';
import {ALERTS_STATES} from '../ts/constants/alertsStates';

export class TelegramNotifierService {

    constructor(public client: TelegramClient) {
        this.aliveStart()
    }

    aliveStart() {
        this.sendAlert({'type': 'aliveAlert'})
        setTimeout(() => this.aliveStart(), Storage.config.notifyCycleTime * 1000)
    }

    generateMsg({type, nodeName, payload, description}: IEmbed, mentioneds: string[]) {

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

    sendAlert(alert: IEmbed) {
        if (!ALERTS_STATES[alert.type]) return;
        this.client.telegram.sendMessage(TELEGRAM_CONFIGS.CHANNEL, this.generateMsg({
            type: alert.type,
            nodeName: alert.nodeName,
            description: alert.description,
            payload: alert.payload
        }, Storage.config.telegramOperators), {parse_mode: 'HTML'});
    }
}
