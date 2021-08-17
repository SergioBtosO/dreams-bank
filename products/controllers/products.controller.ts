import express from 'express';
import usersService from '../../users/services/users.service';
import productsService from '../services/products.services';
import debug from 'debug';

const log: debug.IDebugger = debug('app:productss-controller');
class ProductsController {
    async list(req: express.Request, res: express.Response) {
        const products = await productsService.list(100, 0);
        res.status(200).send(products);
    }

    async getById(req: express.Request, res: express.Response) {
        const product = await productsService.readById(req.body.id);
        res.status(200).send(product);
    }

    async create(req: express.Request, res: express.Response) {
        const ProductId = await productsService.create(req.body);
        const updateUser = await usersService.readById(req.body.owner);
        updateUser.products.push(ProductId);
        await usersService.putById(req.body.owner,updateUser);
        res.status(201).send({ id: ProductId});
    }

    async patch(req: express.Request, res: express.Response) {

        log(await productsService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
       
        log(await usersService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async remove(req: express.Request, res: express.Response) {
        log(await productsService.deleteById(req.body.id));
        const updateUser = await usersService.readById(res.locals.jwt.userId);
        updateUser.products = updateUser.products.filter((i:string) => i !== req.body.id);
        await usersService.putById(res.locals.jwt.userId, updateUser);
        res.status(204).send();
    }
}

export default new ProductsController();