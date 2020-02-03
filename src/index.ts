require('dotenv').config({ path: '.env' });

import { HTTPServer } from './system/httpServer';
import { Config } from './utils/config';
import { listObjects } from './controllers/s3';

class Main {
    private static _httpServer: HTTPServer;

    public static start() {
        Config.initalise({});
        this._httpServer = new HTTPServer();
        listObjects('e3d-resources-development', '98ea3e11-7941-4a38-ad5d-afbc20e7dd81/test.txt');
    }
}

Main.start();
