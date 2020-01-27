import * as Express from 'express';
import { Objects } from '../models/objects';
import { ObjectTags } from './../models/objectTags';
import { BadRequest, NotFound, Success, InternalServerError } from '../utils/respond';

export async function searchByKeyword(request: Express.Request, response: Express.Response) {
    const keyword = request.body.keyword;

    if(!keyword) {
        BadRequest(response, {reason: 'No search term was passed'});
        return;
    }

    try {
        const result = await Objects.findFromKeywordSearch(keyword);

        // find a better way to do this - Promise.all or something non blocking
        for(let object of result) {
            object.tags = await ObjectTags.getTagsByObjectId(object.id);
        }

        Success(response, {result: result});
    } catch (error) {
        InternalServerError(response, {error: error});
    }
}