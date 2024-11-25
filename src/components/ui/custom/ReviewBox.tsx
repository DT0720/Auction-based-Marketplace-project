export default function ReviewBox({ rating, totalReviews, totalRating = 5, className = "" }: { rating: number; totalReviews: number; totalRating?: number; className?: string }) {
    const filledStars = Math.max(0, Math.min(totalRating, Math.floor(rating)));
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = Math.max(0, totalRating - filledStars - (halfStar ? 1 : 0));
  
    return (
      <div className={`flex items-center ${className}`}>
        {/* Filled Stars */}
        {[...Array(filledStars)].map((_, index) => (
          <span key={`filled-${index}`} className="text-yellow-500 mr-1">&#9733;</span>
        ))}
        
        {/* Half Star */}
        {halfStar && <span className="text-yellow-500 mr-1">&#189;</span>}
  
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="text-gray-300 mr-1">&#9733;</span>
        ))}
  
        <span className="text-gray-600 ml-2">{rating} / {totalRating} ({totalReviews} Reviews)</span>
      </div>
    );
  }
  