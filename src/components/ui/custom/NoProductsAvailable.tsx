/**
 * NoProductsAvailable Component.
 * Displays an image when no products are available.
 * The component is designed to inform users that there are no products available at the moment.
 *
 * It includes:
 * - An image indicating no products are found.
 *
 * @returns {JSX.Element} - A centered image indicating no available products.
 */

export default function NoProductsAvailable() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center mx-auto">
            <img
                src="/assets/no-product-found.png"
                alt="No Products"
                className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto mb-8"
            />
        </div>
    );
}
