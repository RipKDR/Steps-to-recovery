import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY_NAME = 'journal_encryption_key';
const KEY_DERIVATION_ITERATIONS = 100000;

export async function generateEncryptionKey(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const randomString = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const salt = Crypto.randomUUID();
  const derivedKey = CryptoJS.PBKDF2(randomString, salt, { keySize: 256 / 32, iterations: KEY_DERIVATION_ITERATIONS }).toString();
  await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, derivedKey);
  await SecureStore.setItemAsync(`${ENCRYPTION_KEY_NAME}_salt`, salt);
  return derivedKey;
}

export async function getEncryptionKey(): Promise<string | null> {
  return await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
}

export async function encryptContent(content: string): Promise<string> {
  const key = await getEncryptionKey();
  if (!key) throw new Error('Encryption key not found');
  const ivBytes = await Crypto.getRandomBytesAsync(16);
  const iv = Array.from(ivBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const ivWordArray = CryptoJS.enc.Hex.parse(iv);
  const keyWordArray = CryptoJS.enc.Hex.parse(key);
  const encrypted = CryptoJS.AES.encrypt(content, keyWordArray, { iv: ivWordArray, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return `${iv}:${encrypted.toString()}`;
}

export async function decryptContent(encrypted: string): Promise<string> {
  const key = await getEncryptionKey();
  if (!key) throw new Error('Encryption key not found');
  const [iv, ciphertext] = encrypted.split(':');
  if (!iv || !ciphertext) throw new Error('Invalid format');
  const ivWordArray = CryptoJS.enc.Hex.parse(iv);
  const keyWordArray = CryptoJS.enc.Hex.parse(key);
  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyWordArray, { iv: ivWordArray, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  if (!plaintext) throw new Error('Decryption failed');
  return plaintext;
}

export async function deleteEncryptionKey(): Promise<void> {
  await SecureStore.deleteItemAsync(ENCRYPTION_KEY_NAME);
  await SecureStore.deleteItemAsync(`${ENCRYPTION_KEY_NAME}_salt`);
}

export async function hasEncryptionKey(): Promise<boolean> {
  const key = await getEncryptionKey();
  return key !== null && key.length > 0;
}
