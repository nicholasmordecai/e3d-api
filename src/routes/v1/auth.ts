import { BaseRoute } from '../../system/baseRoute';
import { Login } from './../../controllers/auth';

export class AuthRoute extends BaseRoute {
    
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.GET('/login', Login);
        this.POST('/login', Login);
    }
}