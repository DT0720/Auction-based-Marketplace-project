import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function NotificationList() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Replace with your own logic to receive notifications
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      setNotifications((prev) => [...prev, event.data]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      {notifications.map((message, index) => (
        <Alert key={index}>
          <AlertTitle>Notification</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

export default NotificationList;
