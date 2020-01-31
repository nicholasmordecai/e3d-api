import {FieldPacket, QueryError} from 'mysql2';
import {MySQL} from '../system/mysql';
import {recordInsertedCorrectly, recordDeletedCorrectly} from '../utils/dbUtils';

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
    public static async addObjectToCollection(objectId: number, collectionId: number, userId: number): Promise<boolean> {
        const query = `INSERT INTO favourites (object_id, user_id, favourites) VALUES (?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, collectionId]);
        return recordInsertedCorrectly(result);
    }

    public static async removeObjectFromCollection(objectId: number, collectionId: number, userId: number) {
        const query = `INSERT INTO favourites (object_id, user_id, favourites) VALUES (?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, collectionId]);
        return recordDeletedCorrectly(result);
    }
}
