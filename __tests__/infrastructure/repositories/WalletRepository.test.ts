import { Wallet } from "@/domain/entities/Wallet";
import { WalletRepository } from "@/infrastructure/repositories/WalletRepository";

describe('WalletRepository', () => {
  let walletRepository: WalletRepository;

  beforeEach(() => {
    walletRepository = new WalletRepository(); // Uses the global prisma mock
  });

  it('should update a user and then fetch the user by ID', async () => {
    // Arrange
    const mockUser = {
      photo: 'uploads/Screenshot 2024-06-30 123855.png',
      email: 'tawsif.kadir18@gmail.com',
    };

    const mockWallet = {
        "user_id":52,
        "current_balance":0
    }
    
    // Act
    const wallet = await walletRepository.createWallet(mockWallet);

    console.log("Test is: " + JSON.stringify(wallet));
  });
});
