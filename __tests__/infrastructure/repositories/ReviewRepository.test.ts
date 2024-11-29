import { prisma } from '@/infrastructure/database/prisma';
import { getReviewData,createReview } from '@/infrastructure/repositories/ReviewRepository';


jest.mock('@/infrastructure/database/prisma', () => ({
    prisma: {
        review: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

describe('getReviewData', () => {
    it('should return review data for a valid user and review ID', async () => {
        const mockReview = {
            review_id: 1,
            review_content: 'Great product!',
            user_id: 1,
            product_id: 1,
            rating: 5,
            buyer: { id: 1, name: 'John Doe' },
            product: { id: 1, name: 'Product 1' },
        };

        (prisma.review.findUnique as jest.Mock).mockResolvedValue(mockReview);

        const result = await getReviewData(1, 1);

        expect(result).toEqual(mockReview);
    });

    it('should throw an error if review is not found', async () => {
        (prisma.review.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(getReviewData(1, 1)).rejects.toThrow('Review not found or user does not have access to this review');
    });

    it('should throw an error if user does not have access to the review', async () => {
        const mockReview = {
            review_id: 1,
            review_content: 'Great product!',
            user_id: 2,
            product_id: 1,
            rating: 5,
            buyer: { id: 2, name: 'Jane Doe' },
            product: { id: 1, name: 'Product 1' },
        };

        (prisma.review.findUnique as jest.Mock).mockResolvedValue(mockReview);

        await expect(getReviewData(1, 1)).rejects.toThrow('Review not found or user does not have access to this review');
    });
});
describe('createReview', () => {
    it('should create a new review', async () => {
        const mockReview = {
            review_id: 1,
            review_content: 'Great product!',
            user_id: 1,
            product_id: 1,
            rating: 5,
        };

        (prisma.review.create as jest.Mock).mockResolvedValue(mockReview);

        const result = await createReview(1, 1, 'Great product!', 5);

        expect(result).toEqual(mockReview);
        expect(prisma.review.create).toHaveBeenCalledWith({
            data: {
                review_content: 'Great product!',
                user_id: 1,
                product_id: 1,
                rating: 5,
            },
        });
    });
});