import {FieldPacket, QueryError} from 'mysql2';
import {MySQL} from './../system/mysql';
import {recordInsertedCorrectly, recordUpdatedCorrectly, returnSingle, returnAll} from '../utils/dbUtils';

/* eslint-enable */
export interface INotification {
    id: number;
    user_id: number;
    notifier_id: number;
    action: number;
    reference_id: number;
    seen_at: number;
    created_at: number;
    deleted: number;
};
/* eslint-disable */

export class Notifications {
    public static async createNotification(userId: number, notifierId: number, action: number, referenceId: number): Promise<boolean | null> {
        const query = 'INSERT INTO notifications (user_id, notifier_id, action, reference_id, created_at) VALUES (?, ?, ?, ?, UNIX_TIMESTAMP() * 1000);';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId, notifierId, action, referenceId]);
        return recordInsertedCorrectly(result);
    }

    public static async getNotificationByID(notificationId: number): Promise<INotification | null> {
        const query = 'SELECT * FROM notifications WHERE id = ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [notificationId]);
        return returnSingle(result);
    }

    public static async getNotificationsForUserById(userId: number, limit: number = 10): Promise<INotification[] | null> {
        const query = 'SELECT * FROM notifications WHERE notifier_id = ? LIMIT ?;';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId, limit]);
        return returnAll(result);
    }

    public static async deleteNotification(notificationId: number) {
        const query = 'UPDATE notifications SET deleted = ? WHERE id = ?';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [notificationId]);
        return recordUpdatedCorrectly(result);
    }

    public static async markAsSeen(notificationId: number, notifierId: number): Promise<boolean | null> {
        const query = 'UPDATE notifications SET seen_at = UNIX_TIMESTAMP() * 1000 WHERE id = ? AND notifier_id = ?';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [notificationId, notifierId]);
        return recordUpdatedCorrectly(result);
    }
}