import { IConfig } from "./interfaces/IConfig"

export default {
    redisUrl: 'redis://127.0.0.1:6379',
    discordToken: "<bot_token>",
    prefix: '!',
    notifyChannel: '<bot_chanel>'
}

export const defaultConfig: IConfig = {
    cycleTime: 60,
    notifyCycleTime: 20,
    nodes: {},
    operators: []
}
