import * as fs from 'fs';
import { MySQL } from './../src/system/mysql';
import { Config } from './../src/utils/config';
require('dotenv').config({ path: 'test.env' });

class TestSetup {
    public static createTables(): Promise<boolean> {
        Config.initalise({});
        return new Promise(async (resolve, reject) => {
            try {
                const createTableSql = fs.readFileSync(__dirname + '/db/mysql_create.sql').toString();
                await MySQL.execute(createTableSql, []);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
}

TestSetup.createTables()
    .then((completed) => {
        console.log(completed);
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
