import { AuthResponse } from './responses/authResponse';
import { GeneralResponse } from './responses/generalResponse';
import { ObjectResponse } from './responses/objectResponses';
import { LikeResponse } from './responses/likeResponses';
import { NotiicationResponse } from './responses/notifications';
import { SearchResponse } from './responses/searchResponse';

/**
 * Auth - 1000:1499
 * Object - 1500:1999
 * Likes - 2000:2499
 * Notifications - 2500:2999
 * Search - 3000:3499
 */

export const Respond = {
    success: GeneralResponse.success,
    notFound: GeneralResponse.notFound,
    Auth: AuthResponse,
    Object: ObjectResponse,
    Like: LikeResponse,
    Notification: NotiicationResponse,
    Search: SearchResponse,
};
