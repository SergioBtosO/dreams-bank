export interface CreateProductDto {
    owner: string;
    typeProduct: string;
    balance?:number;
    openDate?:Date;
    transactions?:string[];
}