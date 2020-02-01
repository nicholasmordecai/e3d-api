import { Response } from 'express';
import { internalServerError, badRequest, unauthorized } from '../apiResponds';

export class UserResponse {
    // Unauthorized 3500 - 3599
    public static noUserIdFromJWTToken(response:Response, data?: any, error?: any, debug?: any) {
        unauthorized(response, 3000, 'No user was present in the request - likely a JWT error', data, error, debug);
    }

    // Bad Request - 3800:3899
    public static noUserIdPassed(response:Response, data?: any, error?: any, debug?: any) {
        badRequest(response, 3800, 'No user ID was passed', data, error, debug);
    }


    // Internal server errors - 3900:3999
    public static errorSearchingForUser(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 3900, 'Database error when searching for an user by ID', data, error, debug);
    }

    public static errorSearchingForCollections(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 3901, 'Database error when searching for public collections by user ID', data, error, debug);
    }
}
