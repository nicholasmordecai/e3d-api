import * as Express from 'express';
import { decodeAccessToken } from './auth';
import { Objects } from '../models/objects';
import { Likes } from './../models/likes';
import { restrictedRoute } from './auth';
import { BadRequest, NotFound, Success, InternalServerError, Unauthorized } from '../utils/respond';

export async function objectLiked(request: Express.Request, response: Express.Response) {
    const objectId: number = parseInt(request.params.id);
    const exists = await Likes.alreadyExists(objectId, request.userId);

    if(exists) {
        return BadRequest(response, {reason: 'User has already liked this object'});
    }

    recalculateObjectsLikeCount(objectId);

    const result = await Likes.insert(objectId, request.userId);
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