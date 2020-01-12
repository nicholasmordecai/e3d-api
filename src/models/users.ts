import {FieldPacket, QueryError} from 'mysql2';
import { MySQL } from './../system/mysql';

export interface User {
    id: number;
    firstname?: string;
    lastname?: string;
    email: string;
    password: string;
    email_verified: string;
    banned: number;
    exp: number;
    level: number;
}

export class UserModel {
    public static async findOneByID(id: number): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE id = ? LIMIT 1';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [id]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async findOneByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [email]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async findOneByRefreshToken(refreshToken: string): Promise<User | null> {
        const query = `
            SELECT * FROM users
            LEFT JOIN tokens
                ON tokens.user_id = users.id
            WHERE tokens.token = ?
            LIMIT 1;`;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [refreshToken]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async updateRefreshToken(id: number, token: string): Promise<[any, FieldPacket[]] | QueryError> {
        const query = 'UPDATE users set refresh_token = ? WHERE id = ?';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [token, id]);
        if(result[0] != null) {
            return result[0];
        } else {
            return null;
        }
    }
}