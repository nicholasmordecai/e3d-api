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

### Linting
ESLint is being used for the linting. This used to be tslint, however they migrated both into just eslint with an option for TS support.

You need to make sure if you want the linter to work in VS code, that you have the following plugin install in vscode: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

Once that's installed, you'll need to add the eslint to your settings.json file to make sure that problem outputs go through vscode problem tab in the terminal. To do this, use ctrl, shift, p or cmd, shift, p and put the following in the json file:

```
    ...
    "eslint.validate":[
        {  
            "language":"javascript",
            "autoFix":true
        },
        {  
            "language":"typescript",
            "autoFix":true
        }
    ]
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

# Performance
> Performance is a big must for this project. You can test the performance on your local machine by doing the following

``` sh
$ npm install -g autocannon
$ autocannon http://localhost:5454/api/v1/auth/login
```

At the time of writing this, the login route (that currently does nothing other than respond 200 ok) is getting beterrn 175k and 190k requests in the 10 seconds of testing with 10 concurrent connections.