import { openFreebox } from '../../services/freeboxService';
import { getFreeboxLast } from '../../models/freeboxModel';
import { createTransaction } from '../../models/transactionModel';
import { updateAsset, getAssetByUserId } from '../../models/assetModel';
import { Asset } from '../../interfaces/assetInterface';
import { Transaction } from '../../interfaces/transactionInterface';
import { Timestamp } from 'firebase-admin/firestore';

jest.mock('../../models/freeboxModel');
jest.mock('../../models/transactionModel');
jest.mock('../../models/assetModel');

describe('FreeboxService', () => {
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('openFreebox', () => {
    it('should successfully open freebox and give reward', async () => {
      const mockFreebox = {
        reward: [
          { chance: 50, reward_type: 'pearl', amount: 10 },
          { chance: 100, reward_type: 'shell', amount: 5 },
        ],
      };

      const mockAsset: Asset = {
        id: 'test-asset-id',
        ads: 0,
        box: 30,
        pearl: 100,
        shell: 50,
        usdt: 0,
        userId: mockUserId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const mockTransaction: Transaction = { 
        id: 'transaction-id',
        amount: 10,
        fee_type: 'pearl',
        reason: 'box_open',
        from: 'company',
        to: mockUserId,
        createdAt: Timestamp.now(),
      };

      (getFreeboxLast as jest.Mock).mockResolvedValue(mockFreebox);
      (createTransaction as jest.Mock).mockResolvedValue(mockTransaction);
      (getAssetByUserId as jest.Mock).mockResolvedValue(mockAsset);
      (updateAsset as jest.Mock).mockResolvedValue(true);

      // Force random number to be 25 (should get pearl reward)
      jest.spyOn(global.Math, 'random').mockReturnValue(0.25);

      const result = await openFreebox(mockUserId);

      expect(result).toEqual({
        amount: 10,
        reward_type: 'pearl',
      });
      expect(createTransaction).toHaveBeenCalledWith({
        fee_type: 'pearl',
        from: 'company',
        to: mockUserId,
        amount: 10,
        reason: 'box_open',
      });

      expect(updateAsset).toHaveBeenCalledWith(mockUserId, {
        userId: mockUserId,
        pearl: 110, // 100 + 10
      });
    });

    it('should throw error when freebox not found', async () => {
      (getFreeboxLast as jest.Mock).mockResolvedValue(null);

      await expect(openFreebox(mockUserId)).rejects.toThrow('Freebox not found');
    });

    it('should throw error when asset not found', async () => {
      const mockFreebox = {
        reward: [{ chance: 100, reward_type: 'pearl', amount: 10 }],
      };

      (getFreeboxLast as jest.Mock).mockResolvedValue(mockFreebox);
      (createTransaction as jest.Mock).mockResolvedValue({ id: 'transaction-id' });
      (getAssetByUserId as jest.Mock).mockResolvedValue(null);

      await expect(openFreebox(mockUserId)).rejects.toThrow('Asset not found');
    });
  });
});
