import * as Express from 'express';
import { Objects, IObject } from '../models/objects';
import { Likes } from './../models/likes';
import { Notification, createNotification } from './notifications';
import { Respond } from '../utils/respond';

export async function objectLiked(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);

    if (objectId == null) {
        return Respond.Like.noObjectIdPassed(response);
    }

    let object: IObject;

    try {
        object = await Objects.findOneByID(objectId);
    } catch (error) {
        return Respond.Object.errorSearchingForObject(response, null, error, objectId);
    }

    if (!object == null) {
        return Respond.notFound(response, null, { objectId: objectId });
    }

    const exists = await Likes.alreadyExists(objectId, request.userId);

    if (exists) {
        return Respond.Like.userAlreadyLikedObjecty(response, null, null, objectId);
    }

    try {
        await Likes.insert(objectId, request.userId);
    } catch (error) {
        return Respond.Like.errorInsertingLikeIntoDatabase(response, null, error, { userId: request.userId, object: object });
    }

    // update the local like counter on the object table
    recalculateObjectsLikeCount(objectId);

    // create a user notification for this

    if (object != null) {
        createNotification(request.userId, object.user_id, objectId, Notification.objectLiked);
    }

    return Respond.success(response, { success: true });
}

export async function recalculateObjectsLikeCount(id: number): Promise<void> {
    const object = await Objects.findOneByID(id);
    if (!object) {
        return;
    }

    const likes = await Likes.countLikes(id);
    if (!likes) {
        return;
    }

    Objects.updateObjectLikeCounter(id, likes);
}

export async function getAllObjectLikes(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);

    if (!objectId) {
        return Respond.Object.noObjectIdPassed(response);
    }

    // TODO check if the object exists, if not - return 404

    try {
        const likes = await Likes.findAllByObjectId(objectId);
        return Respond.success(response, likes);
    } catch (error) {
        return Respond.Like.errorSearchingForAllLikes(response, null, error, objectId);
    }
}

export async function totalCountOfLikesByObjectId(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);

    if (!objectId) {
        return Respond.Like.noObjectIdPassed(response);
    }

    // TODO check if the object exists, if not - return 404

    try {
        const likes = await Likes.countLikes(objectId);
        return Respond.success(response, likes);
    } catch (error) {
        return Respond.Like.errorCountingLikes(response, null, error, { objectId: objectId });
    }
}
