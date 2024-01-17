export class EnvironmentVariableNotExistError extends Error {
    constructor(envVar: string) {
        super(`Environment Variable ${envVar} does not exist!`);
        this.name = 'EnvironmentVariableNotExistError';
    }
}