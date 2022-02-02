import { IConfig } from "./interfaces/IConfig"

export default {
    redisUrl: 'redis://127.0.0.1:6379',
    discordToken: 'OTM3Njg5OTY3OTE0Nzk1MDg5.YffZ1Q.MEkOkm0BeJ3M_YTfD8ZpqHgvfjA',
    prefix: '!',
    notifyChannel: '937692634003157046'
}

export const defaultConfig: IConfig = {
    cycleTime: 60,
    notifyCycleTime: 20,
    nodes: {'test': '143.110.246.141:26657'},
    operators: [],
    n_peers: 40
}