import * as Express from 'express';
import { AuthRoute } from './auth';

export class V1Routes {
    public static setup() {
        const router = Express.Router();
        router.use('/auth', new AuthRoute().expressRouter);
        return router;
    }
}