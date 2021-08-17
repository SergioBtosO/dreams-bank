export interface PutProductDto {
    owner: string;
    typeProduct: string;
    balance:number;
    openDate:Date;
    transactions: string[];
}