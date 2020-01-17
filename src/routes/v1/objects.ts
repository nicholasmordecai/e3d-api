import { BaseRoute } from '../../system/baseRoute';
import { createNewObject, getObjectByID, searchByKeyword} from './../../controllers/objects';

export class ObjectRoute extends BaseRoute {
    
    constructor() {
        super();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.GET('/:id', getObjectByID);
        this.POST('/create', createNewObject);
        this.POST('/search', searchByKeyword);
    }
}