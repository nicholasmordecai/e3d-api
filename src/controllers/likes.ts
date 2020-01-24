import * as Express from 'express';
import { Objects } from '../models/objects';
import { Likes } from './../models/likes';
import { BadRequest, Success, InternalServerError } from '../utils/respond';
import { Notification, createNotification } from './notifications';

export async function objectLiked(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);
    const exists = await Likes.alreadyExists(objectId, request.userId);

    if(exists) {
        return BadRequest(response, {reason: 'User has already liked this object'});
    }

    const result = await Likes.insert(objectId, request.userId);

    // update the local like counter on the object table
    recalculateObjectsLikeCount(objectId);

    // create a user notification for this
    const object = await Objects.findOneByID(objectId);
    if(object != null) {
        createNotification(request.userId, object.user_id, objectId, Notification.objectLiked);
    }

    if(result) {
        return Success(response, {success: true});
    } else {
        return InternalServerError(response);
    }
}

export async function recalculateObjectsLikeCount(id: number): Promise<void> {
    const object = await Objects.findOneByID(id);
    if(!object) {
        return;
    }

    const likes = await Likes.countLikes(id);
    if(!likes) {
        return;
    }

    Objects.updateObjectLikeCounter(id, likes);
}