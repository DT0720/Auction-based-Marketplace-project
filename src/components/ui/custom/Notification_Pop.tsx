import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NotificationService } from "@/infrastructure/services/NotificationService";
import useAuth from "@/hooks/use-auth";

interface Notification {
    id: number;
    content: string;
    recieved_at: Date;
    sender_id: number;
}

function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useAuth();
    const notificationService = new NotificationService();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user?.user_id) {
                const userNotifications = await notificationService.getUserNotifications(user.user_id);
                setNotifications(userNotifications);
            }
        };

        fetchNotifications();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(interval);
    }, [user?.user_id]);

    return (
        <div className="space-y-4">
            {notifications.map((notification) => (
                <Alert key={notification.id}>
                    <AlertTitle>Notification</AlertTitle>
                    <AlertDescription>{notification.content}</AlertDescription>
                    <div className="text-sm text-gray-500 mt-1">
                        {new Date(notification.recieved_at).toLocaleString()}
                    </div>
                </Alert>
            ))}
        </div>
    );
}

export default NotificationList;
