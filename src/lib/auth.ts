import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthUser, LoginCredentials, RegisterCredentials } from '@/types';

const JWT_EXPIRES_IN = '7d';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }
  return secret;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function comparePasswords(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setTokenInStorage(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

export function removeTokenFromStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

export function validateCredentials(credentials: LoginCredentials): string[] {
  const errors: string[] = [];
  
  if (!credentials.email || !credentials.email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
    errors.push('Invalid email format');
  }
  
  if (!credentials.password || credentials.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return errors;
}

export function validateRegistration(credentials: RegisterCredentials): string[] {
  const errors = validateCredentials(credentials);
  
  if (!credentials.firstName || !credentials.firstName.trim()) {
    errors.push('First name is required');
  }
  
  if (!credentials.lastName || !credentials.lastName.trim()) {
    errors.push('Last name is required');
  }
  
  if (credentials.password !== credentials.confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return errors;
}