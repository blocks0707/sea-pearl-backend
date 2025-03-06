import { gameMain, addPearl } from '../../services/gameService';
import { createTransaction } from '../../models/transactionModel';
import { getAssetByUserId, updateAsset } from '../../models/assetModel';
import crypto from 'crypto';
import { getUserByTelegramUid, accessToken, refreshToken, getUserById } from '../../models/userModel';
import { getMiningByUserId } from '../../models/miningModel';

// Mock the modules
jest.mock('../../models/assetModel', () => ({
  getAssetByUserId: jest.fn(),
  updateAsset: jest.fn(),
}));
jest.mock('../../models/transactionModel', () => ({
  createTransaction: jest.fn(),
}));
jest.mock('../../models/userModel', () => ({
  getUserByTelegramUid: jest.fn(),
  accessToken: jest.fn(),
  refreshToken: jest.fn(),
  getUserById: jest.fn(),
}));
jest.mock('../../models/miningModel', () => ({
  getMiningByUserId: jest.fn(),
}));
jest.mock('crypto');

// Mock environment variable
process.env.SECRET_KEY = 'test-secret-key';

describe('GameService', () => {
  const mockUserId = 'test-user-id';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('gameMain', () => {
    it('should process game data successfully', async () => {
      const mockUserData = {
        id: '123',
        auth_date: Math.floor(Date.now() / 1000),
        first_name: 'Test',
        hash: 'valid-hash',
        telegramUid: 'test-telegram-uid',
      };

      const mockAsset = {
        pearl: 100,
        shell: 50,
      };

      const mockUser = {
        id: mockUserId,
        telegramUid: mockUserData.telegramUid,
      };

      const mockMining = {
        id: 'mining-id',
        userId: mockUserId,
        status: 'active',
      };

      // Mock crypto functions
      const mockUpdate = jest.fn().mockReturnThis();
      const mockDigest = jest.fn()
        .mockReturnValueOnce(Buffer.from('test-key-hash'))  // For createHash
        .mockReturnValueOnce('valid-hash');                 // For createHmac

      (crypto.createHash as jest.Mock).mockReturnValue({
        update: mockUpdate,
        digest: mockDigest,
      });

      (crypto.createHmac as jest.Mock).mockReturnValue({
        update: mockUpdate,
        digest: mockDigest,
      });

      // Mock user and asset functions
      (getUserByTelegramUid as jest.Mock).mockResolvedValue(mockUser);
      (getAssetByUserId as jest.Mock).mockResolvedValue(mockAsset);
      (accessToken as jest.Mock).mockResolvedValue('mock-access-token');
      (refreshToken as jest.Mock).mockResolvedValue('mock-refresh-token');
      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (getMiningByUserId as jest.Mock).mockResolvedValue(mockMining);

      const result = await gameMain(mockUserData);

      expect(result).toBeTruthy();
      expect(getAssetByUserId).toHaveBeenCalled();
      expect(getMiningByUserId).toHaveBeenCalledWith({ userId: mockUserId });
    });

    it('should throw error for invalid hash', async () => {
      const mockUserData = {
        id: '123',
        auth_date: Math.floor(Date.now() / 1000),
        first_name: 'Test',
        hash: 'invalid-hash',
        telegramUid: 'test-telegram-uid',
      };

      // Mock crypto functions to return different hash
      const mockUpdate = jest.fn().mockReturnThis();
      (crypto.createHash as jest.Mock).mockReturnValue({
        update: mockUpdate,
        digest: jest.fn().mockReturnValue(Buffer.from('different-hash')),
      });

      (crypto.createHmac as jest.Mock).mockReturnValue({
        update: mockUpdate,
        digest: jest.fn().mockReturnValue('different-hash'),
      });

      await expect(gameMain(mockUserData)).rejects.toThrow('Unauthorized');
    });
  });

  describe('addPearl', () => {
    it('should add pearl to user asset', async () => {
      const mockAsset = {
        pearl: 100,
      };

      (getAssetByUserId as jest.Mock).mockResolvedValue(mockAsset);
      (updateAsset as jest.Mock).mockResolvedValue(true);
      (createTransaction as jest.Mock).mockResolvedValue({
        id: 'transaction-id',
        amount: 50,
        fee_type: 'pearl',
        reason: 'tap',
        from: 'company',
        to: mockUserId,
        createdAt: 'Timestamp.now()',
      });

      const result = await addPearl(mockUserId, 50);

      expect(result).toBe(true);
      expect(updateAsset).toHaveBeenCalledWith(mockUserId, { pearl: 150 });
      expect(createTransaction).toHaveBeenCalledWith({
        fee_type: 'pearl',
        from: 'company',
        to: mockUserId,
        amount: 50,
        reason: 'tap',
      });
    });

    it('should throw error when asset not found', async () => {
      (getAssetByUserId as jest.Mock).mockResolvedValue(null);

      await expect(addPearl(mockUserId, 50)).rejects.toThrow('Asset not found');
    });
  });
});
