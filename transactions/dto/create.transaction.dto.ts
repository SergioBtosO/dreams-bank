export interface ICreateTransactionDto {
    amount: number;
    commerce: string;
    status: string;
    product: string;
    taxes?:number;
    transactionDate?:Date;
}