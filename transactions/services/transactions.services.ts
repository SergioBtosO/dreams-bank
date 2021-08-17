import TransactionsDao from '../daos/transactions.dao';
import { ICRUD } from '../../common/interfaces/crud.interface';
import { ICreateTransactionDto } from '../dto/create.transaction.dto';
import { IPatchTransactionDto } from '../dto/patch.transaction.dto';
import { IPutTransactionDto } from '../dto/put.transaction.dto';
import {debug} from 'debug';

const log: debug.IDebugger = debug('app:products-service');

class TransactionsService implements ICRUD {
    async create(resource: ICreateTransactionDto) {
        return TransactionsDao.addTransaction(resource);
    }

    async deleteById(id: string) {
        return TransactionsDao.removeTransactionById(id);
    }

    async list(limit: number, page: number) {
        return TransactionsDao.getTransactions(limit, page)
    }

    async patchById(id: string, resource: IPatchTransactionDto) {
        return TransactionsDao.updateTransactionById(id, resource);
    }

    async readById(id: string) {
        return TransactionsDao.getTransactionById(id);
    }

    async putById(id: string, resource: IPutTransactionDto) {
        return TransactionsDao.updateTransactionById(id, resource);
    }

}

export default new TransactionsService();