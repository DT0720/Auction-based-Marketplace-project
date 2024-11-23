import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';

/**
 * Generates a JWT token.
 * @param payload - The data to include in the token.
 * @param expiresIn - Token expiration time (default: '1h').
 * @returns The generated JWT token.
 */
export function generateToken(payload: object, expiresIn: string = '7d'): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

/**
 * Verifies and decodes a JWT token.
 * @param token - The token to verify.
 * @returns The decoded payload if valid, otherwise null.
 */
export function verifyToken<T>(token: string): T | null {
  try {
    return jwt.verify(token, SECRET_KEY) as T;
  } catch (error: any) {
    console.error('Invalid or expired token:', error.message);
    return null;
  }
}
