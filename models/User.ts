/**
 * User Model
 * Mongoose schema and model for User entity
 */

import { Schema, model, models, Document } from 'mongoose';

// OAuth Provider Schema
const OAuthProviderSchema = new Schema(
  {
    providerId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    linkedAt: {
      type: Date,
      default: Date.now,
    },
    accessToken: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

// Linked Account Schema
const LinkedAccountSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ['google', 'facebook'],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    linkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// User Preferences Schema
const UserPreferencesSchema = new Schema(
  {
    theme: {
      type: String,
      default: 'light',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    dateFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    timeFormat: {
      type: String,
      enum: ['12h', '24h'],
      default: '12h',
    },
  },
  { _id: false }
);

// OAuth Providers Schema
const OAuthProvidersSchema = new Schema(
  {
    google: {
      type: OAuthProviderSchema,
      required: false,
    },
    facebook: {
      type: OAuthProviderSchema,
      required: false,
    },
  },
  { _id: false }
);

// User Schema
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: function (this: IUser) {
        // Password required only if primaryAuthMethod is 'email'
        return this.primaryAuthMethod === 'email';
      },
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    preferences: {
      type: UserPreferencesSchema,
      default: () => ({}),
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      required: false,
    },
    twoFactorBackupCodes: {
      type: [String],
      required: false,
      select: false, // Don't return backup codes by default
    },
    twoFactorVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabledAt: {
      type: Date,
      required: false,
    },
    twoFactorLastUsed: {
      type: Date,
      required: false,
    },
    oauthProviders: {
      type: OAuthProvidersSchema,
      required: false,
    },
    primaryAuthMethod: {
      type: String,
      enum: ['email', 'google', 'facebook'],
      default: 'email',
    },
    linkedAccounts: {
      type: [LinkedAccountSchema],
      default: [],
    },
    lastLoginAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'users',
  }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'oauthProviders.google.providerId': 1 });
UserSchema.index({ 'oauthProviders.facebook.providerId': 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastLoginAt: -1 });

// Export User interface
export interface IUser extends Document {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  currency: string;
  timezone: string;
  preferences: {
    theme?: string;
    notifications: boolean;
    language: string;
    currency: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  twoFactorVerified: boolean;
  twoFactorEnabledAt?: Date;
  twoFactorLastUsed?: Date;
  oauthProviders?: {
    google?: {
      providerId: string;
      email: string;
      linkedAt: Date;
      accessToken?: string;
      refreshToken?: string;
    };
    facebook?: {
      providerId: string;
      email: string;
      linkedAt: Date;
      accessToken?: string;
    };
  };
  primaryAuthMethod: 'email' | 'google' | 'facebook';
  linkedAccounts: Array<{
    provider: 'google' | 'facebook';
    providerId: string;
    email: string;
    linkedAt: Date;
  }>;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Export User model (use existing model if available, otherwise create new one)
export const User = models.User || model<IUser>('User', UserSchema);

