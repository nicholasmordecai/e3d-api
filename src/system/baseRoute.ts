import * as Express from 'express';
import { restrictedRoute } from './../controllers/auth';

export class BaseRoute {
    protected router: Express.Router;

    constructor() {
        this.router = Express.Router();
    }

    GET(route: string, handler: any, restructed: boolean = false) {
        if(restructed) {
            this.router.get(`${route}`, restrictedRoute, handler);
        } else {
            this.router.get(`${route}`, handler);
        }
    }

    POST(route: string, handler: any, restructed: boolean = false) {
        if(restructed) {
            this.router.post(`${route}`, restrictedRoute, handler);
        } else {
            this.router.post(`${route}`, handler);
        }
    }

    PUT(route: string, handler: any, restructed: boolean = false) {
        if(restructed) {
            this.router.put(`${route}`, restrictedRoute, handler);
        } else {
            this.router.put(`${route}`, handler);
        }
    }

    PATCH(route: string, handler: any, restructed: boolean = false) {
        if(restructed) {
            this.router.patch(`${route}`, restrictedRoute, handler);
        } else {
            this.router.patch(`${route}`, handler);
        }
    }

    DELETE(route: string, handler: any, restructed: boolean = false) {
        if(restructed) {
            this.router.delete(`${route}`, restrictedRoute, handler);
        } else {
            this.router.delete(`${route}`, handler);
        }
    }

    public get expressRouter(): Express.Router {
        return this.router;
    }
}