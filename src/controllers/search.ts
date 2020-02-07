import * as Express from 'express';
import { Objects } from '../models/objects';
import { ObjectTags } from './../models/objectTags';
import { Respond } from '../utils/respond';
import { nonRestrictedRouteTrackingId } from './auth';
import { SearchHistory } from '../models/searchHistory';

export async function searchByKeyword(request: Express.Request, response: Express.Response) {
    const keyword = request.body.keyword;

    if (!keyword) {
        return Respond.Search.noKeywordPassed(response);
    }

    try {
        const result = await Objects.findFromKeywordSearch(keyword);
        logSearch(request, keyword);

        if (result == null) {
            return Respond.Search.couldNotRunSearchQuery(response, null, null, result);
        } else if (result.length < 1) {
            return Respond.success(response, result);
        }

        // find a better way to do this - Promise.all or something non blocking
        for (const object of result) {
            object.tags = await ObjectTags.getTagsByObjectId(object.id);
        }

        return Respond.success(response, result);
    } catch (error) {
        return Respond.Search.couldNotRunSearchQuery(response, null, error, { keyword: keyword });
    }
}

export async function logSearch(request: Express.Request, searchTerm: string): Promise<boolean> {
    try {
        let userTrackingId: string;
        if (request.headers.authorization) {
            userTrackingId = nonRestrictedRouteTrackingId(request);
        }

        return SearchHistory.createSearchHistory(searchTerm, userTrackingId);
    } catch (error) { }
}

export async function featuredObjects(request: Express.Request, searchTerm: string): Promise<void> {

}