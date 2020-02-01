import { BaseRoute } from '../../system/baseRoute';
import {
    createCollection,
    updateCollection,
    addObjectToCollection,
    removeObjectFromCollection,
    removeCollection,
    findCollectionByID }
    from './../../controllers/collections';

export class CollectionsRoute extends BaseRoute {
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.get('/:collection', findCollectionByID);
        this.post('/create', createCollection, true);
        this.put('/:collection', updateCollection, true);
        this.post('/:collection/add-object', addObjectToCollection, true);
        this.delete('/:collection/remove-object', removeObjectFromCollection, true);
        this.delete('/:collection', removeCollection, true);
    }
}
