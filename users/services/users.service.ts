import UsersDao from '../daos/users.dao';
import { ICRUD } from '../../common/interfaces/crud.interface';
import { ICreateUserDto } from '../dto/create.user.dto';
import { IPutUserDto } from '../dto/put.user.dto';
import { IPatchUserDto } from '../dto/patch.user.dto';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-service');

class UsersService implements ICRUD {
    async create(resource: ICreateUserDto) {
        return UsersDao.addUser(resource);
    }

    async deleteById(id: string) {
        return UsersDao.removeUserById(id);
    }

    async list(limit: number, page: number) {
        return UsersDao.getUsers(limit, page)
    }

    async patchById(id: string, resource: IPatchUserDto) {
        return UsersDao.updateUserById(id, resource);
    }

    async readById(id: string) {
        return UsersDao.getUserById(id);
    }

    async putById(id: string, resource: IPutUserDto) {
        return UsersDao.updateUserById(id, resource);
    }

    async getUserByIdentification(identification: string) {
        return UsersDao.getUserByIdentification(identification);
    }

    async getUserByIdentificationWithPassword(identification: string) {
        return UsersDao.getUserByIdentificationWithPassword(identification);
    }

}

export default new UsersService();