import {FieldPacket, QueryError} from 'mysql2';
import { MySQL } from './../system/mysql';
import { recordInsertedCorrectly, recordUpdatedCorrectly, returnSingle, returnAll} from '../utils/dbUtils';

export interface Favourite {
    id: number;
    object_id: number;
    user_id: number;
    favourited: number;
};

export class Favourites {
    public static async findOneByObjectID(userId: number): Promise<Favourite | null> {
        const query = 'SELECT * FROM favourites WHERE object_id = ? LIMIT 1;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return returnSingle(result);
    }

    public static async findAllByObjectId(objectId: number): Promise<Favourite[] | null> {
        const query = 'SELECT * FROM favourites WHERE object_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId]);
        return returnAll(result);
    }

    public static async findOneByUserID(userId: number): Promise<Favourite | null> {
        const query = 'SELECT * FROM favourites WHERE user_id = ? LIMIT 1;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return returnSingle(result);
    }

    public static async findAllByUserID(userId: number): Promise<Favourite[] | null> {
        const query = 'SELECT * FROM favourites WHERE user_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return returnAll(result);
    }

    public static async alreadyExists(objectId: number, userId: number): Promise<boolean> {
        const query = `SELECT * FROM favourites WHERE object_id = ? AND user_id = ?;`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, userId]);
        if(result[0].length > 0) {
            return true
        } else {
            return false;
        }
    }

    public static async insert(objectId: number, userId: number): Promise<boolean> {
        const query = `INSERT INTO favourites (object_id, user_id, favourites) VALUES (?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, userId]);
        return recordInsertedCorrectly(result);
    }

    public static async countfavourites(objectId: number): Promise<number> {
        const query = 'SELECT COUNT(*) as count FROM favourites WHERE object_id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId]);
        if(result[0] != null) {
            return result[0][0].count;
        } else {
            return null;
        }
    }
};