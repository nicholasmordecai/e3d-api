import { Response } from 'express';
import { internalServerError, badRequest } from '../apiResponds';

export class LikeResponse {
    // Bad Request - 2300:2399
    public static noObjectIdPassed(response:Response, data?: any, error?: any, debug?: any) {
        badRequest(response, 2300, 'No refresh token was passed', data, error, debug);
    }

    public static userAlreadyLikedObjecty(response:Response, data?: any, error?: any, debug?: any) {
        badRequest(response, 2301, 'User has already liked the object', data, error, debug);
    }

    // Internal server errors - 2400:2499
    public static errorSearchingForLike(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 2400, 'Database error when searching for a like by ID', data, error, debug);
    }

    public static errorSearchingForAllLikes(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 2401, 'Database error when searching for all likes', data, error, debug);
    }

    public static errorInsertingLikeIntoDatabase(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 2402, 'Database error when inserting the like', data, error, debug);
    }

    public static errorCountingLikes(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 2403, 'Error when trying to count the number of likes on any 1 object', data, error, debug);
    }
}
