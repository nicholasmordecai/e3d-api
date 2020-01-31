import * as Express from 'express';
import { Notifications } from './../models/notifications';
import { Respond } from './../utils/respond';

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

    if (!notificationId) {
        return Respond.notFound(response);
    }

    try {
        const updated = await Notifications.markAsSeen(notificationId, request.userId);
        if (updated) {
            return Respond.success(response, { success: true });
        } else {
            return Respond.Notification.couldNotMarkAsSeen(response, null, null, { updated: updated, notificationId: notificationId });
        }
    } catch (error) {
        return Respond.Notification.couldNotMarkAsSeen(response, null, error, { notificationId: notificationId });
    }
}
