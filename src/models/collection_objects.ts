import { FieldPacket, QueryError } from 'mysql2';
import { MySQL } from '../system/mysql';
import { recordInsertedCorrectly, recordDeletedCorrectly } from '../utils/dbUtils';

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
    // TODO add userId to the query to inforce only the collection owner can add / remove objects
    public static async addObjectToCollection(objectId: number, collectionId: number): Promise<boolean> {
        const query = `INSERT INTO favourites (object_id, user_id, favourites) VALUES (?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, collectionId]);
        return recordInsertedCorrectly(result);
    }

    // TODO add userId to the query to inforce only the collection owner can add / remove objects
    public static async removeObjectFromCollection(objectId: number, collectionId: number) {
        const query = `INSERT INTO favourites (object_id, user_id, favourites) VALUES (?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, collectionId]);
        return recordDeletedCorrectly(result);
    }
}
