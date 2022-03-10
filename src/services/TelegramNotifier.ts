import {telegramConfig} from '../Config';
import {Telegram} from '../bin/Telegram';
import Storage from './Storage';
import {TelegramHelper} from './TelegramHelper';
import {IEmbed} from '../interfaces/IEmbed';

export class TelegramNotifier extends Telegram {
    helper;
    content: string = '';

    constructor() {
        super(telegramConfig.telegramToken);
        this.helper = new TelegramHelper()
        this.aliveEnter()
    }

    aliveEnter() {
        this.sendAlert({'type': 'aliveAlert'}, telegramConfig.telegramMentioneds)
        setTimeout(this.aliveEnter.bind(this), Storage.config.notifyCycleTime * 1000)
    }

    generateMsg({type, nodeName, payload, description}: IEmbed, mentioneds: string[]) {

        this.content = ''
        if (mentioneds.length) this.helper.setMentioneds(mentioneds);
        this.helper.setTitle(`Alert -> ${type.replace('Alert', '')} \n`);

        // nodeName ? this.helper.setAuthor(nodeName) : this.helper.setAuthor('')
        // description ? this.helper.setDescription(description) : this.helper.setDescription('')
        // console.log(this.helper.getContent())

        if (payload) {
            this.helper.setAuthor(payload.name)
            payload.catching_up ? this.helper.setField('Catching Up', 'Yes') : this.helper.setField('Catching Up', 'No')
            this.helper.setField('Voting Power', payload.voting_power)
            this.helper.setField('Network Peers', payload.n_peers)
        }
        console.log(this.content)

        return this.helper.getContent()
    }

    // switchMentioneds(mentioneds: string[]) {
    // }

    sendAlert(alert: IEmbed, mentioneds: string[]) {
        // this.switchMentioneds(mentioneds);

        this.telegram.sendMessage(telegramConfig.telegramChannel, this.generateMsg({type: alert.type}, mentioneds), {parse_mode: 'HTML'});
    }
}
