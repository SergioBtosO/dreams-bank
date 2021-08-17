import { ICreateTransactionDto } from '../dto/create.transaction.dto';
import { IPatchTransactionDto } from '../dto/patch.transaction.dto';
import { IPutTransactionDto } from '../dto/put.transaction.dto';
import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';


const log: debug.IDebugger = debug('app:transactions-in-memory-dao');

class TransactionsDao{

    Schema = mongooseService.getMongoose().Schema;

    transactionSchema = new this.Schema({
        _id: String,
        product: {
            ref: "Products",
            type: String
        },
        amount: Number,
        taxes: { type: Number, default: 0 },
        commerce: String,
        status: String,
        transactionDate: { type: Date, default: Date.now },
    }, {
         id: false,
         timestamps: true,
        });

    Transaction = mongooseService.getMongoose().model('Transactions', this.transactionSchema);

    constructor() {
        log('Created new instance of TransactionsDao');
    }

    //create
    async addTransaction(transactionFields: ICreateTransactionDto) {
        const transactionId = shortid.generate();
        const transaction = new this.Transaction({
            _id: transactionId,
            ...transactionFields,
        });
        await transaction.save();
        return transactionId;
    }

    //read
    async getTransactions(limit = 25, page = 0) {
        return this.Transaction.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async getTransactionById(TransactionId: string) {
        return this.Transaction.findOne({ _id: TransactionId}).populate({path:'product',select:'_id typeProduct'}).exec();
    }

    //update
    async updateTransactionById(
        transactionId: string,
        transactionFields: IPatchTransactionDto | IPutTransactionDto
    ) {
        const existingTransaction = await this.Transaction.findOneAndUpdate(
            { _id:transactionId },
            { $set: transactionFields },
            { new: true }
        ).exec();
    
        return existingTransaction;
    }

    //delete
    async removeTransactionById(transactionId: string) {
        return this.Transaction.deleteOne({ _id: transactionId }).exec();
    }

}

export default new TransactionsDao();