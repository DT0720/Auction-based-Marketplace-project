import { AuctionRepository } from "@/infrastructure/repositories/AuctionRepository";
import { prisma } from "@/infrastructure/database/prisma";
import { Auction } from "@/domain/entities/Auction";
import { Product } from "@/domain/entities/Product";
import { Review } from "@/domain/entities/Review";
import { Bid } from "@/domain/entities/Bid";
import { Prisma } from "@prisma/client";

jest.mock("@/infrastructure/database/prisma", () => ({
  prisma: {
    auction: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
  },
}));

describe("AuctionRepository", () => {
  let auctionRepository: AuctionRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    auctionRepository = new AuctionRepository();
  });

  describe("create", () => {
    it("should create a new auction successfully", async () => {
      const mockAuction = {
        product_id: 1,
        seller_id: 2,
        minimum_price: 100,
        buy_it_now_price: 200,
        status: true,
        start_time: new Date(),
        end_time: new Date(),
      };

      (prisma.auction.create as jest.Mock).mockResolvedValue(mockAuction);

      const auctionEntity = new Auction(
        0,
        mockAuction.product_id,
        mockAuction.seller_id,
        mockAuction.minimum_price,
        mockAuction.buy_it_now_price,
        mockAuction.status,
        mockAuction.start_time,
        mockAuction.end_time
      );

      const result = await auctionRepository.create(auctionEntity);

      expect(prisma.auction.create).toHaveBeenCalledWith({
        data: {
          product_id: auctionEntity.productId,
          seller_id: auctionEntity.sellerId,
          minimum_price: new Prisma.Decimal(auctionEntity.minimumPrice),
          buy_it_now_price: new Prisma.Decimal(auctionEntity.buyItNowPrice),
          status: auctionEntity.status,
          start_time: auctionEntity.startTime,
          end_time: auctionEntity.endTime,
        },
      });
      expect(result).toBe(true);
    });

    it("should return false if creation fails", async () => {
      (prisma.auction.create as jest.Mock).mockRejectedValue(new Error("Database error"));

      const auctionEntity = new Auction(-1, 1, 2, 100, 200, true, new Date(), new Date());
      const result = await auctionRepository.create(auctionEntity);

      expect(prisma.auction.create).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe("findActiveAuctionsById", () => {
    it("should find active auctions by ID", async () => {
      const mockProduct = {
        id: 1,
        auction: {
          id: 1,
          status: true,
        },
      };

      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);

      const result = await auctionRepository.findActiveAuctionsById(1);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          auction: {
            is: {
              status: true,
            },
          },
        },
        include: {
          auction: true,
        },
      });
      expect(result).toEqual({
        product: Product.fromJson(mockProduct),
        auction: Auction.fromJson(mockProduct.auction),
      });
    });

    it("should return null if no active auctions are found", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

      const result = await auctionRepository.findActiveAuctionsById(1);

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should find an auction by ID", async () => {
      const mockProduct = {
        id: 1,
        auction: {
          id: 1,
          status: true,
        },
      };

      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);

      const result = await auctionRepository.findById(1);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          auction: {
            is: {
              status: true,
            },
          },
        },
        include: {
          auction: true,
        },
      });
      expect(result).toEqual({
        product: Product.fromJson(mockProduct),
        auction: Auction.fromJson(mockProduct.auction),
      });
    });

    it("should return null if no auction is found", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

      const result = await auctionRepository.findById(1);

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("findAllProductsOnAuction", () => {
    it("should find all products on auction", async () => {
      const mockProducts = [
        {
          id: 1,
          auction: {
            id: 1,
            status: true,
          },
        },
        {
          id: 2,
          auction: {
            id: 2,
            status: true,
          },
        },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await auctionRepository.findAllProductsOnAuction();

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          auction: {
            is: {
              status: true,
            },
          },
        },
        include: {
          auction: true,
        },
      });
      expect(result).toEqual(
        mockProducts.map((product) => ({
          product: Product.fromJson(product),
          auction: Auction.fromJson(product.auction!),
        }))
      );
    });

    it("should return an empty array if no products are on auction", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

      const result = await auctionRepository.findAllProductsOnAuction();

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("findProductByIdWithDetails", () => {
    it("should find product details with reviews and bids", async () => {
      const mockAuctionWithDetails = {
        bid: [
          { id: 1, amount: 500 },
          { id: 2, amount: 600 },
        ],
        product: {
          id: 1,
          review: [
            { id: 1, rating: 4 },
            { id: 2, rating: 5 },
          ],
        },
      };

      (prisma.auction.findFirst as jest.Mock).mockResolvedValue(mockAuctionWithDetails);

      const result = await auctionRepository.findProductByIdWithDetails(1);

      expect(prisma.auction.findFirst).toHaveBeenCalledWith({
        where: {
          product_id: 1,
          status: true,
        },
        include: {
          bid: true,
          product: {
            include: {
              review: true,
            },
          },
        },
      });

      expect(result).toEqual({
        reviews: mockAuctionWithDetails.product.review.map(Review.fromJson),
        bids: mockAuctionWithDetails.bid.map(Bid.fromJson),
      });
    });

    it("should return null if no details are found", async () => {
      (prisma.auction.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await auctionRepository.findProductByIdWithDetails(1);

      expect(prisma.auction.findFirst).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
