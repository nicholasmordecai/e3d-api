import * as Express from 'express'
import { Users, IUser } from './../models/users'
import { Likes } from './../models/likes'
import { Favourites } from './../models/favourites'
import { Objects } from './../models/objects'
import { BadRequest, Success, InternalServerError } from './../utils/respond';

export async function getUserProfile(request: Express.Request, response: Express.Response) {
    const user = await Users.findOneByID(request.userId);

    if (user === undefined) {
        InternalServerError(response, {error: 'Error while retrieving user'});
        return;
    }

    const sanitizedUser = sanitizeUserData(user);

    Success(response, sanitizedUser);
}

const sanitizeUserData = (user) => {
    return {
        firstname: user.firstname,
        lastname: user.lastname,
        exp: user.exp,
        level: user.level
    }
}

export async function getCompleteUserProfile(request: Express.Request, response: Express.Response) {

    const user = await Users.findOneByID(request.userId);
    if (user === undefined) {
        InternalServerError(response, {error: 'Error while retrieving user'});
        return;
    }

    const likes = await Likes.findAllByUserID(request.userId)
    if (likes === undefined) {
        InternalServerError(response, {error: 'Error while retrieving likes'});
        return;
    }

    const objects = await Objects.findAllByUserID(request.userId)
    if (objects === undefined) {
        InternalServerError(response, {error: 'Error while retrieving objects'});
        return;
    }

    const favourites = await Favourites.findAllByUserID(request.userId);
    if (favourites === undefined) {
        InternalServerError(response, {error: 'Error while retrieving favourites'});
        return;
    }

    const sanitizedUser = sanitizeUserData(user);

    const profile = {
        user: sanitizedUser,
        likes,
        objects,
        favourites
    }

    Success(response, profile);
}