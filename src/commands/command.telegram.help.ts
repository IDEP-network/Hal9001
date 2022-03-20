import {BaseCommand} from '../bin/bin.command';
import {TelegramClient} from '../bin/bin.telegram';
import {ConstantTelegramCommandMessages} from '../ts/constants/constant.telegramCommandMessages';

export default class CommandTelegramHelp extends BaseCommand {

    constructor() {
        super({
            name: 'help',
            aliases: ['ni']
        })
    }

    async run(client: TelegramClient, message, args: string[]) {
        return TelegramClient.serviceTelegramNotifier.sendAlert({
            type: 'infoAlert',
            description: ConstantTelegramCommandMessages.HELP
        });
    }
}