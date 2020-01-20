import { BaseRoute } from '../../system/baseRoute';
import { createNewObject, getObjectByIDForWebView, searchByKeyword} from './../../controllers/objects';
import { objectLiked } from './../../controllers/likes';

export class ObjectRoute extends BaseRoute {
    
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.GET('/:id', getObjectByIDForWebView);
        this.POST('/create', createNewObject);
        this.POST('/search', searchByKeyword);
        this.POST('/:id/liked', objectLiked, true);
    }
}