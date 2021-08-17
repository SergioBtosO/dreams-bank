export interface ICreateProductDto {
    owner: string;
    typeProduct: string;
    balance?:number;
    openDate?:Date;
    transactions?:string[];
}