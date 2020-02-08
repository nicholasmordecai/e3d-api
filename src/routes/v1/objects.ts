import { BaseRoute } from '../../system/baseRoute';
import { createNewObject, getObjectByIDForWebView, updateObjectCategories } from './../../controllers/objects';
import { searchByKeyword } from './../../controllers/search';
import { objectLiked, getAllObjectLikes, totalCountOfLikesByObjectId } from './../../controllers/likes';
import { objectFavourited, unfavouriteObject } from './../../controllers/favourites';

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

        // Likes
        this.post('/:id/liked', objectLiked, true);

        // Favourites
        this.post('/:id/favourite', objectFavourited, true);
        this.delete('/:id/favourite', unfavouriteObject, true);

        // Categories
        this.patch('/update', updateObjectCategories, true);
    }
}
