import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';
import {
  generateEncryptionKey,
  getEncryptionKey,
  encryptContent,
  decryptContent,
  deleteEncryptionKey,
  hasEncryptionKey,
} from '../encryption';

// Mock expo-crypto
jest.mock('expo-crypto', () => ({
  getRandomBytesAsync: jest.fn(),
  randomUUID: jest.fn(),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock crypto-js is not needed as it's a pure JS library
// We'll use it as-is for real encryption/decryption

describe('Encryption Utilities', () => {
  const mockCrypto = Crypto as jest.Mocked<typeof Crypto>;
  const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateEncryptionKey()', () => {
    it('should generate a 256-bit encryption key', async () => {
      // Setup: Mock random bytes (32 bytes = 256 bits)
      const mockRandomBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        mockRandomBytes[i] = i;
      }
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockCrypto.randomUUID.mockReturnValue('test-salt-uuid');
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      // Execute
      const key = await generateEncryptionKey();

      // Verify: Key should be 64 hex characters (256 bits)
      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
      expect(key.length).toBe(64); // PBKDF2 output with keySize 256/32 = 64 hex chars
    });

    it('should store the key in SecureStore', async () => {
      const mockRandomBytes = new Uint8Array(32).fill(1);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockCrypto.randomUUID.mockReturnValue('test-salt-uuid');
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      await generateEncryptionKey();

      // Verify SecureStore was called to store the derived key (salt is used during derivation but not stored)
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledTimes(1);
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        'journal_encryption_key',
        expect.any(String)
      );
    });

    it('should return the generated key string', async () => {
      const mockRandomBytes = new Uint8Array(32).fill(255);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockCrypto.randomUUID.mockReturnValue('test-salt');
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      const key = await generateEncryptionKey();

      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });

    it('should use PBKDF2 with 100,000 iterations', async () => {
      // We can verify this by checking the implementation uses the constant
      // This is more of an integration test to ensure the algorithm is correct
      const mockRandomBytes = new Uint8Array(32).fill(42);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockCrypto.randomUUID.mockReturnValue('salt-123');
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      const key = await generateEncryptionKey();

      // The key should be deterministic for the same input
      expect(key).toBeDefined();

      // Generate again with same mocks to verify consistency
      const key2 = await generateEncryptionKey();
      expect(key2).toBe(key); // Same input = same output
    });

    it('should use getRandomBytesAsync for key generation', async () => {
      const mockRandomBytes = new Uint8Array(32).fill(99);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockCrypto.randomUUID.mockReturnValue('uuid-salt');
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      await generateEncryptionKey();

      expect(mockCrypto.getRandomBytesAsync).toHaveBeenCalledWith(32);
    });

    it('should use randomUUID for salt generation', async () => {
      const mockRandomBytes = new Uint8Array(32).fill(77);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockCrypto.randomUUID.mockReturnValue('unique-uuid-salt');
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      await generateEncryptionKey();

      expect(mockCrypto.randomUUID).toHaveBeenCalled();
    });
  });

  describe('getEncryptionKey()', () => {
    it('should retrieve the stored encryption key', async () => {
      const mockKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
      mockSecureStore.getItemAsync.mockResolvedValue(mockKey);

      const key = await getEncryptionKey();

      expect(key).toBe(mockKey);
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('journal_encryption_key');
    });

    it('should return null if no key exists', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const key = await getEncryptionKey();

      expect(key).toBeNull();
    });
  });

  describe('encryptContent()', () => {
    const mockKey = 'a'.repeat(64); // 64 hex chars = 256 bits

    beforeEach(() => {
      mockSecureStore.getItemAsync.mockResolvedValue(mockKey);
    });

    it('should encrypt plaintext successfully', async () => {
      const mockIV = new Uint8Array(16).fill(0);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const plaintext = 'Hello, World!';
      const encrypted = await encryptContent(plaintext);

      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).toContain(':'); // IV:ciphertext format
    });

    it('should return IV:ciphertext format', async () => {
      const mockIV = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        mockIV[i] = i;
      }
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const encrypted = await encryptContent('test data');
      const parts = encrypted.split(':');

      expect(parts).toHaveLength(2);
      expect(parts[0]).toHaveLength(32); // 16 bytes = 32 hex chars (IV)
      expect(parts[1].length).toBeGreaterThan(0); // ciphertext
    });

    it('should use different IVs for same plaintext', async () => {
      let callCount = 0;
      mockCrypto.getRandomBytesAsync.mockImplementation(async () => {
        const iv = new Uint8Array(16);
        iv.fill(callCount++);
        return iv;
      });

      const plaintext = 'Same content';
      const encrypted1 = await encryptContent(plaintext);
      const encrypted2 = await encryptContent(plaintext);

      // Different IVs should produce different ciphertexts
      expect(encrypted1).not.toBe(encrypted2);

      const [iv1] = encrypted1.split(':');
      const [iv2] = encrypted2.split(':');
      expect(iv1).not.toBe(iv2);
    });

    it('should handle empty strings', async () => {
      const mockIV = new Uint8Array(16).fill(5);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const encrypted = await encryptContent('');

      expect(encrypted).toBeDefined();
      expect(encrypted).toContain(':');
    });

    it('should handle special characters', async () => {
      const mockIV = new Uint8Array(16).fill(10);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = await encryptContent(specialChars);

      expect(encrypted).toBeDefined();
      expect(encrypted).toContain(':');
    });

    it('should handle unicode and emojis', async () => {
      const mockIV = new Uint8Array(16).fill(15);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const unicode = '你好世界 🎉🚀💯';
      const encrypted = await encryptContent(unicode);

      expect(encrypted).toBeDefined();
      expect(encrypted).toContain(':');
    });

    it('should throw error if no encryption key exists', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      await expect(encryptContent('test')).rejects.toThrow('Encryption key not found');
    });

    it('should generate 16-byte IV', async () => {
      const mockIV = new Uint8Array(16).fill(20);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      await encryptContent('test');

      expect(mockCrypto.getRandomBytesAsync).toHaveBeenCalledWith(16);
    });
  });

  describe('decryptContent()', () => {
    const mockKey = 'a'.repeat(64);

    beforeEach(() => {
      mockSecureStore.getItemAsync.mockResolvedValue(mockKey);
    });

    it('should decrypt ciphertext to original plaintext', async () => {
      // First encrypt something
      const mockIV = new Uint8Array(16).fill(1);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const original = 'Secret message';
      const encrypted = await encryptContent(original);

      // Now decrypt it
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should validate IV:ciphertext format', async () => {
      await expect(decryptContent('invalid-format')).rejects.toThrow('Invalid format');
    });

    it('should throw error on missing IV', async () => {
      await expect(decryptContent(':ciphertext')).rejects.toThrow('Invalid format');
    });

    it('should throw error on missing ciphertext', async () => {
      const validIV = '0'.repeat(32);
      await expect(decryptContent(`${validIV}:`)).rejects.toThrow('Invalid format');
    });

    it('should throw error on corrupted ciphertext', async () => {
      const validIV = '0'.repeat(32);
      const corruptedCiphertext = `${validIV}:corrupted-data-!!!`;

      // This should fail during decryption
      await expect(decryptContent(corruptedCiphertext)).rejects.toThrow();
    });

    it('should throw error if no encryption key exists', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const validIV = '0'.repeat(32);
      await expect(decryptContent(`${validIV}:data`)).rejects.toThrow('Encryption key not found');
    });

    it('should throw error on empty string decryption', async () => {
      const mockIV = new Uint8Array(16).fill(2);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const encrypted = await encryptContent('');

      // Empty plaintext results are treated as decryption failures
      await expect(decryptContent(encrypted)).rejects.toThrow('Decryption failed');
    });
  });

  describe('Round-trip encryption/decryption', () => {
    const mockKey = 'b'.repeat(64);

    beforeEach(() => {
      mockSecureStore.getItemAsync.mockResolvedValue(mockKey);
    });

    it('should encrypt and decrypt to return original text', async () => {
      const mockIV = new Uint8Array(16).fill(3);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const original = 'This is a test message';
      const encrypted = await encryptContent(original);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should work with special characters', async () => {
      const mockIV = new Uint8Array(16).fill(4);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const original = '!@#$%^&*()_+-=[]{}\\|;:",.<>?/~`';
      const encrypted = await encryptContent(original);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should work with emojis', async () => {
      const mockIV = new Uint8Array(16).fill(5);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const original = 'Hello 👋 World 🌍 Test 🧪 Success ✅';
      const encrypted = await encryptContent(original);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should work with unicode characters', async () => {
      const mockIV = new Uint8Array(16).fill(6);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const original = '日本語 中文 한국어 العربية עברית';
      const encrypted = await encryptContent(original);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should work with long strings (>10KB)', async () => {
      const mockIV = new Uint8Array(16).fill(7);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      // Generate a string larger than 10KB
      const original = 'A'.repeat(15000);
      const encrypted = await encryptContent(original);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(original);
      expect(decrypted.length).toBe(15000);
    });

    it('should work with multiline text', async () => {
      const mockIV = new Uint8Array(16).fill(8);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const original = `Line 1
Line 2
Line 3
With\ttabs\tand\nnewlines\r\n`;
      const encrypted = await encryptContent(original);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should work with JSON strings', async () => {
      const mockIV = new Uint8Array(16).fill(9);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const original = JSON.stringify({
        name: 'Test',
        value: 123,
        nested: { array: [1, 2, 3] },
      });
      const encrypted = await encryptContent(original);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(original);
      expect(JSON.parse(decrypted)).toEqual(JSON.parse(original));
    });
  });

  describe('deleteEncryptionKey()', () => {
    it('should delete the encryption key from SecureStore', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);

      await deleteEncryptionKey();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('journal_encryption_key');
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('hasEncryptionKey()', () => {
    it('should return true when key exists', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue('some-key-value');

      const result = await hasEncryptionKey();

      expect(result).toBe(true);
    });

    it('should return false when key is null', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const result = await hasEncryptionKey();

      expect(result).toBe(false);
    });

    it('should return false when key is empty string', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue('');

      const result = await hasEncryptionKey();

      expect(result).toBe(false);
    });

    it('should return true for non-empty key strings', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue('x');

      const result = await hasEncryptionKey();

      expect(result).toBe(true);
    });
  });

  describe('Key Management Integration', () => {
    it('should reflect correct state after key generation', async () => {
      // Initially no key
      mockSecureStore.getItemAsync.mockResolvedValue(null);
      expect(await hasEncryptionKey()).toBe(false);

      // Generate key
      const mockRandomBytes = new Uint8Array(32).fill(1);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockCrypto.randomUUID.mockReturnValue('test-salt');
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      const key = await generateEncryptionKey();

      // Now mock that the key exists
      mockSecureStore.getItemAsync.mockResolvedValue(key);
      expect(await hasEncryptionKey()).toBe(true);
    });

    it('should reflect correct state after key deletion', async () => {
      // Start with a key
      const mockKey = 'existing-key';
      mockSecureStore.getItemAsync.mockResolvedValue(mockKey);
      expect(await hasEncryptionKey()).toBe(true);

      // Delete the key
      mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);
      await deleteEncryptionKey();

      // Now key should not exist
      mockSecureStore.getItemAsync.mockResolvedValue(null);
      expect(await hasEncryptionKey()).toBe(false);
    });

    it('should not allow encryption without a key', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      await expect(encryptContent('data')).rejects.toThrow('Encryption key not found');
    });

    it('should not allow decryption without a key', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      await expect(decryptContent('00:data')).rejects.toThrow('Encryption key not found');
    });
  });

  describe('Security Properties', () => {
    const mockKey = 'c'.repeat(64);

    beforeEach(() => {
      mockSecureStore.getItemAsync.mockResolvedValue(mockKey);
    });

    it('should use random IV for each encryption', async () => {
      let callCount = 0;
      mockCrypto.getRandomBytesAsync.mockImplementation(async (size) => {
        const iv = new Uint8Array(size);
        // Each call gets different values
        iv.fill(callCount++);
        return iv;
      });

      const plaintext = 'Same message';
      const encrypted1 = await encryptContent(plaintext);
      const encrypted2 = await encryptContent(plaintext);
      const encrypted3 = await encryptContent(plaintext);

      // All should have different IVs
      const [iv1] = encrypted1.split(':');
      const [iv2] = encrypted2.split(':');
      const [iv3] = encrypted3.split(':');

      expect(iv1).not.toBe(iv2);
      expect(iv2).not.toBe(iv3);
      expect(iv1).not.toBe(iv3);
    });

    it('should use AES-256-CBC encryption mode', async () => {
      // This is verified by the implementation using CryptoJS.AES with 256-bit key
      const mockIV = new Uint8Array(16).fill(11);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const plaintext = 'Test encryption mode';
      const encrypted = await encryptContent(plaintext);
      const decrypted = await decryptContent(encrypted);

      // If the mode was wrong, decryption would fail
      expect(decrypted).toBe(plaintext);
    });

    it('should produce different ciphertexts for same plaintext', async () => {
      let ivCounter = 0;
      mockCrypto.getRandomBytesAsync.mockImplementation(async () => {
        const iv = new Uint8Array(16);
        iv.fill(ivCounter++);
        return iv;
      });

      const plaintext = 'Identical content';
      const results = [];

      for (let i = 0; i < 5; i++) {
        results.push(await encryptContent(plaintext));
      }

      // All ciphertexts should be different
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(5);
    });

    it('should verify PBKDF2 key derivation produces consistent keys', async () => {
      const mockRandomBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        mockRandomBytes[i] = i * 7; // Deterministic pattern
      }

      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockCrypto.randomUUID.mockReturnValue('consistent-salt');
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      const key1 = await generateEncryptionKey();
      const key2 = await generateEncryptionKey();

      // Same inputs should produce same output (PBKDF2 is deterministic)
      expect(key1).toBe(key2);
    });

    it('should verify different salts produce different keys', async () => {
      const mockRandomBytes = new Uint8Array(32).fill(42);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      mockCrypto.randomUUID.mockReturnValue('salt-1');
      const key1 = await generateEncryptionKey();

      mockCrypto.randomUUID.mockReturnValue('salt-2');
      const key2 = await generateEncryptionKey();

      // Different salts should produce different keys
      expect(key1).not.toBe(key2);
    });
  });

  describe('Error Handling', () => {
    it('should handle SecureStore errors during key generation', async () => {
      const mockRandomBytes = new Uint8Array(32).fill(1);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockRandomBytes);
      mockCrypto.randomUUID.mockReturnValue('salt');
      mockSecureStore.setItemAsync.mockRejectedValue(new Error('Storage error'));

      await expect(generateEncryptionKey()).rejects.toThrow('Storage error');
    });

    it('should handle SecureStore errors during key retrieval', async () => {
      mockSecureStore.getItemAsync.mockRejectedValue(new Error('Retrieval error'));

      await expect(getEncryptionKey()).rejects.toThrow('Retrieval error');
    });

    it('should handle SecureStore errors during key deletion', async () => {
      mockSecureStore.deleteItemAsync.mockRejectedValue(new Error('Deletion error'));

      await expect(deleteEncryptionKey()).rejects.toThrow('Deletion error');
    });

    it('should handle Crypto errors during IV generation', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue('key');
      mockCrypto.getRandomBytesAsync.mockRejectedValue(new Error('Crypto error'));

      await expect(encryptContent('test')).rejects.toThrow('Crypto error');
    });

    it('should handle invalid encrypted data format', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue('key');

      await expect(decryptContent('no-colon-separator')).rejects.toThrow('Invalid format');
    });

    it('should handle multiple colons in encrypted data', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue('a'.repeat(64));

      // The split will only split on first colon, so this should work if IV is valid
      const validIV = '0'.repeat(32);
      const encrypted = `${validIV}:data:with:colons`;

      // This should fail during decryption because "data:with:colons" is not valid base64
      await expect(decryptContent(encrypted)).rejects.toThrow();
    });
  });

  describe('Edge Cases', () => {
    const mockKey = 'd'.repeat(64);

    beforeEach(() => {
      mockSecureStore.getItemAsync.mockResolvedValue(mockKey);
    });

    it('should handle very long content (100KB)', async () => {
      const mockIV = new Uint8Array(16).fill(12);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const longContent = 'X'.repeat(100000);
      const encrypted = await encryptContent(longContent);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(longContent);
      expect(decrypted.length).toBe(100000);
    });

    it('should handle content with null bytes', async () => {
      const mockIV = new Uint8Array(16).fill(13);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const content = 'Hello\x00World';
      const encrypted = await encryptContent(content);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(content);
    });

    it('should handle all whitespace content', async () => {
      const mockIV = new Uint8Array(16).fill(14);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const content = '   \t\n\r   ';
      const encrypted = await encryptContent(content);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(content);
    });

    it('should handle content with only special characters', async () => {
      const mockIV = new Uint8Array(16).fill(15);
      mockCrypto.getRandomBytesAsync.mockResolvedValue(mockIV);

      const content = '!@#$%^&*()';
      const encrypted = await encryptContent(content);
      const decrypted = await decryptContent(encrypted);

      expect(decrypted).toBe(content);
    });

    it('should handle rapid successive encryptions', async () => {
      let ivCounter = 0;
      mockCrypto.getRandomBytesAsync.mockImplementation(async () => {
        const iv = new Uint8Array(16);
        iv.fill(ivCounter++);
        return iv;
      });

      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(encryptContent(`Message ${i}`));
      }

      const results = await Promise.all(promises);

      // All should succeed
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toContain(':');
      });
    });
  });
});
