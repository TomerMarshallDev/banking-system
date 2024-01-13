import {DbConnector} from "../db/db-connector";
import {QueryHandler} from "../queries/query-handler";
import {AccountDoesNotExistError} from "../errors/account-does-not-exist-error";
import {AccountBlockedError} from "../errors/account-blocked-error";
import {PersonDoesNotExistError} from "../errors/person-does-not-exist-error";

export class BankAccountValidator {
    private static readonly queryName: string = 'exists';

    private static async doesPersonExist(personId: number): Promise<boolean> {
        return await DbConnector.executeQuery(QueryHandler.doesPersonExist(personId), this.queryName);
    }

    private static async doesAccountExist(accountId: number): Promise<boolean> {
        return await DbConnector.executeQuery(QueryHandler.doesAccountExist(accountId), this.queryName);
    }

    private static async isAccountBlocked(accountId: number): Promise<boolean> {
        return await DbConnector.executeQuery(QueryHandler.isAccountBlocked(accountId), this.queryName);
    }

    static async validateAccount(accountId: number): Promise<void> {
        if (!await this.doesAccountExist(accountId)) {
            throw new AccountDoesNotExistError();
        }
        if (await this.isAccountBlocked(accountId)) {
            throw new AccountBlockedError();
        }
    }

    static async validatePerson(personId: number): Promise<void> {
        if (!await this.doesPersonExist(personId)) {
            throw new PersonDoesNotExistError();
        }
    }
}