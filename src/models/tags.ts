import { FieldPacket, QueryError } from 'mysql2';
import { MySQL } from './../system/mysql';
import { recordInsertedCorrectly, returnAll } from '../utils/dbUtils';

/* eslint-disable */
export interface ITag {
    id: number;
    tag: string;
};
/* eslint-enable */

export class Tags {
    public static async findByTagName(tag: string): Promise<ITag | null> {
        const query = 'SELECT * FROM tags WHERE tag = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [tag]);
        if (result[0] != null) {
            return result[0];
        } else {
            return null;
        }
    }

    public static async findMultipleByTagNames(tags: string[]): Promise<ITag[] | null> {
        const query = 'SELECT * FROM tags WHERE tag IN(?);';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [tags]);
        return returnAll<ITag>(result);
    }

    public static async createTag(tag: string): Promise<boolean> {
        const query = `INSERT INTO tags (tag) VALUES (?);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [tag]);
        return recordInsertedCorrectly(result);
    }

    public static async insertMultipleTags(tags: [string, number][]): Promise<boolean> {
        const query = `INSERT INTO tags (tag, created_at) VALUES ?;`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [tags]);
        return recordInsertedCorrectly(result);
    }

    public static async countOfAllTags(): Promise<{count: number, tag: string}[] | null> {
        const query: string = `
        SELECT count(tags.id) AS count, tags.tag as tag FROM tags
        LEFT JOIN object_tag
        ON tags.id = object_tag.tag_id
        GROUP BY tags.id
        ORDER BY count DESC;`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query);
        return returnAll(result);
    }
}
