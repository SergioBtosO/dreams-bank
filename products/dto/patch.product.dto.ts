import { IPutProductDto } from './put.product.dto';

export interface IPatchProductDto extends Partial<IPutProductDto> {}