import {Client} from 'discord.js';

export default (client: Client, notifier, commandHandler): any => {
    client.on('ready', async (): Promise<any> => {
        if (!client.user || !client.application) {
            return;
        }
        commandHandler.scan()
        let not = new notifier(this);
        commandHandler.scan()
        return not
    });
};