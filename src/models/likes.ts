import {FieldPacket, QueryError} from 'mysql2';
import { MySQL } from './../system/mysql';


export interface Like {
    id: number;
    object_id: number;
    user_id: number;
    liked: number;
};

export class Likes {
    public static async findOneByObjectID(userId: number): Promise<Like | null> {
        const query = 'SELECT * FROM likes WHERE object_id = ? LIMIT 1;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async findAllByObjectId(objectId: number): Promise<Like[] | null> {
        const query = 'SELECT * FROM likes WHERE object_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async findOneByUserID(userId: number): Promise<Like | null> {
        const query = 'SELECT * FROM likes WHERE user_id = ? LIMIT 1;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async findAllByUserID(userId: number): Promise<Like | null> {
        const query = 'SELECT * FROM likes WHERE user_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async alreadyExists(objectId: number, userId: number): Promise<boolean> {
        const query = `SELECT * FROM likes WHERE object_id = ? AND user_id = ?;`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, userId]);
        if(result[0].length > 0) {
            return true
        } else {
            return false;
        }
    }

    public static async insert(objectId: number, userId: number): Promise<boolean> {
        const query = `INSERT INTO likes (object_id, user_id, liked) VALUES (?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, userId]);
        if (result[0].insertId != null) {
            return true;
        } else {
            return false;   
        }
    }

    public static async countLikes(objectId: number): Promise<number> {
        const query = 'SELECT COUNT(*) FROM likes WHERE object_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }
};