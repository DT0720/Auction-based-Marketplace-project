import { WalletRepository } from "@/infrastructure/repositories/WalletRepository";
import { prisma } from "@/infrastructure/database/prisma";
import { Wallet } from "@/domain/entities/Wallet";

jest.mock("@/infrastructure/database/prisma", () => ({
  prisma: {
    wallet: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("WalletRepository", () => {
  let walletRepository: WalletRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    walletRepository = new WalletRepository();
  });

  describe("createWallet", () => {
    it("should create a new wallet successfully", async () => {
      const mockWalletData = {
        user_id: 1,
        current_balance: 100,
        payment_type: "credit_card",
      };

      (prisma.wallet.create as jest.Mock).mockResolvedValue(mockWalletData);

      const result = await walletRepository.createWallet(mockWalletData);

      expect(prisma.wallet.create).toHaveBeenCalledWith({
        data: {
          user_id: mockWalletData.user_id,
          current_balance: mockWalletData.current_balance,
          payment_type: mockWalletData.payment_type,
        },
      });
      expect(result).toBe(true);
    });

    it("should return false if wallet creation fails", async () => {
      (prisma.wallet.create as jest.Mock).mockRejectedValue(new Error("Database error"));

      const result = await walletRepository.createWallet({ user_id: 1, current_balance: 100 });

      expect(prisma.wallet.create).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe("getWallet", () => {
    it("should retrieve a wallet by user ID", async () => {
      const mockWallet = {
        user_id: 1,
        current_balance: 100,
      };

      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);

      const result = await walletRepository.getWallet(1);

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(result).toEqual(Wallet.fromJson(mockWallet));
    });

    it("should return null if wallet is not found", async () => {
      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await walletRepository.getWallet(1);

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(result).toBeNull();
    });
  });

  describe("updateWalletBalance", () => {
    it("should update the wallet balance successfully", async () => {
      const mockUpdatedWallet = {
        user_id: 1,
        current_balance: 200,
      };

      (prisma.wallet.update as jest.Mock).mockResolvedValue(mockUpdatedWallet);

      const result = await walletRepository.updateWalletBalance(1, 200);

      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: { user_id: 1 },
        data: { current_balance: 200 },
      });
      expect(result).toBe(true);
    });

    it("should return false if wallet balance update fails", async () => {
      (prisma.wallet.update as jest.Mock).mockRejectedValue(new Error("Database error"));

      const result = await walletRepository.updateWalletBalance(1, 200);

      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: { user_id: 1 },
        data: { current_balance: 200 },
      });
      expect(result).toBe(false);
    });
  });

  describe("decrementWalletBalance", () => {
    it("should decrement the wallet balance successfully", async () => {
      const mockWallet = {
        user_id: 1,
        current_balance: 500,
        toNumber: function () {
          return this.current_balance;
        },
      };

      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
      (prisma.wallet.update as jest.Mock).mockResolvedValue({
        ...mockWallet,
        current_balance: 400,
      });

      const result = await walletRepository.decrementWalletBalance(1, 100);

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: { user_id: 1 },
        data: { current_balance: 400 },
      });
      expect(result).toBe(true);
    });

    it("should return false if wallet is not found", async () => {
      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await walletRepository.decrementWalletBalance(1, 100);

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(result).toBe(false);
    });

    it("should return false if decrement exceeds current balance", async () => {
      const mockWallet = {
        user_id: 1,
        current_balance: 50,
        toNumber: function () {
          return this.current_balance;
        },
      };

      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);

      const result = await walletRepository.decrementWalletBalance(1, 100);

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(result).toBe(false);
    });

    it("should return false if decrement fails during update", async () => {
      const mockWallet = {
        user_id: 1,
        current_balance: 500,
        toNumber: function () {
          return this.current_balance;
        },
      };

      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
      (prisma.wallet.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

      const result = await walletRepository.decrementWalletBalance(1, 100);

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: { user_id: 1 },
        data: { current_balance: 400 },
      });
      expect(result).toBe(false);
    });
  });
});
