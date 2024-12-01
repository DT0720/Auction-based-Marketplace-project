/**
 * Loader Component.
 * A simple loading spinner used to indicate ongoing processes.
 *
 * @returns {JSX.Element} - A circular spinner centered within its container.
 */

export const Loader = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
    </div>
);

/**
 * FullPageLoader Component.
 * A full-page loading spinner with a semi-transparent background, typically used to block user interaction during long-running operations.
 *
 * @returns {JSX.Element} - A full-page overlay with a centered circular spinner.
 */

export const FullPageLoader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
    </div>
);
