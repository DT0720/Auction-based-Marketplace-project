// ReviewRepository.test.ts
// Import the ReviewRepository class to be tested and the prisma client mock
import { ReviewRepository } from '@/infrastructure/repositories/ReviewRepository';
import { prisma } from '@/infrastructure/database/prisma';

// Mock the prisma client to isolate tests from the real database
jest.mock('@/infrastructure/database/prisma', () => ({
    prisma: {
        review: {
            findMany: jest.fn(),// Mock the findMany method used in tests
        },
    },
}));

// Define a test suite for the ReviewRepository class
describe('ReviewRepository', () => {
    let reviewRepository: ReviewRepository;

    // Instantiate a new ReviewRepository before each test
    beforeEach(() => {
        reviewRepository = new ReviewRepository();
    });

    // Clear all mocked functions after each test to prevent test data leakage
    afterEach(() => {
        jest.clearAllMocks();
    });


    it('should fetch reviews by buyer ID', async () => {
        // Arrange
        const buyerId = 1;
        const mockReviews = [
            {
                review_id: 1,
                review_content: 'Excellent product!',
                buyer_id: buyerId,
                product_id: 2,
                rating: 5,
                buyer: { id: buyerId, user_id: buyerId, name: 'Alice' },
                product: { id: 2, product_name: 'Gadget' },
            },
        ];
        (prisma.review.findMany as jest.Mock).mockResolvedValue(mockReviews);

        // Act
        const reviews = await reviewRepository.getReviewsByUserId(buyerId);
        console.log('Fetched Reviews:', reviews);

        // Assert
        expect(prisma.review.findMany).toHaveBeenCalledWith({
            where: { user_id: buyerId },
            include: { buyer: true, product: true },
        });
        expect(reviews).toEqual(mockReviews);
    });
});