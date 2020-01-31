import { BaseRoute } from '../../system/baseRoute';
import { login, getAccessToken, createAccount } from './../../controllers/auth';

export class AuthRoute extends BaseRoute {
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.post('/login', login);
        this.post('/get-access-token', getAccessToken);
        this.post('/register', createAccount);
    }
}
