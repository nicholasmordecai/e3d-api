import * as Express from 'express';
import { UserModel } from './../models/users';
import { Unauthorized, Success, InternalServerError } from './../utils/respond';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Config } from './../utils/config';

/**
 * Login
 * 
 * @description when a user logs in via the website, the data is to the backend, and this function is called to process the login
 */
export async function Login(request: Express.Request, response: Express.Response) {
    const email = request.body.email;
    const password = request.body.password;

    // check if the correct parameters have been send
    if(!email || !password || typeof(email) !== "string" || typeof(password) !== "string") {
        // respond with server error that incorrect email & password types
        Unauthorized(response, {error: 'No email or password was passed'});
        return;
    }

    const user = await UserModel.findOneByEmail(email);

    if(!user) {
        // respond with server error as no account has been found
        Unauthorized(response, {error: 'No user account matched with that username and password'});
        return;
    }

    // assuming then, that 1 and only 1 account was returned, compare the two passwords and if it's a match, then generate a token.
    compare(password, user.password, (err, match) => {
        if(match) {
            try {
                const token = generateAccessToken(user.id, user.email);
                // respond with token & login login attempt
                Success(response, {login: true, token: ''});
            } catch(error) {
                InternalServerError(response, {error: 'Error when signing access token'});
            }
        } else {
            // respond with login error - make this the same error as above so it is indistinguishable between a wrong email and a wrong password
            Unauthorized(response, {error: 'No user account matched with that username and password'});
        }
    });
}

export function generateAccessToken(id: number, email: string) {
    // TODO add the iss as part of the config
    // TOOD reduce expires in time
    let data = {
        cid: id,
        sub: email,
        iss: 'e3d',
    }
    let token:string = null;
    try {
        token = sign(data, Config.options.accessTokenSecret, {
            expiresIn: '1d'
        });
    } catch(err) {
        throw err;
    }
    return token;
}

export function generateRefreshToken() {

}