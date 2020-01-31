import { AuthResponse } from './responses/authResponse';
import { GeneralResponse } from './responses/generalResponse';
import { ObjectResponse } from './responses/objectResponses';

/**
 * Auth - 1000:1499
 * Object - 1500:1999
 * Likes - 2000:2499
 */

export const Respond = {
    Auth: AuthResponse,
    success: GeneralResponse.success,
    notFound: GeneralResponse.notFound,
    Object: ObjectResponse,
};
