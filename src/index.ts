require('dotenv').config({ path: '.env' });

import { HTTPServer } from './system/httpServer';
import { Config } from './utils/config';

class Main {

    private static _httpServer: HTTPServer;

    public static start() {
        Config.initalise({});
        this._httpServer = new HTTPServer();
    }
}

Main.start();