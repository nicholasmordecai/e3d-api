import { Router } from 'express';
import { AuthRoute } from './auth';
import { ObjectRoute } from './objects';
import { CollectionsRoute } from './collections';
import { NotificationRoute } from './notifications';
import { UsersRoute } from './users';

export class V1Routes {
    public static setup() {
        // eslint-disable-next-line new-cap
        const router = Router();
        router.use('/auth', new AuthRoute().expressRouter);
        router.use('/object', new ObjectRoute().expressRouter);
        router.use('/collection', new CollectionsRoute().expressRouter);
        router.use('/notification', new NotificationRoute().expressRouter);
        router.use('/user', new UsersRoute().expressRouter);
        return router;
    }
}
