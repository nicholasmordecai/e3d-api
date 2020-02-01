import { FieldPacket, QueryError } from 'mysql2';
import { MySQL } from '../system/mysql';
import { recordInsertedCorrectly, recordDeletedCorrectly, returnSingle } from '../utils/dbUtils';

/*eslint-disable */
export interface ICollectionObject {
    id: number;
    collection_id: number;
    user_id: number;
    object_id: number;
    added_at: number;
};
/* eslint-enable */

export class CollectionObjects {
    public static async addObjectToCollection(collectionId: number, userId: number, objectId: number): Promise<boolean> {
        const query = `
            INSERT INTO collection_objects 
                (collection_id, user_id, object_id, added_at) 
            VALUES 
                (?, ?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, userId, collectionId]);
        return recordInsertedCorrectly(result);
    }

    public static async removeObjectFromCollection(objectId: number, collectionId: number, userId: number) {
        const query = `DELETE FROM collection_objects WHERE collection_id = ? AND object_id = ? AND user_id = ? `;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, collectionId]);
        return recordDeletedCorrectly(result);
    }

    public static async exists(collectionId: number, objectId: number): Promise<boolean> {
        const query = `SELECT * FROM collection_objects WHERE collection_id = ? AND object_id = ?`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [collectionId, objectId]);
        return returnSingle(result);
    }
}
