import { CacheItem } from "./cacheItem";
import { FieldPacket } from "mysql2";

export interface IGlobalOptions {
    enabled: boolean; // is it currently running
    maxCacheLifeTimeMS: number; // how long can each cache item lasts before being nuked
    emptyCacheCycleMS: number; // how often the whole cache system is emptied
}

declare interface IGlobalCache { [queryKey: string]: CacheItem };

export class CacheManager {
    private _cache: IGlobalCache;
    private _options: IGlobalOptions;
    private _emptyCacheTimer: NodeJS.Timer;
    private _checkForExpiredTimer: NodeJS.Timer;

    constructor(options: IGlobalOptions) {
        this._options = options;

        if (options.enabled === false) {
            return;
        }

        this.init();
    }

    public init(): void {
        this._cache = {};
        this.initializeFullCacheClearCycle();
        this.initializeCacheLifeCycleCheck();
    }

    private initializeFullCacheClearCycle(): NodeJS.Timer {
        const interval: number = this._options.emptyCacheCycleMS;

        if (interval == null) {
            throw new Error('No full cache clear cycle interval was provided');
        }

        this._emptyCacheTimer = setInterval(() => {
            this.nukeCache();
        }, interval);

        return this._emptyCacheTimer;
    }

    private initializeCacheLifeCycleCheck(): NodeJS.Timer {
        const interval: number = this._options.maxCacheLifeTimeMS;

        if (interval == null) {
            throw new Error('No full cache clear cycle interval was provided');
        }

        this._checkForExpiredTimer = setInterval(() => {
            this.checkForExpiredCache();
        }, interval);

        return this._checkForExpiredTimer;
    }

    /**
     * Check for expired cache
     * 
     * Has a time complexity of O(n)
     */
    private checkForExpiredCache() {
        const curDate: number = Date.now();
        for (var index in this._cache) {
            const cacheItem = this._cache[index];
            if (cacheItem.hasExpired(curDate)) {
                this.recycleItem(cacheItem);
            }
        }
    }

    public recycleItem(cachedItem: CacheItem) {
        this.cache[cachedItem.hash] = null;
    }

    /**
     * 
     * @param queryKey 
     * @param parameters 
     * 
     * Has a time complexity of O(1)
     */
    public find(queryKey: string, parameters: Array<any>): CacheItem | never {
        const hash = this.generateHash(queryKey, parameters);
        // check that there is a base instance of a query cache from the query key
        if (this._cache[hash]) {
            return this._cache[hash];
        } else {
            return null;
        }
    }

    public addToCache(queryKey: string, paramaters: Array<any>, data: [any, FieldPacket[]]): CacheItem {
        // if the hash has already been used, then kill that cached item
        const hash: number = this.generateHash(queryKey, paramaters);
        if (this._cache[hash]) {
            this.recycleItem(this._cache[hash])
        }

        const newCacheItem = new CacheItem(hash, this._options.maxCacheLifeTimeMS, data);
        this._cache[hash] = newCacheItem;
        return newCacheItem;
    }

    public getCacheGroup(key: string | number): CacheItem {
        return this._cache[key] || null;
    }

    public nukeCache(): void {
        this._cache = {};
    }

    /**
     * Could use a UUID here but there is no need. Knowing that if the queryKey is the same and the parameters are the same then it
     * MUST return the same parameters, therefore it is by definition a unique composite key
     * @param queryKey 
     * @param parameters 
     */
    private generateHash(queryKey: string, parameters: Array<number | string | string[]>): number {
        // const parameterString = parameters.join('');
        // const hash = `${queryKey}-${parameterString}`;
        // return hash;
        const string: string = `${queryKey}-${parameters.join('')}`;
        let h: number;
        for (let i = 0; i < string.length; i++) {
            h = Math.imul(31, h) + string.charCodeAt(i) | 0;
        }
        return h;

    }

    public get cache(): IGlobalCache {
        return this._cache;
    }

    public get cachedItems() {
        return Object.keys(this._cache).length;
    }

    public get options() {
        return this._options;
    }
}