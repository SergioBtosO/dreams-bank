import ProductsDao from '../daos/products.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateProductDto } from '../dto/create.product.dto';
import { PatchProductDto } from '../dto/patch.product.dto';
import { PutProductDto } from '../dto/put.product.dto';

class ProductsService implements CRUD {
    async create(resource: CreateProductDto) {
        return ProductsDao.addProduct(resource);
    }

    async deleteById(id: string) {
        return ProductsDao.removeProductById(id);
    }

    async list(limit: number, page: number) {
        return ProductsDao.getProducts(limit, page)
    }

    async patchById(id: string, resource: PatchProductDto) {
        return ProductsDao.updateProductById(id, resource);
    }

    async readById(id: string) {
        return ProductsDao.getProductById(id);
    }

    async putById(id: string, resource: PutProductDto) {
        return ProductsDao.updateProductById(id, resource);
    }

}

export default new ProductsService();