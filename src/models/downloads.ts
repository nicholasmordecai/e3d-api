import { FieldPacket, QueryError } from 'mysql2';
import { MySQL } from './../system/mysql';
import { recordInsertedCorrectly } from '../utils/dbUtils';

/* eslint-disable */
export interface IFavourite {
    id: number;
    object_id: number;
    user_tracking_id: string;
    ip_v4: string;
    ip_v6: string;
    timestamp: number;
};
/* eslint-enable */

export class Downloads {
    public static async recordDownload(ipV4: string, ipV6: string, objectId: string, userTrackingId: string = null) {
        const query = `INSERT INTO downloads (object_id, user_tracking_id, ip_v4, ip_v6, timestamp) VALUES (?, ?, ?, ?, UNIX_TIMESTAMP() * 1000);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [objectId, userTrackingId, ipV4, ipV6]);
        return recordInsertedCorrectly(result);
    }
}
