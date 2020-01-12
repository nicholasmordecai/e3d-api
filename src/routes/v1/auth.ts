import { BaseRoute } from '../../system/baseRoute';
import { login, getAccessToken, createAccount } from './../../controllers/auth';

export class AuthRoute extends BaseRoute {
    
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.POST('/login', login);
        this.POST('/get-access-token', getAccessToken);
        this.POST('/register', createAccount);
    }
}