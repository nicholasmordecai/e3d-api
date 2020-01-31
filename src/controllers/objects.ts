import * as Express from 'express';
import { Objects, IObject } from '../models/objects';
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
        object = await Objects.findOneByID(id);
    } catch (error) {
        return Respond.Object.errorSearchingForObject(response, null, error, id);
    }

    if (!object) {
        return Respond.notFound(response);
    } else {
        return Respond.success(response, object);
    }
}
