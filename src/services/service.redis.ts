import {RedisCommandArgument} from '@node-redis/client/dist/lib/commands';

import ServiceStorage from './service.storage';
import {CONFIGS} from '../configs/configs';
import {InterfaceConfig} from '../ts/interfaces/interface.config';
import {InterfaceNodePayload} from '../ts/interfaces/interface.nodePayload';
import {BinRedis} from '../bin/bin.redis';

class ServiceRedis extends BinRedis {

    constructor() {
        super();
    }

    set(key: string, value: RedisCommandArgument) {
        this.client.set(key, value)
    }

    async loadConfig() {
        console.log('ServiceRedis >> Loading config')
        const config: InterfaceConfig = CONFIGS;
        await this.client.hGetAll('cfg').then((res) => {
            if (Object.keys(res).length == 0) {
                console.log(`ServiceStorage >> Empty config, overwriting with default`)
                return this.writeConfig(CONFIGS)
            }

            for (const key of Object.keys(res)) {
                let val: any = res[key];
                if (val.endsWith('n')) val = parseInt(val);
                if (key == 'd_operators' || key == 't_operators') {
                    val = val.split(', ')
                }
                config[key] = val;
            }

            return true;
        });

        await this.client.hGetAll('node').then((res) => {
            for (const nodeName of Object.keys(res)) {
                const nodeAddress: any = res[nodeName];
                config.nodes[nodeName] = nodeAddress
            }
        });

        console.log('ServiceRedis >> Config loaded');
        ServiceStorage.config = config;
    }

    writeConfig(config: Partial<InterfaceConfig>) {
        console.log(`ServiceRedis >> Updating config`);
        Object.keys(config).forEach(key => {
            let value = config[key];
            if (Array.isArray(value)) value = value.join(', ');
            if (typeof value == 'number') value = `${value}n`;
            if (key == 'nodes') {
                Object.keys(value).forEach(nodeName => {
                    const nodeAddress = value[nodeName];
                    this.client.hSet('node', nodeName, nodeAddress)
                        .then(() => {
                            console.log(`ServiceRedis >> updated node ${nodeName}: ${nodeAddress}`)
                        })
                })
            } else {
                this.client.hSet('cfg', key, value)
                    .then(() => {
                        console.log(`ServiceRedis >> Updated ${key}: ${value}`)
                    })
            }
        })
    }

    removeNode(nodeName: string) {
        return this.client.hDel('node', nodeName)
    }

    getNodes() {
        return this.client.hGetAll('node');
    }

    setNodeData(nodeAddress: string, payload: InterfaceNodePayload) {
        Object.keys(payload).forEach(key => {
            let value = payload[key];
            if (['name', 'address'].includes(key)) return;
            if (typeof value == 'boolean') value = `${value}`;
            this.client.hSet(`node::${nodeAddress}`, key, value);
        })
    }

    getNodeData(nodeAddress: string): any {
        return this.client.hGetAll(`node::${nodeAddress}`);
    }
}

export default new ServiceRedis();