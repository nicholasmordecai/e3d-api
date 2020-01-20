import {FieldPacket, QueryError} from 'mysql2';
import { MySQL } from '../system/mysql';
import { Likes } from './likes';

export interface IObject {
    id: number;
    parent_object_id: number;
    user_id: number;
    title: string;
    version: string;
    active: number;
    description: string;
    likes: number;
    favourites: number;
    followers: number;
    builds: number;
    src_url: number;
};

export class Objects {
    public static async findOneByID(id: number): Promise<IObject | null> {
        /**
         * I thought about using transactions, or stored procedures to update the view counter at the same time as the select
         * However, this locking has performance issues.. and worst case scenario, the page displays 1 less count on the view counter.
         * This isn't a big enough deal to bother worrying about. Speed is more important here.
         */
        const query1: string = `SELECT * FROM objects WHERE ID = ? LIMIT 1`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.executeTransaction(query1, [id]);

        const query2: string = `UPDATE objects SET views = views + 1 WHERE id = ?;`;
        // execute this in a non async callback as it's not needed to return the results - keep it speedy
        MySQL.execute(query2, [id]);

        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async findFromKeywordSearch(keyword: string) {
        // TODO the match happens twice.. I'm 99% sure this is super not effecient. Find a better solution
        const query = `
            SELECT 
                id, views, favourites, likes, builds, src_url, MATCH (title,description) AGAINST (?) as score
            FROM objects 
            WHERE 
                MATCH (title,description) AGAINST (?) > 0 
            ORDER BY score DESC;`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [keyword, keyword]);
        if(result[0] != null) {
            return result[0];
        } else {
            return null;
        }
    }

    public static async updateObjectLikeCounter(id: number, count: number): Promise<boolean> {
        const query = `UPDATE objects SET likes = ? WHERE id = ?`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [count, id]);
        if (result[0].changedRows === 1) {
            return true;
        } else {
            return false;   
        }
    }
}