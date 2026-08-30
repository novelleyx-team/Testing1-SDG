import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null; // Base32 encoded secret
  passwordHash: string | null; // SHA-256 hash
  passwordSalt: string | null;
}

interface SecurityState {
  userSettings: Record<string, UserSecuritySettings>;
  getSettings: (userId: string) => UserSecuritySettings;
  enableTwoFactor: (userId: string, secret: string) => void;
  disableTwoFactor: (userId: string) => void;
  setPasswordHash: (userId: string, hash: string, salt: string) => void;
}

const DEFAULT_SECURITY: UserSecuritySettings = {
  twoFactorEnabled: false,
  twoFactorSecret: null,
  passwordHash: null,
  passwordSalt: null,
};

// Generate a random Base32 secret for TOTP
export function generateTOTPSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  const array = new Uint8Array(20);
  crypto.getRandomValues(array);
  for (let i = 0; i < 20; i++) {
    secret += chars[array[i] % 32];
  }
  return secret;
}

// Generate otpauth:// URI for QR code
export function generateOTPAuthURI(secret: string, email: string): string {
  return `otpauth://totp/NOVELLEYX:${encodeURIComponent(email)}?secret=${secret}&issuer=NOVELLEYX&algorithm=SHA1&digits=6&period=30`;
}

// Hash password using Web Crypto API
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(saltHex + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { hash: hashHex, salt: saltHex };
}

// Verify password against stored hash
export async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex === storedHash;
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set, get) => ({
      userSettings: {},
      getSettings: (userId: string) => {
        return get().userSettings[userId] || DEFAULT_SECURITY;
      },
      enableTwoFactor: (userId: string, secret: string) => {
        set((state) => ({
          userSettings: {
            ...state.userSettings,
            [userId]: {
              ...(state.userSettings[userId] || DEFAULT_SECURITY),
              twoFactorEnabled: true,
              twoFactorSecret: secret,
            },
          },
        }));
      },
      disableTwoFactor: (userId: string) => {
        set((state) => ({
          userSettings: {
            ...state.userSettings,
            [userId]: {
              ...(state.userSettings[userId] || DEFAULT_SECURITY),
              twoFactorEnabled: false,
              twoFactorSecret: null,
            },
          },
        }));
      },
      setPasswordHash: (userId: string, hash: string, salt: string) => {
        set((state) => ({
          userSettings: {
            ...state.userSettings,
            [userId]: {
              ...(state.userSettings[userId] || DEFAULT_SECURITY),
              passwordHash: hash,
              passwordSalt: salt,
            },
          },
        }));
      },
    }),
    {
      name: 'novelleyx-security',
    }
  )
);
