/**
 * Authentication Service
 * Handles user authentication, registration, and password management
 */

import { User, IUser } from '@/models/User';
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/utils/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/utils/jwt';
import { connectDB } from '@/lib/database/connection';
import { ValidationError, UnauthorizedError, NotFoundError } from '@/lib/utils/error-handler';
import type { UserRegistrationInput, UserLoginResponse } from '@/types/user.types';

/**
 * Register a new user
 * @param input - User registration data
 * @returns User and tokens
 */
export async function registerUser(
  input: UserRegistrationInput
): Promise<UserLoginResponse> {
  // Ensure database connection
  await connectDB();

  // Validate password strength
  const passwordValidation = validatePasswordStrength(input.password);
  if (!passwordValidation.isValid) {
    throw new ValidationError('Password does not meet requirements', {
      errors: passwordValidation.errors,
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: input.email.toLowerCase() });
  if (existingUser) {
    throw new ValidationError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(input.password);

  // Create user
  const user = new User({
    email: input.email.toLowerCase(),
    password: hashedPassword,
    firstName: input.firstName,
    lastName: input.lastName,
    currency: input.currency || 'USD',
    timezone: input.timezone || 'UTC',
    primaryAuthMethod: 'email',
    preferences: {
      currency: input.currency || 'USD',
      timezone: input.timezone || 'UTC',
      language: 'en',
      notifications: true,
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '12h',
    },
  });

  await user.save();

  // Generate tokens
  const token = generateAccessToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString(), user.email);

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Return user data (without password)
  const userData = user.toObject();
  delete (userData as { password?: string }).password;
  delete (userData as { twoFactorSecret?: string }).twoFactorSecret;
  delete (userData as { twoFactorBackupCodes?: string[] }).twoFactorBackupCodes;

  return {
    user: userData as any,
    token,
    refreshToken,
    message: 'User registered successfully',
  };
}

/**
 * Login user with email and password
 * @param email - User email
 * @param password - User password
 * @returns User and tokens
 */
export async function loginUser(
  email: string,
  password: string
): Promise<UserLoginResponse> {
  // Ensure database connection
  await connectDB();

  // Find user by email (include password field)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if user has password (OAuth users might not have password)
  if (!user.password) {
    throw new UnauthorizedError('Please use OAuth to login');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if 2FA is enabled
  if (user.twoFactorEnabled && !user.twoFactorVerified) {
    // Return partial response indicating 2FA is required
    const userData = user.toObject();
    delete (userData as { password?: string }).password;
    delete (userData as { twoFactorSecret?: string }).twoFactorSecret;
    delete (userData as { twoFactorBackupCodes?: string[] }).twoFactorBackupCodes;

    return {
      user: userData as any,
      token: '', // No token until 2FA is verified
      message: '2FA verification required',
    };
  }

  // Generate tokens
  const token = generateAccessToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString(), user.email);

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Return user data (without password)
  const userData = user.toObject();
  delete (userData as { password?: string }).password;
  delete (userData as { twoFactorSecret?: string }).twoFactorSecret;
  delete (userData as { twoFactorBackupCodes?: string[] }).twoFactorBackupCodes;

  return {
    user: userData as any,
    token,
    refreshToken,
    message: 'Login successful',
  };
}

/**
 * Verify 2FA and complete login
 * @param userId - User ID
 * @param token - 2FA token
 * @returns User and tokens
 */
export async function verify2FALogin(
  userId: string,
  token: string
): Promise<UserLoginResponse> {
  // Ensure database connection
  await connectDB();

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  // Check if 2FA is enabled
  if (!user.twoFactorEnabled) {
    throw new ValidationError('2FA is not enabled for this user');
  }

  // TODO: Implement 2FA verification (will be done in Chunk 59)
  // For now, just mark as verified
  user.twoFactorVerified = true;
  user.twoFactorLastUsed = new Date();
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString(), user.email);

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Return user data
  const userData = user.toObject();
  delete (userData as { password?: string }).password;
  delete (userData as { twoFactorSecret?: string }).twoFactorSecret;
  delete (userData as { twoFactorBackupCodes?: string[] }).twoFactorBackupCodes;

  return {
    user: userData as any,
    token: accessToken,
    refreshToken,
    message: '2FA verified successfully',
  };
}

/**
 * Change user password
 * @param userId - User ID
 * @param currentPassword - Current password
 * @param newPassword - New password
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  // Ensure database connection
  await connectDB();

  // Find user (include password field)
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new NotFoundError('User');
  }

  // Check if user has password
  if (!user.password) {
    throw new ValidationError('Password change not available for OAuth users');
  }

  // Verify current password
  const isPasswordValid = await verifyPassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Validate new password strength
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new ValidationError('New password does not meet requirements', {
      errors: passwordValidation.errors,
    });
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  user.password = hashedPassword;
  await user.save();
}

/**
 * Get user by ID
 * @param userId - User ID
 * @returns User document
 */
export async function getUserById(userId: string): Promise<IUser | null> {
  await connectDB();
  const user = await User.findById(userId);
  return user;
}

/**
 * Get user by email
 * @param email - User email
 * @returns User document
 */
export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  return user;
}

