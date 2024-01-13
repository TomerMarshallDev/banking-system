require('dotenv').config();

export interface Config {
    [key: string]: string | number | boolean | Object
}

export class ConfigurationParameters {
    private static config: Config;

    static init(): void {
        this.initConfig();
    }

    private static initConfig(): void {
        const envVariables: Config = {};
        Object.entries(process.env).forEach(([key, value]: [string, string | undefined]): void => {
            if (value != undefined) {
                try {
                    envVariables[key] = JSON.parse(value);
                } catch (error) {
                    envVariables[key] = value;
                }
            }
        });
        ConfigurationParameters.config = Object.assign({}, envVariables);
    }

    static getEnvVariable<T = string>(envKey: string): T {
        !ConfigurationParameters.config && this.initConfig();
        return this.config[envKey] as T;
    }
}