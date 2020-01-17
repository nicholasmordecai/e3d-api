import * as Express from 'express';
import { Objects } from '../models/objects';
import { BadRequest, NotFound, Success, InternalServerError } from '../utils/respond';

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

export async function searchByKeyword(request: Express.Request, response: Express.Response) {
    const keyword = request.body.keyword;

    if(!keyword) {
        BadRequest(response, {reason: 'No search term was passed'});
        return;
    }

    try {
        const result = await Objects.findFromKeywordSearch(keyword);
        Success(response, {result: result});
    } catch (error) {
        InternalServerError(response, {error: error});
    }
    
}