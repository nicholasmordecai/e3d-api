import {FieldPacket, QueryError} from 'mysql2';
import {MySQL} from './../system/mysql';

/* eslint-disable */
export enum TokenTypes {
    'refreshToken' = 0,
    'passwordResetToken' = 1,
    'emailVerificationToken' = 2
};

export interface Token {
    id: number;
    token_type: number;
    user_id: number;
    expiration_date: string;
};
/* eslint-enable */

export class Tokens {
    public static async findOneByID(userId: number, tokenType: number): Promise<Token | null> {
        const query = 'SELECT * FROM tokens WHERE user_id = ? AND token_type = ? LIMIT 1';
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [userId, tokenType]);
        if (result[0] != null) {
            return result[0][0];
        } else {
            return null;
        }
    }

    public static async insertOne(tokenType: number, userId: number, token: string) {
        const query = `
            INSERT INTO tokens
            (token_type, user_id, token)
            VALUES
            (?, ?, ?);
        `;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [tokenType, userId, token]);
        if (result[0] != null) {
            return result[0];
        } else {
            return null;
        }
    }

    public static async updateTokenValue(userId: number, token: string, tokenType: number) {
        const query = `
            UPDATE tokens
            SET token = ?
            WHERE user_id = ?
            AND token_type = ?;
        `;
        const result: [any, FieldPacket[]] | QueryError = await MySQL.execute(query, [token, userId, tokenType]);
        if (result[0] != null) {
            return result[0];
        } else {
            return null;
        }
    }
};
