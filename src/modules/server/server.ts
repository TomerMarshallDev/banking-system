import express, {Application, NextFunction, Request, Response} from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {Logger} from "../logger/logger";
import {Route, routes} from "../routes/routes";
import {Result, ValidationError, validationResult} from "express-validator";
import {PersonDoesNotExistError} from "../errors/person-does-not-exist-error";
import {AccountDoesNotExistError} from "../errors/account-does-not-exist-error";
import {AccountBlockedError} from "../errors/account-blocked-error";
import {HTTP_RESPONSE_HEADERS} from "../consts/consts";

export class Server {
    static createApplication(): Application {
        const app: Application = express();
        app.use(bodyParser.json({limit: '10mb'}));
        app.use(cors());
        app.use((_req: Request, res: Response, next: NextFunction): void => {
            Object.entries(HTTP_RESPONSE_HEADERS).forEach(async ([headerNane, headerValue]: [string, string]) => await res.setHeader(headerNane, headerValue));
            next();
        });

        routes.forEach((route: Route): void => {
            (app as any)[route.method](route.route,
                ...route.validation,
                async (req: Request, res: Response, next: Function): Promise<void> => {
                    try {
                        this.validateRequest(req, res);
                        const requestParameters: object = Object.assign({}, req.body, req.params, {
                            action: route.action,
                            queryName: route.queryName
                        });
                        const result = await (route.dao as any)[route.functionName](requestParameters, res);
                        res.json(result);
                    } catch (err) {
                        next(err);
                    }
                });
        });
        app.use(this.handleError);
        app.get('/', (_req: Request, res: Response) => res.send('Server in running!'));
        return app;
    }

    static validateRequest(req: Request, res: Response): void {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
        }
    }

    static listen(app: Application, port: number): void {
        app.listen(port, () => Logger.info(`Listening on port: ${port}`));
    }

    static handleError(error: {
        name: string,
        message: string,
        statusCode: number
    }, _req: Request, res: Response, _next: NextFunction): void {
        switch (error.name) {
            case PersonDoesNotExistError.name || AccountDoesNotExistError.name || AccountBlockedError.name:
                res.status(400).send(Server.buildResponseError(error.message));
                break;
            default:
                res.status(error.statusCode || 500).send(Server.buildResponseError(error.message));
                break;
        }
    }

    static buildResponseError(errorMessage: string): object {
        return {
            errors: [
                {
                    type: "field",
                    msg: errorMessage,
                    location: "request"
                }
            ]
        }
    }
}