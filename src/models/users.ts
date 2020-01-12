import {FieldPacket, QueryError} from 'mysql2';
import { MySQL } from './../system/mysql';

export interface IUser {
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

export class Users {
    public static async findOneByID(id: number): Promise<IUser | null> {
        const query = 'SELECT * FROM users WHERE id = ? LIMIT 1';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [id]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async findOneByEmail(email: string): Promise<IUser | null> {
        const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [email]);
        if(result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async findOneByRefreshToken(refreshToken: string): Promise<IUser | null> {
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

    public static async insertOne(email: string, password: string, firstname: string = '', lastname: string = ''): Promise<IUser | null> {
        const query = `
            INSERT INTO users
            (firstname, lastname, email, password)
            VALUES
            (?, ?, ?, ?);
        `;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [firstname, lastname, email, password]);
        if(result[0] != null) {
            return result[0];
        } else {
            return null;
        }
    }

    public static async updatePassword() {
        // const query = 'UPDATE users set refresh_token = ? WHERE id = ?';
        // const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [token, id]);
        // if(result[0] != null) {
        //     return result[0];
        // } else {
        //     return null;
        // }
    }
}