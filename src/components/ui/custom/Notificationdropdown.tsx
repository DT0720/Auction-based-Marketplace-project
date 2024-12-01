import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import NetworkUtils from "@/lib/networkUtils";
/**
 * @typedef {Object} Notification
 * @property {number} id - The unique identifier of the notification
 * @property {string} content - The content of the notification
 * @property {Date} recieved_at - The date and time when the notification was received
 * @property {number} sender_id - The ID of the user sending the notification
 * @property {Object} user_notifications_sender_idTouser - The user object of the sender
 * @property {string} user_notifications_sender_idTouser.username - The username of the sender
 */

interface Notification {
    id: number;
    content: string;
    recieved_at: Date;
    sender_id: number;
    user_notifications_sender_idTouser: {
        username: string;
    };
}

/**
 * NotificationDropdown Component.
 * Displays a dropdown menu containing notifications for the authenticated user.
 * The notifications are fetched from the server and updated every 5 seconds.
 * The component shows a bell icon and a badge indicating the number of unread notifications.
 * When clicked, the dropdown displays a list of notifications with their content, sender, and timestamp.
 *
 * @returns {JSX.Element} - A dropdown menu with notifications or a loading/error message.
 */

/**
 * @typedef {Object} Notification
 * @property {number} id - The unique identifier of the notification
 * @property {string} content - The content of the notification
 * @property {Date} recieved_at - The date and time when the notification was received
 * @property {number} sender_id - The ID of the user sending the notification
 * @property {Object} user_notifications_sender_idTouser - The user object of the sender
 * @property {string} user_notifications_sender_idTouser.username - The username of the sender
 */

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    /**
     * Fetches the notifications for the authenticated user.
     * Updates the notifications state and unread count.
     * Handles error states and loading status.
     */

    const fetchNotifications = async () => {
        if (!user?.user_id) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await NetworkUtils.getRequest<{ data: Notification[] }>(
                `/api/notifications/send_notification?userId=${user.user_id}`
            );

            if (response?.data) {
                setNotifications(response.data);
                setUnreadCount(response.data.length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError("Failed to load notifications");
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [user?.user_id]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="mb-1 bg-red-500 text-white rounded-full px-1 text-xs">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                {isLoading ? (
                    <DropdownMenuItem disabled>Loading notifications...</DropdownMenuItem>
                ) : error ? (
                    <DropdownMenuItem className="text-red-500">{error}</DropdownMenuItem>
                ) : notifications.length === 0 ? (
                    <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem key={notification.id}>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm">{notification.content}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500">
                                        From:{" "}
                                        {notification.user_notifications_sender_idTouser
                                            ?.username || "System"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(notification.recieved_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
