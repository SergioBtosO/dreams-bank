import ProductsDao from '../daos/products.dao';
import { ICRUD } from '../../common/interfaces/crud.interface';
import { ICreateProductDto } from '../dto/create.product.dto';
import { IPatchProductDto } from '../dto/patch.product.dto';
import { IPutProductDto } from '../dto/put.product.dto';
import {debug} from 'debug';

const log: debug.IDebugger = debug('app:products-service');

class ProductsService implements ICRUD {
    async create(resource: ICreateProductDto) {
        return ProductsDao.addProduct(resource);
    }

    async deleteById(id: string) {
        return ProductsDao.removeProductById(id);
    }

    async list(limit: number, page: number) {
        return ProductsDao.getProducts(limit, page)
    }

    async patchById(id: string, resource: IPatchProductDto) {
        return ProductsDao.updateProductById(id, resource);
    }

    async readById(id: string) {
        return ProductsDao.getProductById(id);
    }

    async putById(id: string, resource: IPutProductDto) {
        return ProductsDao.updateProductById(id, resource);
    }

}

export default new ProductsService();