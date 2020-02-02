import * as Express from 'express';
import { Objects, IObject } from '../models/objects';
import { Favourites } from './../models/favourites';
import { Respond } from '../utils/respond';

export async function objectFavourited(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);
}
