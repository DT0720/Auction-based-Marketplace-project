import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { serialize,parse } from 'cookie';

const SECRET_KEY = new TextEncoder().encode('your-secret-key');
const COOKIE_NAME = 'session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

/**
 * Encrypts a payload into a token.
 * @param payload - The data to encode
 * @returns A signed and encrypted token
 */
export async function encrypt(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

/**
 * Decrypts and verifies a token.
 * @param token - The encrypted token
 * @returns Decoded payload
 */
export async function decrypt(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, SECRET_KEY);
  return payload;
}

/**
 * Creates a session by setting a secure cookie.
 * @param res - HTTP response object
 * @param payload - Data to store in the session
 */
export async function createSession(res: any, payload: JWTPayload): Promise<void> {
  const token = await encrypt(payload);
  res.setHeader('Set-Cookie', serialize(COOKIE_NAME, token, COOKIE_OPTIONS));
}

/**
 * Deletes the session by clearing the session cookie.
 * @param res - HTTP response object
 */
export function deleteSession(res: any): void {
  res.setHeader('Set-Cookie', serialize(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 }));
}

/**
 * Verifies the session by reading and decrypting the cookie.
 * @param req - HTTP request object
 * @returns The session data if valid, null otherwise
 */
export async function verifySession(req: any): Promise<JWTPayload | null> {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    return await decrypt(token);
  } catch (err) {
    console.error('Failed to verify session:', err);
    return null;
  }
}
