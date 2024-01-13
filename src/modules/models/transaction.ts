export interface Transaction {
    transaction_id: string;
    transaction_type: string;
    account_id: number;
    value: number;
    transaction_date: Date;
}