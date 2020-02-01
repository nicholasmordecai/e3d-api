import { Response } from 'express';
import { Config } from './config';


interface IAPIError {
    code: number;
    reason?: string;
    data?: any;
    time: number;
    error?: any;
    debug?: any;
}

/**
 * A utility class for making responses much easier and faster to write
 */

/**
 * 200's - Success
 */

export function success(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(200).json(generateResponseBody(code, reason, data, error, debug));
}

/**
 * 400's - Errors
 */

// 400
export function badRequest(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(400).json(generateResponseBody(code, reason, data, error, debug));
}

// 401
export function unauthorized(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(401).json(generateResponseBody(code, reason, data, error, debug));
}

// 403
export function forbidden(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(403).json(generateResponseBody(code, reason, data, error, debug));
}

// 404
export function notFound(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(404).json(generateResponseBody(code, reason, data, error, debug));
}

// 429
export function tooManyRequests(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(429).json(generateResponseBody(code, reason, data, error, debug));
}

/**
 * 500's - Internal Server Errors
 */

// 500
export function internalServerError(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(500).json(generateResponseBody(code, reason, data, error, debug));
}

// 501
export function notImplemented(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(501).json(generateResponseBody(code, reason, data, error, debug));
}

// 502
export function badGateway(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(502).json(generateResponseBody(code, reason, data, error, debug));
}

// 503
export function serviceUnavailable(response: Response, code: number, reason: string, data?: any, error?: any, debug?: any) {
    response.status(503).json(generateResponseBody(code, reason, data, error, debug));
}

function generateResponseBody(code: number, reason: string, data?: any, error?: any, debug?: any) {
    const responseBody: IAPIError = {
        code: code,
        time: new Date().getTime(),
    };

    if (data != null) {
        responseBody.data = data;
    }

    if (error != null) {
        responseBody.error = error;
    }

    if (reason != null) {
        responseBody.reason = reason;
    }

    if (Config.options.environment === 'development' && debug != null) {
        responseBody.debug = debug;
    }

    return responseBody;
}
