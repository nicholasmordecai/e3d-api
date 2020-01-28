import * as Express from 'express';
import { BadRequest, NotFound, Success, InternalServerError } from '../utils/respond';
import { Favourites } from './../models/favourites';

export async function favouriteObject(request: Express.Request, response: Express.Response): Promise<void> {
    
}