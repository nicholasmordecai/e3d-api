import { createPool, Pool, PoolConnection, FieldPacket, QueryError } from 'mysql2/promise';
import { Config } from './../utils/config';
let connectionPool: Pool;

export class MySQL {

    public static async getUserPool(): Promise<PoolConnection> {
        if (!connectionPool) {
            connectionPool = createPool({
                host: Config.options.mysqlHost,
                user: Config.options.mysqlUser,
                password: Config.options.mysqlPassword,
                database: Config.options.mysqlDatabase,
                port: Config.options.mysqlPort,
                multipleStatements: false,
            });
        }

        return connectionPool.getConnection();
    }

    public static async execute(query: string, params: Array<any> = []): Promise<[any, FieldPacket[]] | QueryError> {
        const connection: PoolConnection = await MySQL.getUserPool();
        try {
            const result = await connection.query(query, params);
            connection.release();
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