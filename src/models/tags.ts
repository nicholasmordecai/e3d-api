import {FieldPacket, QueryError} from 'mysql2';
import { MySQL } from './../system/mysql';
import { recordInsertedCorrectly } from '../utils/dbUtils';

export interface Tag {
    id: number;
    tag: string;
};

export class Tags {
    public static async findByTagName(tag: string): Promise<Tag | null> {
        const query = 'SELECT * FROM tags WHERE tag = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [tag]);
        if(result[0] != null) {
            return result[0];
        } else {
            return null;
        }
    }

    public static async createTag(tag: string): Promise<boolean> {
        const query = `INSERT INTO tags (tag) VALUES (?);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [tag]);
        return recordInsertedCorrectly(result);
    }
}