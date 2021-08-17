import { IPutUserDto } from './put.user.dto';

export interface IPatchUserDto extends Partial<IPutUserDto> {}