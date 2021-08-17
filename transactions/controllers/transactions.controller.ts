import express from 'express';
import ProductsService from '../../products/services/products.services';
import TransactionService from '../services/transactions.services';
import debug from 'debug';

const log: debug.IDebugger = debug('app:transactions-controller');
class TransactionsController {
    async list(req: express.Request, res: express.Response) {
        const transactions = await TransactionService.list(100, 0);
        res.status(200).send(transactions);
    }

    async getById(req: express.Request, res: express.Response) {
        const transaction = await TransactionService.readById(req.body.id);
        res.status(200).send(transaction);
    }

    async create(req: express.Request, res: express.Response) {
        const TransactionId = await TransactionService.create(req.body);
        const updateProduct = await ProductsService.readById(req.body.product);
        console.log("antes",updateProduct)
        updateProduct.transactions.push(TransactionId);
        updateProduct.balance = updateProduct.balance + Number(req.body.amount);
        await ProductsService.putById(req.body.product,updateProduct);
        res.status(201).send({ id: TransactionId});
    }

    async patch(req: express.Request, res: express.Response) {

        log(await TransactionService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await TransactionService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async remove(req: express.Request, res: express.Response) {
        const transaction = await TransactionService.readById(req.body.id);
        log(await TransactionService.deleteById(req.body.id));
        const updateProduct = await ProductsService.readById(transaction.product);
        updateProduct.transactions = updateProduct.transactions.filter((i:string) => i !== req.body.id);
        updateProduct.balance = updateProduct.balance - Number(req.body.amount);
        await ProductsService.putById(res.locals.jwt.userId, updateProduct);
        res.status(204).send();
    }
}

export default new TransactionsController();