import { CommonRoutesConfig } from '../common/common.routes.config';
import ProductsController from './controllers/products.controller';
import ProductsMiddleware from './middleware/products.middleware';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import express from 'express';

export class ProductsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ProductsRoutes');
    }

    configureRoutes() {
        this.app
            .route(`/products`)
            .get(
                jwtMiddleware.validJWTNeeded,
                ProductsController.list
            )
            .post(
                ProductsMiddleware.validateOwnerExists,
                ProductsController.create
            );

        this.app.param(`productId`, ProductsMiddleware.extractProductId);
        this.app
            .route(`/products/:productId`)
            .all(
                jwtMiddleware.validJWTNeeded,
                ProductsMiddleware.validateProductExists
            )
            .get(ProductsController.getById)
            .delete(ProductsController.remove);

        this.app.put(`/products/:productId`, [
            ProductsMiddleware.validateSameOwnerlBelongToSameUser,
            ProductsController.put,
        ]);

        this.app.patch(`/products/:productId`, [
            ProductsMiddleware.validatePatchOwner,
            ProductsController.patch,
        ]);

        return this.app;
    }
}