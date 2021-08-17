import express from 'express';
import usersService from '../../users/services/users.service';
import * as argon2 from 'argon2';

class AuthMiddleware {
    async verifyUserPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await usersService.getUserByIdentificationWithPassword(
            req.body.identification
        );

        
        if (user) {
            const passwordHash = user.password;
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user._id,
                    identification: user.identification,
                };

                //console.log(req.body);
                return next();
            }
        }
        res.status(400).send({ errors: ['Invalid identification and/or password'] });
    }
}

export default new AuthMiddleware();