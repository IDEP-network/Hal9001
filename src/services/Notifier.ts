import { ColorResolvable, MessageEmbed } from "discord.js";
import { DiscordClient } from "../bin/Discord";
import config from "../config";
import notificationConfig from "../notificationConfig";
import { NodeException } from "../types/Monitoring/NodeException";
import { NodePayload } from "../types/Monitoring/NodePayload";
import Storage from "./Storage";

export class Notifier {
    constructor(public client: DiscordClient) {
        this.aliveEnter.bind(this)()
    }

    aliveEnter() {
        this.AliveAlert();
        setTimeout(this.aliveEnter.bind(this), Storage.config.notifyCycleTime * 1000)
    }

    generateEmbed({
        payload,
        type,
        color,
        name
    }: {
        payload?: NodePayload,
        type: NodeException,
        color: ColorResolvable,
        name?: string
    }) {
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(`Alert -> ${type.replace('Alert', '')}`)
        if(name) {
            embed.setAuthor({
                name: `NODE: ${name}`
            })
        }
        if(payload) {
            embed.setAuthor({
                name: `NODE: ${payload.name}`
            })
            embed.addField(`Catching Up`, payload.catching_up ? "Yes" : "No", true
            )
                .addField('Voting Power', payload.voting_power, true)
                .addField('Network Peers', payload.n_peers, true)
        }

        return embed;
    }

    notify(embed: MessageEmbed, operators: string[]) {
        let channel = this.client.channels.resolve(config.notifyChannel);
        if(!channel.isText()) return;

        channel.send({
            embeds: [embed],
            content: `${operators.map(oper => `<@${oper}>`).join(' ')}`
        })
    }

    AliveAlert() {
        if(!notificationConfig.AliveAlert) return;

        this.notify(this.generateEmbed({
            color: 'YELLOW',
            type: 'AliveAlert'
        }), Storage.config.operators)
    }

    CannotAccessNodeAlert(name: string) {
        if(!notificationConfig.CannotAccessNodeAlert) return;

        this.notify(this.generateEmbed({
            color: 'DARK_RED',
            type: 'CannotAccessNodeAlert',
            name
        }), Storage.config.operators)
    }

    IsCatchingUpAlert(payload: NodePayload) {
        if(!notificationConfig.IsCatchingUpAlert) return;

        this.notify(this.generateEmbed({
            color: 'AQUA',
            type: 'IsCatchingUpAlert',
            payload
        }), Storage.config.operators)
    }

    IsNotCatchingUp(payload: NodePayload) {
        if(!notificationConfig.IsNotCatchingUp) return;

        this.notify(this.generateEmbed({
            color: 'YELLOW',
            type: 'IsNotCatchingUp',
            payload
        }), Storage.config.operators)
    }
}