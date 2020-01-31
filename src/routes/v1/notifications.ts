import { BaseRoute } from '../../system/baseRoute';
import { notificationRead } from './../../controllers/notifications';

export class NotificationRoute extends BaseRoute {
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.post('/mark-as-read', notificationRead, true);
    }
}
