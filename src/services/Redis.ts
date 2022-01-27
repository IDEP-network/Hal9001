import { RedisCommandArgument } from "@node-redis/client/dist/lib/commands";
import { createClient, RedisClientType } from "redis";
import config, { defaultConfig } from "../config";
import { IConfig } from "../interfaces/IConfig";
import { NodePayload } from "../types/Monitoring/NodePayload";
import Storage from "./Storage";

class Redis {
    private _connection = createClient({
        url: config.redisUrl
    });
    constructor() {
        this._connection.on('error', this.#onError.bind(this))
        this._connection.on('connect', () => console.log('Redis >> Connected'))
    }

    #onError(err) {
        console.error(`Redis >> ${err}`);
        process.exit();
    }

    set(key: string, value: RedisCommandArgument) {
        this._connection.set(key, value)
    }

    async loadConfig() {
        console.log('Redis >> Loading config')
        const config: IConfig = defaultConfig;
        await this._connection.hGetAll('cfg').then((res) => {
            if(Object.keys(res).length == 0) {
                console.log(`Storage >> Empty config, overwriting with default`)
                return this.writeConfig(defaultConfig)
            }


            for (let key of Object.keys(res)) {
                let val: any = res[key];
                if(val.endsWith('n')) val = parseInt(val.replace('n', ''));
                if(key == 'operators') {
                    val = val.split(', ')
                }
                config[key] = val;
            }

            return true;
        })

        await this._connection.hGetAll('node').then((res) => {
            for (let nodeName of Object.keys(res)) {
                let nodeAddress: any = res[nodeName];
                config.nodes[nodeName] = nodeAddress
            }
        })

        console.log('Redis >> Config loaded');
        Storage.config = config;
    }

    writeConfig(config: Partial<IConfig>) {
        console.log(`Redis >> Updating config`)
        Object.keys(config).forEach(key => {
            let value = config[key];
            if(Array.isArray(value)) value = value.join(', ')
            if(typeof value == 'number') value = `${value}n`
            if(key == 'nodes') {
                Object.keys(value).forEach(nodeName => {
                    let nodeAddress = value[nodeName];
                    this._connection.hSet(`node`, nodeName, nodeAddress)
                        .then(res => {
                            console.log(`Redis >> updated node ${nodeName}: ${nodeAddress}`)
                        })
                })
            } else {
                this._connection.hSet(`cfg`, key, value)
                    .then(res => {
                        console.log(`Redis >> Updated ${key}: ${value}`)
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

    setNodeData(nodeAddress: string, payload: NodePayload) {
        Object.keys(payload).forEach(key => {
            let value = payload[key];
            if(['name', 'address'].includes(key)) return;
            if(typeof value == 'boolean') value = `${value}`;
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

export default new Redis();