import {DbConnector} from "../db/db-connector";
import {QueryHandler} from "./queries/query-handler";
import {Transaction} from "../models/transaction";
import {BankAccountValidator} from "./validator/bank-account-validator";
import {Response} from "express";

type createAccountRequest = { personId: number, accountType: string, queryName: string };
type accountActionsRequest = { accountId: number, queryName: string };
type accountTransactionRequest = accountActionsRequest & { actionValue: number, action: string };

export class BankDao {
    static async createAccount(request: createAccountRequest, response: Response): Promise<void> {
        await BankAccountValidator.validatePerson(request.personId);
        await DbConnector.executeQuery(QueryHandler.createAccount(request.personId, request.accountType), request.queryName);
        response.status(200).send("Account created Successfully!");
    }

    static async accountTransaction(request: accountTransactionRequest, response: Response): Promise<void> {
        await BankAccountValidator.validateAccount(request.accountId);
        request.action === 'withdraw' && await BankAccountValidator.validateAccountLimit(request.accountId, request.actionValue);
        await DbConnector.executeQuery(QueryHandler.accountTransaction(
            request.accountId,
            request.actionValue,
            request.action
        ), request.queryName);
        response.status(200).send(`A ${request.action} to account with id: [${request.accountId}] has been applied with the amount of ${request.actionValue}`);
    }

    static async blockAccount(request: accountActionsRequest, response: Response): Promise<void> {
        await BankAccountValidator.validateAccount(request.accountId);
        await DbConnector.executeQuery(QueryHandler.blockAccount(request.accountId), request.queryName);
        response.status(200).send(`Account with id: [${request.accountId}] has been successfully blocked!`);
    }

    static async getAccountBalance(request: accountActionsRequest, response: Response): Promise<void> {
        await BankAccountValidator.validateAccount(request.accountId);
        const accountBalance: number = await DbConnector.executeQuery<number>(QueryHandler.getAccountBalance(request.accountId), request.queryName);
        response.status(200).send(`The balance of account with id: [${request.accountId}] is [${accountBalance}]`);
    }

    static async getAccountTransactions(request: accountActionsRequest, response: Response): Promise<object> {
        await BankAccountValidator.validateAccount(request.accountId);
        return {"Transactions": await DbConnector.executeQuery<Transaction[]>(QueryHandler.getAccountTransactions(request.accountId))};
    }
}