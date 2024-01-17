import {createLogger, format, Logger as winstonLogger, transports} from 'winston';

export enum LogLevels {
    info = 'info',
    debug = 'debug',
    warn = 'warn',
    error = 'error'
}

export type LogLevel = keyof typeof LogLevels;

export interface loggerConfig {
    level: LogLevel
}

const TIMESTAMP_FORMAT: string = 'YYYY-MM-DD HH:mm:ss.SSS';

export class Logger {
    private static logger: winstonLogger;

    static init(config: loggerConfig): void {
        this.logger = createLogger({
            level: config.level,
            format: format.combine(
                format.json(),
                format.timestamp({format: TIMESTAMP_FORMAT}),
                format.splat(),
                format.colorize(),
                format.printf(({level, message, timestamp}) => `${timestamp} ${level} ${message}`)
            ),
            transports: [new transports.Console()],
        });
    }

    static info(msg: string): void {
        this.logger.log(LogLevels.info, msg);
    }

    static debug(msg: string): void {
        this.logger.log(LogLevels.debug, msg);
    }

    static error(msg: string): void {
        this.logger.log(LogLevels.error, msg);
    }

    static warn(msg: string): void {
        this.logger.log(LogLevels.warn, msg);
    }
}