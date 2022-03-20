import {InterfaceConfig} from "../ts/interfaces/interface.config";

class ServiceStorage {

    private _config: InterfaceConfig;

    get config() {
        return this._config;
    }

    set config(config: InterfaceConfig) {
        console.log(`ServiceStorage >> Config overwrited`);
        this._config = config;
        console.log(`ServiceStorage >> Config: `, config)
    }

    updateConfig(config: Partial<InterfaceConfig>) {
        Object.keys(config).forEach(key => {
            this._config[key] = config[key];
            console.log(`ServiceStorage >> Updated ${key}: ${config[key]}`);
        })
    }
}

export default new ServiceStorage();