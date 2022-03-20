import {TelegramClient} from '../bin/bin.telegram';
import ServiceStorage from './service.storage';
import {TELEGRAM_CONFIGS} from '../configs/configs';
import {InterfaceAlert} from '../ts/interfaces/interface.alert';
import TelegramHelper from '../helpers/helper.telegram';
import {CONSTANT_ALERTS_STATES} from '../ts/constants/constant.alertsStates';

export class ServiceTelegramNotifier {

    constructor(public client: TelegramClient) {
        this.aliveStart()
    }

    aliveStart() {
        this.sendAlert({'type': 'aliveAlert'})
        setTimeout(() => this.aliveStart(), ServiceStorage.config.notifyCycleTime * 1000)
    }

    generateAlert({type, nodeName, payload, description, title}: InterfaceAlert, operators: string[]) {

        TelegramHelper.resetContent();

        if (operators.length) TelegramHelper.setMentioneds(operators);

        if (nodeName) TelegramHelper.setAuthor(nodeName);

        if (type) TelegramHelper.setTitle(`Alert -> ${type.replace('Alert', '')} \n`);

        if (title) TelegramHelper.setTitle(`${title} \n`);

        if (description) TelegramHelper.setDescription(description);

        if (payload) {
            TelegramHelper.setAuthor(payload.name)
            payload.catching_up ? TelegramHelper.setField('Catching Up', 'Yes') : TelegramHelper.setField('Catching Up', 'No')
            TelegramHelper.setField('Voting Power', payload.voting_power).setField('Network Peers', payload.n_peers);
        }

        return TelegramHelper.getContent();
    }

    sendAlert(alert: InterfaceAlert) {
        if (!CONSTANT_ALERTS_STATES[alert.type]) return;
        this.client.telegram.sendMessage(TELEGRAM_CONFIGS.CHANNEL, this.generateAlert({
            type: alert.type,
            nodeName: alert.nodeName,
            description: alert.description,
            payload: alert.payload,
        }, ServiceStorage.config.t_operators), {parse_mode: 'HTML'});
    }

    sendMessage(alert: InterfaceAlert) {
        this.client.telegram.sendMessage(TELEGRAM_CONFIGS.CHANNEL, this.generateAlert({
            nodeName: alert.nodeName,
            description: alert.description,
            title: alert.title
        }, ServiceStorage.config.t_operators), {parse_mode: 'HTML'});
    }
}
