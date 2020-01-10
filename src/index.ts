require('dotenv').config({ path: '.env' });

import { HTTPServer } from './system/httpServer';

class Main {

    private static _httpServer: HTTPServer;

    public static start() {
        this._httpServer = new HTTPServer();
    }
}

Main.start();