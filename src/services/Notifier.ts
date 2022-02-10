import {MessageEmbed} from 'discord.js';
import {DiscordClient} from '../bin/Discord';
import {connectionsConfig} from '../Config';
import notificationConfig from '../NotificationConfig';
import Storage from './Storage';
import operatorConfig from '../OperatorConfig';
import {IEmbed} from '../interfaces/IEmbed';

export class Notifier {
    constructor(public client: DiscordClient) {
        this.aliveEnter.bind(this)()
    }

    aliveEnter() {
        this.generateAlert({color: 'YELLOW', type: 'aliveAlert'});
        setTimeout(this.aliveEnter.bind(this), Storage.config.notifyCycleTime * 1000)
    }

    generateEmbed({payload, type, color, nodeName, description}: IEmbed) {
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(`Alert -> ${type.replace('Alert', '')}`)
        if (nodeName) {
            embed.setAuthor({
                name: `NODE: ${nodeName}`
            })
        }
        if (payload) {
            embed.setAuthor({
                name: `NODE: ${payload.name}`
            })
            embed.addField(`Catching Up`, payload.catching_up ? 'Yes' : 'No', true
            )
                .addField('Voting Power', payload.voting_power, true)
                .addField('Network Peers', payload.n_peers, true)
        }

        if (description) {
            embed.setDescription(description)
        }

        return embed;
    }

    notify(embed: MessageEmbed, operators: string[], onOperator: boolean = operatorConfig.onOperator) {
        const channel = this.client.channels.resolve(connectionsConfig.notifyChannel);
        if (!channel.isText()) return;
        if (!onOperator) operators = [''];

        channel.send({
            embeds: [embed],
            content: `${operators.map(oper => `<@${oper}>`).join(' ')}`
        })
    }

    generateAlert(alert: IEmbed) {
        if (!notificationConfig[alert.type]) return;

        this.notify(this.generateEmbed({
            color: alert.color,
            type: alert.type,
            payload: alert.payload,
            description: alert.description,
            nodeName: alert.nodeName
        }), Storage.config.operators)
    }

    // cannotAccessNodeAlert(nodeName: string) {
    //     if(!notificationConfig.cannotAccessNodeAlert) return;
    //
    //     this.notify(this.generateEmbed({
    //         color: 'DARK_RED',
    //         type: 'cannotAccessNodeAlert',
    //         nodeName
    //     }), Storage.config.operators)
    // }
    //
    // isCatchingUpAlert(payload: INodePayload) {
    //     if(!notificationConfig.isCatchingUpAlert) return;
    //
    //     this.notify(this.generateEmbed({
    //         color: 'AQUA',
    //         type: 'isCatchingUpAlert',
    //         payload
    //     }), Storage.config.operators)
    // }
    //
    // isNotCatchingUp(payload: INodePayload) {
    //     if(!notificationConfig.isNotCatchingUp) return;
    //
    //     this.notify(this.generateEmbed({
    //         color: 'YELLOW',
    //         type: 'isNotCatchingUp',
    //         payload
    //     }), Storage.config.operators)
    // }
}