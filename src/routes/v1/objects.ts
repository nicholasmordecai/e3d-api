import { BaseRoute } from '../../system/baseRoute';
import { createNewObject, getObjectByIDForWebView } from './../../controllers/objects';
import { searchByKeyword } from './../../controllers/search';
import { objectLiked, getAllObjectLikes, totalCountOfLikesByObjectId } from './../../controllers/likes';
import { objectFavourited } from './../../controllers/favourites';

export class ObjectRoute extends BaseRoute {
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.get('/:id', getObjectByIDForWebView);
        this.post('/create', createNewObject);
        this.post('/search', searchByKeyword);
        this.get('/:id/likes', getAllObjectLikes);
        this.get('/:id/like-count', totalCountOfLikesByObjectId);

        // restricted routes
        this.post('/:id/liked', objectLiked, true);
        // remove like

        this.post('/:id/favourite', objectFavourited, true);
        // remove favourite
    }
}
