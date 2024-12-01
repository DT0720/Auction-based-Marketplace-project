import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { prisma } from "@/infrastructure/database/prisma";
import { BuyerRepository } from "@/infrastructure/repositories/BuyerRepository";
import { SellerRepository } from "@/infrastructure/repositories/SellerRepository";
import { WalletRepository } from "@/infrastructure/repositories/WalletRepository";
import { User } from "@/domain/entities/User";

jest.mock("@/infrastructure/database/prisma", () => ({
  prisma: {
    user: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn((callback: any) => callback()),
  },
}));

jest.mock("@/infrastructure/repositories/BuyerRepository", () => ({
  BuyerRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
  })),
}));

jest.mock("@/infrastructure/repositories/SellerRepository", () => ({
  SellerRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
  })),
}));

jest.mock("@/infrastructure/repositories/WalletRepository", () => ({
  WalletRepository: jest.fn().mockImplementation(() => ({
    createWallet: jest.fn(),
  })),
}));

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let mockBuyerRepository: any;
  let mockSellerRepository: any;
  let mockWalletRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockBuyerRepository = new BuyerRepository();
    mockSellerRepository = new SellerRepository();
    mockWalletRepository = new WalletRepository();
    userRepository = new UserRepository();
  });

  describe("create", () => {
    it("should create a user and associated records", async () => {
      const mockUser = {
        user_id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "securepassword",
        age: 30,
        type: "b",
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      mockBuyerRepository.create.mockResolvedValue(true);
      mockWalletRepository.createWallet.mockResolvedValue(true);

      const userEntity = User.fromJson(mockUser);
      const result = await userRepository.create(userEntity);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userEntity.name,
          email: userEntity.email,
          password: userEntity.password,
          age: userEntity.age,
          gender: userEntity.gender,
          secondary_email: userEntity.secondaryEmail,
          type: userEntity.type,
          phone: userEntity.phone,
          photo: userEntity.photo,
        },
      });
      expect(mockBuyerRepository.create).toHaveBeenCalledWith(mockUser.user_id);
      expect(mockWalletRepository.createWallet).toHaveBeenCalledWith({
        user_id: mockUser.user_id,
        current_balance: 0,
      });
      expect(result).toBe(true);
    });

    it("should return false if creation fails", async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue(new Error("Database error"));

      const userEntity = new User(-1, "John Doe", "", "", 30, 0 ,"b", "","", "");
      const result = await userRepository.create(userEntity);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe("update", () => {
    it("should update a user with valid fields", async () => {
      const mockUser = {
        user_id: 1,
        name: "Updated Name",
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const userEntity = User.fromJson(mockUser);
      const result = await userRepository.update(userEntity);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { user_id: userEntity.user_id },
        data: { name: userEntity.name },
      });
      expect(result).toBe(true);
    });

    it("should return false if update fails", async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue(new Error("Database error"));

      const userEntity = new User(-1, "John Doe", "", "", 30, 0 ,"b", "","", "");
      const result = await userRepository.update(userEntity);

      expect(prisma.user.update).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should return false if no fields to update", async () => {
      const userEntity = new User(-1, "John Doe", "", "", 30, 0 ,"b", "","", "");
      const result = await userRepository.update(userEntity);

      expect(result).toBe(false);
    });
  });

  describe("findById", () => {
    it("should find a user by ID", async () => {
      const mockUser = {
        user_id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findById(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(result).toEqual(User.fromJson(mockUser));
    });

    it("should return null if user is not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findById(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      const mockUser = {
        user_id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail("john@example.com");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "john@example.com" } });
      expect(result).toEqual(User.fromJson(mockUser));
    });

    it("should return null if user is not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByEmail("john@example.com");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "john@example.com" } });
      expect(result).toBeNull();
    });
  });

  describe("findAllUsers", () => {
    it("should retrieve all users", async () => {
      const mockUsers = [
        { user_id: 1, name: "John Doe", email: "john@example.com" },
        { user_id: 2, name: "Jane Smith", email: "jane@example.com" },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userRepository.findAllUsers();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers.map(User.fromJson));
    });
  });
});
