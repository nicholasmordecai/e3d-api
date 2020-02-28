import { BaseRoute } from '../../system/baseRoute';
import { getAllCategories } from './../../controllers/categories';

export class CategoriesRoute extends BaseRoute {
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.get('/get-categories', getAllCategories);
    }
}
