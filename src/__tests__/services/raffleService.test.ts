import { buyPearlRaffle, buyShellRaffle } from '../../services/raffleService';
import { createTransaction } from '../../models/transactionModel';
import { getUserById } from '../../models/userModel';
import { getAssetByUserId, updateAsset } from '../../models/assetModel';
import { getLatestPearlRaffle } from '../../models/pearlRaffleModel';
import { getLatestShellRaffle } from '../../models/shellRaffleModel';
import { getChipByUserId, updateChip } from '../../models/chipModel';

jest.mock('../../models/transactionModel');
jest.mock('../../models/userModel');
jest.mock('../../models/assetModel');
jest.mock('../../models/pearlRaffleModel');
jest.mock('../../models/shellRaffleModel');
jest.mock('../../models/chipModel');

describe('RaffleService', () => {
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buyPearlRaffle', () => {
    it('should successfully buy pearl raffle', async () => {
      const mockUser = { id: mockUserId };
      const mockChip = { pearl_chip: 5 };
      const mockPearlRaffle = { price: 10 };
      const mockAsset = { pearl: 100 };

      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (getChipByUserId as jest.Mock).mockResolvedValue(mockChip);
      (getLatestPearlRaffle as jest.Mock).mockResolvedValue(mockPearlRaffle);
      (getAssetByUserId as jest.Mock).mockResolvedValue(mockAsset);
      (updateAsset as jest.Mock).mockResolvedValue(true);
      (updateChip as jest.Mock).mockResolvedValue(true);
      (createTransaction as jest.Mock).mockResolvedValue({ id: 'transaction-id' });

      const result = await buyPearlRaffle(mockUserId);

      expect(Array.isArray(result)).toBe(true);
      expect(updateAsset).toHaveBeenCalled();
      expect(updateChip).toHaveBeenCalled();
      expect(createTransaction).toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      (getUserById as jest.Mock).mockResolvedValue(null);

      await expect(buyPearlRaffle(mockUserId)).rejects.toThrow('USER_NOT_FOUND');
    });

    it('should throw error when chip not found', async () => {
      const mockUser = { id: mockUserId };
      
      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (getChipByUserId as jest.Mock).mockResolvedValue(null);

      await expect(buyPearlRaffle(mockUserId)).rejects.toThrow('CHIP_NOT_FOUND');
    });
  });

  describe('buyShellRaffle', () => {
    it('should successfully buy shell raffle', async () => {
      const mockUser = { id: mockUserId };
      const mockChip = { shell_chip: 5 };
      const mockShellRaffle = { price: 10 };
      const mockAsset = { shell: 100 };

      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (getChipByUserId as jest.Mock).mockResolvedValue(mockChip);
      (getLatestShellRaffle as jest.Mock).mockResolvedValue(mockShellRaffle);
      (getAssetByUserId as jest.Mock).mockResolvedValue(mockAsset);
      (updateAsset as jest.Mock).mockResolvedValue(true);
      (updateChip as jest.Mock).mockResolvedValue(true);
      (createTransaction as jest.Mock).mockResolvedValue({ id: 'transaction-id' });

      const result = await buyShellRaffle(mockUserId);

      expect(Array.isArray(result)).toBe(true);
      expect(updateAsset).toHaveBeenCalled();
      expect(updateChip).toHaveBeenCalled();
      expect(createTransaction).toHaveBeenCalled();
    });

    it('should throw error when shell raffle not found', async () => {
      const mockUser = { id: mockUserId };
      const mockChip = { shell_chip: 5 };
      
      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (getChipByUserId as jest.Mock).mockResolvedValue(mockChip);
      (getLatestShellRaffle as jest.Mock).mockResolvedValue(null);

      await expect(buyShellRaffle(mockUserId)).rejects.toThrow('SHELL_RAFFLE_NOT_FOUND');
    });

    it('should throw error when asset not found', async () => {
      const mockUser = { id: mockUserId };
      const mockChip = { shell_chip: 5 };
      const mockShellRaffle = { price: 10 };
      
      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (getChipByUserId as jest.Mock).mockResolvedValue(mockChip);
      (getLatestShellRaffle as jest.Mock).mockResolvedValue(mockShellRaffle);
      (getAssetByUserId as jest.Mock).mockResolvedValue(null);

      await expect(buyShellRaffle(mockUserId)).rejects.toThrow('ASSET_NOT_FOUND');
    });
  });
});
