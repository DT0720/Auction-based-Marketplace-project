// src/components/ui/Divider.tsx

/**
 * Divider Component.
 * A simple horizontal divider (line) with customizable styles.
 *
 * @param {Object} props - The props for the Divider component.
 * @param {string} [props.className=""] - Optional additional CSS classes to customize the divider's appearance.
 * @returns {JSX.Element} - The rendered Divider component.
 */

export default function Divider({ className = "" }: { className?: string }) {
    return <hr className={`border-t border-gray-300 my-4 ${className}`} />;
}
