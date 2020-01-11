import * as Express from 'express';

/**
 * A utility class for making responses much easier and faster to write
 */

/** 
 * 200's - Success
 */

export function Success(response: Express.Response, data?: any) {
    response.status(200).json(data);
}

/**
 * 400's - Errors
 */

 // 400
export function BadRequest(response: Express.Response, error?: any) {
    response.status(400).json(error);
}

// 401
export function Unauthorized(response: Express.Response, error?: any) {
    response.status(401).json(error);
}

// 403
export function Forbidden(response: Express.Response, error?: any) {
    response.status(403).json(error);
}

// 404
export function NotFound(response: Express.Response, error?: any) {
    response.status(404).json(error);
}

// 429
export function TooManyRequests(response: Express.Response, error?: any) {
    response.status(429).json(error);
}

/**
 * 500's - Internal Server Errors
 */

 // 500
 export function InternalServerError(response: Express.Response, error?: any) {
    response.status(500).json(error);

 }

 // 501
 export function NotImplemented(response: Express.Response, error?: any) {
    response.status(501).json(error);

 }

 // 502
 export function BadGateway(response: Express.Response, error?: any) {
    response.status(502).json(error);

 }

 // 503
 export function ServiceUnavailable(response: Express.Response, error?: any) {
    response.status(503).json(error);
     
 }