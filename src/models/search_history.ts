import { FieldPacket, QueryError } from 'mysql2';
import { MySQL } from './../system/mysql';
import { recordInsertedCorrectly, returnAll } from '../utils/dbUtils';


/* eslint-disable */
export interface ISearchHistory {
    id: number;
    search_term: string;
    timestamp: number;
    user_tracking_id: string;
};


export interface ISearchHistoryResult {
    search_term: string;
    count: number
}
/* eslint-enable */

export class SearchHistory {
    public static async createSearchHistory(searchTerm: string, userTrackingId: string = null): Promise<boolean> {
        const query = `INSERT INTO search_history (search_term, timestamp, user_tracking_id) VALUES (?, UNIX_TIMESTAMP() * 1000, ?);`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [searchTerm, userTrackingId]);
        return recordInsertedCorrectly(result);
    }

    public static async getMostPopularSearches(limit: number = 20): Promise<ISearchHistoryResult[]> {
        const query = `
        SELECT 
            search_term, 
            count(id) AS count 
        FROM search_history 
        GROUP BY search_term 
        ORDER BY searched DESC 
        LIMIT ?;`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [limit]);
        return returnAll(result);
    }
}
