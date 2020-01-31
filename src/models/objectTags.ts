import { FieldPacket, QueryError } from 'mysql2';
import { MySQL } from './../system/mysql';
import { recordInsertedCorrectly, returnAll, recordDeletedCorrectly } from '../utils/dbUtils';

/* eslint-disable */
export interface IObjectTag {
    id: number;
    object_id: number;
    tag_id: number;
    tagged_at: number;
};
/* eslint-enable */

export class ObjectTags {
    public static async insertMultiple(objectTags: [number, number, number][]): Promise<boolean> {
        const query = 'INSERT INTO object_tag (object_id, tag_id, tagged_at) values ?';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectTags]);
        return recordInsertedCorrectly(result);
    }

    public static async getTagsByObjectId(objectId: number) : Promise<IObjectTag[] | null> {
        const query = `
        SELECT 
            tags.id,
            tags.tag,
            tags.created_at,
            object_tag.id AS reference_id
        FROM object_tag 
        LEFT JOIN tags
            ON object_tag.tag_id = tags.id
        WHERE object_id = ?
        `;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId]);
        return returnAll(result);
    }

    public static async removeTag(objectId: number, tagId: number): Promise<boolean> {
        const query = 'DELETE FROM object_tag WHERE object_id = ? AND tag_id = ?';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, tagId]);
        return recordDeletedCorrectly(result);
    }
}
