import * as Express from 'express';
import { Respond } from './../utils/respond';
import { Collections, ICollection } from './../models/collections';
import { CollectionObjects, ICollectionObject } from './../models/collection_objects';
import { Objects } from '../models/objects';
import { nonRestrictedRoute } from './auth';

export async function findCollectionByID(request: Express.Request, response: Express.Response): Promise<void> {
    const collectionId: number = parseInt(request.params.collection);

    // it's not s restricted route, so need to get the optional user ID out of the header IF it exists
    const userId: number = nonRestrictedRoute(request);

    if (collectionId == null) return Respond.Collection.noCollectionIdFound(response);

    try {
        const collection: ICollection = await Collections.findOneById(collectionId);

        if (collection == null) {
            return Respond.notFound(response);
        }

        const objects: ICollectionObject[] = await CollectionObjects.findAllObjects(collection.id);

        // if it's public, return it without checking user ID
        if (collection.visibility === 0) {
            return Respond.success(response, { collection: collection, objects: objects });
        } else {
            // check if user id is owner of the collection
            if (collection.user_id !== userId) {
                // the user doesn't own the collection - so return 404
                return Respond.notFound(response);
            } else {
                return Respond.success(response, { collection: collection, objects: objects });
            }
        }
    } catch (error) {
        return Respond.Collection.errorSearchingForCollection(response, null, error);
    }
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
    const collectionId: number = parseInt(request.params.collection);
    const updateValues = request.body.updateValues;

    if (collectionId == null) return Respond.Collection.noCollectionIdFound(response);
    if (updateValues == null || Object.keys(updateValues).length === 0) {
        return Respond.Collection.noValuesPassedToUpdate(response);
    }

    const collection: ICollection = await Collections.findOneById(collectionId);
    if (collection == null || collection.user_id !== request.userId) {
        return Respond.notFound(response);
    }

    // map the incomming variables from all possible update values to the database field names
    const possibleUpdateKeys: {key: string, dbKey: string}[] = [
        { key: 'name', dbKey: 'name' },
        { key: 'description', dbKey: 'description' },
        { key: 'visibility', dbKey: 'visibility' },
        { key: 'thumbnailSrc', dbKey: 'thumbnail_src' },
    ];

    try {
        const update = await Collections.updateCollection(request.body.updateValues, possibleUpdateKeys, collection.id);
        if (update === true) {
            const newCollectionInformation: ICollection = await Collections.findOneById(collection.id);
            return Respond.success(response, { collection: newCollectionInformation, success: true });
        } else {
            return Respond.Collection.couldNotUpdateCollection(response);
        }
    } catch (error) {
        return Respond.Collection.couldNotUpdateCollection(response, null, error);
    }
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
        const collection: ICollection = await Collections.findOneById(collectionId);
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
        const collection: ICollection = await Collections.findOneById(collectionId);
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
