import { Response } from 'express';
import { unauthorized, internalServerError, badRequest } from './../respond';


/**
 * Auth error responses range  1000 to 1999
 */
export class AuthResponse {
    // Auth unauthorized 1000 - 1099
    public static passwordsDoNotMatch(response:Response, data?: any, error?: any, debug?: any) {
        unauthorized(response, 1001, 'Users email and or password does not match', data, error, debug);
    }

    public static noPasswordOrEmailPassed(response:Response, data?: any, error?: any, debug?: any) {
        unauthorized(response, 1002, 'Users email and or password does not match', data, error, debug);
    }

    public static refreshTokenInvalid(response:Response, data?: any, error?: any, debug?: any) {
        unauthorized(response, 1003, 'The refresh token passed is invalid', data, error, debug);
    }

    public static accessTokenExpired(response:Response, data?: any, error?: any, debug?: any) {
        unauthorized(response, 1004, 'The access token has expired', data, error, debug);
    }

    public static accessTokenInvalid(response:Response, data?: any, error?: any, debug?: any) {
        unauthorized(response, 1005, 'The access token passed is invalid', data, error, debug);
    }


    // Auth bad requests 1300 - 1399
    public static userAlreadyExists(response:Response, data?: any, error?: any, debug?: any) {
        badRequest(response, 1300, 'Email address already exists', data, error, debug);
    }

    public static noRefreshTokenPassed(response:Response, data?: any, error?: any, debug?: any) {
        badRequest(response, 1301, 'No refresh token was passed', data, error, debug);
    }

    public static noAccessTokenPassed(response:Response, data?: any, error?: any, debug?: any) {
        badRequest(response, 1302, 'No access token was present in the header', data, error, debug);
    }


    // Auth interneral server errors 1500 - 1599
    public static couldNotSignIn(response:Response, data?: any, error?: any, debug?: any) {
        internalServerError(response, 1500, 'Unknown error when trying to sign in', data, error, debug);
    }

    public static couldNotHasPassword(response:Response, data?: any, error?: any, debug?: any) {
        internalServerError(response, 1501, 'Error when hashing password', data, error, debug);
    }

    public static couldNotInsertNewUser(response:Response, data?: any, error?: any, debug?: any) {
        internalServerError(response, 1502, 'Error inserting new user into the database', data, error, debug);
    }

    public static couldNotCreateAccount(response:Response, data?: any, error?: any, debug?: any) {
        internalServerError(response, 1503, 'Error creating account', data, error, debug);
    }
}
