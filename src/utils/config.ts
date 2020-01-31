interface IConfigExample {
    env: string;
    required: boolean;
    type: string;
}

export interface IOptions {
    mysqlHost?: string;
    mysqlUser?: string;
    mysqlPassword?: string;
    mysqlDatabase?: string;
    mysqlPort?: number;
    accessTokenSecret?: string;
}

export class Config {
    public static options: IOptions;

    private static readonly emptyConfig: { [key: string]: IConfigExample } = {
        mysqlHost: { env: 'MYSQL_DB_HOST', required: true, type: 'string' },
        mysqlUser: { env: 'MYSQL_DB_USER', required: true, type: 'string' },
        mysqlPassword: { env: 'MYSQL_DB_PASSWORD', required: true, type: 'string' },
        mysqlDatabase: { env: 'MYSQL_DB_DATABASE', required: true, type: 'string' },
        mysqlPort: { env: 'MYSQL_DB_PORT', required: true, type: 'number' },
        accessTokenSecret: { env: 'JWT_ACCESS_SECRET', required: true, type: 'string' },
    }

    public static initalise(config: IOptions): IOptions {
        const confirmedConfig: IOptions = {};
        let throwError: boolean = false;
        let errorString: string = '';

        for (const key in Config.emptyConfig) {
            if (Config.emptyConfig != null) {
                const ex: IConfigExample = Config.emptyConfig[key];
                const envVar = process.env[ex.env];

                // get the environment
                if (envVar != null) {
                    try {
                        confirmedConfig[key] = Config.castToCorrectType(envVar, ex.type);
                    } catch (reason) {
                        throwError = true;
                        errorString += reason + ` for config option: ${key}`;
                    }
                }

                // lastly, use the config passed to override any environment variables
                if (config[key] != null && typeof (config[key]) === ex.type) {
                    confirmedConfig[key] = config[key];
                }
            }
        }

        for (const key in Config.emptyConfig) {
            if (Config.emptyConfig != null) {
            // if the option is required, however it doesn't exist then throw error
                if (Config.emptyConfig[key].required === true && confirmedConfig[key] == null) {
                    errorString += `\n Missing config option: ${key} of type ${Config.emptyConfig[key].type}`;
                    throwError = true;

                    // break the loop here, as there is no point checking type of a missing option
                    continue;
                }

                // check if the type of the config is as expected
                const configType = typeof (confirmedConfig[key]);
                if (configType !== Config.emptyConfig[key].type) {
                    errorString += `
                        \n Invalid config type for option: ${key}. 
                        \n\tExpected (${Config.emptyConfig[key].type}) --- Actual (${typeof (confirmedConfig[key])})`;
                    throwError = true;
                }
            }
        }

        if (throwError === true) {
            throw errorString;
        }

        Config.options = confirmedConfig;

        return confirmedConfig;
    }

    private static castToCorrectType(variable: any, type: string) {
        switch (type) {
        case 'string':
            return variable.toString();
        case 'boolean':
            return Config.getBoolean(variable);
        case 'number':
            return parseInt(variable);
        case 'bigint':
            return parseInt(variable);
        case 'undefined':
            throw new Error(`Config variable: ${variable} is of type undefined`);
        }
    }

    private static getBoolean(value: boolean | number | string): boolean {
        if (value === true || value === 'true' || value === 1 || value === '1' || value === 'yes') {
            return true;
        } else if (value === false || value === 'false' || value === 0 || value === '0' || value === 'no') {
            return false;
        } else {
            throw new Error(`\n Could not correctly parse boolean - ${value}`);
        }
    }
}
