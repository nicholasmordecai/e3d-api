import {FieldPacket, QueryError} from 'mysql2';
import { MySQL } from '../system/mysql';

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
        const query = 'SELECT * FROM objects WHERE ID = ? LIMIT 1';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [id]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }
}