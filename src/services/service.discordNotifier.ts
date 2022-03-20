import {MessageEmbed} from 'discord.js';

import {DiscordClient} from '../bin/bin.discord';
import ServiceStorage from './service.storage';
import {InterfaceAlert} from "../ts/interfaces/interface.alert";
import {DISCORD_CONFIGS} from "../configs/configs";
import {CONSTANT_ALERTS_STATES} from "../ts/constants/constant.alertsStates";


export class ServiceDiscordNotifier {

    constructor(public client: DiscordClient) {
        this.aliveEnter.bind(this)()
    }

    aliveEnter() {
        this.generateAlert({color: 'YELLOW', type: 'aliveAlert'}, true);
        setTimeout(this.aliveEnter.bind(this), ServiceStorage.config.notifyCycleTime * 1000)
    }

    generateEmbed({payload, type, color, nodeName, description}: InterfaceAlert) {
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(`Alert -> ${type.replace('Alert', '')}`);
        if (nodeName) {
            embed.setAuthor({
                name: `NODE: ${nodeName}`
            })
        }
        if (payload) {
            embed.setAuthor({
                name: `NODE: ${payload.name}`
            });
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
        const channel = this.client.channels.resolve(DISCORD_CONFIGS.CHANNEL);
        if (!channel.isText()) return;
        if (!onOperator) operators = [''];

        channel.send({
            embeds: [embed],
            content: `${operators.map(oper => `<@${oper}>`).join(' ')}`
        })
    }

    generateAlert(alert: InterfaceAlert, onOperator: boolean = true) {
        if (!CONSTANT_ALERTS_STATES[alert.type]) return;

        this.notify(this.generateEmbed({
            color: alert.color,
            type: alert.type,
            payload: alert.payload,
            description: alert.description,
            nodeName: alert.nodeName
        }), ServiceStorage.config.d_operators, onOperator)
    }
}