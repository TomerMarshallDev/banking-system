import {Logger} from "./modules/logger/logger";
import {Application} from "express";
import {Server} from "./modules/server/server";
import {ConfigurationParameters} from "./modules/config/config";
import {DbConnector} from "./modules/db/db-connector";
import {bankMetadataSql} from "./modules/consts/consts";

async function run(): Promise<void> {
    const entityName: string = 'bank';
    try {
        ConfigurationParameters.init();
        Logger.init({level: ConfigurationParameters.getEnvVariable('LOG_LEVEL')});
        await DbConnector.init();
        await DbConnector.initDbEnvironment(bankMetadataSql, entityName);
        const app: Application = Server.createApplication();
        Server.listen(app, ConfigurationParameters.getEnvVariable('PORT'));
        Logger.info('Bank System Management Api initialized Successfully!');
    } catch (error) {
        Logger.error(`An error occurred trying to initialize Bank System Management Api. error: ${error.stack}`);
    }
}

run().then();