import { Response } from 'express';
import { success, notFound } from '../apiResponds';

export class GeneralResponse {
    public static success(response:Response, data?: any, error?: any, debug?: any) {
        success(response, 200, 'Users email and or password does not match', data, error, debug);
    }

    public static notFound(response:Response, data?: any, error?: any, debug?: any) {
        notFound(response, 404, 'Not Found', data, error, debug);
    }
}
