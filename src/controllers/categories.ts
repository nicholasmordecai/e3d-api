import * as Express from 'express';
import { Categories, ICategory } from '../models/categories';
import { Respond } from '../utils/respond';

export async function getAllCategories(request: Express.Request, response: Express.Response) : Promise<void> {
    try {
        const categories: ICategory[] = await Categories.getAllCategories();
        if (categories == null) {
            Respond.notFound(response, null, null, null);
        } else {
            Respond.success(response, categories);
        }
    } catch (error) {
        Respond.notFound(response, null, error, null);
    }
}
