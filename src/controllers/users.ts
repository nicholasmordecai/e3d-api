import * as Express from 'express';
import { Users, IUser } from './../models/users';
import { Likes, ILike } from './../models/likes';
import { Favourites, IFavourite } from './../models/favourites';
import { Objects, IObject } from './../models/objects';
import { Respond } from './../utils/respond';
import { nonRestrictedRoute } from './auth';
import { Collections } from '../models/collections';

interface ISanitizedUser {
    firstname: string,
    lastname: string,
    exp: number,
    level: number,
}

interface ISanitizedPrivateProfile {
    user: ISanitizedUser;
    likes: ILike[];
    objects: IObject[];
    favourites: IFavourite[];
}

export async function getUserProfile(request: Express.Request, response: Express.Response) {
    // this should be a redundant check as it should not be possible to get here, better safe than sorry though!
    if (request.userId == null) {
        return Respond.User.noUserIdFromJWTToken(response);
    }


    let user: IUser;
    try {
        user = await Users.findOneByID(request.userId);
        if (user === undefined) {
            return Respond.User.errorSearchingForUser(response, null, null, { user: user, userId: request.userId });
        }
    } catch (error) {
        return Respond.User.errorSearchingForUser(response, null, error, { user: user, userId: request.userId });
    }

    const sanitizedUser: ISanitizedUser = sanitizeUserData(user);

    Respond.success(response, sanitizedUser);
}

const sanitizeUserData = (user: IUser) => {
    return {
        firstname: user.firstname,
        lastname: user.lastname,
        exp: user.exp,
        level: user.level,
    };
};

export async function getCompleteUserProfile(request: Express.Request, response: Express.Response) {
    let user: IUser;
    let likes: ILike[];
    let objects: IObject[];
    let favourites: IFavourite[];

    // get the core user profile
    try {
        user = await Users.findOneByID(request.userId);
        if (user == null) {
            return Respond.User.errorSearchingForUser(response, null, null, { user: user, userId: request.userId });
        }
    } catch (error) {
        return Respond.User.errorSearchingForUser(response, null, error, { user: user, userId: request.userId });
    }

    // get all user likes
    try {
        likes = await Likes.findAllByUserID(request.userId);
        if (likes == null) {
            return Respond.Like.errorSearchingForAllLikes(response, null, null, { user: user, likes });
        }
    } catch (error) {
        return Respond.Like.errorSearchingForAllLikes(response, null, error, { user: user, likes: likes });
    }

    // get all user objects
    try {
        objects = await Objects.findAllByUserID(request.userId);
        if (objects == null) {
            return Respond.Object.errorFindingAllObjectsFromUserId(response, null, null, { user: user, objects });
        }
    } catch (error) {
        return Respond.Like.errorSearchingForAllLikes(response, null, error, { user: user, likes: likes });
    }

    // get all user favourites
    try {
        favourites = await Favourites.findAllByUserID(request.userId);
        if (favourites == null) {
            return Respond.Favourite.errorFindingAllFavouritesFromUserId(response, null, null, { user: user, objects });
        }
    } catch (error) {
        return Respond.Like.errorSearchingForAllLikes(response, null, error, { user: user, likes: likes });
    }


    const sanitizedUser = sanitizeUserData(user);

    const profile: ISanitizedPrivateProfile = {
        user: sanitizedUser,
        likes,
        objects,
        favourites,
    };

    return Respond.success(response, profile);
}

export async function getUsersCollections(request: Express.Request, response: Express.Response) {
    const userId: number = parseInt(request.params.userId);
    const userTokenId: number = nonRestrictedRoute(request);

    try {
        if (userTokenId == null || userId !== userTokenId) {
        // only get any public collections from the user
            const collections = await Collections.findAllPublicByUserId(userId);
            if (collections == null) {
                return Respond.User.errorSearchingForCollections(response);
            } else {
                return Respond.success(response, collections);
            }
        } else {
        // the user is the owner, get all regardless of visibility
            const collections = await Collections.findAllByUserId(userId);
            if (collections == null) {
                return Respond.User.errorSearchingForCollections(response);
            } else {
                return Respond.success(response, collections);
            }
        }
    } catch (error) {
        return Respond.User.errorSearchingForCollections(response, null, error);
    }
}
