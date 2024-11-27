// ReviewRepository.test.ts
import { ReviewRepository } from '@/infrastructure/repositories/ReviewRepository';
import { prisma } from '@/infrastructure/database/prisma';

jest.mock('@/infrastructure/database/prisma', () => ({
  prisma: {
    review: {
      findMany: jest.fn(),
    },
  },
}));

describe('ReviewRepository', () => {
  let reviewRepository: ReviewRepository;

  beforeEach(() => {
    reviewRepository = new ReviewRepository();
  });

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