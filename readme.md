# E3D API

## Installation

``` sh
$ npm install
```

## Usage

### Local Envs
> Create a .env file in the root of the directory and pase the following:

```

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

