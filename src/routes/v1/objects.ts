import { BaseRoute } from '../../system/baseRoute';
import { createNewObject, getObjectByIDForWebView, updateObjectCategories, getHomeFeaturedObjects } from './../../controllers/objects';
import { searchByKeyword } from './../../controllers/search';
import { objectLiked, getAllObjectLikes, totalCountOfLikesByObjectId } from './../../controllers/likes';
import { objectFavourited, unfavouriteObject } from './../../controllers/favourites';

export class ObjectRoute extends BaseRoute {
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        // Featured
        this.get('/featured', getHomeFeaturedObjects);
        this.post('/create', createNewObject);
        this.post('/search', searchByKeyword);

        this.get('/:id', getObjectByIDForWebView);
        this.get('/:id/likes', getAllObjectLikes);
        this.get('/:id/like-count', totalCountOfLikesByObjectId);

        // Categories
        this.patch('/:id/update', updateObjectCategories, true);

        // Favourites
        this.post('/:id/favourite', objectFavourited, true);
        this.delete('/:id/favourite', unfavouriteObject, true);

        // Likes
        this.post('/:id/liked', objectLiked, true);
    }
}
