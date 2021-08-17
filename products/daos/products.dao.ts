import { ICreateProductDto } from '../dto/create.product.dto';
import { IPatchProductDto } from '../dto/patch.product.dto';
import { IPutProductDto } from '../dto/put.product.dto';
import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';


const log: debug.IDebugger = debug('app:products-in-memory-dao');

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
    async addProduct(productFields: ICreateProductDto) {
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
        return this.Product.findOne({ _id: ProductId}).populate({path:'owner',select:'_id identification'}).exec();
    }

    //update
    async updateProductById(
        productId: string,
        productFields: IPatchProductDto | IPutProductDto
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