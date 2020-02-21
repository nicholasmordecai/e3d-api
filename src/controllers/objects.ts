import * as Express from 'express';
import { Objects, IObject, ICategoryEdit } from '../models/objects';
import { Respond } from '../utils/respond';


export async function createNewObject() {

}

export async function getHomeFeaturedObjects(request: Express.Request, response: Express.Response): Promise<void> {
    console.log('hi')
    try {
        const featured = await Objects.getFeaturedObjects();
        if (featured == null) {
            Respond.Object.errorGettingFeaturedObjects(response, null, null, {result: featured});
        } else {
            Respond.success(response, featured);
        }
    } catch (error) {
        Respond.Object.errorGettingFeaturedObjects(response, null, error);
    }
}

export async function getObjectByIDForWebView(request: Express.Request, response: Express.Response): Promise<void> {
    console.log('get object for web view by id:', request.params.id)
    const id = parseInt(request.params.id);

    if (id == null || isNaN(id) === true) {
        return Respond.Object.noObjectIdPassed(response);
    }

    let object: IObject;

    try {
        object = await Objects.findOneById(id);
    } catch (error) {
        return Respond.Object.errorSearchingForObject(response, null, error, id);
    }

    if (!object) {
        return Respond.notFound(response);
    } else {
        return Respond.success(response, object);
    }
}

export async function updateObjectCategories(request: Express.Request, response: Express.Response): Promise<void> {
    const id = parseInt(request.params.id);

    const categoryEdit: ICategoryEdit = {
        id,
        primaryCategory: request.body.primary_category,
        secondaryOne: request.body.secondary_one,
        secondaryTwo: request.body.secondary_two,
    };

    if (id == null || isNaN(id) === true) {
        return Respond.Object.noObjectIdPassed(response);
    }

    if (categoryEdit.primaryCategory == null && categoryEdit.secondaryOne == null && categoryEdit.secondaryTwo == null) {
        return Respond.Object.noEditDataPassed(response);
    }

    const success: boolean = await Objects.updateObjectCategories(categoryEdit);

    if (!success) {
        // Add an Error response for could not update categories
        return Respond.Object.noEditDataPassed(response);
    } else {
        return Respond.success(response, success);
    }
}
