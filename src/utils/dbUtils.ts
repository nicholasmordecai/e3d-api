import {FieldPacket, QueryError} from 'mysql2';

export function recordInsertedCorrectly(result: [any, FieldPacket[]] | QueryError): boolean {
    if (result[0].insertId != null) {
        return true;
    } else {
        return false;   
    }
}

export function returnSingle<T>(result: [any, FieldPacket[]] | QueryError): T | null {
    if(result[0] != null) {
        return result[0][0];
    } else {
        return null;
    }
}

export function returnAll<T>(result: [any, FieldPacket[]] | QueryError): Array<T> | null {
    if(result[0] != null) {
        return result[0];
    } else {
        return null;
    }
}