import * as Express from 'express';
import { AuthRoute } from './auth';
import { ObjectRoute } from './objects';
import { CollectionsRoute } from './collections';

export class V1Routes {
    public static setup() {
        const router = Express.Router();
        router.use('/auth', new AuthRoute().expressRouter);
        router.use('/object', new ObjectRoute().expressRouter);
        router.use('/collection', new CollectionsRoute().expressRouter);
        return router;
    }
}

