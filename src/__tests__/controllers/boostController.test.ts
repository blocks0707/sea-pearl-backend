import { Request, Response } from 'express';
import { getBoostStatus } from '../../services/miningService';
import { getBoost } from '../../controllers/boostController';

// Mock the services
jest.mock('../../services/miningService');

describe('BoostController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    mockRequest = {
      query: { userId: mockUserId },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getBoost', () => {
    it('should return boost status successfully', async () => {
      const mockBoostStatus = {
        doublexboost_before: '25 + 30',
        doublexboost_after: '50 + 30',
        fourxboost_before: '25 + 30',
        fourxboost_after: '100 + 30',
      };

      (getBoostStatus as jest.Mock).mockResolvedValue(mockBoostStatus);

      await getBoost(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBoostStatus);
    });

    it('should handle errors appropriately', async () => {
      const mockError = new Error('Test error');
      (getBoostStatus as jest.Mock).mockRejectedValue(mockError);

      await getBoost(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 500,
        customCode: 'ERR_INTERNAL_SERVER',
        message: 'Internal server error'
      });
    });
  });
});
