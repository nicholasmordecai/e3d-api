import { AuthResponse } from './responses/authResponse';
import { GeneralResponse } from './responses/generalResponse';
import { ObjectResponse } from './responses/objectResponses';
import { LikeResponse } from './responses/likeResponses';
import { NotiicationResponse } from './responses/notifications';
import { SearchResponse } from './responses/searchResponse';
import { UserResponse } from './responses/userResponse';
import { FavouriteResponse } from './responses/favouritesResponse';
import { CollectionResponse } from './responses/collectionsResponse';
import { CategoryResponse } from './responses/categoryResponse';

/**
 * Auth - 1000:1499
 * Object - 1500:1999
 * Likes - 2000:2499
 * Notifications - 2500:2999
 * Search - 3000:3499
 * User - 3500:3999
 * Favourites - 4000:4499
 * Collection - 4500:4999
 * Category - 5000:5499
 */

export const Respond = {
    success: GeneralResponse.success,
    notFound: GeneralResponse.notFound,
    Auth: AuthResponse,
    Object: ObjectResponse,
    Like: LikeResponse,
    Notification: NotiicationResponse,
    Search: SearchResponse,
    User: UserResponse,
    Favourite: FavouriteResponse,
    Collection: CollectionResponse,
    Category: CategoryResponse,
};
