import express from 'express';
import productService from '../../products/services/products.services';
import TransactionsService from '../services/transactions.services';
import debug from 'debug';

const log: debug.IDebugger = debug('app:transactions-middleware');
class TransactionsMiddleware {
    
    async validateSameProductBelongToSameProduct(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await productService.readById(req.body.product);
        if (user && user._id === req.body.product) {
            next();
        } else {
            res.status(400).send({ error: `Invalid Product` });
        }
    }

    validatePatchProduct = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.owner) {
            log('Validating Product', req.body.Owner);

            this.validateSameProductBelongToSameProduct(req, res, next);
        } else {
            next();
        }
    };

    async validateProductExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const product = await productService.readById(req.body.product);

        if (product) {
            next();
        } else {
            res.status(404).send({
                error: `Product ${req.body.product} not found`,
            });
        }
    }

    async validateTransactionExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const transaction = await TransactionsService.readById(req.params.transactionId);
        if (transaction) {
            next();
        } else {
            res.status(404).send({
                error: `Transaction ${req.params.transaction} not found`,
            });
        }
    }


    async extractTransactionIdId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        console.log("req.body",req.body)
        req.body.id = req.params.transactionId;
        next();
    }
}

export default new TransactionsMiddleware();