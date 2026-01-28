import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is not set');
}

export function encryptSecret(secret: string): string {
  return CryptoJS.AES.encrypt(secret, ENCRYPTION_KEY).toString();
}

export function decryptSecret(encryptedSecret: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedSecret, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
