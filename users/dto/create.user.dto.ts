export interface CreateUserDto {
    identification:number;
    password: string;
    firstName?: string;
    lastName?: string;
}