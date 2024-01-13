import knex, {Knex} from "knex";
import {config} from './knexfile';
import * as fs from "fs";
import {Logger} from "../logger/logger";

export class DbConnector {
    private static knex: Knex;

    static async init(): Promise<void> {
        try {
            this.knex = knex(config.development);
            const bankMetadata: string = fs.readFileSync('./src/modules/db/sql/db-metadata.sql', 'utf-8');
            await this.knex.raw(bankMetadata);
        } catch (error) {
            const errorMessage: string = `Failed to initialize db connection and environment. error: ${error.message}`
            Logger.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    static async executeQuery<T>(query: string, queryName?: string): Promise<T> {
        const queryResult: Object = (await this.knex.raw<{ rows: object[] }>(query)).rows;
        return (queryName ? queryResult[0][queryName] : queryResult) as T;
    }
}