import { FieldPacket, QueryError } from 'mysql2';
import { MySQL } from '../system/mysql';
import { getLastInsertedId, returnSingle, returnAll, recordDeletedCorrectly, recordUpdatedCorrectly } from '../utils/dbUtils';

export enum visibility {
    'public' = 0,
    'private' = 1,
};

/*eslint-disable */
export interface ICollection {
    id: number;
    user_id: number;
    name: string;
    description: string;
    visibility: number;
    followers: number;
    created_at: number;
    thumbnail_src: string;
};
/* eslint-enable */

export class Collections {
    public static async create(userId: number, name: string, description: string, visibility: number, thumbnailSrc: string): Promise<number> {
        const query = `
            INSERT INTO 
            collections 
                (
                    user_id, 
                    name,
                    description,
                    thumbnail_src,
                    visibility,
                    created_at
                ) 
            VALUES 
                (?, ?, ?, ?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId, name, description, thumbnailSrc, visibility]);
        return getLastInsertedId(result);
    }

    public static async findOneById(id: number): Promise<ICollection | null> {
        const query = 'SELECT * FROM collections WHERE id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [id]);
        return returnSingle(result);
    }

    public static async findOneWithObjectsByID(id: number): Promise<ICollection | null> {
        const query = `
            SELECT * FROM collections
            LEFT JOIN collection_objects as link
            ON link.collection_id = collections.id
            WHERE collections.id = ?;
        `;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [id]);
        return returnSingle(result);
    }

    public static async findAllPublicByUserId(userId: number): Promise<ICollection[] | null> {
        const query = 'SELECT * FROM collections WHERE user_id = ? AND visibility = 0;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return returnAll(result);
    }

    public static async findAllByUserId(userId: number): Promise<ICollection[] | null> {
        const query = 'SELECT * FROM collections WHERE user_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return returnAll(result);
    }

    public static async removeCollection(collectionId: number, userId: number): Promise<boolean> {
        const query = 'DELETE FROM collections WHERE id = ? AND user_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [collectionId, userId]);
        return recordDeletedCorrectly(result);
    }

    public static async updateCollection(values: {}, map: {key: string, dbKey: string}[], collectionId: number): Promise<boolean> {
        const updateValues: string[] = [];
        const updateFields: string[] = [];
        for (const value in values) {
            if (values[value]) {
                for (const t of map) {
                    if (value === t.key) {
                        updateValues.push(values[value]);
                        updateFields.push(t.dbKey);
                    }
                }
            }
        }

        let query: string = `UPDATE collections SET`;
        const params: any[] = [];
        for (let i = 0; i < updateFields.length; i++) {
            const field: string = updateFields[i];
            query += ` ${field} = ?,`;
            params.push(updateValues[i]);
        }
        query = query.slice(0, -1);
        query += ` WHERE id = ?`;
        params.push(collectionId);

        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, params);
        return recordUpdatedCorrectly(result);
    }
}
