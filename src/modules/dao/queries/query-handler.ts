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
        return `SELECT EXISTS(SELECT FROM bank.account WHERE account_id = ${accountId} AND NOT is_active)`;
    }

    static withdrawlLimitMet(accountId: number, withdrawlAmount: number): string {
        return `WITH daily_withdrawl_sum AS (SELECT SUM(value) AS current_withdrawl_sum
                                             FROM bank.transaction
                                             WHERE transaction.account_id = ${accountId}
                                               AND transaction_type = 'withdraw'
                                               AND transaction_date > NOW() - '24h'::INTERVAL)
                SELECT daily_withdrawl_sum.current_withdrawl_sum + ${withdrawlAmount} > daily_withdrawl_limit AS exists
                FROM daily_withdrawl_sum,
                     bank.account
                WHERE account_id = ${accountId}`
    }
}