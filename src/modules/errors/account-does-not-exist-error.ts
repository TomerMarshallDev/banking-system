export class AccountDoesNotExistError extends Error {
    constructor() {
        super("Account specified does not exist, therefore not handling!");
        this.name = 'AccountDoesNotExistError';
    }
}