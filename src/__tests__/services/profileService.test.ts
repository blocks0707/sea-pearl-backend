import { getProfile } from '../../services/profileService';
import { getUserById } from '../../models/userModel';
import { getAssetById } from '../../models/assetModel';

jest.mock('../../models/userModel');
jest.mock('../../models/assetModel');

describe('ProfileService', () => {
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile with assets', async () => {
      const mockUser = {
        id: mockUserId,
        firstName: 'John',
        lastName: 'Doe',
        telegramUid: '12345',
      };

      const mockAsset = {
        shell: 100,
        pearl: 50,
        usdt: 10,
      };

      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (getAssetById as jest.Mock).mockResolvedValue(mockAsset);

      const result = await getProfile(mockUserId);

      expect(result).toEqual({
        userId: mockUserId,
        firstName: 'John',
        lastName: 'Doe',
        telegramUid: '12345',
        score: {
          shell: 100,
          pearl: 50,
          usdt: 10,
        },
      });
    });

    it('should handle missing optional user fields', async () => {
      const mockUser = {
        id: mockUserId,
        telegramUid: '12345',
      };

      const mockAsset = {
        shell: 100,
        pearl: 50,
        usdt: 10,
      };

      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (getAssetById as jest.Mock).mockResolvedValue(mockAsset);

      const result = await getProfile(mockUserId);

      expect(result.firstName).toBe('');
      expect(result.lastName).toBe('');
    });

    it('should throw error when user not found', async () => {
      (getUserById as jest.Mock).mockResolvedValue(null);

      await expect(getProfile(mockUserId)).rejects.toThrow('User not found');
    });

    it('should throw error when asset not found', async () => {
      const mockUser = {
        id: mockUserId,
        firstName: 'John',
        lastName: 'Doe',
        telegramUid: '12345',
      };

      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (getAssetById as jest.Mock).mockResolvedValue(null);

      await expect(getProfile(mockUserId)).rejects.toThrow('Asset not found');
    });
  });
});
