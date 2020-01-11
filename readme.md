# E3D API

## Installation

``` sh
$ npm install
```

## Usage

### Local Envs
> Create a .env file in the root of the directory and pase the following.
> You need to put the values of your own local database here

```
MYSQL_DB_HOST=http://localhost
MYSQL_DB_USER=user
MYSQL_DB_PASSWORD=password
MYSQL_DB_DATABASE=database
MYSQL_DB_PORT=3306
JWT_ACCESS_SECRET=abcdefg

```

###  To run locally
``` sh
$ npm run dev
```

> To use the node debugger in vscode, once it's running in dev (required for the --inspect) then go to the debug panel (Ctl + Shift + D). Then Select Node:Nodemon and press play. If you don't have a configuration, add a configuration and paste the following:

``` json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "attach",
            "name": "Node: Nodemon",
            "processId": "${command:PickProcess}",
            "restart": true,
            "protocol": "inspector"
        }
    ]
}

```

## Testing

``` sh
$ npm test
```

