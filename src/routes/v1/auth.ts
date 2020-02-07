import { BaseRoute } from '../../system/baseRoute';
import { login, getAccessToken, createAccount, restrictedPage } from './../../controllers/auth';

export class AuthRoute extends BaseRoute {
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.post('/login', login);
        this.get('/validate', restrictedPage);
        this.post('/get-access-token', getAccessToken);
        this.post('/register', createAccount);
    }
}
