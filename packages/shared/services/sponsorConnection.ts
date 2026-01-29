/**
 * Sponsor Connection Service
 * 
 * Handles code generation and sponsor pairing for limited data sharing.
 * Provides a privacy-focused way for sponsees to share recovery progress
 * with their sponsors without exposing sensitive details.
 * 
 * **Note**: This is a local-only implementation. The connection codes are
 * designed to be shared manually (text/email) and enable limited
 * one-way data sharing from sponsee to sponsor.
 * 
 * @module services/sponsorConnection
 */

import { v4 as uuidv4 } from 'uuid';
import * as SecureStore from 'expo-secure-store';

// Secure store keys
const SPONSOR_CODE_KEY = 'sponsor_connection_code';
const SPONSOR_CODE_EXPIRY_KEY = 'sponsor_code_expiry';
const SPONSEE_CODES_KEY = 'sponsee_connection_codes';

// Code validity duration (7 days)
const CODE_VALIDITY_DAYS = 7;

/**
 * Connection code structure
 * Encoded as: RC-{timestamp}-{random}
 * RC = Recovery Companion
 */
export interface ConnectionCode {
  code: string;
  createdAt: Date;
  expiresAt: Date;
  isExpired: boolean;
}

/**
 * Sponsee connection info (for sponsors)
 */
export interface SponseeConnection {
  id: string;
  code: string;
  name: string;
  connectedAt: Date;
  lastSyncAt?: Date;
}

/**
 * Shareable data packet (what gets shared with sponsor)
 * This is intentionally limited to protect privacy
 */
export interface SponsorShareData {
  // Basic info
  displayName?: string;
  soberDays: number;
  programType: string;
  
  // Recent activity summary (no details)
  lastCheckinDate?: string;
  checkinStreak: number;
  currentStep: number;
  
  // Meeting attendance
  meetingsThisWeek: number;
  lastMeetingDate?: string;
  
  // Mood trend (aggregated, not individual entries)
  averageMoodLast7Days?: number;
  averageCravingLast7Days?: number;
  
  // Timestamps
  generatedAt: string;
}

/**
 * Generate a new sponsor connection code
 * 
 * Creates a unique connection code that can be shared with a sponsor.
 * Codes expire after 7 days for security. Format: RC-XXXXXX (6 alphanumeric characters).
 * 
 * @returns Promise resolving to connection code object with expiry information
 * @example
 * ```ts
 * const code = await generateSponsorCode();
 * // Share code.code with sponsor: "RC-A3B7K9"
 * ```
 */
export async function generateSponsorCode(): Promise<ConnectionCode> {
  // Generate random 6-character code
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar chars (0/O, 1/I)
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += characters.charAt(getSecureRandomIndex(characters.length));
  }
  
  const code = `RC-${randomPart}`;
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + CODE_VALIDITY_DAYS);
  
  // Store the code securely
  await SecureStore.setItemAsync(SPONSOR_CODE_KEY, code);
  await SecureStore.setItemAsync(SPONSOR_CODE_EXPIRY_KEY, expiresAt.toISOString());
  
  return {
    code,
    createdAt: now,
    expiresAt,
    isExpired: false,
  };
}

function getSecureRandomIndex(max: number): number {
  const cryptoObj = (globalThis as {
    crypto?: { getRandomValues?: (array: Uint32Array) => Uint32Array };
  }).crypto;
  if (cryptoObj?.getRandomValues) {
    const array = new Uint32Array(1);
    cryptoObj.getRandomValues(array);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/**
 * Get the current sponsor connection code (if exists and valid)
 * 
 * Retrieves the active connection code if one exists and hasn't expired.
 * 
 * @returns Promise resolving to connection code or null if none exists/expired
 * @example
 * ```ts
 * const code = await getCurrentSponsorCode();
 * if (code && !code.isExpired) {
 *   // Display code to user
 * }
 * ```
 */
export async function getCurrentSponsorCode(): Promise<ConnectionCode | null> {
  try {
    const code = await SecureStore.getItemAsync(SPONSOR_CODE_KEY);
    const expiryStr = await SecureStore.getItemAsync(SPONSOR_CODE_EXPIRY_KEY);
    
    if (!code || !expiryStr) return null;
    
    const expiresAt = new Date(expiryStr);
    const now = new Date();
    const isExpired = now > expiresAt;
    
    return {
      code,
      createdAt: new Date(expiresAt.getTime() - CODE_VALIDITY_DAYS * 24 * 60 * 60 * 1000),
      expiresAt,
      isExpired,
    };
  } catch (error) {
    console.error('Failed to get sponsor code:', error);
    return null;
  }
}

/**
 * Revoke the current sponsor connection code
 */
export async function revokeSponsorCode(): Promise<void> {
  await SecureStore.deleteItemAsync(SPONSOR_CODE_KEY);
  await SecureStore.deleteItemAsync(SPONSOR_CODE_EXPIRY_KEY);
}

/**
 * Store a sponsee connection (for sponsors tracking their sponsees)
 */
export async function addSponseeConnection(
  code: string,
  name: string
): Promise<SponseeConnection> {
  const connection: SponseeConnection = {
    id: uuidv4(),
    code,
    name,
    connectedAt: new Date(),
  };
  
  // Get existing connections
  const existingStr = await SecureStore.getItemAsync(SPONSEE_CODES_KEY);
  const existing: SponseeConnection[] = existingStr ? JSON.parse(existingStr) : [];
  
  // Add new connection
  existing.push(connection);
  
  // Store updated list
  await SecureStore.setItemAsync(SPONSEE_CODES_KEY, JSON.stringify(existing));
  
  return connection;
}

/**
 * Get all sponsee connections
 */
export async function getSponseeConnections(): Promise<SponseeConnection[]> {
  try {
    const connectionsStr = await SecureStore.getItemAsync(SPONSEE_CODES_KEY);
    if (!connectionsStr) return [];
    
    const connections: SponseeConnection[] = JSON.parse(connectionsStr);
    return connections.map(c => ({
      ...c,
      connectedAt: new Date(c.connectedAt),
      lastSyncAt: c.lastSyncAt ? new Date(c.lastSyncAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to get sponsee connections:', error);
    return [];
  }
}

/**
 * Remove a sponsee connection
 */
export async function removeSponseeConnection(id: string): Promise<void> {
  const connections = await getSponseeConnections();
  const filtered = connections.filter(c => c.id !== id);
  await SecureStore.setItemAsync(SPONSEE_CODES_KEY, JSON.stringify(filtered));
}

/**
 * Generate shareable data packet for sponsor
 * This creates a summary that can be shared without exposing sensitive details
 */
export async function generateShareData(
  profile: {
    displayName?: string;
    soberDays: number;
    programType: string;
  },
  stats: {
    lastCheckinDate?: Date;
    checkinStreak: number;
    currentStep: number;
    meetingsThisWeek: number;
    lastMeetingDate?: Date;
    averageMoodLast7Days?: number;
    averageCravingLast7Days?: number;
  }
): Promise<SponsorShareData> {
  return {
    displayName: profile.displayName,
    soberDays: profile.soberDays,
    programType: profile.programType,
    lastCheckinDate: stats.lastCheckinDate?.toISOString().split('T')[0],
    checkinStreak: stats.checkinStreak,
    currentStep: stats.currentStep,
    meetingsThisWeek: stats.meetingsThisWeek,
    lastMeetingDate: stats.lastMeetingDate?.toISOString().split('T')[0],
    averageMoodLast7Days: stats.averageMoodLast7Days,
    averageCravingLast7Days: stats.averageCravingLast7Days,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Encode share data for transmission (e.g., via text/email)
 * Returns a base64-encoded JSON string
 */
export async function encodeShareData(data: SponsorShareData): Promise<string> {
  const json = JSON.stringify(data);
  // Simple base64 encoding for sharing
  const encoded = base64Encode(json);
  return `RCSHARE:${encoded}`;
}

/**
 * Decode share data received from sponsee
 */
export function decodeShareData(encoded: string): SponsorShareData | null {
  try {
    if (!encoded.startsWith('RCSHARE:')) {
      return null;
    }
    
    const base64 = encoded.substring(8); // Remove 'RCSHARE:' prefix
    const json = base64Decode(base64);
    return JSON.parse(json) as SponsorShareData;
  } catch (error) {
    console.error('Failed to decode share data:', error);
    return null;
  }
}

function base64Encode(value: string): string {
  const btoaFn = (globalThis as { btoa?: (input: string) => string }).btoa;
  if (btoaFn) {
    return btoaFn(value);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf-8').toString('base64');
  }
  throw new Error('Base64 encoding is unavailable');
}

function base64Decode(value: string): string {
  const atobFn = (globalThis as { atob?: (input: string) => string }).atob;
  if (atobFn) {
    return atobFn(value);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'base64').toString('utf-8');
  }
  throw new Error('Base64 decoding is unavailable');
}

/**
 * Generate a shareable text message for sponsor
 */
export function generateShareMessage(data: SponsorShareData): string {
  const lines = [
    `📊 Recovery Update from ${data.displayName || 'Your Sponsee'}`,
    '',
    `🗓️ Clean Days: ${data.soberDays}`,
    `📈 Check-in Streak: ${data.checkinStreak} days`,
    `📖 Working on Step: ${data.currentStep}`,
    `🤝 Meetings this week: ${data.meetingsThisWeek}`,
  ];
  
  if (data.averageMoodLast7Days !== undefined) {
    lines.push(`😊 Avg Mood (7 days): ${data.averageMoodLast7Days.toFixed(1)}/10`);
  }
  
  if (data.averageCravingLast7Days !== undefined) {
    lines.push(`💪 Avg Craving (7 days): ${data.averageCravingLast7Days.toFixed(1)}/10`);
  }
  
  if (data.lastCheckinDate) {
    lines.push(`📅 Last check-in: ${data.lastCheckinDate}`);
  }
  
  lines.push('');
  lines.push(`Generated: ${new Date(data.generatedAt).toLocaleDateString()}`);
  lines.push('Sent from Recovery Companion');
  
  return lines.join('\n');
}

/**
 * Validate a connection code format
 * 
 * Checks if a code string matches the expected format (RC-XXXXXX).
 * 
 * @param code - Code string to validate
 * @returns True if code format is valid
 * @example
 * ```ts
 * if (isValidCodeFormat(userInput)) {
 *   await addSponseeConnection(userInput, name);
 * }
 * ```
 */
export function isValidCodeFormat(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }
  // Format: RC-XXXXXX (6 alphanumeric characters, excluding similar chars)
  const pattern = /^RC-[A-Z2-9]{6}$/;
  return pattern.test(code.toUpperCase());
}
