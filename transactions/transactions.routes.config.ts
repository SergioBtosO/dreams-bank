import { CommonRoutesConfig } from '../common/common.routes.config';
import TransactionsController from './controllers/transactions.controller';
import TransactionsMiddleware from './middleware/transactions.middleware';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

export class TransactionsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'TransactionsRoutes');
    }

    configureRoutes() {
        this.app
            .route(`/transactions`)
            .get(
                jwtMiddleware.validJWTNeeded,
                TransactionsController.list
            )
            .post(
                body('amount')
                .isNumeric()
                .withMessage('Amount isnt Numeric'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                TransactionsMiddleware.validateProductExists,
                TransactionsController.create
            );

        this.app.param(`transactionId`, TransactionsMiddleware.extractTransactionIdId);
        this.app
            .route(`/transactions/:transactionId`)
            .all(
                jwtMiddleware.validJWTNeeded,
                TransactionsMiddleware.validateProductExists
            )
            .get(TransactionsController.getById)
            .delete(TransactionsController.remove);

        this.app.put(`/transactions/:transactionId`, [
            TransactionsMiddleware.validateSameProductBelongToSameProduct,
            TransactionsController.put,
        ]);

        this.app.patch(`/transactions/:transactionId`, [
            TransactionsMiddleware.validatePatchProduct,
            TransactionsController.patch,
        ]);

        return this.app;
    }
}