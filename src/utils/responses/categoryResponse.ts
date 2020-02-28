import { Response } from 'express';
import { internalServerError } from '../apiResponds';

export class CategoryResponse {
    // Unauthorized 5000:5099

    // Bad Request 5100:5199

    // Internal Server Errors 5200:5299
    public static errorSearchingForCategories(response: Response, data?: any, error?: any, debug?: any) : void {
        internalServerError(response, 5200, 'Database error when searching for categories', data, error, debug);
    }
}

