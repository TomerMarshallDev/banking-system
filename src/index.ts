import {Logger} from "./modules/logger/logger";
import {Application} from "express";
import {Server} from "./modules/server/server";
import {ConfigurationParameters} from "./modules/config/config";
import {DbConnector} from "./modules/db/db-connector";

async function run(): Promise<void> {
    try {
        ConfigurationParameters.init();
        Logger.init({level: ConfigurationParameters.getEnvVariable('LOG_LEVEL')});
        await DbConnector.init();
        const app: Application = Server.createApplication();
        Server.listen(app, ConfigurationParameters.getEnvVariable('PORT'));
        Logger.info('Bank System Management Api initialized Successfully!');
    } catch (error) {
        Logger.error(`An error occurred trying to initialize Bank System Management Api. error: ${error.stack}`);
    }
}

run().then();