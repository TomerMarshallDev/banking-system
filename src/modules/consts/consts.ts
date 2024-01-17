import * as fs from "fs";

export const HTTP_RESPONSE_HEADERS: object = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, DELETE'
};
export const bankMetadataSql: string = fs.readFileSync('./src/modules/db/sql/db-metadata.sql', 'utf-8');