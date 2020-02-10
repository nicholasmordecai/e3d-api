import { FieldPacket } from "mysql2";

export class CacheItem {
    private _hash: number;
    private _endOfLife: number;
    private _data: [any, FieldPacket[]];

    constructor(hashKey: number, lifespan: number, data: [any, FieldPacket[]]) {
        this._endOfLife = Date.now() + lifespan;
        this._hash = hashKey;
        this._data = data;
    }

    public hasExpired(comparisonDate: number): Boolean {
        if(this._endOfLife <= comparisonDate) {
            return true;
        } else {
            return false;
        }
    }

    public get endOfLife(): number {
        return this._endOfLife;
    }

    public get hash(): number {
        return this._hash;
    }

    public get data(): [any, FieldPacket[]] {
        return this._data;
    }
}