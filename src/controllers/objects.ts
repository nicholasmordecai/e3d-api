import * as Express from 'express';
import { Objects } from '../models/objects';
import { BadRequest, NotFound, Success } from '../utils/respond';

export async function createNewObject() {

}

export async function getObjectByID(request: Express.Request, response: Express.Response) {
    const id = parseInt(request.params.id);

    if(!id) {
        BadRequest(response, {reason: 'Missing Object ID'});
        return;
    }

    const object = await Objects.findOneByID(id);

    if(!object) {
        NotFound(response);
    } else {
        Success(response, object);
    }
}