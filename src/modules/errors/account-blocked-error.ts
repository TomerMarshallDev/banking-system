export class AccountBlockedError extends Error {
    constructor() {
        super("Account is blocked, meaning no actions are allowed!");
        this.name = 'AccountBlockedError';
    }
}