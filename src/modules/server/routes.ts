import {body, param, ValidationChain} from "express-validator";
import {BankController} from "../controller/bank-controller";

export type Route = {
    method: string,
    route: string,
    controller: BankController,
    functionName: string,
    validation: ValidationChain[],
    queryName: string,
    action?: string
}

export const routes: Route[] = [
    {
        method: "post",
        route: "/createAccount",
        controller: BankController,
        functionName: "createAccount",
        queryName: "createAccount",
        validation: [
            body('personId').isInt({
                min: 0,
                max: 100
            }).withMessage('Request must include personId and it must be a positive integer'),
            body('accountType').isString().withMessage('Request must include accountType')
        ],
    },
    {
        method: "post",
        route: "/deposit/:accountId",
        controller: BankController,
        functionName: "accountTransaction",
        queryName: "accountTransaction",
        action: 'deposit',
        validation: [
            param('accountId').isInt(),
        ],
    },
    {
        method: "post",
        route: "/withdraw/:accountId",
        controller: BankController,
        functionName: "accountTransaction",
        queryName: "accountTransaction",
        action: 'withdraw',
        validation: [
            param('accountId').isInt(),
        ],
    },
    {
        method: "post",
        route: "/blockAccount/:accountId",
        controller: BankController,
        functionName: "blockAccount",
        queryName: "block_account",
        validation: [
            param('accountId').isInt(),
        ],
    },
    {
        method: "get",
        route: "/getBalance/:accountId",
        controller: BankController,
        functionName: "getAccountBalance",
        queryName: "balance",
        validation: [
            param('accountId').isInt(),
        ],
    },
    {
        method: "get",
        route: "/getAccountTransactions/:accountId",
        controller: BankController,
        functionName: "getAccountTransactions",
        queryName: "get_account_transactions",
        validation: [
            param('accountId').isInt(),
        ],
    }
];