import {IConfig} from './interfaces/IConfig'
import dotenv from 'dotenv'

dotenv.config({path: __dirname + '/../.env'})

export const connectionsConfig = {
    redisUrl: process.env.REDISURL,
    discordToken: process.env.DISCORDTOKEN,
    prefix: process.env.PREFIX,
    notifyChannel: process.env.NOTIFYCHANNEL
}

export const discordOptions: IConfig = {
    cycleTime: 60,
    notifyCycleTime: 20,
    nodes: {'test': '143.110.246.141:26657'},
    // nodes: {'karen1': '68.183.14.161:26657', 'test': '143.110.246.141:26657'},
    operators: ['915532926249222144'],
    D2: 40
}

export const telegramConfig = {
    telegramToken: process.env.TELEGRAMTOKEN,
    telegramChannel: process.env.TELEGRAMCHANNEL,
    telegramMentioneds: [ 'karen111_bot']
}

export const botStatus = {
    DISORDENABLED: true,
    TELEGRAMBOTENABLED: true,
}
