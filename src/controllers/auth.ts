import * as Express from 'express';

export function Login(request: Express.Request, response: Express.Response) {
    response.status(200).json('ok');
}