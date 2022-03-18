import {IConfig} from "../ts/interfaces/IConfig";

class StorageService {
    private _config: IConfig;

    get config() {
        return this._config;
    }

    set config(config: IConfig) {
        console.log(`Storage >> Config overwrited`);
        this._config = config;
        console.log(`Storage >> Config: `, config)
    }

    updateConfig(config: Partial<IConfig>) {
        Object.keys(config).forEach(key => {
            this._config[key] = config[key];
            console.log(`Storage >> Updated ${key}: ${config[key]}`);
        })
    }
}

export default new StorageService();