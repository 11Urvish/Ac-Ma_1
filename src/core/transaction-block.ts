import * as crypto from 'crypto-js';

export class TransactionBlock {

    transaction_id: string;
    customer_id: string;
    loan_id: string;
    amount: number;
    interest_amount: number;
    principal_amount: number;
    balance: number;
    transaction_type: number;
    is_interest_paid: boolean;
    preceding_hash: string;
    hash: string;
    timestamp: string;
    payment_date: Date;
    description: string;

    constructor(
        transaction_id: string,
        customer_id: string,
        loan_id: string,
        amount: number,
        interest_amount: number,
        principal_amount: number,
        balance: number,
        transaction_type: number,
        is_interest_paid: boolean,
        preceding_hash: string,
        payment_date: Date,
        description: string
    ) {
        this.transaction_id = transaction_id;
        this.customer_id = customer_id;
        this.loan_id = loan_id;
        this.amount = amount;
        this.interest_amount = interest_amount;
        this.principal_amount = principal_amount;
        this.balance = balance;
        this.transaction_type = transaction_type;
        this.is_interest_paid = is_interest_paid;
        this.preceding_hash = preceding_hash;
        this.hash = this.computeHash();
        this.payment_date = payment_date;
        this.description = description
    }

    computeHash() {
        return crypto.SHA256(this.transaction_id + this.customer_id + this.loan_id + this.amount + this.balance + this.transaction_type + this.preceding_hash).toString();
    }
}