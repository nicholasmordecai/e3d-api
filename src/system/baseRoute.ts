import * as Express from 'express';

export class BaseRoute {
    protected router: Express.Router;

    constructor() {
        this.router = Express.Router();
    }

    GET(route: string, handler: any) {
        this.router.get(`${route}`, handler);
    }

    POST(route: string, handler: any) {
        this.router.post(`${route}`, handler);
    }

    PUT(route: string, handler: any) {
        this.router.put(`${route}`, handler);
    }

    PATCH(route: string, handler: any) {
        this.router.patch(`${route}`, handler);
    }

    DELETE(route: string, handler: any) {
        this.router.delete(`${route}`, handler);
    }

    public get expressRouter(): Express.Router {
        return this.router;
    }
}