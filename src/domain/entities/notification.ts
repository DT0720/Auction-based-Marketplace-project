/**
 * @fileoverview Defines the Notification interface
 * @description This interface represents the structure of a notification object
 */

/**
 * @interface Notification
 * @description Represents a notification
 * @property {number} id - The unique identifier of the notification
 * @property {number} reciever_id - The ID of the user receiving the notification
 * @property {number} sender_id - The ID of the user sending the notification
 * @property {string} content - The content of the notification
 * @property {Date} recieved_at - The date and time when the notification was received
 * @property {Object} user_notifications_sender_idTouser - The user object of the sender
 * @property {string} user_notifications_sender_idTouser.username - The username of the sender
 */
export interface Notification {
    id: number;
    reciever_id: number;
    sender_id: number;
    content: string;
    recieved_at: Date;
    user_notifications_sender_idTouser: {
        username: string;
    };
}
