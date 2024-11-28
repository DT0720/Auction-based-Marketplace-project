'use client';

// Import necessary components and hooks
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React, { useEffect, useState } from 'react';
import { Review } from '@/domain/entities/Review';
import getReviewData from '@/application/usecases/reviewDashboard/getReviewData';
import useAuth from '@/hooks/use-auth';

// Define the HomePage component
const HomePage: React.FC = () => {
   // State to store reviews and loading status
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Get the authenticated user using the useAuth hook
  const { user } = useAuth();
 // Fetch reviews when the component mounts or the user changes
  useEffect(() => {
    async function fetchReviews() {
      if (user) {
        setLoading(true); // Set loading to true while fetching data
        const fetchedReviews = await getReviewData(user.user_id); // Fetch reviews for the user
        setReviews(fetchedReviews); // Update the reviews state with fetched data
        setLoading(false);  // Set loading to false after data is fetched
      }
    }
    fetchReviews();
  }, [user]);

  // Render loading state

  if (loading) {
    return <div>Loading...</div>;
  }

   // Render message if no reviews are found
  if (reviews.length === 0) {
    return <div>No reviews found.</div>;
  }
// Render the reviews in cards
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
      {reviews.map((review) => (
        <Card key={review.review_id} className="mb-4 border border-gray-300 shadow-lg">
          <CardHeader className="bg-gray-100 p-4">
            <CardTitle className="text-lg font-semibold">Review by User {review.user_id}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <CardDescription className="mb-2">{review.review_content}</CardDescription>
            <p className="text-sm text-gray-600">Rating: {review.rating}</p>
          </CardContent>
          <CardFooter className="bg-gray-100 p-4">
            <p className="text-sm text-gray-600">Product ID: {review.product_id}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default HomePage;
