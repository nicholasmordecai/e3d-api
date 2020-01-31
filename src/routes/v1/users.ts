import { BaseRoute } from '../../system/baseRoute';
import { getUserProfile, getCompleteUserProfile } from './../../controllers/users';

export class UsersRoute extends BaseRoute {
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.get('/get-profile', getUserProfile, true);
        this.get('/get-complete-profile', getCompleteUserProfile, true);
    }
}
