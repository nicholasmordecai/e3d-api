import { FieldPacket, QueryError } from 'mysql2';
import { MySQL } from './../system/mysql';
import { recordInsertedCorrectly, returnSingle, returnAll } from '../utils/dbUtils';


/* eslint-disable */
export interface ILike {
    id: number;
    object_id: number;
    user_id: number;
    liked: number;
};
/* eslint-enable */

export class Likes {
    public static async findOneByObjectID(userId: number): Promise<ILike | null> {
        const query = 'SELECT * FROM likes WHERE object_id = ? LIMIT 1;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return returnSingle(result);
    }

    public static async findAllByObjectId(objectId: number): Promise<ILike[] | null> {
        const query = 'SELECT * FROM likes WHERE object_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId]);
        return returnAll(result);
    }

    public static async findOneByUserID(userId: number): Promise<ILike | null> {
        const query = 'SELECT * FROM likes WHERE user_id = ? LIMIT 1;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return returnSingle(result);
    }

    public static async findAllByUserID(userId: number): Promise<ILike[] | null> {
        const query = 'SELECT * FROM likes WHERE user_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return returnAll(result);
    }

    public static async alreadyExists(objectId: number, userId: number): Promise<boolean> {
        const query = `SELECT * FROM likes WHERE object_id = ? AND user_id = ?;`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, userId]);
        if (result[0].length > 0) {
            return true;
        } else {
            return false;
        }
    }

    public static async insert(objectId: number, userId: number): Promise<boolean> {
        const query = `INSERT INTO likes (object_id, user_id, liked) VALUES (?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, userId]);
        return recordInsertedCorrectly(result);
    }

    public static async countLikes(objectId: number): Promise<number> {
        const query = 'SELECT COUNT(*) as count FROM likes WHERE object_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId]);
        if (result[0] != null) {
            return result[0][0].count;
        } else {
            return null;
        }
    }
};
