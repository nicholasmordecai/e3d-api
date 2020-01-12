import * as Express from 'express';
import { UserModel } from './../models/users';
import { TokenModel, TokenTypes } from './../models/tokens';
import { BadRequest, Unauthorized, Success, InternalServerError } from './../utils/respond';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Config } from './../utils/config';
import { v4 } from 'uuid';

/**
 * Login
 * 
 * @description when a user logs in via the website, the data is to the backend, and this function is called to process the login
 */
export async function login(request: Express.Request, response: Express.Response) {
    const email = request.body.email;
    const password = request.body.password;

    // check if the correct parameters have been send
    if(!email || !password || typeof(email) !== "string" || typeof(password) !== "string") {
        // respond with server error that incorrect email & password types
        Unauthorized(response, {error: 'No email or password was passed'});
        return;
    }

    try {
        const user = await UserModel.findOneByEmail(email);

        if(!user) {
            // respond with server error as no account has been found
            Unauthorized(response, {error: 'No user account matched with that username and password'});
            return;
        }
    
        // assuming then, that 1 and only 1 account was returned, compare the two passwords and if it's a match, then generate a token.
        compare(password, user.password, async (error, match) => {
            if(match) {
                // generate a token to be stored in the database
                const token = v4();
                const existingToken = await TokenModel.findOneByID(user.id, TokenTypes.refreshToken);

                let successful: boolean = null;
                if(existingToken == null) {
                    const inserted = await TokenModel.insertOne(TokenTypes.refreshToken, user.id, token);
                    if(inserted == null) {
                        successful = false;
                    } else {
                        successful = true;
                    }
                } else {
                    const updated = await TokenModel.updateTokenValue(user.id, token, TokenTypes.refreshToken);
                    if(updated == null) {
                        successful = false;
                    } else {
                        successful = true;
                    }
                }
                
                if(successful){
                    Success(response, {success: true, refreshToken: token});
                } else {
                    InternalServerError(response, {error: 'Error while generating refresh token'});
                }
            } else {
                // respond with login error - make this the same error as above so it is indistinguishable between a wrong email and a wrong password
                Unauthorized(response, {error: 'No user account matched with that username and password'});
            }
        });
    } catch (dbError) {
        InternalServerError(response, dbError);
        throw dbError;
    }
}

export async function createAccount(request: Express.Request, response: Express.Response) {
    const email = request.body.email;
    const password = request.body.password;
    const firstname = request.body.firstname;
    const lastname = request.body.lastname;

    if(!email || !password) {
        BadRequest(response, {success: false, reason: 'No email or password was provided'});
    }

    try {
        const existingUser = await UserModel.findOneByEmail(email);

        if(existingUser != null) {
            BadRequest(response, {success: false, reason: 'Email address already registered'});
            return;
        }

        const hashedPassword = hash(password, 10, async (error, hash) => {
            if(error) {
                InternalServerError(response, {success: false, reason: 'Error when trying to hash the password'});
                return;
            }
            const newAccount = await UserModel.insertOne(email, hash, firstname, lastname);

            if(newAccount) {
                Success(response, {success: true});
            } else {
                InternalServerError(response, {success: false, error: newAccount});
            }
        });
    } catch (error) {
        InternalServerError(response, {success: false, reason: 'Error when trying to create an account', error: error});
    }
}

export async function getAccessToken(request: Express.Request, response: Express.Response) {
    const refreshToken = request.body.refreshToken;

    if(!refreshToken) {
        BadRequest(response, {success: false, reason: 'No refresh token passed'});
        return;
    }

    const user = await UserModel.findOneByRefreshToken(refreshToken);
    if(user) {
        const token = generateAccessToken(user.id, user.email);
        Success(response, {success: true, accessToken: token});
    } else {
        Unauthorized(response, {success: false, reason: 'Refresh token could not be found'});
    }
}

export function generateAccessToken(id: number, email: string) {
    // TODO add the iss as part of the config

    let data = {
        cid: id,
        sub: email,
        iss: 'e3d',
    }
    let token:string = null;
    try {
        token = sign(data, Config.options.accessTokenSecret, {
            expiresIn: '30m'
        });
    } catch(err) {
        throw err;
    }
    return token;
}