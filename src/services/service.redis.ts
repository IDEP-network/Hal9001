import {RedisCommandArgument} from '@node-redis/client/dist/lib/commands';
import {createClient} from 'redis';

import ServiceStorage from './service.storage';
import {CONFIGS, REDIS_CONFIGS} from "../configs/configs";
import {InterfaceConfig} from "../ts/interfaces/interface.config";
import {InterfaceNodePayload} from "../ts/interfaces/interface.nodePayload";

class ServiceRedis {

    private _connection = createClient({
        url: REDIS_CONFIGS.URL
    });

    constructor() {
        // @ts-ignore
        this._connection.on('error', this.#onError.bind(this))
        this._connection.on('connect', () => console.log('ServiceRedis >> Connected'))
    }

    #onError(err) {
        console.error(`ServiceRedis >> ${err}`);
        process.exit();
    }

    set(key: string, value: RedisCommandArgument) {
        this._connection.set(key, value)
    }

    async loadConfig() {
        console.log('ServiceRedis >> Loading config')
        const config: InterfaceConfig = CONFIGS;
        await this._connection.hGetAll('cfg').then((res) => {
            if (Object.keys(res).length == 0) {
                console.log(`ServiceStorage >> Empty config, overwriting with default`)
                return this.writeConfig(CONFIGS)
            }

            for (const key of Object.keys(res)) {
                let val: any = res[key];
                if (val.endsWith('n')) val = parseInt(val.replace('n', ''));
                if (key == 'operators') {
                    val = val.split(', ')
                }
                config[key] = val;
            }

            return true;
        });

        await this._connection.hGetAll('node').then((res) => {
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
                    this._connection.hSet('node', nodeName, nodeAddress)
                        .then(() => {
                            console.log(`ServiceRedis >> updated node ${nodeName}: ${nodeAddress}`)
                        })
                })
            } else {
                this._connection.hSet('cfg', key, value)
                    .then(() => {
                        console.log(`ServiceRedis >> Updated ${key}: ${value}`)
                    })
            }
        })
    }

    removeNode(nodeName: string) {
        return this._connection.hDel('node', nodeName)
    }

    getNodes() {
        return this._connection.hGetAll('node');
    }

    setNodeData(nodeAddress: string, payload: InterfaceNodePayload) {
        Object.keys(payload).forEach(key => {
            let value = payload[key];
            if (['name', 'address'].includes(key)) return;
            if (typeof value == 'boolean') value = `${value}`;
            this._connection.hSet(`node::${nodeAddress}`, key, value);
        })
    }

    getNodeData(nodeAddress: string): any {
        return this._connection.hGetAll(`node::${nodeAddress}`);
    }

    connect() {
        return this._connection.connect();
    }
}

export default new ServiceRedis();