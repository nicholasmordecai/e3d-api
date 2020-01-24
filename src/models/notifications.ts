import {FieldPacket, QueryError} from 'mysql2';
import { MySQL } from './../system/mysql';
import { recordInsertedCorrectly } from '../utils/dbUtils';

export interface INotification {
    id: number;
    user_id: number;
    notification_name: number;
    seen_at: number;
    created_at: number;
    reference_table: string;
    reference_id: number;
};

export class Notifications {
    public static async createNotification(userId: number, ): Promise<boolean | null> {
        const query = 'SELECT * FROM likes WHERE object_id = ? LIMIT 1;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId]);
        return recordInsertedCorrectly(result);
    }
}