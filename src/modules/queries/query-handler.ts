export class QueryHandler {
    static createAccount(personId: number, accountType: string): string {
        return `SELECT *
                FROM bank.create_account(${personId}, '${accountType}')`;
    }

    static accountTransaction(accountId: number, actionValue: number, transactionType: string): string {
        return `SELECT *
                FROM bank.account_transaction(${accountId}, ${actionValue}, '${transactionType}')`;
    }

    static blockAccount(accountId: number): string {
        return `SELECT *
                FROM bank.block_account(${accountId})`;
    }

    static getAccountBalance(accountId: number): string {
        return `SELECT balance
                FROM bank.account
                WHERE account_id = ${accountId}`;
    }

    static getAccountTransactions(accountId: number): string {
        return `SELECT *
                FROM bank.get_account_transactions(${accountId})`;
    }

    static doesPersonExist(personId: number): string {
        return `SELECT EXISTS(SELECT FROM bank.person WHERE person_id = ${personId})`;
    }

    static doesAccountExist(accountId: number): string {
        return `SELECT EXISTS(SELECT FROM bank.account WHERE account_id = ${accountId})`;
    }

    static isAccountBlocked(accountId: number): string {
        return `select exists(select from bank.account WHERE account_id = ${accountId} AND not is_active)`;
    }
}