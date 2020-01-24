import * as Express from 'express';
import { Notifications } from './../models/notifications';

export enum Notification {
    objectLiked = 0,
    commented = 1,
    commentLiked = 2
}

export async function createNotification(userId: number, notifierId: number, referenceId: number, notification: Notification): Promise<void> {
    Notifications.createNotification(userId, notifierId, notification, referenceId);
}