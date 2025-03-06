import { getMiningData, getBoostStatus } from '../../services/miningService';
import { getMiningByUserId } from '../../models/miningModel';

// Mock the imported functions
jest.mock('../../models/miningModel');

describe('MiningService', () => {
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getMiningData', () => {
    it('should return mining data with upgrade fees', async () => {
      const mockMining = {
        storage: 50,
        fassive: 30,
        mining_power: 100,
      };

      (getMiningByUserId as jest.Mock).mockResolvedValue(mockMining);

      const result = await getMiningData(mockUserId);

      expect(result).toHaveProperty('storage_level', 50);
      expect(result).toHaveProperty('storageUpgradeFee');
      expect(result.storageUpgradeFee).toBe(4590); // (50 + 1) * 90
      expect(result).toHaveProperty('fassive_level', 30);
      expect(result).toHaveProperty('miningUpgradeFee');
      expect(result.miningUpgradeFee).toBe(31); // 30 + 1
    });

    it('should return zero upgrade fees for max levels', async () => {
      const mockMining = {
        storage: 100,
        fassive: 100,
        mining_power: 100,
      };

      (getMiningByUserId as jest.Mock).mockResolvedValue(mockMining);

      const result = await getMiningData(mockUserId);

      expect(result.storageUpgradeFee).toBe(0);
      expect(result.miningUpgradeFee).toBe(0);
    });

    it('should throw error when mining not found', async () => {
      (getMiningByUserId as jest.Mock).mockResolvedValue(null);

      await expect(getMiningData(mockUserId)).rejects.toThrow('Mining not found');
    });
  });

  describe('getBoostStatus', () => {
    const mockFassive = 30;

    beforeEach(() => {
      // Mock mining data for all boost status tests
      (getMiningByUserId as jest.Mock).mockResolvedValue({
        fassive: mockFassive,
        mining_power: 100,
      });
    });

    it('should return boost status with correct values', async () => {
      const result = await getBoostStatus(mockUserId);

      expect(result).toHaveProperty('doublexboost_before', `25 + ${mockFassive}`);
      expect(result).toHaveProperty('doublexboost_after', `50 + ${mockFassive}`);
      expect(result).toHaveProperty('fourxboost_before', `25 + ${mockFassive}`);
      expect(result).toHaveProperty('fourxboost_after', `100 + ${mockFassive}`);
    });

    it('should throw error when mining not found', async () => {
      (getMiningByUserId as jest.Mock).mockResolvedValue(null);

      await expect(getBoostStatus(mockUserId)).rejects.toThrow('Mining not found');
    });
  });
});
