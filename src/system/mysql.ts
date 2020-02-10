import { createPool, Pool, PoolConnection, FieldPacket, QueryError } from 'mysql2/promise';
import { Config } from './../utils/config';
import { CacheManager } from './cacheManager';

let connectionPool: Pool;
let cache: CacheManager;
export class MySQL {

    public static async getUserPool(): Promise<PoolConnection> {
        if (connectionPool == null) {
            connectionPool = createPool({
                host: Config.options.mysqlHost,
                user: Config.options.mysqlUser,
                password: Config.options.mysqlPassword,
                database: Config.options.mysqlDatabase,
                port: Config.options.mysqlPort,
                multipleStatements: true,
            });
        }



        return connectionPool.getConnection();
    }

    public static cacheManager() {
        if (cache == null) {
            cache = new CacheManager({
                enabled: true,
                emptyCacheCycleMS: 60 * 1000,
                maxCacheLifeTimeMS: 60 * 1000
            });
        }

        return cache;
    }

    public static async execute(query: string, params: Array<any> = [], checkCache: boolean = false): Promise<[any, FieldPacket[]] | QueryError> {
        if (checkCache === true) {
            const result = MySQL.cacheManager().find(query, params);
            if (result != null) {
                // console.log(result);
                return result.data;
            }
        }
        const connection: PoolConnection = await MySQL.getUserPool();
        try {
            const result = await connection.query(query, params);
            connection.release();
            if (checkCache === true) {
                MySQL.cacheManager().addToCache(query, params, result);
            }
            return result;
        } catch (queryError) {
            connection.release();
            throw queryError;
        }
    }

    public static async executeTransaction(query: string, params: Array<any>): Promise<[any, FieldPacket[]] | QueryError> {
        const connection: PoolConnection = await MySQL.getUserPool();
        try {
            await connection.beginTransaction();
            const result: [any, FieldPacket[]] = await connection.query(query, params);
            await connection.commit();
            connection.release();
            return result;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw new Error(error);
        }
    }
}
