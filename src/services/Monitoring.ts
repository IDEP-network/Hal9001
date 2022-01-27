import fetch from "node-fetch";
import { DiscordClient } from "../bin/Discord";
import config from "../config";
import { NodeException } from "../types/Monitoring/NodeException";
import { NodePayload } from "../types/Monitoring/NodePayload";
import Redis from "./Redis";
import Storage from "./Storage";

export class Monitoring {
    constructor() {
        this.cycleTimeout();
    }

    cycleTimeout() {
        console.log(`Monitoring >> Cycle is processed, the next cycle through ${Storage.config.cycleTime}`)
        this.cycleEnter();
        setTimeout(this.cycleTimeout.bind(this), Storage.config.cycleTime * 1000)
    }

    async cycleEnter() {
        console.log(`Motitoring >> Cycle entered`)
        const nodes = await Redis.getNodes();
        for (let node in nodes) {
            const nodeAddress = nodes[node];
            const nodeInfo = await this.getNodeInfo(nodeAddress, node);
            if(typeof nodeInfo == 'string') {
                console.log(`Motoring >> FATAL: CannotAccessNodeAlert`)
                DiscordClient.instance.notifier.CannotAccessNodeAlert(node)
                continue;
            }
            // @ts-ignore
            DiscordClient.instance.notifier[nodeInfo.exception](nodeInfo)
            console.log(`Monitoring >> Payload from ${nodeAddress}: `, nodeInfo)
            Redis.setNodeData(nodeAddress, nodeInfo);
        }
    }

    async getNodeInfo(nodeAddress: string, nodeName: string): Promise<NodeException | NodePayload> {
        const apiUrl = `http://${nodeAddress}`
        const response: any = await fetch(`${apiUrl}/status`).then(res => res.json()).catch(e => (null))
        if(!response) return "CannotAccessNodeAlert";

        const responseNetInfo: any = await fetch(`${apiUrl}/net_info`).then(res => res.json());

        const catching_up = response.result.sync_info.catching_up;

        const payload: NodePayload = {
            catching_up,
            n_peers: responseNetInfo.result.n_peers,
            voting_power: response.result.validator_info.voting_power,
            exception: 'IsNotCatchingUp',
            name: nodeName,
            address: nodeAddress
        }

        if(catching_up) {
            payload.exception = 'IsCatchingUpAlert'
        }

        return payload;
    }
} 