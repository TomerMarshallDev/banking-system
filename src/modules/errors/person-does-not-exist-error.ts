export class PersonDoesNotExistError extends Error {
    constructor() {
        super("The person id specified does not exist!");
        this.name = 'PersonDoesNotExistError';
    }
}