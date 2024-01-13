import type {Knex} from "knex";
import {Logger} from "../logger/logger";

export const config: { [key: string]: Knex.Config } = {
    development: {
        client: "postgresql",
        connection: {
            query_timeout: 120000,
            database: "postgres",
            user: "postgres",
            password: "postgres"
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
                })
            }
        }
    }
};
