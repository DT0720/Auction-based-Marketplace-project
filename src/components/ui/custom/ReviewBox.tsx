/**
 * ReviewBox Component.
 * Displays a visual representation of a rating system using stars.
 * The component shows filled, half-filled, and empty stars based on the rating.
 * It also displays the total rating value and the number of reviews.
 *
 * @param {Object} props - The props for the component.
 * @param {number} props.rating - The rating value to display (between 0 and totalRating).
 * @param {number} props.totalReviews - The total number of reviews.
 * @param {number} [props.totalRating=5] - The maximum rating value (default is 5).
 * @param {string} [props.className=""] - Additional CSS classes to apply to the container.
 *
 * @returns {JSX.Element} - A component displaying the rating stars and review information.
 */

export default function ReviewBox({
    rating,
    totalReviews,
    totalRating = 5,
    className = "",
}: {
    rating: number;
    totalReviews: number;
    totalRating?: number;
    className?: string;
}) {
    const filledStars = Math.max(0, Math.min(totalRating, Math.floor(rating)));
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = Math.max(
        0,
        totalRating - filledStars - (halfStar ? 1 : 0)
    );

    return (
        <div className={`flex items-center ${className}`}>
            {/* Filled Stars */}
            {[...Array(filledStars)].map((_, index) => (
                <span key={`filled-${index}`} className="text-yellow-500 mr-1">
                    &#9733;
                </span>
            ))}

            {/* Half Star */}
            {halfStar && <span className="text-yellow-500 mr-1">&#189;</span>}

            {/* Empty Stars */}
            {[...Array(emptyStars)].map((_, index) => (
                <span key={`empty-${index}`} className="text-gray-300 mr-1">
                    &#9733;
                </span>
            ))}

            <span className="text-gray-600 ml-2">
                {rating} / {totalRating} ({totalReviews} Reviews)
            </span>
        </div>
    );
}
