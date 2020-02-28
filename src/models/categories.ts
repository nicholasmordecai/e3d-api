import { FieldPacket, QueryError } from 'mysql2';
import { MySQL } from '../system/mysql';
import { returnAll } from '../utils/dbUtils';

/* eslint-disable */
export interface ICategory {
    id: number;
    category: string;
    parent_id: number;
    count: number;
    active: number;
    is_featured: number;
}
/* eslint-enable */

export class Categories {
    public static async getAllCategories() : Promise<ICategory[]> {
        const query1: string = `SELECT * FROM categories`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query1);

        return returnAll(result);
    }
}
