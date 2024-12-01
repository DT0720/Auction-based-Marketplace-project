import { ToastAction } from "@/components/ui/toast"; // Adjust the import based on your project structure

const TOAST_DURATION = 3000; // Default duration for toasts

/**
 * Displays a success toast message.
 *
 * @param {Function} toast - The toast function to trigger the toast.
 * @param {string} toastDescription - The description text of the toast.
 * @param {string} [toastTitle] - The optional title of the toast.
 * @param {string} [actionText] - The optional action text for the toast.
 * @param {number | null} [duration=TOAST_DURATION] - The optional duration of the toast, in milliseconds (default is 3000ms).
 *
 * @returns {void}
 */
export const successMessage = (
    toast: Function,
    toastDescription: string,
    toastTitle?: string,
    actionText?: string,
    duration: number | null = TOAST_DURATION // Default to 3 seconds
) => {
    toast({
        title: toastTitle, // Optional title
        description: toastDescription,
        variant: "default", // Success variant has default styling
        className: "bg-green-400 text-white", // Green background for success
        action: actionText ? (
            <ToastAction altText="Action">{actionText}</ToastAction>
        ) : undefined,
        duration: duration, // Duration
    });
};

/**
 * Displays an error toast message.
 *
 * @param {Function} toast - The toast function to trigger the toast.
 * @param {string} toastDescription - The description text of the toast.
 * @param {string} [toastTitle] - The optional title of the toast.
 * @param {string} [actionText] - The optional action text for the toast.
 * @param {number | null} [duration=TOAST_DURATION] - The optional duration of the toast, in milliseconds (default is 3000ms).
 *
 * @returns {void}
 */
export const errorMessage = (
    toast: Function,
    toastDescription: string,
    toastTitle?: string,
    actionText?: string,
    duration: number | null = TOAST_DURATION // Default to 3 seconds
) => {
    toast({
        title: toastTitle, // Optional title
        description: toastDescription,
        variant: "destructive", // Error variant uses destructive styling
        className: "bg-red-500 text-white", // Red background for error
        action: actionText ? (
            <ToastAction altText="Action">{actionText}</ToastAction>
        ) : undefined,
        duration: duration, // Duration
    });
};

/**
 * Displays a warning toast message.
 *
 * @param {Function} toast - The toast function to trigger the toast.
 * @param {string} toastDescription - The description text of the toast.
 * @param {string} [toastTitle] - The optional title of the toast.
 * @param {string} [actionText] - The optional action text for the toast.
 * @param {number | null} [duration=TOAST_DURATION] - The optional duration of the toast, in milliseconds (default is 3000ms).
 *
 * @returns {void}
 */
export const warningMessage = (
    toast: Function,
    toastDescription: string,
    toastTitle?: string,
    actionText?: string,
    duration: number | null = TOAST_DURATION // Default to 3 seconds
) => {
    toast({
        title: toastTitle, // Optional title
        description: toastDescription,
        variant: "default", // Warning variant uses default styling
        className: "bg-yellow-300 text-white", // Yellow background for warning
        action: actionText ? (
            <ToastAction altText="Action">{actionText}</ToastAction>
        ) : undefined,
        duration: duration, // Duration
    });
};
