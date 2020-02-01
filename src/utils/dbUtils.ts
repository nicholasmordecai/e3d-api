import { FieldPacket, QueryError } from 'mysql2';

export function recordInsertedCorrectly(result: [any, FieldPacket[]] | QueryError): boolean {
    if (result[0].insertId != null) {
        return true;
    } else {
        return false;
    }
}

export function getLastInsertedId(result: [any, FieldPacket[]] | QueryError): number {
    if (result[0].insertId != null) {
        return result[0].insertId;
    } else {
        return null;
    }
}

export function recordUpdatedCorrectly(result: [any, FieldPacket[]] | QueryError): boolean {
    if (result[0].affectedRows != null) {
        return true;
    } else {
        return false;
    }
}

export function recordDeletedCorrectly(result: [any, FieldPacket[]] | QueryError): boolean {
    if (result[0].affectedRows >= 1) {
        return true;
    } else {
        return false;
    }
}

export function returnSingle<T>(result: [any, FieldPacket[]] | QueryError): T | null {
    if (result[0] != null) {
        return result[0][0];
    } else {
        return null;
    }
}

export function returnAll<T>(result: [any, FieldPacket[]] | QueryError): Array<T> | null {
    if (result[0] != null) {
        return result[0];
    } else {
        return null;
    }
}
