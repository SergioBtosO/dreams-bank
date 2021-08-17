import { CreateProductDto } from '../dto/create.product.dto';
import { PatchProductDto } from '../dto/patch.product.dto';
import { PutProductDto } from '../dto/put.product.dto';
import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';


const log: debug.IDebugger = debug('app:in-memory-dao');

class ProductsDao{

    Schema = mongooseService.getMongoose().Schema;

    productSchema = new this.Schema({
        _id: String,
        typeProduct: String,
        balance: { type: Number, default: 0},
        owner:{
            ref: "Users",
            type: String
        },
        trasactions:[{
            transactionId:String
        }],
        openDate: { type: Date, default: Date.now },
    }, { id: false });

    Product = mongooseService.getMongoose().model('Products', this.productSchema);

    constructor() {
        log('Created new instance of ProductsDao');
    }

    //create
    async addProduct(productFields: CreateProductDto) {
        const productId = shortid.generate();
        const product = new this.Product({
            _id: productId,
            ...productFields,
        });
        await product.save();
        return productId;
    }

    //read
    async getProducts(limit = 25, page = 0) {
        return this.Product.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async getProductById(ProductId: string) {
        return this.Product.findOne({ _id: ProductId}).populate('owner').exec();
    }

    //update
    async updateProductById(
        productId: string,
        productFields: PatchProductDto | PutProductDto
    ) {
        const existingProduct = await this.Product.findOneAndUpdate(
            { _id: productId },
            { $set: productFields },
            { new: true }
        ).exec();
    
        return existingProduct;
    }

    //delete
    async removeProductById(productId: string) {
        return this.Product.deleteOne({ _id: productId }).exec();
    }

}

export default new ProductsDao();