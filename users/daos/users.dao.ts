import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug('app:in-memory-dao');

class UsersDao {
    
    Schema = mongooseService.getMongoose().Schema;

    userSchema = new this.Schema({
        _id: String,
        identification: String,
        password: { type: String, select: false },
        firstName: String,
        lastName: String,
        permissionFlags: Number,
    }, { id: false });

    User = mongooseService.getMongoose().model('Users', this.userSchema);

    constructor() {
        log('Created new instance of UsersDao');
    }

    //create
    async addUser(userFields: CreateUserDto) {
        const userId = shortid.generate();
        const user = new this.User({
            _id: userId,
            ...userFields,
        });
        await user.save();
        return userId;
    }

    //read
    async getUsers(limit = 25, page = 0) {
        return this.User.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }
    
    async getUserById(userId: string) {
        return this.User.findOne({ _id: userId }).populate('User').exec();
    }
    
    async getUserByIdentification(identification: string) {
        return this.User.findOne({ identification }).exec();
    }
    
    
    async getUserByIdentificationWithPassword(identification: string) {
        return this.User.findOne({ identification })
            .select('_id identification +password')
            .exec();
    }

    //update
    async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingUser = await this.User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        ).exec();
    
        return existingUser;
    }

    //delete
    async removeUserById(userId: string) {
        return this.User.deleteOne({ _id: userId }).exec();
    }

}


export default new UsersDao();