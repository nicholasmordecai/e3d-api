import * as Express from 'express';
import { BadRequest, NotFound, Success, InternalServerError } from '../utils/respond';
import { Notifications } from './../models/notifications';

export enum Notification {
    objectLiked = 0,
    commented = 1,
    commentLiked = 2
}

export async function createNotification(userId: number, notifierId: number, referenceId: number, notification: Notification): Promise<void> {
    Notifications.createNotification(userId, notifierId, notification, referenceId);
}

export async function notificationRead(request: Express.Request, response: Express.Response): Promise<void> {
    const notificationId: number = parseInt(request.body.notificationId);

    if(!notificationId) {
        return NotFound(response, 'No notification ID was passed');
    }

    try {
    const updated = await Notifications.markAsSeen(notificationId, request.userId);
        if(updated) {
            Success(response, {success: true});
        } else {
            InternalServerError(response, {error: 'unknown error when marking notification as seen'});
        }
    }
    catch(error) {
        InternalServerError(response, {error: error}); 
    }
}