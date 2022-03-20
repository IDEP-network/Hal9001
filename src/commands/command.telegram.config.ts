import {v4} from 'uuid'

import {BaseCommand} from '../bin/bin.command'
import ServiceStorage from '../services/service.storage'
import {TelegramClient} from '../bin/bin.telegram';
import ServiceRedis from '../services/service.redis';
import {ConstantTelegramCommandMessages} from '../ts/constants/constant.telegramCommandMessages';

export default class CommandTelegramConfig extends BaseCommand {

    constructor() {
        super({
            name: 'config',
            aliases: ['ni']
        })
    }

    async run(client: TelegramClient, message, args: string[]) {

        const availabeKeys = ['t_operators', 'nodes', 'cycleTime', 'notifyCycleTime'];
        if (args.length < 2 || !availabeKeys.includes(args[0])) {
            return TelegramClient.serviceTelegramNotifier.sendMessage({
                title: 'Invalid usage', description: ConstantTelegramCommandMessages.CONFIGS
            });
        }

        const config = ServiceStorage.config;

        if (args[1] == 'view' && args.length == 2) {
            let value = ServiceStorage.config[args[0]];
            if (!value) value = 'Key not found'
            console.log(value)
            if (args[0] == 't_operators') {
                value = value.map(val => `${val}`).join(', ')
            }
            if (args[0] == 'nodes') {
                value = Object.keys(value).map(key => `**${key}**: ${value[key]}`).join('\n')
            }
            return TelegramClient.serviceTelegramNotifier.sendMessage({
                title: `View - ${args[0]}`,
                description: `${value}`
            })
        }

        const action = args[1];
        let description = `**${action.toUpperCase()} -> ${args[0]}**`;

        switch (args[0]) {
            case 't_operators': {
                if (action == 'add') {
                    config.t_operators.push(args[2]);
                    description = description + `\n **${args[2]}** added!`
                }
                if (action == 'remove') {
                    config.t_operators = config.t_operators.filter(op => op != args[2])
                    description = description + `\n **${args[2]}** removed!  👍`
                }
                break;
            }
            case 'nodes': {
                if (action == 'add') {
                    const node = args[2];
                    const name = args.length == 4 ? args[3] : v4()

                    description = description + `\n **${node}** (\`${name}\`) added!`
                    config.nodes[name] = node;
                }
                if (action == 'remove') {
                    const target = args[2]
                    let node = ServiceStorage.config.nodes[target];
                    if (!node) return message.reply('Invalid node');
                    delete config.nodes[target];
                    ServiceRedis.removeNode(target)
                    description = description + `\n  **${node}** (\`${target}\`) removed!`
                }
                break;
            }
            case 'cycleTime': {
                const time = parseInt(args[2]);
                if (action == 'set') {
                    config.cycleTime = time;
                    description = description + `\n cycleTime -> ${time}sec`
                }
                break;
            }
            case 'notifyCycleTime': {
                const time = parseInt(args[2]);
                if (action == 'set') {
                    config.notifyCycleTime = time;
                    description = description + `\n notifyCycleTime -> ${time}sec`
                }
                break;
            }
        }
        TelegramClient.serviceTelegramNotifier.sendMessage({description: description})

        console.log(config);

        ServiceStorage.config = config;
        ServiceRedis.writeConfig(config);
    }
}