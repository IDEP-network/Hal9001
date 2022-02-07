import { IConfig } from "./interfaces/IConfig"
require('dotenv').config({ path: __dirname+'/../.env' });

export default {
    redisUrl: process.env.REDISURL,
    discordToken: process.env.DISCORDTOKEN,
    prefix: process.env.PREFIX,
    notifyChannel: process.env.NOTIFYCHANNEL
}

export const defaultConfig: IConfig = {
    cycleTime: 60,
    notifyCycleTime: 20,
    nodes: {'test': '143.110.246.141:26657'},
    operators: ['915532926249222144'],
    D2: 40
}