import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');
class UsersMiddleware {
    async validateRequiredUserBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const log: debug.IDebugger = debug('app:'+req);
        if (req.body && req.body.identification && req.body.password) {
            next();
        } else {
            res.status(400).send({
                error: `Missing required fields identification and password`,
            });
        }
    }

    async validateSameIdentificationDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByIdentification(req.body.identification);
        if (user) {
            res.status(400).send({ error: `Identificacion already exists` });
        } else {
            next();
        }
    }

    async validateSameIdentificationlBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByIdentification(req.body.Identificacion);
        if (user && user._id === req.params.userId) {
            next();
        } else {
            res.status(400).send({ error: `Invalid Identificacion` });
        }
    }

    validatePatchIdentification = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.identification) {
            log('Validating identification', req.body.identification);

            this.validateSameIdentificationlBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.readById(req.params.userId);
        if (user) {
            next();
        } else {
            res.status(404).send({
                error: `User ${req.params.userId} not found`,
            });
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }
}

export default new UsersMiddleware();