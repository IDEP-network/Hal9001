import {createClient} from 'redis';

import {REDIS_CONFIGS} from '../configs/configs';

export class BinRedis {

    public client;

    constructor() {
        this.client = createClient({url: REDIS_CONFIGS.URL});
        this.client.on('error', (err) => {
            console.log(`ServiceRedis >> ${err}`);
            process.exit();
        });
        this.client.on('connect', async () => {
            console.log('ServiceRedis >> Connected');
        });

    }

    async connect() {
        return await this.client.connect();
    }
}