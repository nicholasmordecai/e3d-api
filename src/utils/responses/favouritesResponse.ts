import { Response } from 'express';
import { internalServerError } from '../apiResponds';

export class FavouriteResponse {
    // Unauthorized 4000 - 4099

    // Bad Request - 4300:4399

    // Internal server errors - 4400:4499
    public static errorFindingAllFavouritesFromUserId(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 4400, 'Database error when searching for all favourites by user ID', data, error, debug);
    }
}
