

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
  