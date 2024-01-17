export class DailyWithdrawlLimitReachedError extends Error {
    constructor(accountId: number, withdrawlAmount: number) {
        super(`Cannot make requested withdrawl amount of [${withdrawlAmount}] to account with id [${accountId}] because it exceeds the daily withdrawl amount of the account!`);
        this.name = 'DailyWithdrawlLimitReachedError';
    }
}