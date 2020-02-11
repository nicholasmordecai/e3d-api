import * as Express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as http from 'http';
import * as cors from 'cors';

http.globalAgent.maxSockets = Infinity;

// import API routers
import { V1Routes } from './../routes/v1/v1Routes';

export class HTTPServer {
    public _expressServer: Express.Application;

    constructor() {
        this.start();
    }

    private async start() {
        // eslint-disable-next-line new-cap
        this._expressServer = Express();
        // setup security (using helmet)
        this._expressServer.use(helmet());

        // setup the json parser middleware
        this._expressServer.use(bodyParser.urlencoded({ extended: true }));
        this._expressServer.use(bodyParser.json());

        // use compression to reduce the payload size in the data returned in response to any request
        this._expressServer.use(compression());

        // use the cookie parser module to enable json data being accepted
        this._expressServer.use(cookieParser());

        this._expressServer.use(cors());

        // list the accessible API versions here
        this._expressServer.use('/api/v1', V1Routes.setup());
        // this._expressServer.use('/api/v1');

        this._expressServer.listen(5454, () => {
            console.log('server running');
        });
    }
}
