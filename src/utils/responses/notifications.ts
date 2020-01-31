import { Response } from 'express';
import { internalServerError, badRequest } from '../apiResponds';

export class NotiicationResponse {
    // Unauthorized - 2000:2099

    // Bad Request - 2300:2399
    public static noNotificationIdPassed(response:Response, data?: any, error?: any, debug?: any) {
        badRequest(response, 2300, 'No notification ID was passed', data, error, debug);
    }

    // Internal Server Error - 2400: 2499
    public static couldNotMarkAsSeen(response:Response, data?: any, error?: any, debug?: any): void {
        internalServerError(response, 2400, 'Could not mark the notification as seen', data, error, debug);
    }
}
