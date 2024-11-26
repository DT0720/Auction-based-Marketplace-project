'use client';
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

const HomePage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchReviews() {
      if (user) {
        setLoading(true);
        const fetchedReviews = await getReviewData(user.user_id);
        setReviews(fetchedReviews);
        setLoading(false);
      }
    }
    fetchReviews();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (reviews.length === 0) {
    return <div>No reviews found.</div>;
  }

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