import path from 'path';
import {promisify} from 'util';
import glob from 'glob';

export class UtilCommandsHandler {

    public static async getCommandsFiles (botName){
        const pathName = path.normalize(__dirname + '/../commands');
        return await promisify(glob)(pathName + `/command.${botName}.*.{ts,js}`);
    }

    public static async createCommandsInstances (commandPath) {
        const commandModule = await import(commandPath).then(item => item.default);
        return new commandModule();
    }
}