import * as Express from 'express';
import { Objects, IObject } from '../models/objects';
import { Favourites } from './../models/favourites';
import { Respond } from '../utils/respond';
import { Notification, createNotification } from './notifications';

export async function objectFavourited(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);

    try {
    // check the object exists
        const object:IObject = await Objects.findOneById(objectId);
        if (object == null) {
            return Respond.notFound(response);
        }

        // check if the user has already favourited the object
        const exists: boolean = await Favourites.alreadyExists(objectId, request.userId);
        if (exists === true) {
            return Respond.Favourite.alreadyFavourited(response);
        }

        const favourited = await Favourites.insert(object.id, request.userId);
        if (favourited === true) {
            recalculateFavourites(object.id);
            createNotification(request.userId, object.user_id, object.id, Notification.objectFavourited);
            return Respond.success(response, { success: true });
        } else {
            return Respond.Favourite.errorWhenFavouritingObject(response);
        }
    } catch (error) {
        return Respond.Favourite.errorWhenFavouritingObject(response, null, error);
    }
}

export async function unfavouriteObject(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);

    try {
    // check the object exists
        const object:IObject = await Objects.findOneById(objectId);
        if (object == null) {
            Respond.notFound(response);
        }

        // check if the user has favourited the object, if not then they can't remove
        const exists: boolean = await Favourites.alreadyExists(objectId, request.userId);
        if (exists === false) {
            return Respond.Favourite.notFavourited(response);
        }

        const removed = await Favourites.remove(object.id, request.userId);
        if (removed === true) {
            recalculateFavourites(object.id);
            return Respond.success(response, { success: true });
        } else {
            return Respond.Favourite.errorWhenUnFavouritingObject(response);
        }
    } catch (error) {
        return Respond.Favourite.errorWhenUnFavouritingObject(response, null, error);
    }
}

export async function recalculateFavourites(objectId: number) {
    const favouriteCount = await Favourites.countfavourites(objectId);
    if (favouriteCount == null) {
        return;
    }

    Objects.updateObjectFavouriteCounter(objectId, favouriteCount);
}
