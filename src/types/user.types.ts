/**
 * User TypeScript Types
 * Type definitions for User entity
 */

/**
 * OAuth Provider Type
 */
export interface OAuthProvider {
  providerId: string;
  email: string;
  linkedAt: Date;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Linked Account Type
 */
export interface LinkedAccount {
  provider: 'google' | 'facebook';
  providerId: string;
  email: string;
  linkedAt: Date;
}

/**
 * User Preferences Type
 */
export interface UserPreferences {
  theme?: string;
  notifications: boolean;
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

/**
 * OAuth Providers Type
 */
export interface OAuthProviders {
  google?: OAuthProvider;
  facebook?: OAuthProvider;
}

/**
 * User Type (for API responses and client-side usage)
 */
export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  currency: string;
  timezone: string;
  preferences: UserPreferences;
  twoFactorEnabled: boolean;
  twoFactorVerified: boolean;
  twoFactorEnabledAt?: Date;
  oauthProviders?: OAuthProviders;
  primaryAuthMethod: 'email' | 'google' | 'facebook';
  linkedAccounts: LinkedAccount[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Registration Input Type
 */
export interface UserRegistrationInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  currency?: string;
  timezone?: string;
}

/**
 * User Update Input Type
 */
export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  currency?: string;
  timezone?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * User Profile Response Type
 */
export interface UserProfileResponse {
  user: User;
  message?: string;
}

/**
 * User Login Response Type
 */
export interface UserLoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  message?: string;
}

/**
 * User with Password (for internal use only)
 */
export interface UserWithPassword extends User {
  password?: string;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
}

