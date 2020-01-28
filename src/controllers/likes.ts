import * as Express from 'express';
import { Objects } from '../models/objects';
import { Likes } from './../models/likes';
import { BadRequest, Success, InternalServerError, NotFound } from '../utils/respond';
import { Notification, createNotification } from './notifications';

export async function objectLiked(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);
    const object = await Objects.findOneByID(objectId);

    if(!object == null) {
        return NotFound(response, `Object ${objectId} was not found`);
    } 

    const exists = await Likes.alreadyExists(objectId, request.userId);

    if(exists) {
        return BadRequest(response, {reason: 'User has already liked this object'});
    }

    const result = await Likes.insert(objectId, request.userId);

    // update the local like counter on the object table
    recalculateObjectsLikeCount(objectId);

    // create a user notification for this
    
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

export async function getAllObjectLikes(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);

    if(!objectId) {
        BadRequest(response);
    }

    //TODO check if the object exists, if not - return 404

    const likes = await Likes.findAllByObjectId(objectId);
    if(!likes) {
        InternalServerError(response, 'Unknown - 548');
    } else {
        Success(response, likes);
    }
}

export async function totalCountOfLikesByObjectId(request: Express.Request, response: Express.Response): Promise<void> {
    const objectId: number = parseInt(request.params.id);

    if(!objectId) {
        BadRequest(response);
    }

    //TODO check if the object exists, if not - return 404

    const likes = await Likes.countLikes(objectId);
    if(!likes) {
        InternalServerError(response, 'Unknown - 548');
    } else {
        Success(response, likes);
    }
}