export interface IPutProductDto {
    owner: string;
    typeProduct: string;
    balance:number;
    openDate:Date;
    transactions: string[];
}