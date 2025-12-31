/**
 * Mock SQLite database for testing
 */

export const mockDatabase = {
  getAllAsync: jest.fn(),
  getFirstAsync: jest.fn(),
  runAsync: jest.fn(),
  execAsync: jest.fn(),
  withTransactionAsync: jest.fn((callback) => callback()),
};

export function resetMockDatabase() {
  mockDatabase.getAllAsync.mockClear();
  mockDatabase.getFirstAsync.mockClear();
  mockDatabase.runAsync.mockClear();
  mockDatabase.execAsync.mockClear();
  mockDatabase.withTransactionAsync.mockClear();
}

export function mockDatabaseQuery<T>(method: keyof typeof mockDatabase, result: T) {
  (mockDatabase[method] as jest.Mock).mockResolvedValueOnce(result);
}

export function mockDatabaseError(method: keyof typeof mockDatabase, error: Error) {
  (mockDatabase[method] as jest.Mock).mockRejectedValueOnce(error);
}
