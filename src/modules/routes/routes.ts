import {body, param, ValidationChain} from "express-validator";
import {BankDao} from "../dao/bank-dao";

export type Route = {
    method: string,
    route: string,
    dao: BankDao,
    functionName: string,
    validation: ValidationChain[],
    queryName: string,
    action?: 'deposit' | 'withdraw'
}

export const routes: Route[] = [
    {
        method: "post",
        route: "/createAccount",
        dao: BankDao,
        functionName: "createAccount",
        queryName: "createAccount",
        validation: [
            body('personId').exists().withMessage('Request must include personId')
                .isInt({min: 0}).withMessage('personId must be a positive integer'),
            body('accountType').exists().withMessage('Request must include accountType')
                .isString().withMessage('accountType must be a string')
                .isLength({min: 0, max: 10}).withMessage('accountType must be either personal or business')
        ],
    },
    {
        method: "post",
        route: "/deposit/:accountId",
        dao: BankDao,
        functionName: "accountTransaction",
        queryName: "accountTransaction",
        action: 'deposit',
        validation: [
            param('accountId').exists().withMessage('Request must include accountId')
                .isInt({min: 0}).withMessage('accountId must be a positive integer'),
            body('actionValue').exists().withMessage('Request must include actionValue')
                .isInt({min: 0}).withMessage('actionValue must be a positive integer')
        ],
    },
    {
        method: "post",
        route: "/withdraw/:accountId",
        dao: BankDao,
        functionName: "accountTransaction",
        queryName: "accountTransaction",
        action: 'withdraw',
        validation: [
            param('accountId').exists().withMessage('Request must include accountId')
                .isInt({min: 0}).withMessage('accountId must be a positive integer'),
            body('actionValue').exists().withMessage('Request must include actionValue')
                .isInt({min: 0}).withMessage('actionValue must be a positive integer')
        ],
    },
    {
        method: "post",
        route: "/blockAccount/:accountId",
        dao: BankDao,
        functionName: "blockAccount",
        queryName: "block_account",
        validation: [
            param('accountId').exists().withMessage('Request must include accountId')
                .isInt({min: 0}).withMessage('accountId must be a positive integer'),
        ],
    },
    {
        method: "get",
        route: "/getBalance/:accountId",
        dao: BankDao,
        functionName: "getAccountBalance",
        queryName: "balance",
        validation: [
            param('accountId').exists().withMessage('Request must include accountId')
                .isInt({min: 0}).withMessage('accountId must be a positive integer'),
        ],
    },
    {
        method: "get",
        route: "/getAccountTransactions/:accountId",
        dao: BankDao,
        functionName: "getAccountTransactions",
        queryName: "get_account_transactions",
        validation: [
            param('accountId').exists().withMessage('Request must include accountId')
                .isInt({min: 0}).withMessage('accountId must be a positive integer'),
        ],
    }
];