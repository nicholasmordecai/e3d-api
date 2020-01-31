import { Response } from 'express';
import { success } from './../respond';

export class GeneralResponse {
    public static success(response:Response, data?: any, error?: any, debug?: any) {
        success(response, 200, 'Users email and or password does not match', data, error, debug);
    }
}
