import * as Express from 'express';
import { Objects } from '../models/objects';
import { ObjectTags } from './../models/objectTags';
import { badRequest, success, internalServerError } from '../utils/respond';

export async function searchByKeyword(request: Express.Request, response: Express.Response) {
    const keyword = request.body.keyword;

    if (!keyword) {
        badRequest(response, { reason: 'No search term was passed' });
        return;
    }

    try {
        const result = await Objects.findFromKeywordSearch(keyword);

        // find a better way to do this - Promise.all or something non blocking
        for (const object of result) {
            object.tags = await ObjectTags.getTagsByObjectId(object.id);
        }

        success(response, { result: result });
    } catch (error) {
        internalServerError(response, { error: error });
    }
}
