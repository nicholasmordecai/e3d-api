import { Router } from 'express';
import { restrictedRoute } from './../controllers/auth';

export class BaseRoute {
    protected router: Router;

    constructor() {
        // eslint-disable-next-line new-cap
        this.router = Router();
    }

    get(route: string, handler: any, restricted: boolean = false) {
        if (restricted) {
            this.router.get(`${route}`, restrictedRoute, handler);
        } else {
            this.router.get(`${route}`, handler);
        }
    }

    post(route: string, handler: any, restricted: boolean = false) {
        if (restricted) {
            this.router.post(`${route}`, restrictedRoute, handler);
        } else {
            this.router.post(`${route}`, handler);
        }
    }

    put(route: string, handler: any, restricted: boolean = false) {
        if (restricted) {
            this.router.put(`${route}`, restrictedRoute, handler);
        } else {
            this.router.put(`${route}`, handler);
        }
    }

    patch(route: string, handler: any, restricted: boolean = false) {
        if (restricted) {
            this.router.patch(`${route}`, restrictedRoute, handler);
        } else {
            this.router.patch(`${route}`, handler);
        }
    }

    delete(route: string, handler: any, restricted: boolean = false) {
        if (restricted) {
            this.router.delete(`${route}`, restrictedRoute, handler);
        } else {
            this.router.delete(`${route}`, handler);
        }
    }

    public get expressRouter(): Router {
        return this.router;
    }
}
