import knex, {Knex} from "knex";
import {Logger} from "../logger/logger";
import {ConfigurationParameters} from "../config/config";

export class DbConnector {
    private static knex: Knex;

    static async init(): Promise<void> {
        try {
            this.knex = knex({
                client: 'pg',
                connection: {
                    database: ConfigurationParameters.getEnvVariable<string>('DATABASE'),
                    user: ConfigurationParameters.getEnvVariable<string>('DB_USER'),
                    password: ConfigurationParameters.getEnvVariable<string>('DB_PASSWORD'),
                    query_timeout: ConfigurationParameters.getEnvVariable<number>('QUERY_TIMEOUT')
                },
                pool: {
                    min: 2,
                    max: 10,
                    afterCreate: (conn: any, done: any): void => {
                        conn.query('select 1 as result', (err: Error): void => {
                            conn.on('notice', (dbLog: { message: string }): void => {
                                Logger.info(`POSTGRES: ${dbLog.message}`);
                            });
                            done(err, conn);
                        });
                    }
                }
            });
        } catch (error) {
            const errorMessage: string = `Failed to initialize db connection. error: ${error.message}`
            Logger.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    static async executeQuery<T = void>(query: string, queryName?: string): Promise<T> {
        const queryResult: Object = (await this.knex.raw<{ rows: object[] }>(query)).rows;
        return (queryName ? queryResult[0][queryName] : queryResult) as T;
    }

    static async initDbEnvironment(sql: string, entityName: string): Promise<void> {
        Logger.info(`Creating ${entityName} DB environment!`);
        await this.executeQuery<void>(sql);
        Logger.info(`Finished Creating ${entityName} DB environment!`)
    }

    static async teardown(entityName: string): Promise<void> {
        Logger.info(`Tearing down ${entityName} DB environment!`);
        await this.executeQuery(`DROP SCHEMA IF EXISTS ${entityName} CASCADE;`);
        await this.knex.destroy();
        Logger.info('Teardown executed successfully!')
    }
}