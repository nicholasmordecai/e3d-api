import * as Express from 'express';
import { Users } from './../models/users';
import { Tokens, TokenTypes } from './../models/tokens';
import { badRequest, unauthorized, success, internalServerError } from './../utils/respond';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Config } from './../utils/config';
import { v4 } from 'uuid';

declare global {
    namespace Express {
        interface Request {
            userId?: number;
            userEmail?: string;
        }
    }
}

interface IPayload {
    cid: number;
    sub: string;
    iss: string;
    iat: number;
    exp: number;
}

export async function login(request: Express.Request, response: Express.Response) {
    const email = request.body.email;
    const password = request.body.password;
    const keepMeSignedIn = request.body.keepMeSignedIn;

    // check if the correct parameters have been send
    if (!email || !password || typeof (email) !== 'string' || typeof (password) !== 'string') {
        // respond with server error that incorrect email & password types
        unauthorized(response, { error: 'No email or password was passed' });
        return;
    }

    try {
        const user = await Users.findOneByEmail(email);

        if (!user) {
            // respond with server error as no account has been found
            unauthorized(response, { error: 'No user account matched with that username and password' });
            return;
        }

        // assuming then, that 1 and only 1 account was returned, compare the two passwords and if it's a match, then generate a token.
        compare(password, user.password, async (error, match) => {
            if (match) {
                // generate a token to be stored in the database
                const token = v4();
                const existingToken = await Tokens.findOneByID(user.id, TokenTypes.refreshToken);

                let successful: boolean = null;
                if (existingToken == null) {
                    const inserted = await Tokens.insertOne(TokenTypes.refreshToken, user.id, token);
                    if (inserted == null) {
                        successful = false;
                    } else {
                        successful = true;
                    }
                } else {
                    const updated = await Tokens.updateTokenValue(user.id, token, TokenTypes.refreshToken);
                    if (updated == null) {
                        successful = false;
                    } else {
                        successful = true;
                    }
                }

                if (successful) {
                    if (keepMeSignedIn != null && keepMeSignedIn === true) {
                        success(response, { success: true, refreshToken: token });
                    } else {
                        const accessToken = generateAccessToken(user.id, user.email);
                        success(response, { success: true, accessToken: accessToken });
                    }
                } else {
                    internalServerError(response, { error: 'Error while signing you in' });
                }
            } else {
                // respond with login error - make this the same error as above so it is indistinguishable between a wrong email and a wrong password
                unauthorized(response, { error: 'No user account matched with that username and password' });
            }
        });
    } catch (dbError) {
        internalServerError(response, dbError);
        throw dbError;
    }
}

export async function createAccount(request: Express.Request, response: Express.Response) {
    const email = request.body.email;
    const password = request.body.password;
    const firstname = request.body.firstname;
    const lastname = request.body.lastname;

    if (!email || !password) {
        badRequest(response, { success: false, reason: 'No email or password was provided' });
    }

    try {
        const existingUser = await Users.findOneByEmail(email);

        if (existingUser != null) {
            badRequest(response, { success: false, reason: 'Email address already registered' });
            return;
        }

        hash(password, 10, async (error, hash) => {
            if (error) {
                internalServerError(response, { success: false, reason: 'Error when trying to hash the password' });
                return;
            }
            const newAccount = await Users.insertOne(email, hash, firstname, lastname);

            if (newAccount) {
                success(response, { success: true });
            } else {
                internalServerError(response, { success: false, error: newAccount });
            }
        });
    } catch (error) {
        internalServerError(response, { success: false, reason: 'Error when trying to create an account', error: error });
    }
}

export async function getAccessToken(request: Express.Request, response: Express.Response) {
    const refreshToken = request.body.refreshToken;

    if (!refreshToken) {
        badRequest(response, { success: false, reason: 'No refresh token passed' });
        return;
    }

    const user = await Users.findOneByRefreshToken(refreshToken);
    if (user) {
        const token = generateAccessToken(user.id, user.email);
        success(response, { success: true, accessToken: token });
    } else {
        unauthorized(response, { success: false, reason: 'Refresh token could not be found' });
    }
}

export function decodeAccessToken(token: string): IPayload {
    const payload: IPayload = verify(token, Config.options.accessTokenSecret) as IPayload;
    return payload;
}

export function generateAccessToken(id: number, email: string) {
    // TODO add the iss as part of the config

    const data = {
        cid: id,
        sub: email,
        iss: 'e3d',
    };
    let token: string = null;
    try {
        token = sign(data, Config.options.accessTokenSecret, {
            expiresIn: '30m',
        });
    } catch (err) {
        throw err;
    }
    return token;
}

export function restrictedRoute(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
    const token: string = request.headers.authorization as string;

    if (token === undefined) {
        return unauthorized(response);
    }

    try {
        const payload = decodeAccessToken(token);
        request.userId = payload.cid;
        request.userEmail = payload.sub;
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return unauthorized(response, { reason: 'Access token expired' });
        } else {
            return unauthorized(response, { error: error });
        }
    }
}
