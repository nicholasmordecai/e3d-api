import * as Express from 'express';
import { Objects, IObject, ICategoryEdit } from '../models/objects';
import { Respond } from '../utils/respond';


export async function createNewObject() {

}

export async function getObjectByIDForWebView(request: Express.Request, response: Express.Response) {
    const id = parseInt(request.params.id);

    if (id == null) {
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

export async function updateObjectCategories(request: Express.Request, response: Express.Response) {
    const id = parseInt(request.body.id);

    const categoryEdit: ICategoryEdit = {
        id,
        primary_category: request.body.primary_category,
        secondary_one: request.body.secondary_one,
        secondary_two: request.body.secondary_two,
    };

    if (id == null) {
        return Respond.Object.noObjectIdPassed(response);
    }

    if (categoryEdit.primary_category == null && categoryEdit.secondary_one == null && categoryEdit.secondary_two == null) {
        return Respond.Object.noEditDataPassed(response);
    }

    const success:boolean = await Objects.updateObjectCategories(categoryEdit);

    if (!success) {
        // Add an Error response for could not update categories
        return Respond.Object.noEditDataPassed(response);
    } else {
        return Respond.success(response, success);
    }
}
