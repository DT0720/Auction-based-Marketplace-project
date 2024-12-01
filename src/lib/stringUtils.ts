/**
 * Formats a given amount as currency in USD.
 *
 * @param {number | null} amount - The amount to format. If null, it defaults to 0.00.
 * @returns {string} - The formatted currency string in USD (e.g., "$1,234.56").
 */
export const formatCurrency = (amount: number | null): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount ?? 0.0);
