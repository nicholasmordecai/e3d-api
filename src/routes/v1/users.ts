import { BaseRoute } from '../../system/baseRoute';
import { getUserProfile, getCompleteUserProfile } from './../../controllers/users';

export class UsersRoute extends BaseRoute {

    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.GET('/get-profile', getUserProfile, true);
        this.GET('/get-complete-profile', getCompleteUserProfile, true)
    }
}