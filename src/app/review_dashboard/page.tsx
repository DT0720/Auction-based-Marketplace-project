// src/app/review_dashboard/page.tsx

'use client';
import React, { useEffect, useState } from 'react';
import { Review } from '@/domain/entities/Review';
import getReviewData from '@/application/usecases/reviewDashboard/getReviewData';

const HomePage: React.FC = () => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const reviewId = 1; // Replace with the actual review ID you want to fetch

  useEffect(() => {
    async function fetchReview() {
      setLoading(true);
      const fetchedReview = await getReviewData(reviewId);
      setReview(fetchedReview);
      setLoading(false);
    }

    fetchReview();
  }, [reviewId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!review) {
    return <div>No review found.</div>;
  }

  return (
    <div>
      <h3>Review by User {review.user_id}</h3>
      <p>{review.review_content}</p>
      <p>Rating: {review.rating}</p>
      {/* Render other review details as needed */}
    </div>
  );
};

export default HomePage;