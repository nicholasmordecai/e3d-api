import { Response } from 'express';
import { internalServerError, badRequest } from '../apiResponds';

export class FavouriteResponse {
    // Unauthorized 4000 - 4099

    // Bad Request - 4300:4399
    public static alreadyFavourited(response:Response, data?: any, error?: any, debug?: any): void {
        badRequest(response, 4300, 'User has already favourited this object', data, error, debug);
    }

    public static notFavourited(response:Response, data?: any, error?: any, debug?: any): void {
        badRequest(response, 4301, 'User has not favourited this object, cannot remove', data, error, debug);
    }

    // Internal server errors - 4400:4499
    public static errorFindingAllFavouritesFromUserId(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 4400, 'Database error when searching for all favourites by user ID', data, error, debug);
    }

    public static errorWhenFavouritingObject(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 4401, 'Database error when trying to favourite an object', data, error, debug);
    }

    public static errorWhenUnFavouritingObject(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 4402, 'Database error when trying to unfavourite an object', data, error, debug);
    }
}
