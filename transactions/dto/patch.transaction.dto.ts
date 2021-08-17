import { IPutTransactionDto } from './put.transaction.dto';

export interface IPatchTransactionDto extends Partial<IPutTransactionDto> {}