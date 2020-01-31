import { Response } from 'express';
import { internalServerError, badRequest } from '../apiResponds';

export class SearchResponse {
    // Unauthorized - 3000:3099

    // Bad Request - 3300:3399
    public static noKeywordPassed(response:Response, data?: any, error?: any, debug?: any) {
        badRequest(response, 3300, 'No keyword was passed', data, error, debug);
    }

    // Internal Server Error - 3400: 3499
    public static couldNotMarkAsSeen(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 3400, 'Could not mark the notification as seen', data, error, debug);
    }

    public static couldNotRunSearchQuery(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 3401, 'There was a problem running the search query', data, error, debug);
    }
}
