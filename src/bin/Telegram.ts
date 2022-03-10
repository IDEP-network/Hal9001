import {Telegraf} from 'telegraf';

export class Telegram extends Telegraf {
    constructor(token: string) {
        if (token === undefined) {
            throw new Error('TELEGRAM BOT TOKEN must be provided!')
        }
        super(token);
    }
}