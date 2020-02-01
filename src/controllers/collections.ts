import * as Express from 'express';
import { Respond } from './../utils/respond';
import { Collections, ICollection } from './../models/collections';
import { CollectionObjects } from './../models/collection_objects';
import { Objects } from '../models/objects';

export async function findCollectionByID(request: Express.Request, response: Express.Response): Promise<void> {

}

export async function createCollection(request: Express.Request, response: Express.Response): Promise<void> {
    const userId: number = request.userId;
    const name: string = request.body.name;
    const description: string = request.body.description;
    const visibility: number = parseInt(request.body.visibility);
    const thumbnailSrc: string = request.body.thumbnailSrc;

    if (userId == null) return Respond.Auth.noAccessTokenPassed(response);

    if (name == null || description == null || visibility == null || thumbnailSrc == null) {
        return Respond.Collection.missingParameters(response, null, null, {
            name: name,
            description: description,
            visibility: visibility,
            thumbnailSrc: thumbnailSrc,
        });
    }

    try {
        const result = await Collections.create(userId, name, description, visibility, thumbnailSrc);
        const collection: ICollection = await Collections.findOneById(result);
        if (collection != null) {
            return Respond.success(response, { success: true, collection: collection });
        } else {
            return Respond.Collection.errorCreatingCollection(response, null, null, result);
        }
    } catch (error) {
        return Respond.Collection.errorCreatingCollection(response, null, error);
    }
}

export async function updateCollection(request: Express.Request, response: Express.Response): Promise<void> {

}

export async function addObjectToCollection(request: Express.Request, response: Express.Response): Promise<void> {
    const userId: number = request.userId;
    const collectionId: number = parseInt(request.params.collection);
    const objectId: number = request.body.objectId;

    if ( userId == null ) return Respond.Auth.noAccessTokenPassed(response);
    if ( objectId == null ) return Respond.Collection.noObjectIdPassed(response);
    if ( collectionId == null) return Respond.Collection.noCollectionIdFound(response);

    try {
        // make sure the collection exists
        const collection: ICollection = await Collections.findOneById(objectId);
        if (collection == null) {
            return Respond.notFound(response, null, null, { collection: collection, objectId: objectId });
        }

        // check if the user actually owns this collection
        if (collection.user_id !== userId) {
            return Respond.Collection.userDoesNotOwnThisCollection(response, null, null, { userId: userId, collectionId: CollectionObjects });
        }

        // make sure the object exists
        const object = await Objects.findOneById(objectId);
        if (object == null) {
            return Respond.notFound(response, null, null, { object: object, objectId: objectId });
        }

        const exists = await CollectionObjects.exists(collectionId, objectId);

        if (exists != null) {
            return Respond.Collection.objectAlreadyAddedToCollection(response, null, null, { exists: exists });
        }
        const result = await CollectionObjects.addObjectToCollection(object.id, userId, collectionId);
        if (result != null) {
            return Respond.success(response, { success: true });
        } else {
            return Respond.Collection.errorAddingObjectToCollection(response, null, null, result);
        }
    } catch (error) {
        return Respond.Collection.errorAddingObjectToCollection(response, null, error);
    }
}

export async function removeObjectFromCollection(request: Express.Request, response: Express.Response): Promise<void> {
    const userId: number = request.userId;
    const collectionId: number = parseInt(request.params.collection);
    const objectId: number = request.body.objectId;

    if ( userId == null ) return Respond.Auth.noAccessTokenPassed(response);
    if ( objectId == null ) return Respond.Collection.noObjectIdPassed(response);
    if ( collectionId == null) return Respond.Collection.noCollectionIdFound(response);

    try {
        // make sure the collection exists
        const collection: ICollection = await Collections.findOneById(objectId);
        if (collection == null) {
            return Respond.notFound(response, null, null, { collection: collection, objectId: objectId });
        }

        // check if the user actually owns this collection
        if (collection.user_id !== userId) {
            return Respond.Collection.userDoesNotOwnThisCollection(response, null, null, { userId: userId, collectionId: CollectionObjects });
        }

        // make sure the object exists
        const object = await Objects.findOneById(objectId);
        if (object == null) {
            return Respond.notFound(response, null, null, { object: object, objectId: objectId });
        }

        const exists = await CollectionObjects.exists(collectionId, objectId);

        if (exists == null) {
            return Respond.notFound(response, null, null, { exists: exists });
        }
        const result = await CollectionObjects.removeObjectFromCollection(objectId, collectionId, userId);
        if (result != null) {
            return Respond.success(response, { success: true });
        } else {
            return Respond.Collection.errorRemovingObjectFromCollection(response, null, null, result);
        }
    } catch (error) {
        return Respond.Collection.errorRemovingObjectFromCollection(response, null, error);
    }
}

export async function removeCollection(request: Express.Request, response: Express.Response): Promise<void> {
    const userId: number = request.userId;
    const collectionId: number = parseInt(request.params.collection);

    if (userId == null) return Respond.Auth.noAccessTokenPassed(response);
    if ( collectionId == null) return Respond.Collection.noCollectionIdFound(response);


    try {
        const collection: ICollection = await Collections.findOneById(collectionId);
        if (collection == null) {
            return Respond.notFound(response, null, null, { collectionId: collectionId });
        }

        const result: boolean = await Collections.removeCollection(collectionId, userId);
        if (result === true) {
            return Respond.success(response, { success: true });
        } else {
            return Respond.Collection.errorRemovingCollection(response, null, null, { userId: userId, collectionId: collectionId });
        }
    } catch (error) {
        return Respond.Collection.errorRemovingCollection(response, null, error);
    }
}
