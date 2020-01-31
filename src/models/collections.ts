import {FieldPacket, QueryError} from 'mysql2';
import {MySQL} from '../system/mysql';
import {recordInsertedCorrectly, recordUpdatedCorrectly, returnSingle, returnAll} from '../utils/dbUtils';

/*eslint-disable */
export interface ICollection {
    id: number;
    user_id: number;
    name: string;
    description: string;
    visibility: number;
    followers: number;
    created_at: number;
};
/* eslint-enable */

export class Collections {
    public static async create(userId: number, name: string, description: string, visibility: number): Promise<boolean> {
        const query = `
            INSERT INTO 
            collections 
                (
                    user_id, 
                    name,
                    description,
                    visibility,
                    created_at
                ) 
            VALUES 
                (?, ?, ?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId, name, description, visibility]);
        return recordInsertedCorrectly(result);
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

    public static async findAllByUserId(userId: number): Promise<ICollection[] | null> {
        const query = 'SELECT * FROM collections WHERE user_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return returnAll(result);
    }
}
