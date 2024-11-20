import { ToastAction } from "@/components/ui/toast"; // Adjust the import based on your project structure

const TOAST_DURATION = 3000; // Default duration for toasts

// Function for Success Toast
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
    action: actionText ? <ToastAction altText="Action">{actionText}</ToastAction> : undefined,
    duration: duration, // Duration
  });
};

// Function for Error Toast
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
    action: actionText ? <ToastAction altText="Action">{actionText}</ToastAction> : undefined,
    duration: duration, // Duration
  });
};

// Function for Warning Toast
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
    action: actionText ? <ToastAction altText="Action">{actionText}</ToastAction> : undefined,
    duration: duration, // Duration
  });
};
