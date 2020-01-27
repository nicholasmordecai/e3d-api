import { BaseRoute } from '../../system/baseRoute';
import { createNewObject, getObjectByIDForWebView} from './../../controllers/objects';
import { searchByKeyword } from './../../controllers/search';
import { objectLiked, getAllObjectLikes, totalCountOfLikesByObjectId } from './../../controllers/likes';

export class ObjectRoute extends BaseRoute {
    
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.GET('/:id', getObjectByIDForWebView);
        this.POST('/create', createNewObject);
        this.POST('/search', searchByKeyword);
        this.GET('/:id/likes', getAllObjectLikes);
        this.GET('/:id/like-count', totalCountOfLikesByObjectId);

        // restricted routes
        this.POST('/:id/liked', objectLiked, true);
    }
}