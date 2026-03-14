import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

/**
 * Utility for AES-256-CBC Encryption
 * Used to protect sensitive environment variables in the database.
 */

// Encryption Key must be 32 bytes for AES-256
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env['ENCRYPTION_KEY'] 
  ? Buffer.from(process.env['ENCRYPTION_KEY'], 'hex') 
  : scryptSync('fallback-key-do-not-use-in-prod', 'salt', 32);

export function encrypt(text: string): string {
    if (!text) return '';
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

export function decrypt(text: string): string {
    if (!text) return '';
    try {
        const [ivHex, encryptedText] = text.split(':');
        if (!ivHex || !encryptedText) return text; // Return as is if not encrypted
        
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error);
        return '--- DECRYPTION ERROR ---';
    }
}
