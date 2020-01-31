import * as Express from 'express';
import { Objects } from '../models/objects';
import { badRequest, notFound, success } from '../utils/respond';

export async function createNewObject() {

}

export async function getObjectByIDForWebView(request: Express.Request, response: Express.Response) {
    const id = parseInt(request.params.id);

    if (!id) {
        badRequest(response, { reason: 'Missing Object ID' });
        return;
    }

    const object = await Objects.findOneByID(id);

    if (!object) {
        notFound(response);
    } else {
        success(response, object);
    }
}
