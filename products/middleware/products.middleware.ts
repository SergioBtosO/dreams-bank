import express from 'express';
import userService from '../../users/services/users.service';
import productService from '../services/products.services';
import debug from 'debug';

const log: debug.IDebugger = debug('app:products-middleware');
class ProductsMiddleware {
    
    async validateSameOwnerlBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.readById(req.body.Owner);
        if (user && user._id === req.body.Owner) {
            next();
        } else {
            res.status(400).send({ error: `Invalid Owner` });
        }
    }

    validatePatchOwner = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.owner) {
            log('Validating Owner', req.body.Owner);

            this.validateSameOwnerlBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };

    async validateOwnerExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.readById(req.body.owner);
        console.log("user",user)
        if (user) {
            next();
        } else {
            res.status(404).send({
                error: `Owner ${req.body.owner} not found`,
            });
        }
    }

    async validateProductExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await productService.readById(req.params.productId);
        if (user) {
            next();
        } else {
            res.status(404).send({
                error: `Product ${req.params.productId} not found`,
            });
        }
    }


    async extractProductId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        console.log("req.body",req.body)
        req.body.id = req.params.productId;
        next();
    }
}

export default new ProductsMiddleware();