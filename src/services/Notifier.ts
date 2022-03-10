import {MessageEmbed} from 'discord.js';
import {DiscordClient} from '../bin/Discord';
import {connectionsConfig} from '../Config';
import notificationConfig from '../NotificationConfig';
import Storage from './Storage';
import {DiscordOperators} from '../OperatorConfig';
import {IEmbed} from '../interfaces/IEmbed';

export class Notifier {
    constructor(public client: DiscordClient) {
        this.aliveEnter.bind(this)()
    }

    aliveEnter() {
        this.generateAlert({color: 'YELLOW', type: 'aliveAlert'}, true);
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

    notify(embed: MessageEmbed, operators: string[], onOperator: boolean) {
        const channel = this.client.channels.resolve(connectionsConfig.notifyChannel);
        if (!channel.isText()) return;
        if (!onOperator) operators = [''];

        channel.send({
            embeds: [embed],
            content: `${operators.map(oper => `<@${oper}>`).join(' ')}`
        })
    }

    generateAlert(alert: IEmbed, onOperator: boolean = DiscordOperators.onOperator) {
        if (!notificationConfig[alert.type]) return;

        this.notify(this.generateEmbed({
            color: alert.color,
            type: alert.type,
            payload: alert.payload,
            description: alert.description,
            nodeName: alert.nodeName
        }), Storage.config.operators, onOperator)
    }
}