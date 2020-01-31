import { Response } from 'express';
import { internalServerError, badRequest } from '../apiResponds';

export class ObjectResponse {
    // Bad Request - 1800:1899
    public static noObjectIdPassed(response:Response, data?: any, error?: any, debug?: any) {
        badRequest(response, 1800, 'No refresh token was passed', data, error, debug);
    }

    // Internal server errors - 1900:1999
    public static errorSearchingForObject(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 1900, 'Database error when searching for an object by ID', data, error, debug);
    }

    // Internal server errors - 1900:1999
    public static errorFindingAllObjectsFromUserId(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 1901, 'Database error when searching for all objects from the user ID', data, error, debug);
    }
}
