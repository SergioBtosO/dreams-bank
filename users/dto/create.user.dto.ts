export interface ICreateUserDto {
    identification:number;
    password: string;
    firstName?: string;
    lastName?: string;
    products?: string[];
}