import * as Express from 'express';
import { Users } from './../models/users';
import { Tokens, TokenTypes } from './../models/tokens';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Config } from './../utils/config';
import { Respond } from '../utils/respond';
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
        return Respond.Auth.noPasswordOrEmailPassed(response);
    }

    try {
        const user = await Users.findOneByEmail(email);

        if (!user) {
            return Respond.Auth.passwordsDoNotMatch(response);
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
                        return Respond.success(response, { success: true, refreshToken: token });
                    } else {
                        const accessToken = generateAccessToken(user.id, user.email);
                        return Respond.success(response, { success: true, accessToken: accessToken });
                    }
                } else {
                    return Respond.Auth.couldNotSignIn(response);
                }
            } else {
                // respond with login error - make this the same error as above so it is indistinguishable between a wrong email and a wrong password
                return Respond.Auth.passwordsDoNotMatch(response);
            }
        });
    } catch (dbError) {
        return Respond.Auth.couldNotSignIn(response, dbError);
    }
}

export async function createAccount(request: Express.Request, response: Express.Response) {
    const email = request.body.email;
    const password = request.body.password;
    const firstname = request.body.firstname;
    const lastname = request.body.lastname;

    if (!email || !password) {
        return Respond.Auth.noPasswordOrEmailPassed(response);
    }

    try {
        const existingUser = await Users.findOneByEmail(email);

        if (existingUser != null) {
            return Respond.Auth.userAlreadyExists(response);
        }

        hash(password, 10, async (error, hash) => {
            if (error) {
                Respond.Auth.couldNotHasPassword(response, null, error);
                return;
            }
            try {
                const newAccount = await Users.insertOne(email, hash, firstname, lastname);

                if (newAccount) {
                    Respond.success(response, { success: true });
                } else {
                    Respond.Auth.couldNotInsertNewUser(response, null, newAccount, newAccount);
                }
            } catch (error) {
                Respond.Auth.couldNotInsertNewUser(response, null, error, null);
            }
        });
    } catch (error) {
        return Respond.Auth.couldNotCreateAccount(response, null, error, { email: email });
    }
}

export async function getAccessToken(request: Express.Request, response: Express.Response) {
    const refreshToken = request.body.refreshToken;

    if (!refreshToken) {
        return Respond.Auth.noRefreshTokenPassed(response);
    }

    const user = await Users.findOneByRefreshToken(refreshToken);
    if (user) {
        const token = generateAccessToken(user.id, user.email);
        return Respond.success(response, { success: true, accessToken: token });
    } else {
        return Respond.Auth.refreshTokenInvalid(response, null, null, { refreshToken: refreshToken });
    }
}

export function decodeAccessToken(token: string): IPayload {
    const payload: IPayload = verify(token, Config.options.accessTokenSecret) as IPayload;
    return payload;
}

export function generateAccessToken(id: number, email: string): string {
    // TODO add the iss as part of the config

    const data = {
        cid: id,
        sub: email,
        iss: 'e3d',
    };
    let token: string = null;
    try {
        token = sign(data, Config.options.accessTokenSecret, {
            expiresIn: '24h',
        });
    } catch (err) {
        throw err;
    }
    return token;
}

export function restrictedRoute(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
    const token: string = request.headers.authorization as string;

    if (token == null) {
        return Respond.Auth.noAccessTokenPassed(response);
    }

    try {
        const payload = decodeAccessToken(token);
        request.userId = payload.cid;
        request.userEmail = payload.sub;
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return Respond.Auth.accessTokenExpired(response, null, null, { accessToken: token });
        } else {
            return Respond.Auth.accessTokenExpired(response, null, error, { accessToken: token });
        }
    }
}
