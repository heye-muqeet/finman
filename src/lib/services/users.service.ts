/**
 * Users Service
 * Handles user profile operations
 */

import { User, IUser } from '@/models/User';
import { connectDB } from '@/lib/database/connection';
import { NotFoundError, ValidationError } from '@/lib/utils/error-handler';
import { loggerService } from '@/lib/services/logger.service';
import type { UpdateProfileInput } from '@/lib/validators/user.validator';

/**
 * Get user profile by ID
 * @param userId - User ID
 * @returns User profile (without sensitive data)
 */
export async function getUserProfile(userId: string): Promise<Partial<IUser>> {
  await connectDB();

  try {
    const user = await User.findById(userId)
      .select('-password -twoFactorSecret -twoFactorBackupCodes')
      .lean();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    loggerService.logDatabase('FIND', 'users', {
      userId,
      operation: 'getProfile',
    });

    return user;
  } catch (error) {
    loggerService.error('Failed to get user profile', error, { userId });
    throw error;
  }
}

/**
 * Update user profile
 * @param userId - User ID
 * @param input - Profile update data
 * @returns Updated user profile (without sensitive data)
 */
export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<Partial<IUser>> {
  await connectDB();

  try {
    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Build update object (only include provided fields)
    // Using Record to allow null values for clearing fields (Mongoose supports null for optional fields)
    const updateData: Record<string, any> = {};

    // Handle firstName: null clears the field, undefined means don't update, string updates the field
    // Note: Empty strings are transformed to null by the validator
    if (input.firstName !== undefined) {
      updateData.firstName = input.firstName; // null clears, string updates
    }

    // Handle lastName: null clears the field, undefined means don't update, string updates the field
    // Note: Empty strings are transformed to null by the validator
    if (input.lastName !== undefined) {
      updateData.lastName = input.lastName; // null clears, string updates
    }

    if (input.currency !== undefined) {
      updateData.currency = input.currency;
    }

    if (input.timezone !== undefined) {
      updateData.timezone = input.timezone;
    }

    // Handle preferences update (merge with existing preferences)
    if (input.preferences !== undefined) {
      updateData.preferences = {
        ...(existingUser.preferences || {}),
        ...input.preferences,
      };
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select('-password -twoFactorSecret -twoFactorBackupCodes')
      .lean();

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    loggerService.logDatabase('UPDATE', 'users', {
      userId,
      operation: 'updateProfile',
      updatedFields: Object.keys(updateData),
    });

    return updatedUser;
  } catch (error) {
    loggerService.error('Failed to update user profile', error, { userId });
    throw error;
  }
}

