# FinMan - Financial & Expense Management System
## Complete Documentation

**System Name**: FinMan  
**Domain**: finman.finance  
**Tagline**: "Your Personal Financial Manager"

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Database Indexing & Performance](#database-indexing--performance)
6. [Activity Logging & Audit Trail](#activity-logging--audit-trail)
7. [API Endpoints](#api-endpoints)
8. [API Documentation (Swagger/OpenAPI)](#api-documentation-swaggeropenapi)
9. [Search & Filtering](#search--filtering)
10. [Frontend Structure](#frontend-structure)
11. [Mobile App (React Native)](#mobile-app-react-native)
12. [Real-time Updates (WebSocket)](#real-time-updates-websocket)
12. [AI Integration (Gemini)](#ai-integration-gemini)
13. [Email Integration (Nodemailer)](#email-integration-nodemailer)
14. [Background Jobs & Task Scheduling](#background-jobs--task-scheduling)
15. [Logging & Monitoring](#logging--monitoring)
16. [File Storage & Upload Management (Cloudinary)](#file-storage--upload-management-cloudinary)
17. [Project Setup](#project-setup)
18. [Data Migration & Seeding](#data-migration--seeding)
19. [Development Guidelines](#development-guidelines)
20. [Testing Strategy & Implementation](#testing-strategy--implementation)
21. [Performance Optimization](#performance-optimization)
22. [Features List](#features-list)
23. [Analytics & User Tracking (Optional)](#analytics--user-tracking-optional)
24. [User Onboarding Flow](#user-onboarding-flow)
25. [Data Export/Import Functionality](#data-exportimport-functionality)
26. [Security Considerations](#security-considerations)
27. [Docker & Containerization](#docker--containerization)
28. [Deployment Guide](#deployment-guide)
29. [CI/CD Pipeline](#cicd-pipeline)
30. [Troubleshooting Guide](#troubleshooting-guide)

---

## System Overview

**FinMan** is a comprehensive personal financial and expense management system built as a single web application using Next.js (TypeScript). The system allows users to track income, expenses, budgets, investments, and financial goals with AI-powered insights and recommendations.

### Framework Note
This documentation uses **Next.js 14+ with TypeScript** for both backend (API routes) and frontend (React Server Components and Client Components). All code examples should be implemented using Next.js patterns:
- **API Routes**: Use `app/api/*/route.ts` files instead of NestJS controllers
- **Services**: Create service files in `lib/services/` directory
- **Middleware**: Use `middleware.ts` for request interception
- **Authentication**: Use NextAuth.js or JWT with API routes
- **Database**: Use Mongoose models in `lib/models/` directory

### Core Capabilities
- **Income Management**: Track multiple income sources
- **Expense Tracking**: Categorize and monitor expenses
- **Budget Planning**: Create and manage budgets
- **Financial Goals**: Set and track financial objectives
- **Reports & Analytics**: Visualize financial data
- **AI Insights**: Get intelligent recommendations using Gemini AI
- **Multi-Currency Support**: Handle different currencies
- **Recurring Transactions**: Automate recurring income/expenses
- **Receipt Management**: Upload and process receipts
- **Investment Tracking**: Monitor investments and portfolios

---

## Architecture

### System Architecture Pattern
- **Full-Stack Next.js**: Single Next.js application with API routes and frontend
- **RESTful API**: Next.js API routes for backend operations
- **App Router**: Next.js 13+ App Router for routing and layouts
- **Server Components**: React Server Components for server-side rendering
- **Service Layer**: Business logic separation in API routes and services
- **Repository Pattern**: Data access abstraction with MongoDB/Mongoose

### Directory Structure
```
finman/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   ├── api/                   # API routes
│   │   │   ├── auth/
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── 2fa/
│   │   │   │   │   ├── setup/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── verify/
│   │   │   │   │       └── route.ts
│   │   │   │   └── google/
│   │   │   │       └── route.ts
│   │   │   ├── transactions/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── budgets/
│   │   │   ├── goals/
│   │   │   └── ...
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   │   └── page.tsx
│   │   └── ...
│   ├── lib/                       # Shared utilities and services
│   │   ├── config/                # Configuration files
│   │   │   ├── database.ts
│   │   │   ├── gemini.ts
│   │   │   ├── email.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── app.ts
│   │   ├── services/              # Business logic services
│   │   │   ├── auth.service.ts
│   │   │   ├── transactions.service.ts
│   │   │   ├── budgets.service.ts
│   │   │   ├── currency.service.ts
│   │   │   ├── datetime.service.ts
│   │   │   └── ...
│   │   ├── middleware.ts          # Next.js middleware
│   │   └── utils/                 # Utility functions
│   ├── components/               # React components
│   │   ├── common/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   └── ...
│   ├── models/                    # Mongoose models/schemas
│   │   ├── User.ts
│   │   ├── Transaction.ts
│   │   ├── Budget.ts
│   │   └── ...
│   ├── types/                     # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── transaction.types.ts
│   │   └── ...
│   ├── hooks/                     # Custom React hooks
│   │   ├── useCurrency.ts
│   │   ├── useDateTime.ts
│   │   └── ...
│   ├── i18n/                      # Translation files
│   │   └── locales/
│   └── styles/                    # Global styles
│   │   ├── users/                 # User management
│   │   ├── income/                # Income tracking
│   │   ├── expenses/              # Expense tracking
│   │   ├── budgets/               # Budget management
│   │   ├── goals/                 # Financial goals
│   │   ├── categories/            # Transaction categories
│   │   ├── transactions/          # General transactions
│   │   ├── reports/               # Reports & analytics
│   │   ├── investments/           # Investment tracking
│   │   ├── receipts/              # Receipt management
│   │   ├── ai-insights/           # Gemini AI integration
│   │   ├── email/                 # Email service module
│   │   ├── upload/                # File upload module
│   │   │   ├── cloudinary.service.ts
│   │   │   └── upload.module.ts
│   │   ├── export/                # Data export module
│   │   │   ├── export.service.ts
│   │   │   └── export.module.ts
│   │   ├── import/                # Data import module
│   │   │   ├── import.service.ts
│   │   │   └── import.module.ts
│   │   ├── search/                # Search & filtering module
│   │   │   ├── search.service.ts
│   │   │   ├── search.controller.ts
│   │   │   └── search.module.ts
│   │   ├── websocket/             # WebSocket real-time updates
│   │   │   ├── websocket.gateway.ts
│   │   │   ├── websocket.service.ts
│   │   │   └── websocket.module.ts
│   │   ├── audit/                 # Audit trail & activity logging
│   │   │   ├── audit.service.ts
│   │   │   ├── audit.controller.ts
│   │   │   ├── security-detection.service.ts
│   │   │   └── audit.module.ts
│   │   └── logs/                  # Log management (optional)
│   ├── common/                    # Shared utilities
│   │   ├── services/
│   │   │   └── logger.service.ts  # Logger service
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts  # Logging interceptor
│   │       ├── email.service.ts
│   │       ├── email.module.ts
│   │       ├── templates/         # Email templates
│   │       └── dto/
│   ├── database/
│   │   ├── schemas/               # Mongoose schemas
│   │   │   ├── user-activity-log.schema.ts
│   │   │   ├── security-event-log.schema.ts
│   │   │   └── data-change.schema.ts
│   │   └── seeds/                 # Database seeds
│   └── views/                     # Frontend views (if using server-side rendering)
├── public/                        # Static assets
├── frontend/                      # Frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # React/Vue components
│   │   │   ├── pages/            # Page components
│   │   │   ├── services/         # API services
│   │   │   ├── store/            # State management
│   │   │   ├── hooks/            # Custom hooks
│   │   │   │   ├── useCurrency.ts
│   │   │   │   └── useDateTime.ts
│   │   │   ├── i18n/             # Translation files
│   │   │   │   └── locales/
│   │   │   └── utils/            # Utilities
│   │   ├── assets/
│   │   └── styles/
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Technology Stack

### Backend & Frontend
- **Framework**: Next.js 14+ (TypeScript) - Full-stack React framework
- **Language**: TypeScript
- **Routing**: Next.js App Router (App Directory)
- **API Routes**: Next.js API Routes for backend endpoints
- **Server Components**: React Server Components for server-side rendering
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with NextAuth.js
- **Validation**: Zod or Yup for schema validation
- **API Documentation**: Swagger/OpenAPI (optional)
- **File Upload**: Next.js API routes with FormData
- **Date Handling**: date-fns, date-fns-tz, or moment.js
- **Real-time Communication**: Socket.IO (WebSocket)

### Frontend (Next.js)
- **UI Library**: Radix UI (headless components) with Tailwind CSS for styling
- **State Management**: Redux Toolkit with Redux Persist for state persistence
- **Local Storage**: AsyncStorage (React Native) / localStorage (Web) with Redux Persist integration
- **Charts**: Chart.js, Recharts, or D3.js
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Native fetch or Axios
- **Styling**: Tailwind CSS (primary), with Radix UI for accessible component primitives

### AI Integration
- **AI Provider**: Google Gemini API
- **Use Cases**:
  - Expense categorization
  - Budget recommendations
  - Financial insights
  - Receipt OCR and data extraction
  - Spending pattern analysis
  - Goal suggestions

### Development Tools
- **Package Manager**: npm or yarn
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest
- **Version Control**: Git

---

## Database Schema

### User Schema
```typescript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String,
  lastName: String,
  currency: String (default: 'USD'),
  timezone: String,
  preferences: {
    theme: String,
    notifications: Boolean,
    language: String (default: 'en'),
    currency: String (default: 'USD'),
    timezone: String (default: 'UTC'),
    dateFormat: String (default: 'YYYY-MM-DD'),
    timeFormat: String (enum: ['12h', '24h'], default: '12h'),
  },
  twoFactorEnabled: Boolean (default: false),
  twoFactorSecret: String (encrypted, optional),
  twoFactorBackupCodes: [String] (encrypted, optional),
  twoFactorVerified: Boolean (default: false),
  twoFactorEnabledAt: Date (optional),
  twoFactorLastUsed: Date (optional),
  oauthProviders: {
    google: {
      providerId: String,
      email: String,
      linkedAt: Date,
      accessToken: String (encrypted, optional),
      refreshToken: String (encrypted, optional),
    },
    facebook: {
      providerId: String,
      email: String,
      linkedAt: Date,
      accessToken: String (encrypted, optional),
    }
  },
  primaryAuthMethod: String (enum: ['email', 'google', 'facebook'], default: 'email'),
  linkedAccounts: [{
    provider: String (enum: ['google', 'facebook']),
    providerId: String,
    email: String,
    linkedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String (required),
  type: String (enum: ['income', 'expense', 'both']),
  icon: String,
  color: String,
  parentCategoryId: ObjectId (ref: Category, optional),
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (enum: ['income', 'expense'], required),
  amount: Number (required),
  currency: String (required),
  categoryId: ObjectId (ref: Category),
  description: String,
  date: Date (required),
  paymentMethod: String (enum: ['cash', 'card', 'bank_transfer', 'digital_wallet', 'other']),
  tags: [String],
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  receiptId: ObjectId (ref: Receipt, optional),
  isRecurring: Boolean,
  recurringPattern: {
    frequency: String (enum: ['daily', 'weekly', 'monthly', 'yearly']),
    endDate: Date,
    nextOccurrence: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String (required),
  categoryId: ObjectId (ref: Category),
  amount: Number (required),
  currency: String (required),
  period: String (enum: ['weekly', 'monthly', 'yearly'], required),
  startDate: Date (required),
  endDate: Date,
  alertThreshold: Number (percentage),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Financial Goal Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String (required),
  description: String,
  targetAmount: Number (required),
  currentAmount: Number (default: 0),
  currency: String (required),
  targetDate: Date,
  category: String (enum: ['savings', 'debt_payoff', 'investment', 'purchase', 'other']),
  isCompleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Investment Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String (required),
  type: String (enum: ['stock', 'bond', 'crypto', 'mutual_fund', 'etf', 'real_estate', 'other']),
  symbol: String,
  quantity: Number,
  purchasePrice: Number,
  currentPrice: Number,
  purchaseDate: Date,
  currency: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Receipt Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  transactionId: ObjectId (ref: Transaction, optional),
  fileName: String,
  filePath: String,
  publicId: String (required), // Cloudinary public ID
  fileSize: Number,
  mimeType: String,
  cloudinaryData: {
    publicId: String,
    url: String,
    width: Number,
    height: Number,
    format: String
  },
  extractedData: {
    merchant: String,
    amount: Number,
    date: Date,
    items: [{
      name: String,
      price: Number,
      quantity: Number
    }],
    aiProcessed: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Alert Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  budgetId: ObjectId (ref: Budget),
  type: String (enum: ['threshold', 'exceeded']),
  message: String,
  isRead: Boolean (default: false),
  createdAt: Date
}
```

### Email Template Schema
```typescript
{
  _id: ObjectId,
  name: String (required, unique),
  subject: String (required),
  htmlTemplate: String (required),
  textTemplate: String,
  variables: [String], // Template variables like {{userName}}, {{amount}}, etc.
  type: String (enum: ['welcome', 'password-reset', 'budget-alert', 'goal-reminder', 'report', 'transaction-alert', 'weekly-summary', 'monthly-summary']),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Email Log Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  to: String (required),
  subject: String (required),
  templateName: String,
  status: String (enum: ['pending', 'sent', 'failed', 'bounced']),
  errorMessage: String,
  sentAt: Date,
  createdAt: Date
}
```

### Activity Log Schema (Optional - for database logging)
```typescript
{
  _id: ObjectId,
  timestamp: Date (required, indexed),
  level: String (enum: ['error', 'warn', 'info', 'http', 'verbose', 'debug'], required, indexed),
  service: String (required, indexed), // auth, transactions, budgets, etc.
  event: String (required, indexed), // event type
  userId: ObjectId (ref: User, optional, indexed),
  message: String,
  metadata: Object, // Additional context data
  ipAddress: String,
  userAgent: String,
  requestId: String, // For request tracing
  responseTime: Number, // For API requests
  statusCode: Number, // For API requests
  error: {
    message: String,
    stack: String,
    code: String
  },
  createdAt: Date (default: Date.now, indexed)
}
```

**Indexes for Activity Log**:
- `{ timestamp: -1 }` - For time-based queries
- `{ userId: 1, timestamp: -1 }` - For user activity queries
- `{ service: 1, level: 1, timestamp: -1 }` - For service-specific queries
- `{ event: 1, timestamp: -1 }` - For event-based queries
- `{ level: 1, timestamp: -1 }` - For error/warning queries

---

## Database Indexing & Performance

### Overview
Proper database indexing is crucial for optimal query performance in FinMan. This section outlines the comprehensive indexing strategy, query optimization techniques, and performance monitoring approaches.

### Index Strategy

#### 1. Required Indexes for Each Collection

##### User Collection
```typescript
// models/User.ts
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'oauthProviders.google.providerId': 1 });
UserSchema.index({ 'oauthProviders.facebook.providerId': 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastLoginAt: -1 });
```

##### Transaction Collection
```typescript
// models/Transaction.ts
TransactionSchema.index({ userId: 1, date: -1 }); // Most common query
TransactionSchema.index({ userId: 1, type: 1, date: -1 });
TransactionSchema.index({ userId: 1, categoryId: 1, date: -1 });
TransactionSchema.index({ userId: 1, amount: 1 });
TransactionSchema.index({ userId: 1, tags: 1 });
TransactionSchema.index({ userId: 1, paymentMethod: 1 });
TransactionSchema.index({ userId: 1, date: -1, amount: -1 }); // Compound for reports

// Text index for full-text search
TransactionSchema.index({
  description: 'text',
  tags: 'text',
}, {
  weights: {
    description: 10,
    tags: 5,
  },
});
```

##### Category Collection
```typescript
// models/Category.ts
CategorySchema.index({ userId: 1, type: 1 });
CategorySchema.index({ userId: 1, name: 1 });
CategorySchema.index({ name: 'text' }); // Text search
```

##### Budget Collection
```typescript
// models/Budget.ts
BudgetSchema.index({ userId: 1, startDate: -1, endDate: -1 });
BudgetSchema.index({ userId: 1, categoryId: 1 });
BudgetSchema.index({ userId: 1, isActive: 1 });
BudgetSchema.index({ userId: 1, startDate: 1, endDate: 1 }); // Range queries
```

##### Goal Collection
```typescript
// models/Goal.ts
GoalSchema.index({ userId: 1, targetDate: -1 });
GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ userId: 1, categoryId: 1 });
```

##### Activity Log Collection
```typescript
// models/ActivityLog.ts
ActivityLogSchema.index({ userId: 1, timestamp: -1 });
ActivityLogSchema.index({ userId: 1, action: 1, timestamp: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });
ActivityLogSchema.index({ timestamp: -1 }); // For cleanup queries
```

### Query Optimization Techniques

#### 1. Use Projection to Limit Fields
```typescript
// Only fetch needed fields
const transactions = await Transaction.find(
  { userId },
  'amount date type description categoryId'
).lean();
```

#### 2. Use Lean Queries for Read-Only Operations
```typescript
// Faster queries without Mongoose document overhead
const transactions = await Transaction.find({ userId }).lean();
```

#### 3. Use Aggregation for Complex Queries
```typescript
// Efficient aggregation pipeline
const monthlyStats = await Transaction.aggregate([
  { $match: { userId, date: { $gte: startDate, $lte: endDate } } },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
      totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
      totalExpenses: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);
```

#### 4. Use Index Hints for Complex Queries
```typescript
// Force specific index usage
const transactions = await Transaction.find({ userId, date: { $gte: startDate } })
  .hint({ userId: 1, date: -1 })
  .lean();
```

#### 5. Batch Operations
```typescript
// Use bulk operations for multiple writes
await Transaction.bulkWrite([
  { updateOne: { filter: { _id: id1 }, update: { $set: { amount: 100 } } } },
  { updateOne: { filter: { _id: id2 }, update: { $set: { amount: 200 } } } },
]);
```

### Aggregation Pipeline Optimization

#### 1. Use $match Early
```typescript
// Filter early in pipeline
const pipeline = [
  { $match: { userId, date: { $gte: startDate } } }, // Filter first
  { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
  { $sort: { total: -1 } },
  { $limit: 10 },
];
```

#### 2. Use $project to Limit Fields
```typescript
const pipeline = [
  { $match: { userId } },
  { $project: { amount: 1, date: 1, type: 1 } }, // Only needed fields
  { $group: { _id: '$type', total: { $sum: '$amount' } } },
];
```

#### 3. Use $facet for Multiple Aggregations
```typescript
const pipeline = [
  { $match: { userId, date: { $gte: startDate } } },
  {
    $facet: {
      income: [{ $match: { type: 'income' } }, { $group: { _id: null, total: { $sum: '$amount' } } }],
      expenses: [{ $match: { type: 'expense' } }, { $group: { _id: null, total: { $sum: '$amount' } } }],
      categories: [{ $group: { _id: '$categoryId', total: { $sum: '$amount' } } }],
    },
  },
];
```

### Database Connection Pooling

#### Mongoose Connection Configuration
```typescript
// lib/database/connection.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10, // Maximum number of connections in pool
      minPoolSize: 5, // Minimum number of connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      heartbeatFrequencyMS: 10000, // Heartbeat every 10 seconds
      retryWrites: true,
      retryReads: true,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

export default connectDB;
```

### Performance Monitoring Queries

#### 1. Check Index Usage
```typescript
// Explain query to see index usage
const explain = await Transaction.find({ userId, date: { $gte: startDate } })
  .explain('executionStats');

console.log('Index used:', explain.executionStats.executionStages.indexName);
console.log('Documents examined:', explain.executionStats.totalDocsExamined);
console.log('Documents returned:', explain.executionStats.nReturned);
```

#### 2. Monitor Slow Queries
```typescript
// Enable profiling for slow queries
// In MongoDB shell:
// db.setProfilingLevel(1, { slowms: 100 }) // Log queries slower than 100ms

// Check slow queries
// db.system.profile.find().sort({ ts: -1 }).limit(10).pretty()
```

#### 3. Index Statistics
```typescript
// Get index statistics
const stats = await Transaction.collection.stats();
console.log('Index sizes:', stats.indexSizes);
console.log('Total index size:', stats.totalIndexSize);
```

### Index Maintenance

#### 1. Regular Index Rebuilding
```typescript
// Rebuild indexes (run during maintenance window)
await Transaction.collection.reIndex();
```

#### 2. Monitor Index Size
```typescript
// Check if indexes are too large
const stats = await Transaction.collection.stats();
const indexSizeRatio = stats.totalIndexSize / stats.size;
if (indexSizeRatio > 0.5) {
  console.warn('Index size is more than 50% of collection size');
}
```

#### 3. Remove Unused Indexes
```typescript
// Drop unused indexes
await Transaction.collection.dropIndex('unused_index_name');
```

### Best Practices

1. **Index Selectivity**: Create indexes on fields with high selectivity
2. **Compound Indexes**: Order fields by selectivity (most selective first)
3. **Covered Queries**: Use indexes that include all queried fields
4. **Index Intersection**: MongoDB can use multiple indexes for a query
5. **Partial Indexes**: Create indexes with filters for specific use cases
6. **TTL Indexes**: Use for time-based data cleanup
7. **Text Indexes**: Limit to necessary fields to reduce index size
8. **Monitor Performance**: Regularly check query performance and index usage

---

## Activity Logging & Audit Trail

### Overview
FinMan implements comprehensive activity logging and audit trail functionality to track all user actions, data changes, and security events. This ensures compliance, security monitoring, and provides a complete history of system activities.

### User Activity Log Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required, indexed),
  action: String (required, indexed), // e.g., 'transaction.created', 'budget.updated'
  entityType: String (required, indexed), // 'transaction', 'budget', 'goal', 'category', etc.
  entityId: ObjectId (indexed), // ID of the affected entity
  actionType: String (enum: ['create', 'update', 'delete', 'view', 'export', 'import'], required),
  description: String, // Human-readable description
  changes: {
    before: Object, // Previous state (for updates/deletes)
    after: Object,  // New state (for creates/updates)
    fields: [String] // List of changed fields
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceType: String, // 'desktop', 'mobile', 'tablet'
    browser: String,
    os: String,
    location: {
      country: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  },
  severity: String (enum: ['low', 'medium', 'high', 'critical'], default: 'low'),
  status: String (enum: ['success', 'failed', 'pending'], default: 'success'),
  errorMessage: String, // If action failed
  sessionId: String (indexed), // Session identifier
  requestId: String (indexed), // Request identifier for tracing
  timestamp: Date (required, indexed, default: Date.now),
  createdAt: Date (default: Date.now)
}
```

**Indexes for User Activity Log**:
- `{ userId: 1, timestamp: -1 }` - User activity timeline
- `{ entityType: 1, entityId: 1, timestamp: -1 }` - Entity change history
- `{ action: 1, timestamp: -1 }` - Action-based queries
- `{ actionType: 1, timestamp: -1 }` - Action type queries
- `{ severity: 1, timestamp: -1 }` - Security event queries
- `{ sessionId: 1, timestamp: -1 }` - Session tracking
- `{ requestId: 1 }` - Request tracing

### Security Event Log Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, optional, indexed), // null for anonymous events
  eventType: String (required, indexed), // 'login_attempt', 'password_change', 'suspicious_activity', etc.
  severity: String (enum: ['low', 'medium', 'high', 'critical'], required, indexed),
  description: String (required),
  metadata: {
    ipAddress: String (required, indexed),
    userAgent: String,
    deviceFingerprint: String, // For device identification
    location: {
      country: String,
      city: String,
      isp: String
    },
    success: Boolean,
    failureReason: String, // If event failed
    riskScore: Number, // 0-100 risk assessment
  },
  relatedEntity: {
    type: String, // 'transaction', 'budget', etc.
    id: ObjectId
  },
  flagged: Boolean (default: false, indexed), // Manually flagged for review
  reviewed: Boolean (default: false),
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  timestamp: Date (required, indexed, default: Date.now),
  createdAt: Date (default: Date.now)
}
```

**Indexes for Security Event Log**:
- `{ userId: 1, timestamp: -1 }` - User security events
- `{ eventType: 1, severity: 1, timestamp: -1 }` - Security event queries
- `{ 'metadata.ipAddress': 1, timestamp: -1 }` - IP-based queries
- `{ flagged: 1, reviewed: 1 }` - Review queue
- `{ severity: 1, timestamp: -1 }` - Critical events

### Data Change Tracking Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required, indexed),
  entityType: String (required, indexed), // 'transaction', 'budget', 'goal', etc.
  entityId: ObjectId (required, indexed),
  changeType: String (enum: ['create', 'update', 'delete'], required),
  changes: [{
    field: String (required), // Field name
    oldValue: any, // Previous value
    newValue: any, // New value
    dataType: String // 'string', 'number', 'date', 'object', etc.
  }],
  changedBy: ObjectId (ref: User, required), // User who made the change
  changeReason: String, // Optional reason for change
  version: Number (default: 1), // Version number for entity
  previousVersion: ObjectId (ref: DataChange), // Link to previous version
  timestamp: Date (required, indexed, default: Date.now),
  createdAt: Date (default: Date.now)
}
```

**Indexes for Data Change Tracking**:
- `{ entityType: 1, entityId: 1, timestamp: -1 }` - Entity change history
- `{ userId: 1, timestamp: -1 }` - User change history
- `{ changedBy: 1, timestamp: -1 }` - Changes by user
- `{ changeType: 1, timestamp: -1 }` - Change type queries

### Activity Logging Service

Create `lib/services/audit.service.ts`:
```typescript
import { Model } from 'mongoose';
import { UserActivityLog } from '@/models/UserActivityLog';
import { SecurityEventLog } from '@/models/SecurityEventLog';
import { DataChange } from '@/models/DataChange';
import { logger } from '@/lib/services/logger.service';

interface ActivityLogData {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'export' | 'import';
  description?: string;
  changes?: {
    before?: any;
    after?: any;
    fields?: string[];
  };
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
  };
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'success' | 'failed' | 'pending';
  errorMessage?: string;
  sessionId?: string;
  requestId?: string;
}

interface SecurityEventData {
  userId?: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: {
    ipAddress: string;
    userAgent?: string;
    success?: boolean;
    failureReason?: string;
    riskScore?: number;
  };
}

export const auditService = {
  /**
   * Get models (lazy load to avoid circular dependencies)
   */
  async getModels() {
    const { default: UserActivityLog } = await import('@/models/UserActivityLog');
    const { default: SecurityEventLog } = await import('@/models/SecurityEventLog');
    const { default: DataChange } = await import('@/models/DataChange');
    return { UserActivityLog, SecurityEventLog, DataChange };
  },

  /**
   * Log user activity
   */
  async logActivity(data: ActivityLogData): Promise<void> {
    try {
      const { UserActivityLog } = await this.getModels();
      await UserActivityLog.create({
        ...data,
        timestamp: new Date(),
      });

      // Also log to Winston for immediate monitoring
      logger.info(`Activity: ${data.action}`, {
        service: 'audit',
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        severity: data.severity || 'low',
      });
    } catch (error: any) {
      logger.error('Activity log failed', {
        service: 'audit',
        error: error.message,
        event: 'activity_log_failed',
        userId: data.userId,
      });
    }
  },

  /**
   * Log security event
   */
  async logSecurityEvent(data: SecurityEventData): Promise<void> {
    try {
      const { SecurityEventLog } = await this.getModels();
      await SecurityEventLog.create({
        ...data,
        timestamp: new Date(),
      });

      // Log critical events immediately
      if (data.severity === 'critical' || data.severity === 'high') {
        logger.warn(`Security Event: ${data.eventType}`, {
          service: 'audit',
          userId: data.userId,
          eventType: data.eventType,
          severity: data.severity,
          ipAddress: data.metadata.ipAddress,
        });
      }
    } catch (error: any) {
      logger.error('Security event log failed', {
        service: 'audit',
        error: error.message,
        event: 'security_event_log_failed',
      });
    }
  },

  /**
   * Track data changes
   */
  async trackDataChange(
    userId: string,
    entityType: string,
    entityId: string,
    changeType: 'create' | 'update' | 'delete',
    oldData: any,
    newData: any,
    changedBy: string,
  ): Promise<void> {
    try {
      const { DataChange } = await this.getModels();
      
      // Calculate changes
      const changes = this.calculateChanges(oldData, newData, changeType);

      if (changes.length === 0 && changeType !== 'delete') {
        return; // No actual changes
      }

      // Get current version
      const lastChange = await DataChange
        .findOne({
          entityType,
          entityId,
        })
        .sort({ version: -1 })
        .lean();

      const version = lastChange ? lastChange.version + 1 : 1;

      await DataChange.create({
        userId,
        entityType,
        entityId,
        changeType,
        changes,
        changedBy,
        version,
        previousVersion: lastChange?._id,
        timestamp: new Date(),
      });
    } catch (error: any) {
      logger.error('Data change tracking failed', {
        service: 'audit',
        error: error.message,
        event: 'data_change_tracking_failed',
        userId,
        entityType,
        entityId,
      });
    }
  },

  /**
   * Calculate field changes between old and new data
   */
  calculateChanges(
    oldData: any,
    newData: any,
    changeType: string,
  ): Array<{ field: string; oldValue: any; newValue: any; dataType: string }> {
    const changes: Array<{
      field: string;
      oldValue: any;
      newValue: any;
      dataType: string;
    }> = [];

    if (changeType === 'create') {
      // For creates, all fields are new
      Object.keys(newData || {}).forEach((key) => {
        if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
          changes.push({
            field: key,
            oldValue: null,
            newValue: newData[key],
            dataType: typeof newData[key],
          });
        }
      });
    } else if (changeType === 'update') {
      // For updates, compare old and new
      const allKeys = new Set([
        ...Object.keys(oldData || {}),
        ...Object.keys(newData || {}),
      ]);

      allKeys.forEach((key) => {
        if (
          key !== '_id' &&
          key !== '__v' &&
          key !== 'createdAt' &&
          key !== 'updatedAt'
        ) {
          const oldValue = oldData?.[key];
          const newValue = newData?.[key];

          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push({
              field: key,
              oldValue,
              newValue,
              dataType: typeof newValue,
            });
          }
        }
      });
    } else if (changeType === 'delete') {
      // For deletes, record all fields from old data
      Object.keys(oldData || {}).forEach((key) => {
        if (key !== '_id' && key !== '__v') {
          changes.push({
            field: key,
            oldValue: oldData[key],
            newValue: null,
            dataType: typeof oldData[key],
          });
        }
      });
    }

    return changes;
  }

  /**
   * Get user activity history
   */
  async getUserActivityHistory(
    userId: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      action?: string;
      entityType?: string;
      limit?: number;
      page?: number;
    },
  ) {
    const query: any = { userId };

    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = filters.startDate;
      if (filters.endDate) query.timestamp.$lte = filters.endDate;
    }

    if (filters.action) query.action = filters.action;
    if (filters.entityType) query.entityType = filters.entityType;

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const { UserActivityLog } = await this.getModels();
    const [data, total] = await Promise.all([
      UserActivityLog
        .find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserActivityLog.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Get entity change history
   */
  async getEntityChangeHistory(
    entityType: string,
    entityId: string,
  ): Promise<any[]> {
    const { DataChange } = await this.getModels();
    return DataChange
      .find({ entityType, entityId })
      .sort({ version: 1 })
      .populate('changedBy', 'email firstName lastName')
      .lean();
  },

  /**
   * Get security events
   */
  async getSecurityEvents(
    filters: {
      userId?: string;
      eventType?: string;
      severity?: string;
      flagged?: boolean;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      page?: number;
    },
  ) {
    const { SecurityEventLog } = await this.getModels();
    const query: any = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.eventType) query.eventType = filters.eventType;
    if (filters.severity) query.severity = filters.severity;
    if (filters.flagged !== undefined) query.flagged = filters.flagged;

    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = filters.startDate;
      if (filters.endDate) query.timestamp.$lte = filters.endDate;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      SecurityEventLog
        .find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'email firstName lastName')
        .lean(),
      SecurityEventLog.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Flag security event for review
   */
  async flagSecurityEvent(eventId: string, flagged: boolean = true): Promise<void> {
    const { SecurityEventLog } = await this.getModels();
    await SecurityEventLog.findByIdAndUpdate(eventId, { flagged });
  },

  /**
   * Review security event
   */
  async reviewSecurityEvent(
    eventId: string,
    reviewedBy: string,
    notes?: string,
  ): Promise<void> {
    const { SecurityEventLog } = await this.getModels();
    await SecurityEventLog.findByIdAndUpdate(eventId, {
      reviewed: true,
      reviewedBy,
      reviewedAt: new Date(),
      reviewNotes: notes,
    });
  },
};
```

### Audit Middleware/Utility

Create `lib/utils/audit-helper.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auditService } from '@/lib/services/audit.service';
import { verifyToken } from '@/lib/utils/auth';

export async function auditRequest(
  request: NextRequest,
  response: NextResponse,
  user: any,
  data?: any,
) {
  const method = request.method;
  const url = request.nextUrl.pathname;
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
    const startTime = Date.now();
  const responseTime = Date.now() - startTime;

    // Determine action type
  const actionType = getActionType(method);
  const entityType = getEntityType(url);
    const action = `${entityType}.${actionType}`;

  if (user && shouldLog(url, method)) {
    await auditService.logActivity({
              userId: user.id,
              action,
              entityType,
      entityId: extractEntityId(url, data),
              actionType,
              description: `${method} ${url}`,
              metadata: {
                ipAddress: ip,
        userAgent,
        deviceType: detectDevice(userAgent),
      },
      status: response.status < 400 ? 'success' : 'failed',
      requestId: request.headers.get('x-request-id') || generateRequestId(),
      severity: determineSeverity(action, method),
    });
  }
}

export async function auditError(
  request: NextRequest,
  user: any,
  error: Error,
) {
  const method = request.method;
  const url = request.nextUrl.pathname;
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  const actionType = getActionType(method);
  const entityType = getEntityType(url);
  const action = `${entityType}.${actionType}`;

          if (user) {
    await auditService.logActivity({
              userId: user.id,
              action,
              entityType,
              actionType,
              description: `${method} ${url} - Failed`,
              metadata: {
                ipAddress: ip,
        userAgent,
              },
              status: 'failed',
              errorMessage: error.message,
              severity: 'high',
            });
          }
  }

function getActionType(method: string): 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' {
    switch (method.toUpperCase()) {
      case 'POST':
        return 'create';
      case 'PUT':
      case 'PATCH':
        return 'update';
      case 'DELETE':
        return 'delete';
      case 'GET':
        return 'view';
      default:
        return 'view';
    }
  }

function getEntityType(url: string): string {
    const parts = url.split('/').filter(Boolean);
    if (parts.length > 1 && parts[0] === 'api') {
      return parts[1]; // e.g., 'transactions', 'budgets'
    }
    return 'unknown';
  }

function extractEntityId(url: string, data: any): string | undefined {
    // Extract ID from URL or response data
    const urlMatch = url.match(/\/([a-f0-9]{24})/);
    if (urlMatch) return urlMatch[1];
    if (data?._id) return data._id.toString();
    if (data?.id) return data.id.toString();
    return undefined;
  }

function shouldLog(url: string, method: string): boolean {
    // Don't log health checks, metrics, etc.
    const excludedPaths = ['/health', '/metrics', '/api/auth/login'];
    return !excludedPaths.some((path) => url.includes(path));
  }

function detectDevice(userAgent: string): string {
    if (!userAgent) return 'unknown';
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet/i.test(userAgent)) return 'tablet';
    return 'desktop';
  }

function determineSeverity(action: string, method: string): 'low' | 'medium' | 'high' | 'critical' {
    // Critical actions
    if (action.includes('delete') || action.includes('password') || action.includes('account')) {
      return 'critical';
    }
    // High severity actions
    if (action.includes('export') || action.includes('import') || action.includes('budget')) {
      return 'high';
    }
    // Medium severity actions
    if (action.includes('update') || action.includes('create')) {
      return 'medium';
    }
    return 'low';
  }

function generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

### Security Event Detection

Create `lib/services/security-detection.service.ts`:
```typescript
import { auditService } from './audit.service';

export const securityDetectionService = {

  /**
   * Detect suspicious login patterns
   */
  async detectSuspiciousLogin(
    userId: string,
    ipAddress: string,
    userAgent: string,
    success: boolean,
  ): Promise<void> {
    // Check for multiple failed attempts
    const recentFailures = await auditService.getSecurityEvents({
      userId,
      eventType: 'login_attempt',
      startDate: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
      limit: 10,
    });

    const failureCount = recentFailures.data.filter(
      (e: any) => !e.metadata.success,
    ).length;

    if (failureCount >= 5) {
      await auditService.logSecurityEvent({
        userId,
        eventType: 'multiple_failed_login_attempts',
        severity: 'high',
        description: `Multiple failed login attempts detected (${failureCount} in 15 minutes)`,
        metadata: {
          ipAddress,
          userAgent,
          success: false,
          failureReason: 'Too many failed attempts',
          riskScore: 80,
        },
      });
    }

    // Check for login from new location/device
    // Implementation would check against previous login locations
  }

  /**
   * Detect unusual transaction patterns
   */
  async detectUnusualTransaction(
    userId: string,
    transaction: any,
    ipAddress: string,
  ): Promise<void> {
    // Check for large transactions
    if (transaction.amount > 10000) {
      await auditService.logSecurityEvent({
        userId,
        eventType: 'large_transaction',
        severity: 'medium',
        description: `Large transaction detected: ${transaction.amount} ${transaction.currency}`,
        metadata: {
          ipAddress,
          success: true,
          riskScore: 40,
        },
      });
    }

    // Check for rapid transaction creation
    // Implementation would check transaction frequency
  }

  /**
   * Detect data export abuse
   */
  async detectExportAbuse(
    userId: string,
    exportType: string,
    ipAddress: string,
  ): Promise<void> {
    // Check export frequency
    const recentExports = await auditService.getUserActivityHistory(
      userId,
      {
        action: `${exportType}.export`,
        startDate: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        limit: 100,
      },
    );

    if (recentExports.total > 10) {
      await auditService.logSecurityEvent({
        userId,
        eventType: 'excessive_export',
        severity: 'high',
        description: `Excessive export activity detected: ${recentExports.total} exports in 1 hour`,
        metadata: {
          ipAddress,
          success: true,
          riskScore: 60,
        },
      });
    }
  },
};
```

### Audit API Routes

Create `app/api/v1/audit/activity/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { auditService } from '@/lib/services/audit.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const action = searchParams.get('action') || undefined;
    const entityType = searchParams.get('entityType') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const history = await auditService.getUserActivityHistory(user.id, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      action,
      entityType,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/audit/entity/[entityType]/[entityId]/history/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { auditService } from '@/lib/services/audit.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { entityType: string; entityId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const history = await auditService.getEntityChangeHistory(
      params.entityType,
      params.entityId,
    );

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/audit/security-events/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { auditService } from '@/lib/services/audit.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('eventType') || undefined;
    const severity = searchParams.get('severity') || undefined;
    const flagged = searchParams.get('flagged') === 'true' ? true : undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const events = await auditService.getSecurityEvents({
      userId: user.id,
      eventType,
      severity,
      flagged,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/audit/security-events/[id]/flag/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { auditService } from '@/lib/services/audit.service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { flagged } = body;

    await auditService.flagSecurityEvent(params.id, flagged);

    return NextResponse.json({
      success: true,
      message: `Event ${flagged ? 'flagged' : 'unflagged'} successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/audit/security-events/[id]/review/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { auditService } from '@/lib/services/audit.service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notes } = body;

    await auditService.reviewSecurityEvent(params.id, user.id, notes);

    return NextResponse.json({
      success: true,
      message: 'Event reviewed successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Integration with Services

Update services to track changes:
```typescript
// In transactions.service.ts
async update(id: string, updateDto: UpdateTransactionDto, userId: string) {
  // Get old data
  const oldTransaction = await this.transactionModel.findOne({ _id: id, userId });

  // Update
  const updatedTransaction = await this.transactionModel.findOneAndUpdate(
    { _id: id, userId },
    updateDto,
    { new: true },
  );

  // Track data change
  await auditService.trackDataChange(
    userId,
    'transaction',
    id,
    'update',
    oldTransaction.toObject(),
    updatedTransaction.toObject(),
    userId,
  );

  // Log activity
  await auditService.logActivity({
    userId,
    action: 'transaction.updated',
    entityType: 'transaction',
    entityId: id,
    actionType: 'update',
    description: 'Transaction updated',
    changes: {
      before: oldTransaction.toObject(),
      after: updatedTransaction.toObject(),
    },
  });

  return updatedTransaction;
}
```

### Compliance Considerations

#### GDPR Compliance
- **Right to Access**: Users can export their activity logs
- **Right to Erasure**: Anonymize logs when user deletes account
- **Data Retention**: Define retention policies for audit logs
- **Data Minimization**: Only log necessary information

#### Data Retention Policy
```typescript
// Retention periods
const RETENTION_POLICIES = {
  activityLogs: 365, // 1 year
  securityEvents: 730, // 2 years
  dataChanges: 1095, // 3 years
  criticalEvents: 2555, // 7 years
};

// Cleanup job - Use Next.js API route with cron
// Create app/api/cron/cleanup-logs/route.ts
// Configure in Vercel Cron or use node-cron
import { NextRequest, NextResponse } from 'next/server';
import { UserActivityLog } from '@/models/UserActivityLog';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_POLICIES.activityLogs);

  await UserActivityLog.deleteMany({
    timestamp: { $lt: cutoffDate },
    severity: { $ne: 'critical' },
  });

  return NextResponse.json({ success: true, message: 'Logs cleaned up' });
}

// Configure in vercel.json for Vercel deployment:
// {
//   "crons": [{
//     "path": "/api/cron/cleanup-logs",
//     "schedule": "0 2 * * *"
//   }]
// }
```

### Audit Models

Create `models/UserActivityLog.ts`, `models/SecurityEventLog.ts`, and `models/DataChange.ts`:
```typescript
// models/UserActivityLog.ts
import mongoose from 'mongoose';

const UserActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, index: true },
  entityType: { type: String, required: true, index: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, index: true },
  actionType: { type: String, enum: ['create', 'update', 'delete', 'view', 'export', 'import'], required: true },
  description: String,
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    fields: [String],
  },
  metadata: mongoose.Schema.Types.Mixed,
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },
  errorMessage: String,
  sessionId: String,
  requestId: String,
  timestamp: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

export default mongoose.models.UserActivityLog || mongoose.model('UserActivityLog', UserActivityLogSchema);
```

**Note**: In Next.js, models are created directly using Mongoose. No modules are needed - just import the models where needed.

### API Endpoints

Add to API Endpoints section:
```
### Audit & Activity Logging Endpoints
GET    /api/audit/activity          # Get user activity history
GET    /api/audit/entity/:type/:id/history # Get entity change history
GET    /api/audit/security-events   # Get security events
POST   /api/audit/security-events/:id/flag # Flag security event
POST   /api/audit/security-events/:id/review # Review security event
```

### Best Practices

1. **Log All Critical Actions**: Log all create, update, delete operations
2. **Immutable Logs**: Never modify or delete audit logs
3. **Performance**: Use async logging to avoid blocking requests
4. **Storage**: Consider separate database for audit logs
5. **Encryption**: Encrypt sensitive data in logs
6. **Access Control**: Restrict access to audit logs
7. **Regular Review**: Review security events regularly
8. **Compliance**: Follow GDPR and other regulations

---

## API Endpoints

### API Versioning Strategy

#### Overview
FinMan uses URL-based API versioning to ensure backward compatibility and smooth transitions when introducing breaking changes. All API endpoints are versioned using the `/api/v{version}/` prefix pattern.

#### Versioning Approach

##### URL-Based Versioning
All API endpoints follow the pattern: `/api/v{version}/{resource}/{action}`

**Examples:**
```
/api/v1/auth/login
/api/v1/transactions
/api/v1/budgets
/api/v2/transactions  # New version with breaking changes
```

##### Current Version
- **Current Version**: v1
- **Default Version**: v1 (if no version specified, defaults to latest stable)
- **Version Format**: Semantic versioning (v1, v2, v3, etc.)

##### Version Structure in Next.js

```
app/
├── api/
│   ├── v1/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   ├── transactions/
│   │   │   └── route.ts
│   │   └── budgets/
│   │       └── route.ts
│   └── v2/
│       ├── transactions/
│       │   └── route.ts
│       └── budgets/
│           └── route.ts
```

#### Version Detection Middleware

Create `middleware.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if path starts with /api/
  if (path.startsWith('/api/')) {
    // Check if version is specified
    const versionMatch = path.match(/^\/api\/v(\d+)\//);
    
    if (versionMatch) {
      const version = parseInt(versionMatch[1]);
      
      // Validate version exists
      const supportedVersions = [1, 2]; // Add new versions here
      
      if (!supportedVersions.includes(version)) {
        return NextResponse.json(
          {
            error: 'Unsupported API version',
            message: `API version v${version} is not supported. Supported versions: ${supportedVersions.map(v => `v${v}`).join(', ')}`,
            supportedVersions: supportedVersions.map(v => `v${v}`),
          },
          { status: 400 }
        );
      }
      
      // Add version to request headers for route handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-api-version', version.toString());
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } else {
      // No version specified, default to v1
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-api-version', '1');
      
      // Optionally redirect to versioned URL
      // Or continue with default version
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

#### Version-Specific Route Handlers

Create `app/api/v1/transactions/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { transactionsServiceV1 } from '@/lib/services/v1/transactions.service';

export async function GET(request: NextRequest) {
  try {
    const version = request.headers.get('x-api-version') || '1';
    
    // Version-specific logic
    if (version === '1') {
      const transactions = await transactionsServiceV1.findAll(userId);
      return NextResponse.json({
        success: true,
        data: transactions,
        version: 'v1',
      });
    }
    
    // Fallback
    return NextResponse.json(
      { error: 'Unsupported version' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v2/transactions/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { transactionsServiceV2 } from '@/lib/services/v2/transactions.service';

export async function GET(request: NextRequest) {
  try {
    // V2 has different response structure
    const transactions = await transactionsServiceV2.findAll(userId);
    
    return NextResponse.json({
      success: true,
      data: {
        transactions: transactions.items,
        pagination: transactions.pagination,
        metadata: transactions.metadata,
      },
      version: 'v2',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### Backward Compatibility

##### Compatibility Strategy
1. **Maintain Old Versions**: Keep previous versions active for a deprecation period
2. **Additive Changes**: New versions should add features, not remove (when possible)
3. **Response Wrappers**: Use adapters to maintain compatibility
4. **Feature Flags**: Use feature flags to enable new behavior gradually

##### Version Adapter Pattern
```typescript
// lib/services/version-adapter.ts
export const versionAdapter = {
  /**
   * Adapt v1 response to v2 format
   */
  adaptV1ToV2(v1Response: any): any {
    return {
      data: {
        transactions: v1Response.data,
        pagination: {
          page: 1,
          limit: v1Response.data.length,
          total: v1Response.data.length,
        },
        metadata: {
          currency: 'USD',
          period: 'all',
        },
      },
      version: 'v2',
    };
  },

  /**
   * Adapt v2 response to v1 format
   */
  adaptV2ToV1(v2Response: any): any {
    return {
      data: v2Response.data.transactions,
      version: 'v1',
    };
  },
};
```

#### Deprecation Policy

##### Deprecation Timeline
1. **Announcement**: Announce deprecation 6 months in advance
2. **Warning Period**: Add deprecation warnings to API responses for 3 months
3. **Sunset Period**: Keep deprecated version active for 3 months after announcement
4. **Removal**: Remove deprecated version after sunset period

##### Deprecation Headers
```typescript
// Add deprecation headers to responses
export function addDeprecationHeaders(response: NextResponse, version: string) {
  const deprecatedVersions = ['v1']; // List of deprecated versions
  
  if (deprecatedVersions.includes(version)) {
    response.headers.set('X-API-Deprecated', 'true');
    response.headers.set('X-API-Deprecation-Date', '2024-12-31');
    response.headers.set('X-API-Sunset-Date', '2025-03-31');
    response.headers.set('X-API-Successor-Version', 'v2');
    response.headers.set(
      'X-API-Deprecation-Notice',
      'This API version is deprecated. Please migrate to v2 by 2025-03-31.'
    );
  }
  
  return response;
}
```

##### Deprecation Response Example
```json
{
  "success": true,
  "data": { ... },
  "version": "v1",
  "deprecation": {
    "deprecated": true,
    "deprecationDate": "2024-12-31",
    "sunsetDate": "2025-03-31",
    "successorVersion": "v2",
    "migrationGuide": "https://finman.finance/docs/api/migration/v1-to-v2"
  }
}
```

#### Version Migration Guide

##### Migration Documentation Structure
```
docs/
├── api/
│   ├── migration/
│   │   ├── v1-to-v2.md
│   │   ├── v2-to-v3.md
│   │   └── index.md
│   └── versions/
│       ├── v1.md
│       ├── v2.md
│       └── latest.md
```

##### Migration Guide Template
```markdown
# Migrating from v1 to v2

## Overview
This guide helps you migrate from API v1 to v2.

## Breaking Changes

### 1. Response Structure
**v1:**
```json
{
  "data": [...]
}
```

**v2:**
```json
{
  "data": {
    "items": [...],
    "pagination": {...},
    "metadata": {...}
  }
}
```

### 2. Authentication
- v1: Bearer token in header
- v2: Bearer token + API key required

### 3. Error Format
**v1:**
```json
{
  "error": "Error message"
}
```

**v2:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {...}
  }
}
```

## Migration Steps

1. Update base URL to `/api/v2/`
2. Update response parsing
3. Add API key to requests
4. Update error handling
5. Test thoroughly

## Code Examples

### JavaScript/TypeScript
```typescript
// Before (v1)
const response = await fetch('/api/v1/transactions');
const data = await response.json();
const transactions = data.data;

// After (v2)
const response = await fetch('/api/v2/transactions', {
  headers: {
    'X-API-Key': 'your-api-key',
  },
});
const data = await response.json();
const transactions = data.data.items;
```

## Timeline
- v1 deprecated: 2024-12-31
- v1 sunset: 2025-03-31
- v2 stable: 2024-06-01
```

#### Breaking Changes Handling

##### Breaking Change Types
1. **Response Structure Changes**: Changes to response format
2. **Request Format Changes**: Changes to request body/parameters
3. **Authentication Changes**: Changes to auth requirements
4. **Endpoint Removal**: Removing endpoints
5. **Error Format Changes**: Changes to error response structure

##### Breaking Change Process
```typescript
// lib/utils/version-compatibility.ts
export const versionCompatibility = {
  /**
   * Check if request is compatible with version
   */
  validateRequest(version: string, request: any): {
    compatible: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check version-specific requirements
    if (version === 'v2') {
      if (!request.headers['x-api-key']) {
        issues.push('API key required for v2');
      }
    }
    
    return {
      compatible: issues.length === 0,
      issues,
    };
  },

  /**
   * Transform request for version compatibility
   */
  transformRequest(version: string, request: any): any {
    if (version === 'v2') {
      // Transform v1 request to v2 format
      return {
        ...request,
        body: {
          ...request.body,
          // Add v2-specific fields
        },
      };
    }
    
    return request;
  },
};
```

##### Version-Specific Validation
```typescript
// lib/validators/v1/transaction.validator.ts
import { z } from 'zod';

export const createTransactionSchemaV1 = z.object({
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  categoryId: z.string(),
  description: z.string().optional(),
  date: z.string(),
});

// lib/validators/v2/transaction.validator.ts
export const createTransactionSchemaV2 = z.object({
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  categoryId: z.string(),
  description: z.string().optional(),
  date: z.string(),
  // v2 adds new required field
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});
```

#### Version Information Endpoint

Create `app/api/versions/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const versions = {
    current: 'v2',
    latest: 'v2',
    supported: ['v1', 'v2'],
    deprecated: ['v1'],
    versions: {
      v1: {
        status: 'deprecated',
        deprecationDate: '2024-12-31',
        sunsetDate: '2025-03-31',
        endpoints: '/api/v1/*',
      },
      v2: {
        status: 'stable',
        releaseDate: '2024-06-01',
        endpoints: '/api/v2/*',
        changelog: 'https://finman.finance/docs/api/v2/changelog',
      },
    },
  };

  return NextResponse.json({
    success: true,
    data: versions,
  });
}
```

#### Version-Specific Service Structure

```
lib/
├── services/
│   ├── v1/
│   │   ├── transactions.service.ts
│   │   ├── budgets.service.ts
│   │   └── auth.service.ts
│   ├── v2/
│   │   ├── transactions.service.ts
│   │   ├── budgets.service.ts
│   │   └── auth.service.ts
│   └── shared/
│       ├── database.service.ts
│       └── validation.service.ts
```

#### Best Practices

1. **Version in URL**: Always include version in URL path
2. **Default to Latest**: Default to latest stable version if not specified
3. **Clear Documentation**: Document all versions and changes
4. **Deprecation Warnings**: Always warn before deprecating
5. **Migration Tools**: Provide migration guides and tools
6. **Testing**: Test all versions thoroughly
7. **Monitoring**: Monitor version usage
8. **Communication**: Communicate changes clearly

#### Version Usage Tracking

```typescript
// Track API version usage
export async function trackVersionUsage(version: string, endpoint: string) {
  await analyticsService.trackEvent({
    eventType: 'api_version_usage',
    eventName: 'api_call',
    properties: {
      version,
      endpoint,
    },
  });
}
```

### Authentication Endpoints (v1)
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # User login
POST   /api/v1/auth/logout            # User logout
POST   /api/v1/auth/refresh           # Refresh access token
GET    /api/v1/auth/profile           # Get current user profile
PUT    /api/v1/auth/profile           # Update user profile
POST   /api/v1/auth/change-password   # Change password
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password with token
POST   /api/v1/auth/2fa/setup         # Initiate 2FA setup
POST   /api/v1/auth/2fa/verify        # Verify and enable 2FA
POST   /api/v1/auth/2fa/disable       # Disable 2FA
POST   /api/v1/auth/2fa/backup-codes/regenerate # Regenerate backup codes
GET    /api/v1/auth/2fa/status        # Get 2FA status
POST   /api/v1/auth/2fa/verify-login  # Verify 2FA during login
POST   /api/v1/auth/2fa/recover       # Account recovery
GET    /api/v1/auth/google             # Initiate Google OAuth
GET    /api/v1/auth/google/callback   # Google OAuth callback
GET    /api/v1/auth/facebook           # Initiate Facebook OAuth (optional)
GET    /api/v1/auth/facebook/callback # Facebook OAuth callback (optional)
POST   /api/v1/auth/link-account      # Link OAuth account to existing account
POST   /api/v1/auth/unlink-account    # Unlink OAuth account
GET    /api/v1/auth/linked-accounts    # Get linked OAuth accounts
```

**Note**: All endpoints are versioned. Use `/api/v1/` prefix for current version. Future versions will use `/api/v2/`, `/api/v3/`, etc.

### OAuth & Social Login

#### Overview
FinMan supports OAuth-based social login using Google OAuth and optionally Facebook. This allows users to sign in quickly using their existing social media accounts while maintaining security and privacy.

#### OAuth Flow Implementation

##### Step 1: Install Dependencies
```bash
npm install passport passport-google-oauth20 passport-facebook
npm install -D @types/passport-google-oauth20 @types/passport-facebook
```

##### Step 2: Update User Schema
Add OAuth fields to User schema:
```typescript
{
  // ... existing fields
  oauthProviders: {
    google: {
      providerId: String, // Google user ID
      email: String,
      linkedAt: Date,
      accessToken: String (encrypted, optional),
      refreshToken: String (encrypted, optional),
    },
    facebook: {
      providerId: String, // Facebook user ID
      email: String,
      linkedAt: Date,
      accessToken: String (encrypted, optional),
    }
  },
  primaryAuthMethod: String (enum: ['email', 'google', 'facebook'], default: 'email'),
  linkedAccounts: [{
    provider: String (enum: ['google', 'facebook']),
    providerId: String,
    email: String,
    linkedAt: Date
  }]
}
```

##### Step 3: Google OAuth Handler
Create `lib/utils/google-oauth.ts`:
```typescript
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

export function createGoogleStrategy() {
  return new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    },
    async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
    ) => {
    const { id, name, emails, photos } = profile;
    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };

    done(null, user);
    },
  );
}
```

##### Step 4: Facebook OAuth Handler (Optional)
Create `lib/utils/facebook-oauth.ts`:
```typescript
import { Strategy, Profile } from 'passport-facebook';

export function createFacebookStrategy() {
  return new Strategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      scope: ['email'],
      profileFields: ['emails', 'name', 'picture'],
    },
    async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
    ) => {
    const { id, name, emails, photos } = profile;
    const user = {
      provider: 'facebook',
      providerId: id,
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value,
      accessToken,
    };

    done(null, user);
    },
  );
}
```

##### Step 5: OAuth Service
Create `lib/services/oauth.service.ts`:
```typescript
import { Model } from 'mongoose';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { auditService } from './audit.service';
import { emailService } from './email.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

interface OAuthUser {
  provider: 'google' | 'facebook';
  providerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  accessToken: string;
  refreshToken?: string;
}

export const oauthService = {

  /**
   * Handle OAuth login/registration
   */
  async handleOAuthLogin(
    oauthUser: OAuthUser,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ user: any; accessToken: string; isNewUser: boolean }> {
    // Check if user exists with this OAuth provider
    let user = await User.findOne({
      [`oauthProviders.${oauthUser.provider}.providerId`]: oauthUser.providerId,
    });

    const isNewUser = !user;

    if (!user) {
      // Check if user exists with this email
      user = await User.findOne({ email: oauthUser.email });

      if (user) {
        // Link OAuth account to existing user
        user.oauthProviders[oauthUser.provider] = {
          providerId: oauthUser.providerId,
          email: oauthUser.email,
          linkedAt: new Date(),
          accessToken: encryptToken(oauthUser.accessToken),
          refreshToken: oauthUser.refreshToken
            ? encryptToken(oauthUser.refreshToken)
            : undefined,
        };

        user.linkedAccounts.push({
          provider: oauthUser.provider,
          providerId: oauthUser.providerId,
          email: oauthUser.email,
          linkedAt: new Date(),
        });

        await user.save();

        // Log account linking
        await auditService.logActivity({
          userId: user._id.toString(),
          action: 'oauth.account_linked',
          entityType: 'user',
          entityId: user._id.toString(),
          actionType: 'update',
          description: `${oauthUser.provider} account linked`,
          severity: 'high',
          metadata: {
            ipAddress,
            userAgent,
            provider: oauthUser.provider,
          },
        });

        // Send email notification
        await emailService.sendAccountLinkedEmail(user, oauthUser.provider);
      } else {
        // Create new user with OAuth
        user = await User.create({
          email: oauthUser.email,
          firstName: oauthUser.firstName,
          lastName: oauthUser.lastName,
          oauthProviders: {
            [oauthUser.provider]: {
              providerId: oauthUser.providerId,
              email: oauthUser.email,
              linkedAt: new Date(),
              accessToken: this.encryptToken(oauthUser.accessToken),
              refreshToken: oauthUser.refreshToken
                ? this.encryptToken(oauthUser.refreshToken)
                : undefined,
            },
          },
          primaryAuthMethod: oauthUser.provider,
          linkedAccounts: [
            {
              provider: oauthUser.provider,
              providerId: oauthUser.providerId,
              email: oauthUser.email,
              linkedAt: new Date(),
            },
          ],
          emailVerified: true, // OAuth emails are pre-verified
        });

        // Log registration
        await auditService.logActivity({
          userId: user._id.toString(),
          action: 'user.registered',
          entityType: 'user',
          entityId: user._id.toString(),
          actionType: 'create',
          description: `User registered via ${oauthUser.provider}`,
          severity: 'medium',
          metadata: {
            ipAddress,
            userAgent,
            provider: oauthUser.provider,
          },
        });

        // Send welcome email
        await emailService.sendWelcomeEmail(user);
      }
    } else {
      // Update access token
      user.oauthProviders[oauthUser.provider].accessToken = this.encryptToken(
        oauthUser.accessToken,
      );
      if (oauthUser.refreshToken) {
        user.oauthProviders[oauthUser.provider].refreshToken =
          this.encryptToken(oauthUser.refreshToken);
      }
      await user.save();
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );

    // Log login
    await auditService.logActivity({
      userId: user._id.toString(),
      action: 'user.login',
      entityType: 'user',
      entityId: user._id.toString(),
      actionType: 'view',
      description: `User logged in via ${oauthUser.provider}`,
      metadata: {
        ipAddress,
        userAgent,
        provider: oauthUser.provider,
      },
      severity: 'low',
    });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        primaryAuthMethod: user.primaryAuthMethod,
        linkedAccounts: user.linkedAccounts,
      },
      accessToken,
      isNewUser,
    };
  }

  /**
   * Link OAuth account to existing user
   */
  async linkAccount(
    userId: string,
    oauthUser: OAuthUser,
    ipAddress: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if account is already linked
    if (user.oauthProviders[oauthUser.provider]?.providerId) {
      throw new Error(
        `${oauthUser.provider} account is already linked`,
      );
    }

    // Check if OAuth account is linked to another user
    const existingLink = await User.findOne({
      [`oauthProviders.${oauthUser.provider}.providerId`]: oauthUser.providerId,
    });

    if (existingLink) {
      throw new Error(
        `This ${oauthUser.provider} account is already linked to another user`,
      );
    }

    // Link account
    user.oauthProviders[oauthUser.provider] = {
      providerId: oauthUser.providerId,
      email: oauthUser.email,
      linkedAt: new Date(),
      accessToken: encryptToken(oauthUser.accessToken),
      refreshToken: oauthUser.refreshToken
        ? encryptToken(oauthUser.refreshToken)
        : undefined,
    };

    user.linkedAccounts.push({
      provider: oauthUser.provider,
      providerId: oauthUser.providerId,
      email: oauthUser.email,
      linkedAt: new Date(),
    });

    await user.save();

    // Log activity
    await auditService.logActivity({
      userId,
      action: 'oauth.account_linked',
      entityType: 'user',
      entityId: userId,
      actionType: 'update',
      description: `${oauthUser.provider} account linked`,
      severity: 'high',
      metadata: {
        ipAddress,
        provider: oauthUser.provider,
      },
    });

    // Send email notification
    await emailService.sendAccountLinkedEmail(user, oauthUser.provider);
  }

  /**
   * Unlink OAuth account
   */
  async unlinkAccount(
    userId: string,
    provider: 'google' | 'facebook',
    password?: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if account is linked
    if (!user.oauthProviders[provider]?.providerId) {
      throw new Error(`${provider} account is not linked`);
    }

    // If this is the primary auth method, require password or another auth method
    if (user.primaryAuthMethod === provider) {
      if (!password && user.password) {
        throw new Error(
          'Password required to unlink primary authentication method',
        );
      }

      // Verify password if provided
      if (password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
      }

      // Set new primary auth method
      if (user.password) {
        user.primaryAuthMethod = 'email';
      } else if (user.oauthProviders.google?.providerId && provider !== 'google') {
        user.primaryAuthMethod = 'google';
      } else if (user.oauthProviders.facebook?.providerId && provider !== 'facebook') {
        user.primaryAuthMethod = 'facebook';
      } else {
        throw new Error(
          'Cannot unlink primary authentication method without alternative',
        );
      }
    }

    // Remove OAuth provider
    user.oauthProviders[provider] = undefined;
    user.linkedAccounts = user.linkedAccounts.filter(
      (account) => account.provider !== provider,
    );

    await user.save();

    // Log activity
    await auditService.logActivity({
      userId,
      action: 'oauth.account_unlinked',
      entityType: 'user',
      entityId: userId,
      actionType: 'update',
      description: `${provider} account unlinked`,
      severity: 'high',
    });

    // Send email notification
    await emailService.sendAccountUnlinkedEmail(user, provider);
  },

  /**
   * Get linked accounts
   */
  async getLinkedAccounts(userId: string) {
    const user = await User.findById(userId).select('linkedAccounts primaryAuthMethod');

    return {
      linkedAccounts: user.linkedAccounts,
      primaryAuthMethod: user.primaryAuthMethod,
    };
  },
};

// Helper functions
function encryptToken(token: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(
    process.env.ENCRYPTION_KEY || '',
      'hex',
    );
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(token, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

function decryptToken(encrypted: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(
    process.env.ENCRYPTION_KEY || '',
      'hex',
    );

    const data = Buffer.from(encrypted, 'base64');
    const iv = data.slice(0, 16);
    const authTag = data.slice(16, 32);
    const encryptedData = data.slice(32);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
}
```

##### Step 6: OAuth API Routes
Create `app/api/v1/auth/google/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import passport from 'passport';
import { createGoogleStrategy } from '@/lib/utils/google-oauth';

// Initialize passport strategy
passport.use('google', createGoogleStrategy());

export async function GET(request: NextRequest) {
  return new Promise((resolve) => {
    passport.authenticate('google', { scope: ['email', 'profile'] })(
      request as any,
      {} as any,
      () => {
        // Passport handles redirect
      }
    );
  });
}
```

Create `app/api/v1/auth/google/callback/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import passport from 'passport';
import { oauthService } from '@/lib/services/oauth.service';

export async function GET(request: NextRequest) {
  return new Promise((resolve) => {
    passport.authenticate('google', async (err: any, oauthUser: any) => {
      if (err || !oauthUser) {
        const redirectUrl = new URL(process.env.APP_URL || 'http://localhost:3000');
        redirectUrl.searchParams.set('error', err?.message || 'OAuth failed');
        return resolve(NextResponse.redirect(redirectUrl.toString()));
      }

      try {
        const ipAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || '';

        const result = await oauthService.handleOAuthLogin(
        oauthUser,
        ipAddress,
        userAgent,
      );

        const redirectUrl = new URL(process.env.APP_URL || 'http://localhost:3000');
      redirectUrl.searchParams.set('token', result.accessToken);
      redirectUrl.searchParams.set('isNewUser', result.isNewUser.toString());

        return resolve(NextResponse.redirect(redirectUrl.toString()));
      } catch (error: any) {
        const redirectUrl = new URL(process.env.APP_URL || 'http://localhost:3000');
      redirectUrl.searchParams.set('error', error.message);
        return resolve(NextResponse.redirect(redirectUrl.toString()));
      }
    })(request as any, {} as any, () => {});
  });
}
```

Create `app/api/v1/auth/link-account/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { oauthService } from '@/lib/services/oauth.service';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { provider, code } = body;

    // Exchange code for tokens and get user info
    // Implementation would call OAuth provider API to exchange code

    return NextResponse.json({
      success: true,
      message: `${provider} account linked successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/auth/unlink-account/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { oauthService } from '@/lib/services/oauth.service';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { provider, password } = body;

    await oauthService.unlinkAccount(user.id, provider, password);

    return NextResponse.json({
      success: true,
      message: `${provider} account unlinked successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/auth/linked-accounts/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { oauthService } from '@/lib/services/oauth.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accounts = await oauthService.getLinkedAccounts(user.id);

    return NextResponse.json({
      success: true,
      data: accounts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

##### Step 7: Initialize Passport (Optional)
If using Passport.js, create `lib/config/passport.ts`:
```typescript
import passport from 'passport';
import { createGoogleStrategy } from '@/lib/utils/google-oauth';
import { createFacebookStrategy } from '@/lib/utils/facebook-oauth';

// Initialize strategies
passport.use('google', createGoogleStrategy());
passport.use('facebook', createFacebookStrategy());

// Serialize/deserialize user for sessions (if using sessions)
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
```

**Note**: In Next.js, you can also use NextAuth.js for OAuth which is simpler. Passport.js is optional.

##### Step 8: Environment Variables
Add to `.env`:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
# Production: https://finman.finance/api/auth/google/callback

# Facebook OAuth (Optional)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback
# Production: https://finman.finance/api/auth/facebook/callback

# Frontend URL for OAuth redirects
FRONTEND_URL=http://localhost:3000
# Production: https://finman.finance
```

#### OAuth Flow Implementation

##### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://finman.finance/api/auth/google/callback`
6. Copy Client ID and Client Secret

##### Facebook OAuth Setup (Optional)
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs
5. Copy App ID and App Secret

#### Token Management

##### Access Token Storage
- OAuth access tokens are encrypted before storage
- Tokens are stored per provider
- Refresh tokens (Google) are also encrypted
- Tokens can be refreshed when expired

##### Token Refresh (Google)
```typescript
async refreshGoogleToken(userId: string): Promise<string> {
  const user = await this.userModel.findById(userId);
  const refreshToken = this.decryptToken(
    user.oauthProviders.google.refreshToken,
  );

  // Call Google token refresh endpoint
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  // Update stored token
  user.oauthProviders.google.accessToken = this.encryptToken(
    response.data.access_token,
  );
  await user.save();

  return response.data.access_token;
}
```

#### Account Linking

##### Link OAuth to Existing Account
- Users can link Google/Facebook to existing email accounts
- Email must match for automatic linking
- Manual linking requires verification
- Email notification sent when account is linked

##### Unlink OAuth Account
- Users can unlink OAuth accounts
- Requires password if it's the primary auth method
- Cannot unlink if it's the only auth method
- Email notification sent when account is unlinked

#### Privacy Considerations

##### Data Collection
- Only collect necessary data from OAuth providers
- Request minimal scopes (email, profile)
- Don't store unnecessary user data
- Encrypt sensitive tokens

##### Data Usage
- Use OAuth data only for authentication
- Don't share data with third parties
- Allow users to unlink accounts
- Provide data export functionality

##### User Consent
- Clear privacy policy
- Explain what data is collected
- Allow users to control linked accounts
- Provide account deletion option

##### GDPR Compliance
- Right to access OAuth data
- Right to delete OAuth data
- Right to unlink accounts
- Data portability

#### Security Best Practices

1. **Token Encryption**: Always encrypt OAuth tokens
2. **HTTPS Only**: Use HTTPS for all OAuth callbacks
3. **State Parameter**: Use state parameter to prevent CSRF
4. **Token Expiration**: Handle token expiration gracefully
5. **Scope Limitation**: Request only necessary scopes
6. **Account Verification**: Verify email matches for linking
7. **Audit Logging**: Log all OAuth activities
8. **Rate Limiting**: Limit OAuth login attempts

#### Frontend Integration

```typescript
// React component for OAuth login
const OAuthLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/api/auth/facebook';
  };

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const isNewUser = urlParams.get('isNewUser') === 'true';

    if (token) {
      // Store token and redirect
      localStorage.setItem('accessToken', token);
      if (isNewUser) {
        // Show onboarding
      }
      window.location.href = '/dashboard';
    }

    if (error) {
      // Show error message
      console.error('OAuth error:', error);
    }
  }, []);

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
      <button onClick={handleFacebookLogin}>
        Sign in with Facebook
      </button>
    </div>
  );
};
```

#### Email Notifications

Add to EmailService:
```typescript
async sendAccountLinkedEmail(user: User, provider: string): Promise<void> {
  const template = this.getAccountLinkedTemplate(user, provider);
  await this.sendEmail({
    to: user.email,
    subject: `${provider} account linked to FinMan`,
    html: template.html,
    text: template.text,
  });
}

async sendAccountUnlinkedEmail(user: User, provider: string): Promise<void> {
  const template = this.getAccountUnlinkedTemplate(user, provider);
  await this.sendEmail({
    to: user.email,
    subject: `${provider} account unlinked from FinMan`,
    html: template.html,
    text: template.text,
  });
}
```

### User Endpoints
```
GET    /api/users/me               # Get current user
PUT    /api/users/me               # Update current user
DELETE /api/users/me               # Delete current user account
GET    /api/users/preferences      # Get user preferences
PUT    /api/users/preferences      # Update user preferences
```

### Category Endpoints
```
GET    /api/categories             # Get all categories
GET    /api/categories/:id         # Get category by ID
POST   /api/categories             # Create category
PUT    /api/categories/:id         # Update category
DELETE /api/categories/:id         # Delete category
GET    /api/categories/tree        # Get categories as tree structure
```

### Transaction Endpoints
```
GET    /api/transactions           # Get all transactions (with filters)
GET    /api/search/transactions    # Advanced search transactions
GET    /api/search/categories      # Search categories
GET    /api/search/autocomplete    # Get autocomplete suggestions
GET    /api/search/suggestions     # Get search suggestions
GET    /api/transactions/:id       # Get transaction by ID
POST   /api/transactions           # Create transaction
PUT    /api/transactions/:id       # Update transaction
DELETE /api/transactions/:id       # Delete transaction
GET    /api/transactions/summary   # Get transaction summary
POST   /api/transactions/bulk      # Create multiple transactions
GET    /api/transactions/export/csv    # Export transactions (CSV)
GET    /api/transactions/export/excel  # Export transactions (Excel)
GET    /api/transactions/export/pdf    # Export transactions (PDF)
POST   /api/transactions/import/csv    # Import transactions from CSV
POST   /api/transactions/import/excel   # Import transactions from Excel
GET    /api/transactions/import/template # Get import template
```

### Budget Endpoints
```
GET    /api/budgets                # Get all budgets
GET    /api/budgets/:id            # Get budget by ID
POST   /api/budgets                # Create budget
PUT    /api/budgets/:id            # Update budget
DELETE /api/budgets/:id            # Delete budget
GET    /api/budgets/:id/progress   # Get budget progress
GET    /api/budgets/active         # Get active budgets
```

### Financial Goals Endpoints
```
GET    /api/goals                  # Get all goals
GET    /api/goals/:id              # Get goal by ID
POST   /api/goals                  # Create goal
PUT    /api/goals/:id              # Update goal
DELETE /api/goals/:id              # Delete goal
PUT    /api/goals/:id/progress     # Update goal progress
GET    /api/goals/active           # Get active goals
```

### Investment Endpoints
```
GET    /api/investments            # Get all investments
GET    /api/investments/:id        # Get investment by ID
POST   /api/investments            # Create investment
PUT    /api/investments/:id        # Update investment
DELETE /api/investments/:id        # Delete investment
GET    /api/investments/portfolio  # Get portfolio summary
GET    /api/investments/performance # Get performance metrics
```

### Receipt Endpoints
```
GET    /api/receipts               # Get all receipts
GET    /api/receipts/:id           # Get receipt by ID
POST   /api/receipts               # Upload receipt
DELETE /api/receipts/:id           # Delete receipt
GET    /api/receipts/:id/download  # Download receipt file
POST   /api/receipts/:id/process   # Process receipt with AI
```

### Reports Endpoints
```
GET    /api/reports/overview       # Get financial overview
GET    /api/reports/income         # Get income report
GET    /api/reports/expenses       # Get expense report
GET    /api/reports/cashflow       # Get cash flow report
GET    /api/reports/category-breakdown # Get category breakdown
GET    /api/reports/trends         # Get spending trends
GET    /api/reports/export/excel   # Export report (Excel)
GET    /api/reports/export/pdf     # Export report (PDF)
```

### AI Insights Endpoints
```
GET    /api/ai-insights/summary    # Get AI financial summary
POST   /api/ai-insights/analyze    # Analyze spending patterns
POST   /api/ai-insights/recommendations # Get budget recommendations
POST   /api/ai-insights/categorize # Categorize transaction with AI
POST   /api/ai-insights/chat       # Chat with AI assistant
```

### Email Endpoints
```
POST   /api/email/send             # Send custom email
POST   /api/email/test             # Send test email
GET    /api/email/templates        # Get all email templates
GET    /api/email/templates/:id    # Get template by ID
POST   /api/email/templates        # Create email template
PUT    /api/email/templates/:id    # Update email template
GET    /api/email/logs             # Get email logs
GET    /api/email/preferences      # Get email preferences
PUT    /api/email/preferences      # Update email preferences
```

### Search & Filtering Endpoints
```
GET    /api/search/transactions    # Search transactions with filters
GET    /api/search/categories     # Search categories
GET    /api/search/autocomplete    # Get autocomplete suggestions
GET    /api/search/suggestions     # Get search suggestions
```

### Audit & Activity Logging Endpoints
```
GET    /api/audit/activity          # Get user activity history
GET    /api/audit/entity/:type/:id/history # Get entity change history
GET    /api/audit/security-events   # Get security events
POST   /api/audit/security-events/:id/flag # Flag security event
POST   /api/audit/security-events/:id/review # Review security event
```

### WebSocket Endpoints
```
WS     /ws                         # WebSocket connection endpoint
       Events:
       - transaction:created       # New transaction notification
       - transaction:updated       # Transaction update notification
       - budget:updated            # Budget progress update
       - budget:alert              # Budget threshold/exceeded alert
       - goal:progress             # Goal progress update
       - goal:milestone            # Goal milestone reached
       - system:notification       # System notification
```

---

## Search & Filtering

### Overview
FinMan implements comprehensive search and filtering capabilities using MongoDB's full-text search and advanced query features. This enables users to quickly find transactions, categories, budgets, and other data with powerful search queries and filters.

### MongoDB Text Indexes

#### 1. Transaction Text Index

Create text index on Transaction schema:
```typescript
// models/Transaction.ts
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  // ... existing fields
  description: String,
  tags: [String],
  // ... other fields
}, { timestamps: true });

// Create text index for full-text search
TransactionSchema.index({
  description: 'text',
  tags: 'text',
});

// Create compound indexes for filtering
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1, date: -1 });
TransactionSchema.index({ userId: 1, categoryId: 1, date: -1 });
TransactionSchema.index({ userId: 1, amount: 1 });
TransactionSchema.index({ userId: 1, 'tags': 1 });
```

#### 2. Category Text Index

```typescript
// models/Category.ts
CategorySchema.index({ name: 'text' });
CategorySchema.index({ userId: 1, name: 1 });
```

### Search Service Implementation

Create `lib/services/search.service.ts`:
```typescript
import { Transaction } from '@/models/Transaction';
import { Category } from '@/models/Category';
import { Budget } from '@/models/Budget';
import { Goal } from '@/models/Goal';

interface SearchFilters {
  query?: string;
  type?: 'income' | 'expense';
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const searchService = {

  /**
   * Search transactions with advanced filters
   */
  async searchTransactions(
    userId: string,
    filters: SearchFilters,
  ): Promise<SearchResult<Transaction>> {
    const {
      query,
      type,
      categoryId,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      paymentMethod,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc',
    } = filters;

    // Build query
    const queryBuilder: any = { userId };

    // Text search
    if (query) {
      queryBuilder.$text = { $search: query };
    }

    // Type filter
    if (type) {
      queryBuilder.type = type;
    }

    // Category filter
    if (categoryId) {
      queryBuilder.categoryId = categoryId;
    }

    // Amount range
    if (minAmount !== undefined || maxAmount !== undefined) {
      queryBuilder.amount = {};
      if (minAmount !== undefined) {
        queryBuilder.amount.$gte = minAmount;
      }
      if (maxAmount !== undefined) {
        queryBuilder.amount.$lte = maxAmount;
      }
    }

    // Date range
    if (startDate || endDate) {
      queryBuilder.date = {};
      if (startDate) {
        queryBuilder.date.$gte = new Date(startDate);
      }
      if (endDate) {
        queryBuilder.date.$lte = new Date(endDate);
      }
    }

    // Payment method filter
    if (paymentMethod) {
      queryBuilder.paymentMethod = paymentMethod;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      queryBuilder.tags = { $in: tags };
    }

    // Build sort object
    const sort: any = {};
    if (query) {
      // When using text search, include text score in sort
      sort.score = { $meta: 'textScore' };
    }
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Transaction
        .find(queryBuilder)
        .populate('categoryId', 'name icon color')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(queryBuilder),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Search categories
   */
  async searchCategories(
    userId: string,
    query: string,
    type?: string,
  ): Promise<Category[]> {
    const queryBuilder: any = {
      userId,
      $text: { $search: query },
    };

    if (type) {
      queryBuilder.type = type;
    }

    return Category
      .find(queryBuilder)
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean();
  }

  /**
   * Get autocomplete suggestions
   */
  async getAutocompleteSuggestions(
    userId: string,
    query: string,
    type: 'transaction' | 'category' = 'transaction',
  ): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const suggestions: Set<string> = new Set();

    if (type === 'transaction') {
      // Get suggestions from transaction descriptions
      const transactions = await Transaction
        .find({
          userId,
          description: { $regex: query, $options: 'i' },
        })
        .select('description')
        .limit(10)
        .lean();

      transactions.forEach((t) => {
        if (t.description) {
          // Extract words that start with query
          const words = t.description.split(/\s+/);
          words.forEach((word) => {
            if (word.toLowerCase().startsWith(query.toLowerCase())) {
              suggestions.add(word);
            }
          });
        }
      });

      // Get suggestions from tags
      const tagTransactions = await Transaction
        .find({
          userId,
          tags: { $regex: query, $options: 'i' },
        })
        .select('tags')
        .limit(10)
        .lean();

      tagTransactions.forEach((t) => {
        if (t.tags) {
          t.tags.forEach((tag) => {
            if (tag.toLowerCase().includes(query.toLowerCase())) {
              suggestions.add(tag);
            }
          });
        }
      });
    } else if (type === 'category') {
      // Get category name suggestions
      const categories = await Category
        .find({
          userId,
          name: { $regex: query, $options: 'i' },
        })
        .select('name')
        .limit(10)
        .lean();

      categories.forEach((c) => {
        suggestions.add(c.name);
      });
    }

    return Array.from(suggestions).slice(0, 10);
  }

  /**
   * Get search suggestions (popular searches, recent searches)
   */
  async getSearchSuggestions(userId: string): Promise<{
    popular: string[];
    recent: string[];
  }> {
    // Get popular search terms from transaction descriptions
    const popularSearches = await Transaction
      .aggregate([
        { $match: { userId } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, term: '$_id' } },
      ]);

    // In a real implementation, you'd store recent searches in a separate collection
    // For now, return empty array
    const recentSearches: string[] = [];

    return {
      popular: popularSearches.map((s) => s.term),
      recent: recentSearches,
    };
  }

  /**
   * Advanced filtering with aggregation pipeline
   */
  async advancedFilterTransactions(
    userId: string,
    filters: SearchFilters,
  ): Promise<SearchResult<Transaction>> {
    const {
      query,
      type,
      categoryId,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      paymentMethod,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc',
    } = filters;

    const pipeline: any[] = [
      // Match stage
      {
        $match: {
          userId,
          ...(type && { type }),
          ...(categoryId && { categoryId }),
          ...(paymentMethod && { paymentMethod }),
          ...(tags && tags.length > 0 && { tags: { $in: tags } }),
          ...(minAmount !== undefined || maxAmount !== undefined
            ? {
                amount: {
                  ...(minAmount !== undefined && { $gte: minAmount }),
                  ...(maxAmount !== undefined && { $lte: maxAmount }),
                },
              }
            : {}),
          ...(startDate || endDate
            ? {
                date: {
                  ...(startDate && { $gte: new Date(startDate) }),
                  ...(endDate && { $lte: new Date(endDate) }),
                },
              }
            : {}),
          ...(query
            ? {
                $or: [
                  { description: { $regex: query, $options: 'i' } },
                  { tags: { $in: [new RegExp(query, 'i')] } },
                ],
              }
            : {}),
        },
      },
      // Lookup category
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Sort
      {
        $sort: {
          [sortBy]: sortOrder === 'asc' ? 1 : -1,
        },
      },
      // Facet for pagination and total count
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                categoryId: 1,
                type: 1,
                amount: 1,
                currency: 1,
                description: 1,
                date: 1,
                paymentMethod: 1,
                tags: 1,
                category: {
                  name: '$category.name',
                  icon: '$category.icon',
                  color: '$category.color',
                },
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const result = await Transaction.aggregate(pipeline);

    const data = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};
```

### Search API Routes

Create `app/api/v1/search/transactions/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { searchService } from '@/lib/services/search.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      query: searchParams.get('query') || undefined,
      type: searchParams.get('type') as 'income' | 'expense' | undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      minAmount: searchParams.get('minAmount') ? parseFloat(searchParams.get('minAmount')!) : undefined,
      maxAmount: searchParams.get('maxAmount') ? parseFloat(searchParams.get('maxAmount')!) : undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
      paymentMethod: searchParams.get('paymentMethod') || undefined,
      tags: searchParams.get('tags') ? searchParams.get('tags')!.split(',') : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: searchParams.get('sortBy') || 'date',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    };

    const result = await searchService.searchTransactions(user.id, filters);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/search/categories/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { searchService } from '@/lib/services/search.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || undefined;

    const categories = await searchService.searchCategories(
      user.id,
      query,
      type,
    );

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/search/autocomplete/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { searchService } from '@/lib/services/search.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const type = (searchParams.get('type') || 'transaction') as 'transaction' | 'category';

    const suggestions = await searchService.getAutocompleteSuggestions(
      user.id,
      query,
      type,
    );

    return NextResponse.json({
      success: true,
      data: suggestions,
    };
  }

}
```

Create `app/api/v1/search/suggestions/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { searchService } from '@/lib/services/search.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const suggestions = await searchService.getSearchSuggestions(user.id);

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Search Query Optimization

#### 1. Index Strategy

```typescript
// Compound indexes for common query patterns
TransactionSchema.index({ userId: 1, date: -1, type: 1 });
TransactionSchema.index({ userId: 1, categoryId: 1, date: -1 });
TransactionSchema.index({ userId: 1, amount: 1, date: -1 });
TransactionSchema.index({ userId: 1, tags: 1, date: -1 });
TransactionSchema.index({ userId: 1, paymentMethod: 1, date: -1 });

// Text index for full-text search
TransactionSchema.index({
  description: 'text',
  tags: 'text',
}, {
  weights: {
    description: 10,
    tags: 5,
  },
});
```

#### 2. Query Optimization Tips

1. **Use Indexes**: Always query with indexed fields first
2. **Limit Results**: Always use pagination
3. **Project Fields**: Only select needed fields
4. **Use Lean**: Use `.lean()` for read-only queries
5. **Avoid Regex**: Use text search instead of regex when possible
6. **Cache Results**: Cache frequent searches

#### 3. Caching Strategy

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL

export const searchService = {
  ) {}

  async searchTransactions(userId: string, filters: SearchFilters) {
    // Create cache key
    const cacheKey = `search:${userId}:${JSON.stringify(filters)}`;

    // Try to get from cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Execute search
    const result = await this.executeSearch(userId, filters);

    // Cache result for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300);

    return result;
  }
}
```

### Advanced Filtering Options

#### Filter Types

1. **Text Search**: Full-text search on description and tags
2. **Type Filter**: Income or expense
3. **Category Filter**: Filter by category
4. **Amount Range**: Min/max amount filters
5. **Date Range**: Start and end date filters
6. **Payment Method**: Filter by payment method
7. **Tags**: Filter by tags (multiple)
8. **Combined Filters**: Multiple filters combined with AND logic

#### Example Filter Queries

```typescript
// Search for "grocery" expenses in January 2024
{
  query: "grocery",
  type: "expense",
  startDate: "2024-01-01",
  endDate: "2024-01-31"
}

// Find large transactions (>$500)
{
  minAmount: 500,
  sortBy: "amount",
  sortOrder: "desc"
}

// Search by category and tags
{
  categoryId: "cat123",
  tags: "business,travel"
}

// Complex filter
{
  query: "hotel",
  type: "expense",
  minAmount: 100,
  maxAmount: 1000,
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  paymentMethod: "card",
  tags: "travel,business"
}
```

### Autocomplete Implementation

#### Frontend Integration Example

```typescript
// React hook for autocomplete
const useAutocomplete = (query: string, type: 'transaction' | 'category') => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/search/autocomplete', {
          params: { query, type },
        });
        setSuggestions(response.data.data);
      } catch (error) {
        console.error('Autocomplete error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce API calls
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query, type]);

  return { suggestions, loading };
};
```

### Search Result Pagination

#### Pagination Implementation

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

class PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };
  }
}
```

### Performance Considerations

1. **Index Usage**: Ensure all filter fields are indexed
2. **Query Limits**: Always limit result sets
3. **Pagination**: Use cursor-based pagination for large datasets
4. **Caching**: Cache frequent search queries
5. **Debouncing**: Debounce autocomplete requests
6. **Lazy Loading**: Load search results incrementally

### Search Module

**Note**: In Next.js, no module file is needed. Simply import the service and models directly in API routes. Models are defined in `models/` directory and imported as needed.

### Best Practices

1. **Index Management**: Create indexes based on common query patterns
2. **Query Optimization**: Use explain() to analyze query performance
3. **Result Limiting**: Always limit and paginate results
4. **Error Handling**: Handle search errors gracefully
5. **User Feedback**: Provide loading states and error messages
6. **Search Analytics**: Track popular searches for optimization

---

## API Documentation (Swagger/OpenAPI)

### Overview
API documentation is essential for developers consuming the FinMan API. While Next.js doesn't have built-in Swagger support like NestJS, we can use OpenAPI/Swagger tools to generate interactive API documentation.

### Setup with Next.js

#### Step 1: Install Dependencies
```bash
npm install swagger-jsdoc swagger-ui-react
npm install -D @types/swagger-jsdoc
```

#### Step 2: OpenAPI Configuration
Create `lib/config/swagger.config.ts`:
```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinMan API',
      version: '1.0.0',
      description: 'Financial & Expense Management System API Documentation',
      contact: {
        name: 'FinMan Support',
        email: 'support@finman.finance',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.finman.finance',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            type: { type: 'string', enum: ['income', 'expense'] },
            amount: { type: 'number' },
            currency: { type: 'string' },
            categoryId: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date' },
            paymentMethod: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./app/api/**/*.ts'], // Path to API route files
};

export const swaggerSpec = swaggerJsdoc(options);
```

#### Step 3: API Route Documentation
Document API routes using JSDoc comments:
```typescript
// app/api/v1/transactions/route.ts
/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by transaction type
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 default: USD
 *               categoryId:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               paymentMethod:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
```

#### Step 4: Swagger UI Route
Create `app/api/docs/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/config/swagger.config';

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
```

#### Step 5: Swagger UI Page
Create `app/docs/page.tsx`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function APIDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return <div>Loading API documentation...</div>;
  }

  return (
    <div>
      <SwaggerUI spec={spec} />
    </div>
  );
}
```

### Alternative: Using OpenAPI Generator

#### Generate TypeScript Client
```bash
npm install @openapitools/openapi-generator-cli -g
openapi-generator-cli generate -i ./openapi.json -g typescript-axios -o ./src/generated/api
```

### API Documentation Best Practices

1. **Complete Documentation**: Document all endpoints, parameters, and responses
2. **Examples**: Include request/response examples
3. **Error Codes**: Document all possible error responses
4. **Authentication**: Clearly document authentication requirements
5. **Versioning**: Document API versioning strategy
6. **Rate Limits**: Document rate limiting per endpoint
7. **Keep Updated**: Update documentation with code changes

---

## Frontend Structure

### Component Architecture
```
components/
├── common/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   └── Modal.tsx
├── transactions/
│   ├── TransactionList.tsx
│   ├── TransactionForm.tsx
│   ├── TransactionCard.tsx
│   └── TransactionFilters.tsx
├── budgets/
│   ├── BudgetList.tsx
│   ├── BudgetForm.tsx
│   ├── BudgetCard.tsx
│   └── BudgetProgress.tsx
├── goals/
│   ├── GoalList.tsx
│   ├── GoalForm.tsx
│   ├── GoalCard.tsx
│   └── GoalProgress.tsx
├── reports/
│   ├── OverviewChart.tsx
│   ├── CategoryChart.tsx
│   ├── TrendChart.tsx
│   └── ReportFilters.tsx
├── ai-insights/
│   ├── InsightCard.tsx
│   ├── AIChat.tsx
│   └── RecommendationList.tsx
└── receipts/
    ├── ReceiptUpload.tsx
    ├── ReceiptList.tsx
    └── ReceiptViewer.tsx
```

### Page Structure
```
pages/
├── Dashboard.tsx              # Main dashboard
├── Transactions.tsx           # Transaction management
├── Budgets.tsx                # Budget management
├── Goals.tsx                  # Financial goals
├── Reports.tsx                # Reports & analytics
├── Investments.tsx            # Investment tracking
├── Receipts.tsx               # Receipt management
├── AIInsights.tsx             # AI insights page
├── Settings.tsx               # User settings
└── Login.tsx                  # Authentication
```

### State Management with Redux Toolkit

#### Overview
FinMan uses **Redux Toolkit** as the primary state management solution for the web application. Redux Toolkit provides a simplified and efficient way to manage global application state, with built-in support for async operations, immutability, and developer tools.

#### Redux Toolkit Benefits
- **Simplified API**: Less boilerplate code compared to traditional Redux
- **Built-in Best Practices**: Includes Redux Thunk for async operations
- **DevTools Integration**: Excellent debugging with Redux DevTools
- **TypeScript Support**: Full TypeScript support with type safety
- **Performance**: Optimized re-renders with proper selectors
- **Middleware Support**: Easy integration with Redux Persist and other middleware

#### State Structure
The Redux store is organized into feature-based slices:
- **User Slice**: Authentication state, user profile, preferences
- **Transactions Slice**: Transaction list, filters, pagination, selected transaction
- **Budgets Slice**: Budget list, active budgets, budget details
- **Goals Slice**: Financial goals, goal progress, goal details
- **Categories Slice**: Category list, default categories, category filters
- **UI Slice**: Loading states, error messages, modals, notifications
- **Settings Slice**: App settings, preferences, theme

#### State Persistence with Redux Persist

**Overview**
Redux Persist is used to persist Redux state to local storage, ensuring that user data and application state survive page refreshes and browser sessions. This provides a seamless user experience where users don't lose their data or application state.

**What Gets Persisted**
- User authentication state (tokens, user profile)
- User preferences and settings
- Recently viewed transactions
- Filter and search preferences
- UI preferences (theme, layout)
- Cached category lists
- Budget and goal data

**What Doesn't Get Persisted**
- Temporary UI state (modals, loading indicators)
- Form input data (unless explicitly needed)
- Error messages
- Network request cache (handled separately)

#### Local Storage Strategy

**Web Application (localStorage)**
- Redux Persist uses browser's localStorage API
- Data is automatically serialized and deserialized
- Storage quota limits are handled gracefully
- Automatic cleanup of expired or invalid data

**Mobile Application (AsyncStorage)**
- Redux Persist uses React Native's AsyncStorage
- Async operations for better performance
- Handles large data sets efficiently
- Automatic error handling and recovery

#### Redux Persist Configuration

**Storage Engine**
- Web: Uses localStorage as the storage engine
- Mobile: Uses AsyncStorage as the storage engine
- Both provide the same API interface for consistency

**Persistence Configuration**
- Selective persistence: Only persist specific slices of state
- Transform configuration: Transform data before saving/loading
- Migration support: Handle state structure changes between app versions
- Version control: Track state structure versions for migrations

**Rehydration Process**
- State is automatically rehydrated on app initialization
- Loading state is shown during rehydration
- Errors during rehydration are handled gracefully
- Fallback to default state if rehydration fails

#### Caching Strategy with Redux

**API Response Caching**
- API responses are cached in Redux state
- Cache invalidation strategies for fresh data
- Time-based cache expiration
- Manual cache refresh options

**Optimistic Updates**
- UI updates immediately before API confirmation
- Rollback on API failure
- Better user experience with instant feedback

**Normalized State Structure**
- Data is stored in normalized format for efficiency
- Reduces data duplication
- Faster lookups and updates
- Easier cache invalidation

#### State Management Best Practices

1. **Slice Organization**: Organize state into feature-based slices
2. **Selectors**: Use memoized selectors for derived state
3. **Async Operations**: Use Redux Toolkit's createAsyncThunk for API calls
4. **Normalization**: Store data in normalized format
5. **Persistence**: Only persist necessary state
6. **Performance**: Use proper memoization to prevent unnecessary re-renders
7. **Type Safety**: Leverage TypeScript for type-safe state management
8. **DevTools**: Use Redux DevTools for debugging and development

### UI Components with Radix UI

#### Overview
FinMan uses **Radix UI** as the primary UI component library for building accessible, unstyled component primitives. Radix UI provides headless, accessible components that can be styled with Tailwind CSS to match the design system.

#### Why Radix UI
- **Accessibility First**: Built-in ARIA attributes, keyboard navigation, and screen reader support
- **Headless Components**: Unstyled primitives that give full control over styling
- **Composable**: Components can be combined to create complex UI patterns
- **TypeScript Support**: Full TypeScript support with excellent type safety
- **Small Bundle Size**: Only includes what you need
- **Customizable**: Style with Tailwind CSS or any CSS solution

#### Radix UI Components Used

**Dialog/Modal Components**
- `@radix-ui/react-dialog` - For modals, confirmations, and overlays
- `@radix-ui/react-alert-dialog` - For alert dialogs and confirmations
- `@radix-ui/react-popover` - For popovers and tooltips
- `@radix-ui/react-dropdown-menu` - For dropdown menus
- `@radix-ui/react-select` - For select dropdowns
- `@radix-ui/react-context-menu` - For context menus

**Form Components**
- `@radix-ui/react-label` - For form labels
- `@radix-ui/react-checkbox` - For checkboxes
- `@radix-ui/react-radio-group` - For radio button groups
- `@radix-ui/react-switch` - For toggle switches
- `@radix-ui/react-slider` - For range sliders
- `@radix-ui/react-tabs` - For tab navigation

**Navigation Components**
- `@radix-ui/react-navigation-menu` - For navigation menus
- `@radix-ui/react-accordion` - For collapsible sections
- `@radix-ui/react-tabs` - For tab interfaces

**Feedback Components**
- `@radix-ui/react-toast` - For toast notifications
- `@radix-ui/react-progress` - For progress indicators
- `@radix-ui/react-tooltip` - For tooltips
- `@radix-ui/react-hover-card` - For hover cards

**Layout Components**
- `@radix-ui/react-separator` - For dividers and separators
- `@radix-ui/react-scroll-area` - For custom scrollbars
- `@radix-ui/react-avatar` - For user avatars

**Data Display Components**
- `@radix-ui/react-collapsible` - For collapsible content
- `@radix-ui/react-accordion` - For accordion lists

#### Component Structure with Radix UI

**Example: Dialog Component**
```
components/
├── ui/
│   ├── dialog.tsx          # Radix Dialog wrapper with Tailwind styling
│   ├── button.tsx          # Button component using Radix primitives
│   ├── input.tsx           # Input component
│   ├── select.tsx          # Select component using Radix Select
│   ├── checkbox.tsx        # Checkbox using Radix Checkbox
│   ├── radio-group.tsx     # Radio group using Radix RadioGroup
│   ├── switch.tsx          # Switch using Radix Switch
│   ├── tabs.tsx            # Tabs using Radix Tabs
│   ├── toast.tsx           # Toast using Radix Toast
│   ├── tooltip.tsx         # Tooltip using Radix Tooltip
│   ├── dropdown-menu.tsx  # Dropdown menu using Radix DropdownMenu
│   ├── popover.tsx         # Popover using Radix Popover
│   ├── alert-dialog.tsx    # Alert dialog using Radix AlertDialog
│   └── accordion.tsx       # Accordion using Radix Accordion
```

#### Styling Approach

**Tailwind CSS Integration**
- All Radix UI components are wrapped with Tailwind CSS classes
- Custom design system tokens are defined in `tailwind.config.js`
- Consistent spacing, colors, and typography across components
- Dark mode support with Tailwind's dark mode classes

**Component Variants**
- Use `class-variance-authority` or `clsx` for component variants
- Define variant styles (primary, secondary, danger, etc.)
- Size variants (sm, md, lg, xl)
- State variants (default, hover, focus, disabled)

#### Accessibility Features

**Built-in Accessibility**
- All Radix UI components include proper ARIA attributes
- Keyboard navigation support (Tab, Enter, Escape, Arrow keys)
- Focus management for modals and dialogs
- Screen reader announcements
- Focus trap in modals

**Additional Accessibility Considerations**
- Color contrast ratios meet WCAG AA standards
- Touch target sizes meet minimum requirements (44x44px)
- Focus indicators are clearly visible
- Error messages are associated with form fields
- Loading states are announced to screen readers

#### Component Usage Examples

**Dialog/Modal**
- Transaction creation/edit forms
- Budget creation/edit forms
- Goal creation/edit forms
- Confirmation dialogs for deletions
- Settings panels

**Form Components**
- Transaction forms (Select for categories, Date picker, Input for amounts)
- Budget forms (Slider for amounts, Select for categories)
- Settings forms (Switch for toggles, Checkbox for preferences)
- Filter forms (Select for filters, Checkbox for multiple selections)

**Navigation Components**
- Tab navigation in Reports section
- Accordion for FAQ or help sections
- Navigation menu in header/sidebar

**Feedback Components**
- Toast notifications for success/error messages
- Progress indicators for data loading
- Tooltips for help text and additional information
- Hover cards for user profile previews

#### Installation and Setup

**Required Packages**
```bash
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-switch
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-popover
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-accordion
npm install @radix-ui/react-label
npm install @radix-ui/react-separator
npm install @radix-ui/react-avatar
npm install @radix-ui/react-progress
npm install @radix-ui/react-slider
npm install @radix-ui/react-hover-card
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-collapsible
```

**Additional Utilities**
```bash
npm install class-variance-authority  # For component variants
npm install clsx tailwind-merge      # For conditional classes
npm install @radix-ui/react-icons    # Optional: Radix icons
```

#### Best Practices

1. **Always Style Radix Components**: Radix UI provides unstyled primitives, so always add Tailwind CSS classes
2. **Maintain Accessibility**: Don't remove or override accessibility features
3. **Use Composition**: Combine multiple Radix components to create complex UI patterns
4. **Consistent Styling**: Use design system tokens for consistent styling
5. **Test Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
6. **Screen Reader Testing**: Test with screen readers to ensure proper announcements
7. **Focus Management**: Properly manage focus in modals and dialogs
8. **Error Handling**: Provide clear error messages and associate them with form fields
9. **Loading States**: Show loading states for async operations
10. **Responsive Design**: Ensure components work well on all screen sizes

#### Component Library Structure

**UI Components Directory**
```
components/
├── ui/                          # Radix UI wrapper components
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── radio-group.tsx
│   ├── switch.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   ├── tooltip.tsx
│   ├── dropdown-menu.tsx
│   ├── popover.tsx
│   ├── alert-dialog.tsx
│   ├── accordion.tsx
│   ├── label.tsx
│   ├── separator.tsx
│   ├── avatar.tsx
│   ├── progress.tsx
│   ├── slider.tsx
│   └── scroll-area.tsx
├── common/                      # Common composed components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── ...
└── [feature]/                   # Feature-specific components
    ├── TransactionForm.tsx     # Uses Radix UI components
    ├── BudgetCard.tsx
    └── ...
```

### Mobile Responsiveness Guidelines

#### Overview
FinMan is designed with a mobile-first approach to ensure optimal user experience across all devices. The application is fully responsive, touch-friendly, and includes Progressive Web App (PWA) capabilities for offline functionality.

#### Mobile-First Design Approach

##### Design Principles
1. **Mobile-First**: Design for mobile devices first, then enhance for larger screens
2. **Progressive Enhancement**: Start with core functionality, add features for larger screens
3. **Touch-First**: Optimize for touch interactions, not just mouse clicks
4. **Performance First**: Prioritize fast loading and smooth interactions
5. **Content Priority**: Show most important content first on mobile

##### Implementation Strategy
```typescript
// Mobile-first CSS approach
// Start with mobile styles (default)
.container {
  padding: 1rem;
  width: 100%;
}

// Enhance for tablets
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 768px;
    margin: 0 auto;
  }
}

// Enhance for desktop
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 3rem;
  }
}
```

#### Responsive Breakpoints

##### Tailwind CSS Breakpoints (Recommended)
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '475px',   // Extra small devices
      'sm': '640px',   // Small devices (phones)
      'md': '768px',   // Medium devices (tablets)
      'lg': '1024px',  // Large devices (laptops)
      'xl': '1280px',  // Extra large devices (desktops)
      '2xl': '1536px', // 2X large devices (large desktops)
    },
  },
};
```

##### Custom Breakpoints
```css
/* Mobile devices (default) */
@media (max-width: 767px) {
  /* Mobile-specific styles */
}

/* Tablets */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet-specific styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop-specific styles */
}

/* Large desktop */
@media (min-width: 1440px) {
  /* Large desktop-specific styles */
}
```

##### Next.js Responsive Hook
Create `hooks/useResponsive.ts`:
```typescript
import { useState, useEffect } from 'react';

interface Breakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  width: number;
}

export const useResponsive = (): Breakpoints => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024 && width < 1440,
    isLargeDesktop: width >= 1440,
    width,
  };
};
```

#### Touch-Friendly UI Elements

##### Minimum Touch Target Sizes
```css
/* Minimum 44x44px (iOS) or 48x48px (Android) for touch targets */
.touch-target {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
}

/* Buttons should be easily tappable */
.button {
  min-height: 44px;
  padding: 12px 24px;
  font-size: 16px; /* Prevent zoom on iOS */
}

/* Form inputs should be large enough */
.input {
  min-height: 44px;
  font-size: 16px; /* Prevent zoom on iOS */
  padding: 12px;
}
```

##### Touch Gesture Support
```typescript
// Swipe gestures for mobile
import { useSwipeable } from 'react-swipeable';

const SwipeableCard = ({ children, onSwipeLeft, onSwipeRight }) => {
  const handlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    trackMouse: false,
    trackTouch: true,
  });

  return (
    <div {...handlers} className="swipeable-card">
      {children}
    </div>
  );
};
```

##### Mobile Navigation Patterns
```typescript
// Mobile bottom navigation
const MobileNavigation = () => {
  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 md:hidden">
      <div className="flex justify-around items-center bg-white border-t">
        <NavLink href="/dashboard" className="nav-item">
          <HomeIcon />
          <span>Home</span>
        </NavLink>
        <NavLink href="/transactions" className="nav-item">
          <TransactionIcon />
          <span>Transactions</span>
        </NavLink>
        <NavLink href="/budgets" className="nav-item">
          <BudgetIcon />
          <span>Budgets</span>
        </NavLink>
        <NavLink href="/reports" className="nav-item">
          <ReportIcon />
          <span>Reports</span>
        </NavLink>
      </div>
    </nav>
  );
};

// Hamburger menu for mobile
const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        <MenuIcon />
      </button>
      {isOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-menu">
            {/* Menu items */}
          </nav>
        </div>
      )}
    </>
  );
};
```

#### Mobile Performance Optimization

##### Image Optimization
```typescript
// Next.js Image component with responsive images
import Image from 'next/image';

const ResponsiveImage = ({ src, alt }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
      quality={85}
    />
  );
};
```

##### Code Splitting
```typescript
// Dynamic imports for mobile-specific components
import dynamic from 'next/dynamic';

const MobileChart = dynamic(() => import('./MobileChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

// Conditional rendering based on device
const Chart = () => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return <MobileChart />;
  }

  return <DesktopChart />;
};
```

##### Lazy Loading
```typescript
// Lazy load components below the fold
import { lazy, Suspense } from 'react';

const TransactionsList = lazy(() => import('./TransactionsList'));

const Dashboard = () => {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={<LoadingSpinner />}>
        <TransactionsList />
      </Suspense>
    </div>
  );
};
```

##### Bundle Size Optimization
```typescript
// next.config.js
module.exports = {
  // Optimize bundle size
  experimental: {
    optimizeCss: true,
  },
  // Tree shaking
  webpack: (config) => {
    config.optimization.usedExports = true;
    return config;
  },
};
```

#### Progressive Web App (PWA) Considerations

##### PWA Setup

Install dependencies:
```bash
npm install next-pwa
```

##### Service Worker Configuration
Create `next.config.js`:
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js config
});
```

##### Manifest File
Create `public/manifest.json`:
```json
{
  "name": "FinMan - Financial Management",
  "short_name": "FinMan",
  "description": "Your Personal Financial Manager",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10B981",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

##### PWA Install Prompt
```typescript
'use client';

import { useEffect, useState } from 'react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-install-banner">
      <p>Install FinMan for a better experience</p>
      <button onClick={handleInstall}>Install</button>
      <button onClick={() => setShowPrompt(false)}>Not now</button>
    </div>
  );
};
```

#### Offline Functionality

##### Service Worker for Offline Support
```typescript
// public/sw.js (auto-generated by next-pwa)
// Custom service worker logic can be added

self.addEventListener('fetch', (event) => {
  // Cache API responses
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open('api-cache').then((cache) => {
            cache.put(event.request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  }
});
```

##### Offline Detection
```typescript
'use client';

import { useEffect, useState } from 'react';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Usage
const TransactionForm = () => {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {!isOnline && (
        <div className="offline-banner">
          You're offline. Changes will be synced when you're back online.
        </div>
      )}
      {/* Form content */}
    </div>
  );
};
```

##### Offline Data Storage
```typescript
// IndexedDB for offline storage
import { openDB, DBSchema } from 'idb';

interface FinManDB extends DBSchema {
  transactions: {
    key: string;
    value: Transaction;
    indexes: { 'by-date': Date };
  };
  budgets: {
    key: string;
    value: Budget;
  };
}

const dbPromise = openDB<FinManDB>('finman-db', 1, {
  upgrade(db) {
    const transactionStore = db.createObjectStore('transactions', {
      keyPath: 'id',
    });
    transactionStore.createIndex('by-date', 'date');

    db.createObjectStore('budgets', { keyPath: 'id' });
  },
});

// Save transaction offline
export const saveTransactionOffline = async (transaction: Transaction) => {
  const db = await dbPromise;
  await db.put('transactions', transaction);
};

// Sync when online
export const syncOfflineData = async () => {
  const db = await dbPromise;
  const transactions = await db.getAll('transactions');

  for (const transaction of transactions) {
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      });
      await db.delete('transactions', transaction.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
};
```

#### Mobile-Specific Components

##### Mobile Transaction Card
```typescript
const MobileTransactionCard = ({ transaction }) => {
  return (
    <div className="mobile-transaction-card touch-target">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="category-icon">
            {transaction.category.icon}
          </div>
          <div>
            <h3 className="font-semibold">{transaction.description}</h3>
            <p className="text-sm text-gray-500">{transaction.category.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>
    </div>
  );
};
```

##### Mobile Form Inputs
```typescript
const MobileFormInput = ({ label, ...props }) => {
  return (
    <div className="mobile-form-input">
      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>
      <input
        {...props}
        className="w-full min-h-[44px] px-4 py-2 text-base border rounded-lg"
        // Prevent zoom on iOS
        style={{ fontSize: '16px' }}
      />
    </div>
  );
};
```

##### Mobile Bottom Sheet
```typescript
const MobileBottomSheet = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </>
  );
};
```

#### Responsive Layout Patterns

##### Mobile-First Grid
```css
/* Mobile: single column */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

##### Responsive Typography
```css
/* Mobile-first typography */
h1 {
  font-size: 1.5rem;
  line-height: 1.2;
}

@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 2.5rem;
  }
}
```

#### Testing Mobile Responsiveness

##### Device Testing
- Test on real devices (iOS, Android)
- Use browser DevTools device emulation
- Test different screen sizes and orientations
- Test touch interactions
- Test performance on slower devices

##### Tools
- Chrome DevTools Device Mode
- BrowserStack for cross-device testing
- Lighthouse for PWA audit
- WebPageTest for performance

#### Best Practices

1. **Touch Targets**: Minimum 44x44px for all interactive elements
2. **Font Size**: Minimum 16px to prevent iOS zoom
3. **Spacing**: Adequate spacing between touch targets
4. **Loading States**: Show loading indicators on mobile
5. **Error Handling**: Clear error messages on mobile
6. **Navigation**: Simple, clear navigation patterns
7. **Forms**: Large inputs, clear labels, easy submission
8. **Images**: Optimize and lazy load images
9. **Performance**: Minimize bundle size, optimize assets
10. **Accessibility**: Ensure mobile accessibility standards

---

## Internationalization (i18n)

### Overview
FinMan supports multi-language internationalization with comprehensive currency formatting and date/time localization. The system automatically detects user language preferences and formats financial data according to regional standards.

### Multi-language Support Setup

#### Step 1: Install Dependencies
```bash
# Backend
npm install i18next react-i18next i18next-browser-languagedetector
npm install i18next i18next-browser-languagedetector

# Frontend (if using React)
npm install react-i18next i18next i18next-browser-languagedetector
npm install date-fns date-fns-tz
npm install react-intl  # Alternative option
```

#### Step 2: Translation File Structure
```
src/
├── i18n/
│   ├── locales/
│   │   ├── en/
│   │   │   ├── common.json
│   │   │   ├── transactions.json
│   │   │   ├── budgets.json
│   │   │   ├── goals.json
│   │   │   ├── reports.json
│   │   │   └── errors.json
│   │   ├── es/
│   │   │   ├── common.json
│   │   │   ├── transactions.json
│   │   │   └── ...
│   │   ├── fr/
│   │   ├── de/
│   │   ├── ar/  # RTL support
│   │   └── zh/
│   ├── i18n.config.ts
│   └── currency.config.ts
```

### Currency Formatting

#### Backend Currency Service
Create `lib/services/currency.service.ts`:
```typescript
interface CurrencyFormat {
  symbol: string;
  code: string;
  decimal: string;
  thousands: string;
  precision: number;
  position: 'before' | 'after';
}

export const currencyService = {
};

const currencyFormats: Map<string, CurrencyFormat> = new Map([
    ['USD', { symbol: '$', code: 'USD', decimal: '.', thousands: ',', precision: 2, position: 'before' }],
    ['EUR', { symbol: '€', code: 'EUR', decimal: ',', thousands: '.', precision: 2, position: 'after' }],
    ['GBP', { symbol: '£', code: 'GBP', decimal: '.', thousands: ',', precision: 2, position: 'before' }],
    ['JPY', { symbol: '¥', code: 'JPY', decimal: '.', thousands: ',', precision: 0, position: 'before' }],
    ['CNY', { symbol: '¥', code: 'CNY', decimal: '.', thousands: ',', precision: 2, position: 'before' }],
    ['INR', { symbol: '₹', code: 'INR', decimal: '.', thousands: ',', precision: 2, position: 'before' }],
    ['AUD', { symbol: 'A$', code: 'AUD', decimal: '.', thousands: ',', precision: 2, position: 'before' }],
    ['CAD', { symbol: 'C$', code: 'CAD', decimal: '.', thousands: ',', precision: 2, position: 'before' }],
    ['CHF', { symbol: 'CHF', code: 'CHF', decimal: '.', thousands: "'", precision: 2, position: 'after' }],
    ['AED', { symbol: 'د.إ', code: 'AED', decimal: '.', thousands: ',', precision: 2, position: 'after' }],
    ['SAR', { symbol: 'ر.س', code: 'SAR', decimal: '.', thousands: ',', precision: 2, position: 'after' }],
  ]);

  /**
   * Format currency amount
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    const format = currencyFormats.get(currency) || currencyFormats.get('USD')!;
    
    // Round to precision
    const rounded = Number(amount.toFixed(format.precision));
    
    // Format number with thousands separator
    const parts = rounded.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, format.thousands);
    const decimalPart = parts[1] || '';
    
    const formattedNumber = decimalPart 
      ? `${integerPart}${format.decimal}${decimalPart}`
      : integerPart;
    
    // Add currency symbol
    if (format.position === 'before') {
      return `${format.symbol}${formattedNumber}`;
    } else {
      return `${formattedNumber} ${format.symbol}`;
    }
  }

  /**
   * Format currency with code
   */
  formatCurrencyWithCode(amount: number, currency: string = 'USD'): string {
    const format = currencyFormats.get(currency) || currencyFormats.get('USD')!;
    const formatted = this.formatCurrency(amount, currency);
    return `${formatted} ${format.code}`;
  },

  /**
   * Parse currency string to number
   */
  parseCurrency(value: string, currency: string = 'USD'): number {
    const format = currencyFormats.get(currency) || currencyFormats.get('USD')!;
    
    // Remove currency symbol and whitespace
    let cleaned = value.replace(format.symbol, '').trim();
    
    // Replace thousands separator
    cleaned = cleaned.replace(new RegExp(`\\${format.thousands}`, 'g'), '');
    
    // Replace decimal separator
    cleaned = cleaned.replace(format.decimal, '.');
    
    return parseFloat(cleaned) || 0;
  }

  /**
   * Get currency info
   */
  getCurrencyInfo(currency: string): CurrencyFormat {
    return currencyFormats.get(currency) || currencyFormats.get('USD')!;
  },

  /**
   * Convert amount between currencies (requires exchange rate API)
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    // In production, fetch exchange rates from API
    // For now, return same amount (1:1)
    // Example: const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    // return amount * rate;
    return amount;
  }
}
```

#### Frontend Currency Formatting Hook
Create `src/hooks/useCurrency.ts`:
```typescript
import { useMemo } from 'react';
import { useUser } from '../store/userStore';

export const useCurrency = () => {
  const { user } = useUser();
  const currency = user?.currency || 'USD';

  const formatCurrency = useMemo(() => {
    return (amount: number, options?: { showCode?: boolean }) => {
      return new Intl.NumberFormat(
        getLocaleFromCurrency(currency),
        {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: getCurrencyPrecision(currency),
          maximumFractionDigits: getCurrencyPrecision(currency),
        }
      ).format(amount);
    };
  }, [currency]);

  const parseCurrency = (value: string): number => {
    // Remove currency symbols and parse
    const cleaned = value.replace(/[^\d.,-]/g, '');
    const normalized = cleaned.replace(',', '.');
    return parseFloat(normalized) || 0;
  };

  return {
    currency,
    formatCurrency,
    parseCurrency,
    currencySymbol: getCurrencySymbol(currency),
  };
};

function getLocaleFromCurrency(currency: string): string {
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    CNY: 'zh-CN',
    INR: 'en-IN',
    AUD: 'en-AU',
    CAD: 'en-CA',
    CHF: 'de-CH',
    AED: 'ar-AE',
    SAR: 'ar-SA',
  };
  return localeMap[currency] || 'en-US';
}

function getCurrencyPrecision(currency: string): number {
  const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND'];
  return zeroDecimalCurrencies.includes(currency) ? 0 : 2;
}

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    AED: 'د.إ',
    SAR: 'ر.س',
  };
  return symbols[currency] || currency;
}
```

### Date/Time Localization

#### Backend Date/Time Service
Create `lib/services/datetime.service.ts`:
```typescript
import * as moment from 'moment-timezone';

export const datetimeService = {

  /**
   * Format date according to user locale and timezone
   */
  formatDate(
    date: Date | string,
    format: string = 'YYYY-MM-DD',
    timezone?: string,
    locale?: string,
  ): string {
    const momentDate = moment(date);
    
    if (timezone) {
      momentDate.tz(timezone);
    }
    
    if (locale) {
      momentDate.locale(locale);
    }
    
    return momentDate.format(format);
  }

  /**
   * Format date for display (localized)
   */
  formatDateDisplay(
    date: Date | string,
    locale: string = 'en',
    timezone?: string,
  ): string {
    const formats: Record<string, string> = {
      en: 'MMM DD, YYYY',
      es: 'DD MMM YYYY',
      fr: 'DD MMM YYYY',
      de: 'DD.MM.YYYY',
      ar: 'YYYY/MM/DD',
      zh: 'YYYY年MM月DD日',
    };

    return this.formatDate(
      date,
      formats[locale] || formats.en,
      timezone,
      locale,
    );
  }

  /**
   * Format time according to user locale
   */
  formatTime(
    date: Date | string,
    locale: string = 'en',
    timezone?: string,
    format24h: boolean = false,
  ): string {
    const momentDate = moment(date);
    
    if (timezone) {
      momentDate.tz(timezone);
    }
    
    momentDate.locale(locale);
    
    if (format24h) {
      return momentDate.format('HH:mm');
    } else {
      return momentDate.format('h:mm A');
    }
  }

  /**
   * Format date and time
   */
  formatDateTime(
    date: Date | string,
    locale: string = 'en',
    timezone?: string,
  ): string {
    return `${this.formatDateDisplay(date, locale, timezone)} ${this.formatTime(date, locale, timezone)}`;
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(
    date: Date | string,
    locale: string = 'en',
  ): string {
    return moment(date).locale(locale).fromNow();
  }

  /**
   * Get start/end of period (day, week, month, year)
   */
  getPeriodRange(
    period: 'day' | 'week' | 'month' | 'year',
    date?: Date,
    timezone?: string,
  ): { start: Date; end: Date } {
    const momentDate = moment(date || new Date());
    
    if (timezone) {
      momentDate.tz(timezone);
    }
    
    let start: moment.Moment;
    let end: moment.Moment;
    
    switch (period) {
      case 'day':
        start = momentDate.clone().startOf('day');
        end = momentDate.clone().endOf('day');
        break;
      case 'week':
        start = momentDate.clone().startOf('week');
        end = momentDate.clone().endOf('week');
        break;
      case 'month':
        start = momentDate.clone().startOf('month');
        end = momentDate.clone().endOf('month');
        break;
      case 'year':
        start = momentDate.clone().startOf('year');
        end = momentDate.clone().endOf('year');
        break;
    }
    
    return {
      start: start.toDate(),
      end: end.toDate(),
    };
  }

  /**
   * Convert date to user timezone
   */
  toUserTimezone(date: Date, timezone: string): Date {
    return moment(date).tz(timezone).toDate();
  }

  /**
   * Get current date in user timezone
   */
  getCurrentDate(timezone?: string): Date {
    if (timezone) {
      return moment().tz(timezone).toDate();
    }
    return new Date();
  }
}
```

#### Frontend Date/Time Hook
Create `src/hooks/useDateTime.ts`:
```typescript
import { useMemo } from 'react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { enUS, es, fr, de, ar, zhCN } from 'date-fns/locale';
import { useUser } from '../store/userStore';

const localeMap: Record<string, Locale> = {
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  ar: ar,
  zh: zhCN,
};

export const useDateTime = () => {
  const { user } = useUser();
  const locale = user?.language || 'en';
  const timezone = user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatDate = useMemo(() => {
    return (
      date: Date | string,
      formatStr: string = 'PPP', // date-fns format
      options?: { timezone?: string }
    ) => {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      const tz = options?.timezone || timezone;
      
      if (tz) {
        return formatInTimeZone(dateObj, tz, formatStr, {
          locale: localeMap[locale] || enUS,
        });
      }
      
      return format(dateObj, formatStr, {
        locale: localeMap[locale] || enUS,
      });
    };
  }, [locale, timezone]);

  const formatTime = useMemo(() => {
    return (
      date: Date | string,
      options?: { format24h?: boolean; timezone?: string }
    ) => {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      const tz = options?.timezone || timezone;
      const formatStr = options?.format24h ? 'HH:mm' : 'h:mm a';
      
      if (tz) {
        return formatInTimeZone(dateObj, tz, formatStr, {
          locale: localeMap[locale] || enUS,
        });
      }
      
      return format(dateObj, formatStr, {
        locale: localeMap[locale] || enUS,
      });
    };
  }, [locale, timezone]);

  const formatDateTime = useMemo(() => {
    return (date: Date | string, timezone?: string) => {
      const dateStr = formatDate(date, 'PPP', { timezone });
      const timeStr = formatTime(date, { timezone });
      return `${dateStr} ${timeStr}`;
    };
  }, [formatDate, formatTime]);

  const formatRelative = useMemo(() => {
    return (date: Date | string) => {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: localeMap[locale] || enUS,
      });
    };
  }, [locale]);

  const toUserTimezone = useMemo(() => {
    return (date: Date | string) => {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return toZonedTime(dateObj, timezone);
    };
  }, [timezone]);

  return {
    locale,
    timezone,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelative,
    toUserTimezone,
  };
};
```

### Language Detection

#### Backend Language Detection
Create `lib/utils/language-detector.ts`:
```typescript
import { NextRequest } from 'next/server';

export function detectLanguage(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
    const language = 
    acceptLanguage?.split(',')[0]?.split('-')[0] ||
      'en';

  return language;
  }

// Use in API routes:
// const language = detectLanguage(request);
// Set language context for this request
```

#### Frontend Language Detection
```typescript
// i18n.config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en/common.json';
import esTranslations from './locales/es/common.json';
import frTranslations from './locales/fr/common.json';
// ... other languages

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslations },
      // ... other languages
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### Translation File Examples

#### English (en/common.json)
```json
{
  "common": {
    "welcome": "Welcome to FinMan",
    "dashboard": "Dashboard",
    "transactions": "Transactions",
    "budgets": "Budgets",
    "goals": "Goals",
    "reports": "Reports",
    "settings": "Settings",
    "logout": "Logout"
  },
  "currency": {
    "format": "{{amount}} {{currency}}",
    "income": "Income",
    "expense": "Expense",
    "balance": "Balance"
  },
  "date": {
    "today": "Today",
    "yesterday": "Yesterday",
    "thisWeek": "This Week",
    "thisMonth": "This Month",
    "thisYear": "This Year"
  }
}
```

#### Spanish (es/common.json)
```json
{
  "common": {
    "welcome": "Bienvenido a FinMan",
    "dashboard": "Panel",
    "transactions": "Transacciones",
    "budgets": "Presupuestos",
    "goals": "Objetivos",
    "reports": "Informes",
    "settings": "Configuración",
    "logout": "Cerrar sesión"
  },
  "currency": {
    "format": "{{amount}} {{currency}}",
    "income": "Ingresos",
    "expense": "Gastos",
    "balance": "Balance"
  },
  "date": {
    "today": "Hoy",
    "yesterday": "Ayer",
    "thisWeek": "Esta Semana",
    "thisMonth": "Este Mes",
    "thisYear": "Este Año"
  }
}
```

### RTL Language Support

#### CSS for RTL
```css
/* rtl.css */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="rtl"] .sidebar {
  right: 0;
  left: auto;
}

[dir="rtl"] .transaction-card {
  flex-direction: row-reverse;
}

[dir="rtl"] .currency-amount {
  direction: ltr; /* Keep numbers LTR */
  text-align: right;
}
```

#### React RTL Component
```typescript
// RTLWrapper.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const RTLWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const isRTL = RTL_LANGUAGES.includes(i18n.language);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);

  return <>{children}</>;
};
```

### Usage Examples

#### Backend Usage
```typescript
// In an API route (app/api/v1/transactions/route.ts)
import { currencyService } from '@/lib/services/currency.service';
import { datetimeService } from '@/lib/services/datetime.service';

export async function GET(request: NextRequest) {
  const user = await verifyToken(token);
  const transactions = await transactionsService.findAll(user.id);
  
  return NextResponse.json({
    data: transactions.map(t => ({
    ...t,
      amountFormatted: currencyService.formatCurrency(t.amount, user.currency),
      dateFormatted: datetimeService.formatDateDisplay(t.date, user.language, user.timezone),
    })),
  });
}
```

#### Frontend Usage
```typescript
// TransactionCard.tsx
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';
import { useDateTime } from '../hooks/useDateTime';

const TransactionCard = ({ transaction }) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate, formatRelative } = useDateTime();

  return (
    <div className="transaction-card">
      <h3>{transaction.description}</h3>
      <p className="amount">{formatCurrency(transaction.amount)}</p>
      <p className="date">{formatDate(transaction.date)}</p>
      <p className="relative">{formatRelative(transaction.date)}</p>
      <span className="category">{t(`categories.${transaction.category}`)}</span>
    </div>
  );
};
```

### Environment Configuration

Add to `.env`:
```env
# i18n Configuration
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,es,fr,de,ar,zh
DEFAULT_TIMEZONE=UTC
DEFAULT_CURRENCY=USD
DEFAULT_TIMEZONE=UTC
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,es,fr,de,ar,zh
```

### API Endpoints for i18n

```
GET    /api/i18n/languages          # Get supported languages
GET    /api/i18n/currencies         # Get supported currencies
GET    /api/i18n/timezones          # Get supported timezones
PUT    /api/users/preferences        # Update language/currency/timezone preferences
```

### Best Practices

1. **Currency Formatting**:
   - Always use user's preferred currency
   - Store amounts in base currency (USD) in database
   - Convert for display only
   - Handle zero-decimal currencies (JPY, KRW)

2. **Date/Time Formatting**:
   - Store dates in UTC in database
   - Convert to user timezone for display
   - Use ISO 8601 format for API responses
   - Support both 12h and 24h time formats

3. **Language Detection**:
   - Check user preferences first
   - Fall back to browser language
   - Allow manual language selection
   - Persist language choice

4. **RTL Support**:
   - Test all layouts in RTL
   - Keep numbers LTR in RTL layouts
   - Mirror icons and images appropriately
   - Test form inputs and validation messages

---

## Mobile App (React Native)

### Overview
The FinMan mobile application is built using React Native, providing a native mobile experience for iOS and Android platforms. The mobile app connects to the same Next.js backend API, ensuring data consistency across web and mobile platforms. All features available in the web application are accessible through the mobile app, with optimizations for mobile user experience.

### Architecture

#### Mobile App Architecture Pattern
The mobile app follows a clean architecture pattern with clear separation of concerns:

- **Presentation Layer**: React Native components and screens
- **State Management Layer**: Redux Toolkit with Redux Persist for global state management
- **Business Logic Layer**: Services and utilities
- **Data Layer**: API clients and AsyncStorage for local persistence
- **Navigation Layer**: React Navigation for screen routing

#### Communication with Backend
The mobile app communicates with the Next.js backend through RESTful API endpoints. All API calls are made to the same base URL as the web application, ensuring consistent data access and business logic across platforms.

#### Data Flow
1. User interacts with mobile UI
2. Action triggers state management update
3. Service layer makes API call to backend
4. Response is processed and stored in local state
5. UI updates reflect the changes
6. Data is optionally cached locally for offline access

### Technology Stack

#### Core Framework
- **React Native**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **React Navigation**: Navigation and routing
- **React Native Paper** or **NativeBase**: UI component library

#### State Management

**Redux Toolkit with Redux Persist**
- **Redux Toolkit**: Primary state management solution for global application state
- **Redux Persist**: State persistence middleware that automatically saves Redux state to AsyncStorage
- **AsyncStorage**: React Native's local storage solution used by Redux Persist for data persistence
- **State Slices**: Organized into feature-based slices (user, transactions, budgets, goals, categories, UI)
- **Selective Persistence**: Only specific slices are persisted to AsyncStorage for optimal performance
- **Automatic Rehydration**: State is automatically restored from AsyncStorage when app launches

**State Persistence Strategy**
- User authentication state and tokens are persisted for seamless login experience
- User preferences and settings are persisted across app sessions
- Cached transaction data is persisted for offline access
- Budget and goal data is persisted for quick access
- UI preferences (theme, layout) are persisted
- Filter and search preferences are persisted

**What Gets Persisted**
- User authentication tokens and profile data
- User preferences and app settings
- Recently viewed transactions (limited cache)
- Active budgets and goals
- Category lists
- Filter and search preferences
- UI state preferences

**What Doesn't Get Persisted**
- Temporary UI state (loading indicators, modals)
- Form input data (unless explicitly needed)
- Error messages
- Network request cache (handled separately by API layer)

#### API Communication
- **Axios**: HTTP client for API calls to the backend
- **Redux Toolkit Async Thunks**: Data fetching, caching, and synchronization through Redux
- **Axios Interceptors**: Request/response handling and token management
- **Redux State for API Cache**: API responses are cached in Redux state with Redux Persist

#### Authentication
- **Secure Storage**: Storing JWT tokens securely
- **Biometric Authentication**: Face ID / Touch ID integration
- **Keychain Services**: Secure credential storage

#### Additional Libraries
- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch gestures
- **React Native Camera** or **Image Picker**: Receipt scanning
- **React Native Push Notifications**: Push notification handling
- **React Native Offline**: Offline mode detection
- **React Native Paper** or **NativeBase**: UI components
- **Date-fns**: Date formatting and manipulation
- **React Native Charts**: Data visualization
- **Redux Toolkit**: State management (primary solution)
- **Redux Persist**: State persistence middleware
- **AsyncStorage**: Local storage for Redux Persist in React Native

### Features Available in Mobile App

#### Core Financial Features

**Transaction Management**
- View all transactions with filtering and sorting
- Add new income and expense transactions
- Edit and delete existing transactions
- Quick transaction entry with frequently used categories
- Transaction search with full-text search capabilities
- Transaction categorization with AI assistance
- Receipt photo capture and attachment
- Transaction tags and notes

**Category Management**
- View all categories (income and expense)
- Create custom categories
- Edit category details (name, icon, color)
- Delete unused categories
- Default category suggestions

**Budget Management**
- View all active budgets
- Create new budgets for categories or time periods
- Set budget limits and track spending
- Budget progress visualization
- Budget alerts and notifications
- Budget history and reports

**Financial Goals**
- View all financial goals
- Create new savings goals
- Track goal progress
- Set target amounts and deadlines
- Goal achievement celebrations
- Goal contribution tracking

**Investment Tracking**
- View investment portfolio
- Add investment transactions
- Track investment performance
- View investment history
- Investment category management

**Reports and Analytics**
- Monthly and yearly financial reports
- Income vs expense comparisons
- Category-wise spending analysis
- Trend analysis with charts
- Export reports as PDF or CSV
- Custom date range reports

#### Advanced Features

**AI Integration**
- AI-powered expense categorization
- Receipt OCR and data extraction
- Financial insights and recommendations
- Budget suggestions based on spending patterns
- AI chat assistant for financial queries
- Smart transaction suggestions

**Search and Filtering**
- Full-text search across transactions
- Advanced filtering (date range, category, amount, type)
- Saved filter presets
- Quick filter shortcuts
- Search history

**Data Export/Import**
- Export transactions to CSV or Excel
- Export reports as PDF
- Import transactions from CSV/Excel
- Bulk transaction import
- Data backup and restore

**Real-time Updates**
- Real-time transaction synchronization
- Live budget updates
- Instant goal progress updates
- Push notifications for important events
- WebSocket connection for live data

**Offline Capabilities**
- Offline transaction entry
- Local data caching
- Sync when connection restored
- Offline mode indicator
- Conflict resolution for offline changes

**Push Notifications**
- Budget alerts
- Goal achievement notifications
- Bill reminders
- Weekly/monthly summaries
- Security alerts (login from new device)
- Transaction confirmations

**Security Features**
- Biometric authentication (Face ID / Touch ID)
- PIN code protection
- Two-factor authentication (2FA)
- Secure token storage
- Auto-logout on inactivity
- Session management

**User Management**
- User profile management
- Account settings
- Currency preferences
- Date format preferences
- Language selection
- Notification preferences
- Privacy settings

**Onboarding**
- First-time user tutorial
- Feature discovery tour
- Sample data creation
- Onboarding checklist
- Interactive guides

**Social Features** (Optional)
- OAuth login (Google, Facebook)
- Account linking
- Social sharing of achievements

### API Integration

#### API Client Setup
The mobile app uses the same API endpoints as the web application. All API calls are made to the base URL configured in the app settings. The API client handles authentication, error handling, and request/response transformation.

#### Authentication Flow
1. User enters credentials on login screen
2. App sends login request to `/api/v1/auth/login`
3. Backend validates credentials and returns JWT token
4. Token is stored securely in device keychain
5. Token is included in all subsequent API requests
6. Token refresh is handled automatically before expiration

#### API Request Structure
All API requests follow the same structure as the web application:
- Base URL: `https://api.finman.finance` (or configured URL)
- API versioning: `/api/v1/`
- Authentication: Bearer token in Authorization header
- Request format: JSON
- Response format: JSON with standardized structure

#### Error Handling
The mobile app handles API errors gracefully:
- Network errors: Show offline message, queue requests
- Authentication errors: Redirect to login, clear stored tokens
- Validation errors: Display field-specific error messages
- Server errors: Show user-friendly error message, log details
- Rate limiting: Show retry message with countdown

#### Data Synchronization
- Automatic sync on app launch
- Background sync at intervals
- Manual refresh option
- Conflict resolution for concurrent edits
- Optimistic updates for better UX

### Navigation Structure

#### Main Navigation Tabs
The mobile app uses a bottom tab navigator with the following main sections:

1. **Dashboard**: Overview of finances, recent transactions, budget status
2. **Transactions**: List of all transactions with filtering
3. **Budgets**: Active budgets and budget management
4. **Goals**: Financial goals and progress tracking
5. **Reports**: Analytics, charts, and financial reports
6. **More**: Settings, profile, help, and additional features

#### Screen Hierarchy
- **Authentication Stack**: Login, Register, Forgot Password, 2FA
- **Main Stack**: Dashboard, Transactions, Budgets, Goals, Reports
- **Detail Screens**: Transaction Details, Budget Details, Goal Details
- **Modal Screens**: Add Transaction, Add Budget, Add Goal, Filters
- **Settings Stack**: Profile, Preferences, Security, Notifications, About

#### Navigation Patterns
- **Stack Navigation**: For hierarchical navigation (list → detail)
- **Tab Navigation**: For main app sections
- **Modal Navigation**: For forms and overlays
- **Drawer Navigation**: For settings and additional options (optional)

### State Management with Redux Toolkit and Redux Persist

#### Global State with Redux Toolkit
The mobile app uses Redux Toolkit as the primary state management solution. The global state is organized into feature-based slices:

- **User Slice**: Authentication state, user profile, preferences, tokens
- **Transactions Slice**: Transaction list, filters, pagination, selected transaction, cached transactions
- **Budgets Slice**: Budget list, active budgets, budget details, budget progress
- **Goals Slice**: Financial goals, goal progress, goal details, goal contributions
- **Categories Slice**: Category list, default categories, category filters, category icons
- **UI Slice**: Loading states, error messages, modals, notifications, theme
- **Settings Slice**: App settings, preferences, notification settings, privacy settings

#### State Persistence with Redux Persist and AsyncStorage

**Overview**
Redux Persist automatically saves Redux state to AsyncStorage, ensuring that user data and application state survive app restarts and device reboots. This provides a seamless user experience where users don't lose their data when closing the app.

**AsyncStorage Integration**
- Redux Persist uses React Native's AsyncStorage as the storage engine
- AsyncStorage provides asynchronous key-value storage for React Native apps
- Data is automatically serialized before saving and deserialized when loading
- Storage operations are non-blocking and don't freeze the UI
- Handles large data sets efficiently with proper serialization

**Persistence Configuration**
- **Selective Persistence**: Only specific slices are persisted (user, transactions cache, budgets, goals, settings)
- **Transform Configuration**: Data is transformed before saving to optimize storage
- **Migration Support**: Handles state structure changes between app versions
- **Version Control**: Tracks state structure versions for safe migrations
- **Storage Quota Management**: Handles storage limits gracefully

**Rehydration Process**
- State is automatically rehydrated from AsyncStorage when app launches
- Loading state is shown during rehydration process
- Errors during rehydration are handled gracefully with fallback to default state
- Rehydration completes before app becomes interactive

**What Gets Persisted to AsyncStorage**
- User authentication tokens and profile data
- User preferences and app settings
- Cached transaction data (recent transactions for offline access)
- Active budgets and budget details
- Financial goals and goal progress
- Category lists and user-created categories
- Filter and search preferences
- UI preferences (theme, layout, language)

**What Doesn't Get Persisted**
- Temporary UI state (loading indicators, active modals)
- Form input data (unless explicitly needed for draft saving)
- Error messages (cleared on app restart)
- Network request cache (handled separately by API layer)
- Real-time WebSocket connection state

#### Local State
Component-level state is used for:
- Form inputs and validation (before submission)
- UI interactions (toggles, selections, temporary selections)
- Temporary data before submission to Redux store
- Animation states and transitions
- Component-specific UI state that doesn't need to be shared

#### Server State Management
Server state is managed through Redux Toolkit's async thunks:
- API response caching in Redux state
- Automatic cache invalidation strategies
- Background data synchronization
- Optimistic updates for better UX
- Request deduplication to prevent duplicate API calls
- Error handling and retry logic

#### Caching Strategy

**API Response Caching**
- API responses are cached in Redux state slices
- Cache invalidation based on data freshness requirements
- Time-based cache expiration for different data types
- Manual cache refresh options for users
- Background sync to update cached data

**Offline Data Access**
- Cached data in Redux state is available offline
- AsyncStorage provides persistent offline access
- Data sync when connection is restored
- Conflict resolution for offline changes
- Optimistic updates for offline actions

**Normalized State Structure**
- Data is stored in normalized format in Redux state
- Reduces data duplication and improves performance
- Faster lookups and updates
- Easier cache invalidation
- Better memory management

### Authentication Flow

#### Login Process
1. User opens app and sees login screen
2. User enters email and password
3. Optional: Biometric authentication (Face ID / Touch ID)
4. App validates credentials with backend
5. Backend returns JWT token and user data
6. Token is stored securely in device keychain
7. User is navigated to dashboard
8. Token is used for all subsequent API calls

#### Registration Process
1. User navigates to registration screen
2. User enters registration details
3. App validates input and sends to backend
4. Backend creates account and sends verification email
5. User verifies email (optional)
6. User can log in with new credentials

#### Two-Factor Authentication (2FA)
1. User enables 2FA in settings
2. QR code is displayed for authenticator app
3. User scans QR code and enters verification code
4. 2FA is enabled for account
5. Future logins require 2FA code
6. Backup codes are provided for recovery

#### Session Management
- Token expiration is checked before API calls
- Automatic token refresh before expiration
- Session timeout after inactivity
- Auto-logout on security events
- Remember me functionality

#### Biometric Authentication
- Face ID / Touch ID for quick login
- Secure token storage in keychain
- Fallback to password if biometric fails
- Biometric settings in app preferences

### Offline Capabilities

#### Offline Mode Features
The mobile app supports full functionality in offline mode:

**Transaction Management**
- Add new transactions offline
- Edit existing cached transactions
- Delete transactions (queued for sync)
- View all cached transactions
- Search and filter cached data

**Data Viewing**
- View all cached data (transactions, budgets, goals)
- View reports based on cached data
- View charts and analytics from cached data

**Queue Management**
- All API requests are queued when offline
- Requests are automatically retried when online
- Conflict resolution for concurrent edits
- Sync status indicator

#### Data Caching Strategy
- Recent transactions cached locally
- Active budgets and goals cached
- User profile and settings cached
- Cache expiration and refresh policies
- Cache size management

#### Sync Process
1. App detects network connection
2. Queued requests are processed in order
3. Local changes are synced to server
4. Server updates are fetched and merged
5. Conflicts are resolved (last write wins or user choice)
6. UI is updated with synced data

#### Offline Indicators
- Network status indicator in header
- Offline banner when disconnected
- Sync status for queued operations
- Last sync timestamp display

### Push Notifications

#### Notification Types

**Budget Alerts**
- Budget limit reached
- Budget threshold warnings (80%, 90%)
- Budget exceeded notifications
- Monthly budget summary

**Goal Notifications**
- Goal achievement celebrations
- Goal progress milestones
- Goal deadline reminders
- Goal contribution confirmations

**Transaction Notifications**
- Large transaction alerts
- Recurring transaction reminders
- Bill payment reminders
- Transaction categorization suggestions

**Security Notifications**
- Login from new device
- Password change confirmations
- 2FA setup/disable notifications
- Suspicious activity alerts

**System Notifications**
- Weekly financial summary
- Monthly report ready
- App update available
- Maintenance notifications

#### Notification Configuration
- User can enable/disable notification types
- Quiet hours settings
- Notification sound preferences
- Badge count settings
- Notification grouping preferences

#### Push Notification Setup
- Firebase Cloud Messaging (FCM) for Android
- Apple Push Notification Service (APNs) for iOS
- Device token registration with backend
- Notification payload handling
- Deep linking to relevant screens

### UI/UX Considerations

#### Design Principles
- **Mobile-First**: Optimized for mobile screen sizes
- **Touch-Friendly**: Large tap targets, swipe gestures
- **Fast Loading**: Optimized images, lazy loading
- **Smooth Animations**: 60fps animations, native feel
- **Accessibility**: Screen reader support, high contrast
- **Consistent**: Matches web app design language

#### Screen Layouts
- **Dashboard**: Cards with key metrics, quick actions
- **Transaction List**: Swipeable items, pull-to-refresh
- **Forms**: Bottom sheets or full-screen modals
- **Charts**: Interactive, zoomable, shareable
- **Settings**: Grouped sections, clear hierarchy

#### User Interactions
- **Swipe Actions**: Swipe to delete/edit transactions
- **Pull to Refresh**: Refresh data on lists
- **Long Press**: Context menus and quick actions
- **Haptic Feedback**: Tactile feedback for actions
- **Gestures**: Swipe navigation, pinch to zoom

#### Responsive Design
- Adapts to different screen sizes
- Supports both portrait and landscape
- Tablet-optimized layouts
- Dynamic font sizing
- Safe area handling (notches, status bars)

#### Dark Mode Support
- System theme detection
- Manual theme toggle
- Consistent dark theme across app
- Proper contrast ratios
- Theme persistence

### Performance Optimization

#### App Performance
- **Fast Launch**: Optimized app startup time
- **Smooth Scrolling**: Virtualized lists for large datasets
- **Image Optimization**: Compressed images, lazy loading
- **Code Splitting**: Lazy load screens and features
- **Memory Management**: Efficient state management

#### Network Optimization
- **Request Batching**: Batch multiple API calls
- **Request Caching**: Cache API responses
- **Pagination**: Load data in chunks
- **Prefetching**: Preload likely-needed data
- **Compression**: Compress request/response data

#### Data Optimization
- **Local Caching**: Cache frequently accessed data
- **Incremental Updates**: Only fetch changed data
- **Optimistic Updates**: Update UI before server response
- **Debouncing**: Debounce search and filter inputs
- **Throttling**: Throttle scroll events and API calls

#### Battery Optimization
- **Background Tasks**: Minimize background processing
- **Location Services**: Use only when needed
- **Network Requests**: Batch and optimize requests
- **Animations**: Use efficient animation libraries

### Security Considerations

#### Data Security
- **Secure Storage**: Tokens stored in keychain/keystore
- **Encryption**: Encrypt sensitive local data
- **Certificate Pinning**: Pin SSL certificates
- **Data Validation**: Validate all user inputs
- **Secure Communication**: HTTPS only, no HTTP

#### Authentication Security
- **Token Management**: Secure token storage and refresh
- **Biometric Auth**: Secure biometric authentication
- **Session Management**: Proper session timeout
- **Auto-Logout**: Logout on security events
- **2FA Support**: Two-factor authentication

#### App Security
- **Code Obfuscation**: Obfuscate production code
- **Root/Jailbreak Detection**: Warn or block rooted devices
- **Debug Detection**: Disable debug features in production
- **API Key Protection**: Secure API key storage
- **Error Handling**: Don't expose sensitive info in errors

#### Privacy
- **Data Minimization**: Collect only necessary data
- **User Consent**: Clear consent for data collection
- **Data Deletion**: Allow user to delete their data
- **Privacy Policy**: Clear privacy policy
- **GDPR Compliance**: Follow GDPR guidelines

### Testing Strategy

#### Unit Testing
- Test individual components and functions
- Test business logic and utilities
- Mock API calls and dependencies
- Test error handling and edge cases

#### Integration Testing
- Test API integration
- Test navigation flows
- Test state management
- Test offline/online transitions

#### E2E Testing
- Test complete user flows
- Test authentication flows
- Test transaction creation and management
- Test budget and goal management
- Test on real devices

#### Device Testing
- Test on multiple iOS versions
- Test on multiple Android versions
- Test on different screen sizes
- Test on different device capabilities
- Test performance on low-end devices

### Deployment

#### Build Process
- **Development Build**: For testing and development
- **Staging Build**: For pre-production testing
- **Production Build**: For app store release
- **Code Signing**: Proper code signing for iOS and Android
- **Version Management**: Semantic versioning

#### App Store Deployment

**iOS (App Store)**
- Create App Store Connect app
- Configure app metadata and screenshots
- Submit for App Store review
- Handle review feedback
- Release to App Store

**Android (Google Play)**
- Create Google Play Console app
- Configure app listing and assets
- Submit for Google Play review
- Handle review feedback
- Release to Google Play

#### Over-the-Air (OTA) Updates
- Use CodePush or similar for JavaScript updates
- Update app without app store approval
- Rollback capability for problematic updates
- Update notification to users
- Version compatibility checks

#### Version Management
- Semantic versioning (major.minor.patch)
- Version code for Android
- Build number for iOS
- Changelog for each version
- Migration scripts for data changes

### Feature Parity with Web App

The mobile app provides feature parity with the web application:

✅ **All Core Features**: Transactions, Categories, Budgets, Goals, Investments
✅ **All Advanced Features**: AI Integration, Search, Export/Import, Real-time Updates
✅ **All Security Features**: 2FA, OAuth, Biometric Auth
✅ **All User Features**: Onboarding, Settings, Preferences, Notifications
✅ **All Reporting Features**: Reports, Analytics, Charts, Exports

The mobile app may have some UI/UX differences to optimize for mobile, but all functionality remains the same.

### Best Practices

1. **Consistent API Usage**: Use same API endpoints as web app
2. **Error Handling**: Graceful error handling with user-friendly messages
3. **Loading States**: Show loading indicators for async operations
4. **Offline Support**: Full offline functionality with sync
5. **Performance**: Optimize for fast, smooth user experience
6. **Security**: Follow mobile security best practices
7. **Accessibility**: Support screen readers and accessibility features
8. **Testing**: Comprehensive testing on multiple devices
9. **Documentation**: Keep mobile app documentation updated
10. **User Feedback**: Collect and act on user feedback

---

## Real-time Updates (WebSocket)

### Overview
FinMan implements WebSocket-based real-time updates to provide instant notifications and live data synchronization. This enables users to see budget updates, transaction notifications, and goal progress changes in real-time without page refreshes.

### Use Cases
1. **Real-time Budget Updates**: Live budget progress and threshold alerts
2. **Live Transaction Notifications**: Instant notifications when transactions are added/updated
3. **Real-time Goal Progress**: Live goal progress updates
4. **Budget Alerts**: Instant budget threshold and exceeded alerts
5. **Collaborative Features**: Real-time updates if multiple devices are used
6. **System Notifications**: Real-time system messages and alerts

### WebSocket Setup with Next.js

#### Step 1: Install Dependencies
```bash
npm install socket.io socket.io-client
npm install socket.io
npm install -D @types/socket.io
```

#### Step 2: WebSocket Server Setup
Create `lib/services/websocket.service.ts`:
```typescript
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { logger } from './logger.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export class WebSocketService {
  private io: SocketIOServer;
  private connectedClients = new Map<string, Set<string>>(); // userId -> Set of socketIds

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
      path: '/ws',
    });

    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers() {
    this.io.on('connection', (client: AuthenticatedSocket) => {
      this.handleConnection(client);
    });
  }

  private async handleConnection(client: AuthenticatedSocket) {
    try {
      // Authenticate WebSocket connection
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
      client.userId = payload.sub;

      // Store connection
      if (!this.connectedClients.has(client.userId)) {
        this.connectedClients.set(client.userId, new Set());
      }
      this.connectedClients.get(client.userId)!.add(client.id);

      // Join user-specific room
      client.join(`user:${client.userId}`);

      // Log connection
      logger.info('WebSocket connection established', {
        service: 'websocket',
        userId: client.userId,
        socketId: client.id,
        totalConnections: this.connectedClients.get(client.userId)!.size,
      });

      // Send welcome message
      client.emit('connected', {
        message: 'Connected to FinMan real-time updates',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('WebSocket connection error', {
        service: 'websocket',
        error: error.message,
        socketId: client.id,
        event: 'connection_error',
      });
      client.disconnect();
    }
  }

  private handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userConnections = this.connectedClients.get(client.userId);
      if (userConnections) {
        userConnections.delete(client.id);
        if (userConnections.size === 0) {
          this.connectedClients.delete(client.userId);
        }
      }

      logger.info('WebSocket disconnected', {
        service: 'websocket',
        userId: client.userId,
        socketId: client.id,
      });
    }
    }
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return client.handshake.auth?.token || null;
  }

  /**
   * Send real-time transaction notification
   */
  notifyTransaction(userId: string, transaction: any) {
    this.io.to(`user:${userId}`).emit('transaction:created', {
      type: 'transaction:created',
      data: transaction,
      timestamp: new Date().toISOString(),
    });

    logger.info('Transaction notification sent', {
      service: 'websocket',
      userId,
      transactionId: transaction._id,
    });
  }

  /**
   * Send real-time budget update
   */
  notifyBudgetUpdate(userId: string, budget: any) {
    this.io.to(`user:${userId}`).emit('budget:updated', {
      type: 'budget:updated',
      data: budget,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send budget alert
   */
  notifyBudgetAlert(userId: string, alert: any) {
    this.io.to(`user:${userId}`).emit('budget:alert', {
      type: 'budget:alert',
      data: alert,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send goal progress update
   */
  notifyGoalProgress(userId: string, goal: any) {
    this.io.to(`user:${userId}`).emit('goal:progress', {
      type: 'goal:progress',
      data: goal,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send system notification
   */
  notifySystemMessage(userId: string, message: any) {
    this.io.to(`user:${userId}`).emit('system:notification', {
      type: 'system:notification',
      data: message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Broadcast to all connected clients (admin use)
   */
  broadcast(message: any) {
    this.io.emit('broadcast', {
      type: 'broadcast',
      data: message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get Socket.IO server instance
   */
  getIO(): SocketIOServer {
    return this.io;
  }
  }

  /**
   * Get connected clients count
   */
  getConnectedClientsCount(): number {
    return Array.from(this.connectedClients.values()).reduce(
      (sum, set) => sum + set.size,
      0,
    );
  }

  /**
   * Get user connections count
   */
  getUserConnectionsCount(userId: string): number {
    return this.connectedClients.get(userId)?.size || 0;
  }
}
```

#### Step 3: Initialize WebSocket in Next.js
Create `lib/server.ts` or update your Next.js server setup:
```typescript
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketService } from './services/websocket.service';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Initialize WebSocket service
  const wsService = new WebSocketService(server);

  // Export wsService for use in API routes
  (global as any).wsService = wsService;

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
```

**Note**: For Next.js API routes, you can also use Socket.IO with a custom server setup or use a separate WebSocket server.
import { BudgetsService } from '../budgets/budgets.service';
import { GoalsService } from '../goals/goals.service';
import { AppLogger } from '../../common/services/logger.service';

// Use WebSocketService methods directly
// Import services as needed in API routes or other services
import { transactionsService } from '@/lib/services/transactions.service';
import { budgetsService } from '@/lib/services/budgets.service';
import { goalsService } from '@/lib/services/goals.service';

  /**
   * Notify transaction creation
   */
  async notifyTransactionCreated(userId: string, transactionId: string) {
    try {
      const transaction = await transactionsService.findOne(
        transactionId,
        userId,
      );
      if ((global as any).wsService) {
        (global as any).wsService.notifyTransaction(userId, transaction);
      }
    } catch (error: any) {
      logger.logError(error, 'websocket', {
        userId,
        transactionId,
        event: 'transaction_notification_failed',
      });
    }
  }

  /**
   * Notify transaction update
   */
  async notifyTransactionUpdated(userId: string, transactionId: string) {
    try {
      const transaction = await transactionsService.findOne(
        transactionId,
        userId,
      );
      if ((global as any).wsService) {
        (global as any).wsService.notifyTransaction(userId, transaction);
      }
        type: 'transaction:updated',
        data: transaction,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.logError(error, 'websocket', {
        userId,
        transactionId,
        event: 'transaction_update_notification_failed',
      });
    }
  }

  /**
   * Notify budget update with progress calculation
   */
  async notifyBudgetUpdate(userId: string, budgetId: string) {
    try {
      const budget = await this.budgetsService.findOne(budgetId, userId);
      const progress = await this.budgetsService.getBudgetProgress(
        budgetId,
        userId,
      );

      const budgetWithProgress = {
        ...budget.toObject(),
        progress: {
          spent: progress.spent,
          remaining: progress.remaining,
          percentage: progress.percentage,
        },
      };

      this.gateway.notifyBudgetUpdate(userId, budgetWithProgress);

      // Check for threshold alerts
      if (progress.percentage >= budget.alertThreshold) {
        this.gateway.notifyBudgetAlert(userId, {
          budgetId: budget._id,
          budgetName: budget.name,
          spent: progress.spent,
          limit: budget.amount,
          percentage: progress.percentage,
          type: progress.percentage >= 100 ? 'exceeded' : 'threshold',
        });
      }
    } catch (error) {
      this.logger.logError(error, 'websocket', {
        userId,
        budgetId,
        event: 'budget_update_notification_failed',
      });
    }
  }

  /**
   * Notify goal progress update
   */
  async notifyGoalProgress(userId: string, goalId: string) {
    try {
      const goal = await this.goalsService.findOne(goalId, userId);
      const percentage = (goal.currentAmount / goal.targetAmount) * 100;

      this.gateway.notifyGoalProgress(userId, {
        ...goal.toObject(),
        progress: {
          percentage: percentage.toFixed(1),
          remaining: goal.targetAmount - goal.currentAmount,
        },
      });

      // Check for milestones
      const milestones = [25, 50, 75, 100];
      const reachedMilestone = milestones.find(
        (m) => percentage >= m && percentage < m + 1,
      );

      if (reachedMilestone) {
        this.gateway.server.to(`user:${userId}`).emit('goal:milestone', {
          type: 'goal:milestone',
          data: {
            goalId: goal._id,
            goalTitle: goal.title,
            milestone: reachedMilestone,
            percentage: percentage.toFixed(1),
          },
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      this.logger.logError(error, 'websocket', {
        userId,
        goalId,
        event: 'goal_progress_notification_failed',
      });
    }
  }

  /**
   * Notify system message
   */
  notifySystemMessage(userId: string, message: string, type: 'info' | 'warning' | 'error' = 'info') {
    this.gateway.notifySystemMessage(userId, {
      message,
      type,
    });
  }
}
```

#### Step 4: Using WebSocket in Services
In Next.js, import and use the WebSocketService directly in your services:

```typescript
// lib/services/transactions.service.ts
import { wsService } from '@/lib/server'; // or wherever you export it

export const transactionsService = {
  async create(data: any, userId: string) {
    const transaction = await Transaction.create({ ...data, userId });
    
    // Notify via WebSocket
    if ((global as any).wsService) {
      (global as any).wsService.notifyTransaction(userId, transaction);
    }
    
    return transaction;
  },
};
```

**Note**: In Next.js, there's no module system. Simply import services and utilities where needed.

#### Step 5: Integration with Services

Update `TransactionsService` to emit WebSocket events:
```typescript
// In transactions.service.ts
import { WebSocketService } from '../websocket/websocket.service';

// lib/services/transactions.service.ts
export const transactionsService = {
  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const transaction = await Transaction.create({
      ...createTransactionDto,
      userId,
    });

    // Emit WebSocket notification
    if ((global as any).wsService) {
      (global as any).wsService.notifyTransaction(userId, transaction);
    }

    return transaction;
  },

  async update(id: string, updateDto: UpdateTransactionDto, userId: string) {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      updateDto,
      { new: true },
    );

    // Emit WebSocket notification
    if ((global as any).wsService) {
      (global as any).wsService.notifyTransaction(userId, transaction);
    }

    return transaction;
  },
};
```

### Connection Management

#### 1. Authentication
- JWT token validation on connection
- User identification and room assignment
- Connection tracking per user

#### 2. Room Management
```typescript
// User-specific rooms
client.join(`user:${userId}`);

// Category-specific rooms (optional)
client.join(`category:${categoryId}`);

// Budget-specific rooms (optional)
client.join(`budget:${budgetId}`);
```

#### 3. Connection State Management
```typescript
// Track active connections
private connectedClients = new Map<string, Set<string>>();

// Get connection count
getUserConnectionsCount(userId: string): number {
  return this.connectedClients.get(userId)?.size || 0;
}
```

#### 4. Reconnection Handling
```typescript
// Client-side reconnection logic
const socket = io('http://localhost:3000/ws', {
  auth: {
    token: getAuthToken(),
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});
```

### Fallback Strategies

#### 1. Polling Fallback
```typescript
// Frontend: Fallback to polling if WebSocket fails
class RealTimeService {
  private socket: Socket | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;
  private usePolling = false;

  connect() {
    try {
      this.socket = io('http://localhost:3000/ws', {
        auth: { token: this.getToken() },
      });

      this.socket.on('connect', () => {
        this.usePolling = false;
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
        }
      });

      this.socket.on('disconnect', () => {
        this.fallbackToPolling();
      });

      this.socket.on('connect_error', () => {
        this.fallbackToPolling();
      });
    } catch (error) {
      this.fallbackToPolling();
    }
  }

  private fallbackToPolling() {
    this.usePolling = true;
    this.pollingInterval = setInterval(() => {
      this.pollForUpdates();
    }, 5000); // Poll every 5 seconds
  }

  private async pollForUpdates() {
    // Make API call to get latest updates
    const updates = await this.apiService.getLatestUpdates();
    this.handleUpdates(updates);
  }
}
```

#### 2. Server-Sent Events (SSE) Alternative
```typescript
// Alternative: SSE endpoint for browsers that don't support WebSocket
// Create app/api/v1/events/route.ts
import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const user = await verifyToken(token);

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
    const interval = setInterval(() => {
        const data = JSON.stringify({ type: 'ping', timestamp: Date.now() });
        controller.enqueue(`data: ${data}\n\n`);
    }, 30000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

#### 3. Connection Health Monitoring
```typescript
// Ping/pong mechanism
@SubscribeMessage('ping')
handlePing(@ConnectedSocket() client: Socket) {
  client.emit('pong', { timestamp: Date.now() });
}

// Client-side health check
setInterval(() => {
  if (socket.connected) {
    socket.emit('ping');
  }
}, 30000);
```

### Frontend Integration

#### React Hook Example
```typescript
// useWebSocket.ts
import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export const useWebSocket = (token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/ws', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('WebSocket connected');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('WebSocket disconnected');
    });

    // Listen for transaction events
    newSocket.on('transaction:created', (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
      // Update UI or state
    });

    newSocket.on('transaction:updated', (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for budget events
    newSocket.on('budget:updated', (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('budget:alert', (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
      // Show alert notification
    });

    // Listen for goal events
    newSocket.on('goal:progress', (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('goal:milestone', (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
      // Show milestone celebration
    });

    // Listen for system notifications
    newSocket.on('system:notification', (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  const sendMessage = useCallback(
    (type: string, data: any) => {
      if (socket && connected) {
        socket.emit(type, data);
      }
    },
    [socket, connected],
  );

  return { socket, connected, messages, sendMessage };
};
```

### Event Types

#### Transaction Events
- `transaction:created` - New transaction created
- `transaction:updated` - Transaction updated
- `transaction:deleted` - Transaction deleted

#### Budget Events
- `budget:updated` - Budget progress updated
- `budget:alert` - Budget threshold/exceeded alert
- `budget:created` - New budget created

#### Goal Events
- `goal:progress` - Goal progress updated
- `goal:milestone` - Goal milestone reached
- `goal:completed` - Goal completed

#### System Events
- `system:notification` - System notification
- `connected` - Connection established
- `disconnected` - Connection lost

### Security Considerations

1. **Authentication**: Validate JWT tokens on connection
2. **Authorization**: Verify user permissions for events
3. **Rate Limiting**: Limit message frequency
4. **Input Validation**: Validate all WebSocket messages
5. **CORS Configuration**: Proper CORS setup
6. **Connection Limits**: Limit connections per user

### Performance Optimization

1. **Room-based Broadcasting**: Only send to relevant users
2. **Message Batching**: Batch multiple updates
3. **Connection Pooling**: Manage connection lifecycle
4. **Heartbeat Mechanism**: Detect dead connections
5. **Compression**: Enable WebSocket compression

### Monitoring & Logging

```typescript
// Log all WebSocket events
this.logger.log('WebSocket event', 'websocket', {
  event: 'transaction:created',
  userId,
  socketId: client.id,
});

// Monitor connection health
// Use Next.js API route with cron: app/api/cron/monitor-connections/route.ts
// Configure in vercel.json: { "path": "/api/cron/monitor-connections", "schedule": "*/30 * * * * *" }
monitorConnections() {
  const stats = {
    totalConnections: this.getConnectedClientsCount(),
    timestamp: new Date().toISOString(),
  };
  this.logger.log('WebSocket stats', 'websocket', stats);
}
```

### Environment Configuration

Add to `.env`:
```env
# WebSocket Configuration
WS_PORT=3001
WS_PATH=/ws
WS_CORS_ORIGIN=http://localhost:3000
WS_ENABLED=true
```

### Main Application Module Setup

**Note**: In Next.js, WebSocket is initialized in the custom server setup (see Step 3 in WebSocket section). No module file is needed.

### Best Practices

1. **Graceful Degradation**: Always have polling fallback
2. **Error Handling**: Handle connection errors gracefully
3. **Reconnection Logic**: Automatic reconnection with exponential backoff
4. **Message Queuing**: Queue messages during disconnection
5. **Resource Cleanup**: Clean up connections on disconnect
6. **Testing**: Test WebSocket connections thoroughly

---

## AI Integration (Gemini)

### Setup
1. Get Gemini API key from Google Cloud Console
2. Install `@google/generative-ai` package
3. Configure API key in environment variables

### Implementation Areas

#### 1. Expense Categorization
```typescript
// Automatically categorize transactions based on description
async categorizeTransaction(description: string, amount: number): Promise<string> {
  const prompt = `Categorize this transaction: "${description}" for $${amount}. 
  Return only the category name from: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Education, Other.`;
  
  // Call Gemini API
  // Return category
}
```

#### 2. Budget Recommendations
```typescript
// Analyze spending patterns and suggest budgets
async getBudgetRecommendations(userId: string): Promise<BudgetRecommendation[]> {
  // Fetch user's spending history
  // Send to Gemini with prompt for analysis
  // Return AI-generated budget suggestions
}
```

#### 3. Financial Insights
```typescript
// Generate monthly/weekly financial insights
async generateInsights(userId: string, period: string): Promise<Insight[]> {
  // Analyze transactions, budgets, goals
  // Generate personalized insights using Gemini
  // Return formatted insights
}
```

#### 4. Receipt Processing
```typescript
// Extract data from receipt images using Gemini Vision
async processReceipt(imageBuffer: Buffer): Promise<ReceiptData> {
  // Use Gemini Vision API to extract:
  // - Merchant name
  // - Total amount
  // - Date
  // - Line items
  // Return structured data
}
```

#### 5. AI Chat Assistant
```typescript
// Conversational AI for financial questions
async chatWithAI(userId: string, message: string): Promise<string> {
  // Include user's financial context
  // Send to Gemini with conversation history
  // Return AI response
}
```

### Gemini Service Structure
```typescript
// lib/services/gemini.service.ts
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

let model: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }
  return model;
}

export const geminiService = {
  async generateText(prompt: string): Promise<string> {
    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  },
  
  async analyzeImage(imageBuffer: Buffer, prompt: string): Promise<string> {
    const model = getModel();
    // Use Gemini Vision API
    // Implementation depends on Gemini Vision API
    return '';
  },
  
  async chat(messages: ChatMessage[]): Promise<string> {
    const model = getModel();
    // Conversational AI implementation
    return '';
  },
};
```

---

## Email Integration (Nodemailer)

### Overview
FinMan uses Nodemailer for sending personalized emails to users. Emails are sent for authentication, notifications, reports, and alerts.

### Email Use Cases

#### 1. Authentication Emails
- **Welcome Email**: Sent after user registration
- **Email Verification**: Verify user email address
- **Password Reset**: Send reset link when user forgets password
- **Password Changed**: Confirmation when password is changed
- **Account Deleted**: Confirmation when account is deleted

#### 2. Budget & Financial Alerts
- **Budget Threshold Alert**: When budget reaches threshold (e.g., 80%)
- **Budget Exceeded Alert**: When budget is exceeded
- **Budget Reminder**: Reminder before budget period ends
- **Low Balance Alert**: When account balance is low

#### 3. Goal Reminders
- **Goal Progress Update**: Weekly/monthly progress updates
- **Goal Milestone**: When reaching milestones (25%, 50%, 75%)
- **Goal Completed**: Celebration email when goal is achieved
- **Goal Deadline Reminder**: Reminder approaching deadline

#### 4. Transaction Alerts
- **Large Transaction Alert**: Alert for transactions above threshold
- **Recurring Transaction Reminder**: Upcoming recurring transactions
- **Unusual Spending Pattern**: AI-detected unusual patterns

#### 5. Reports & Summaries
- **Weekly Summary**: Weekly financial summary
- **Monthly Report**: Comprehensive monthly report
- **Yearly Summary**: Annual financial review
- **Custom Report**: User-requested reports

#### 6. System Notifications
- **Backup Reminder**: Data backup reminders
- **Feature Updates**: New feature announcements
- **Security Alerts**: Login from new device, suspicious activity
- **Subscription Reminders**: If premium features are added

### Setup

#### Step 1: Install Dependencies
```bash
npm install nodemailer handlebars
npm install -D @types/nodemailer @types/handlebars
```

#### Step 2: Email Configuration
Create `lib/config/email.config.ts`:
```typescript
export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App password for Gmail
  },
  from: {
    name: 'FinMan',
    address: process.env.EMAIL_FROM || 'noreply@finman.finance',
  },
  replyTo: process.env.EMAIL_REPLY_TO || 'support@finman.finance',
};
```

#### Step 3: Environment Variables
Add to `.env`:
```env
# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@finman.finance
EMAIL_REPLY_TO=support@finman.finance

# Email Settings
EMAIL_ENABLED=true
EMAIL_FROM_NAME=FinMan
EMAIL_BASE_URL=https://finman.finance
```

#### Step 4: Email Service Implementation
Create `lib/services/email.service.ts`:
```typescript
import * as nodemailer from 'nodemailer';
import { User } from '@/models/User';
import { emailConfig } from '@/lib/config/email.config';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  }
  return transporter;
  }

export const emailService = {

  async sendWelcomeEmail(user: User): Promise<void> {
    const template = getWelcomeTemplate(user);
    await this.sendEmail({
      to: user.email,
      subject: 'Welcome to FinMan - Your Personal Financial Manager',
      html: template.html,
      text: template.text,
    });
  },

  async sendPasswordResetEmail(user: User, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.EMAIL_BASE_URL}/reset-password?token=${resetToken}`;
    const template = getPasswordResetTemplate(user, resetUrl);
    
    await this.sendEmail({
      to: user.email,
      subject: 'Reset Your FinMan Password',
      html: template.html,
      text: template.text,
    });
  },

  async sendBudgetAlertEmail(
    user: User,
    budgetName: string,
    spent: number,
    limit: number,
    percentage: number,
  ): Promise<void> {
    const template = getBudgetAlertTemplate(user, budgetName, spent, limit, percentage);
    
    await this.sendEmail({
      to: user.email,
      subject: `Budget Alert: ${budgetName}`,
      html: template.html,
      text: template.text,
    });
  },

  async sendGoalProgressEmail(
    user: User,
    goalTitle: string,
    currentAmount: number,
    targetAmount: number,
    percentage: number,
  ): Promise<void> {
    const template = getGoalProgressTemplate(user, goalTitle, currentAmount, targetAmount, percentage);
    
    await this.sendEmail({
      to: user.email,
      subject: `Goal Update: ${goalTitle}`,
      html: template.html,
      text: template.text,
    });
  },

  async sendWeeklySummaryEmail(user: User, summary: any): Promise<void> {
    const template = getWeeklySummaryTemplate(user, summary);
    
    await this.sendEmail({
      to: user.email,
      subject: 'Your Weekly Financial Summary',
      html: template.html,
      text: template.text,
    });
  },

  async sendMonthlyReportEmail(user: User, report: any): Promise<void> {
    const template = getMonthlyReportTemplate(user, report);
    
    await this.sendEmail({
      to: user.email,
      subject: 'Your Monthly Financial Report',
      html: template.html,
      text: template.text,
    });
  },

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<void> {
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: {
          name: process.env.EMAIL_FROM_NAME || 'FinMan',
          address: emailConfig.from.address,
        },
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || htmlToText(options.html),
        replyTo: emailConfig.replyTo,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  },
};

// Email Templates (helper functions)
function getWelcomeTemplate(user: User) {
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563EB 0%, #10B981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #2563EB; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to FinMan!</h1>
            </div>
            <div class="content">
              <p>Hi ${user.firstName || 'there'},</p>
              <p>Thank you for joining FinMan - Your Personal Financial Manager!</p>
              <p>We're excited to help you take control of your finances. With FinMan, you can:</p>
              <ul>
                <li>Track your income and expenses</li>
                <li>Set and manage budgets</li>
                <li>Achieve your financial goals</li>
                <li>Get AI-powered insights</li>
                <li>Generate detailed reports</li>
              </ul>
              <a href="${process.env.EMAIL_BASE_URL}/dashboard" class="button">Get Started</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The FinMan Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to FinMan! Hi ${user.firstName || 'there'}, Thank you for joining FinMan. Get started at ${process.env.EMAIL_BASE_URL}/dashboard`,
    };
  }

  private getPasswordResetTemplate(user: User, resetUrl: string) {
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563EB; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #2563EB; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${user.firstName || 'there'},</p>
              <p>We received a request to reset your password for your FinMan account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p>${resetUrl}</p>
              <p class="warning">This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
              <p>Best regards,<br>The FinMan Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Password Reset: Click here to reset your password: ${resetUrl}. This link expires in 1 hour.`,
    };
  }

  private getBudgetAlertTemplate(
    user: User,
    budgetName: string,
    spent: number,
    limit: number,
    percentage: number,
  ) {
    const isExceeded = percentage >= 100;
    const alertColor = isExceeded ? '#dc2626' : '#f59e0b';
    
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${alertColor}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .stats { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .progress-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
            .progress-fill { background: ${alertColor}; height: 100%; width: ${percentage}%; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${isExceeded ? 'Budget Exceeded!' : 'Budget Alert'}</h1>
            </div>
            <div class="content">
              <p>Hi ${user.firstName || 'there'},</p>
              <p>${isExceeded ? 'Your budget has been exceeded!' : `Your budget is at ${percentage}% of its limit.`}</p>
              <div class="stats">
                <h3>${budgetName}</h3>
                <p><strong>Spent:</strong> ${spent.toLocaleString()} ${user.currency || 'USD'}</p>
                <p><strong>Limit:</strong> ${limit.toLocaleString()} ${user.currency || 'USD'}</p>
                <p><strong>Remaining:</strong> ${(limit - spent).toLocaleString()} ${user.currency || 'USD'}</p>
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
                <p><strong>Usage:</strong> ${percentage.toFixed(1)}%</p>
              </div>
              <a href="${process.env.EMAIL_BASE_URL}/budgets" class="button">View Budgets</a>
              <p>Best regards,<br>The FinMan Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Budget Alert: ${budgetName} - Spent: ${spent}, Limit: ${limit}, Usage: ${percentage}%`,
    };
  }

  private getGoalProgressTemplate(
    user: User,
    goalTitle: string,
    currentAmount: number,
    targetAmount: number,
    percentage: number,
  ) {
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10B981 0%, #2563EB 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .stats { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .progress-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
            .progress-fill { background: #10B981; height: 100%; width: ${percentage}%; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Goal Progress Update</h1>
            </div>
            <div class="content">
              <p>Hi ${user.firstName || 'there'},</p>
              <p>Great progress on your financial goal!</p>
              <div class="stats">
                <h3>${goalTitle}</h3>
                <p><strong>Current:</strong> ${currentAmount.toLocaleString()} ${user.currency || 'USD'}</p>
                <p><strong>Target:</strong> ${targetAmount.toLocaleString()} ${user.currency || 'USD'}</p>
                <p><strong>Remaining:</strong> ${(targetAmount - currentAmount).toLocaleString()} ${user.currency || 'USD'}</p>
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
                <p><strong>Progress:</strong> ${percentage.toFixed(1)}%</p>
              </div>
              <a href="${process.env.EMAIL_BASE_URL}/goals" class="button">View Goals</a>
              <p>Keep up the great work!</p>
              <p>Best regards,<br>The FinMan Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Goal Progress: ${goalTitle} - ${percentage.toFixed(1)}% complete`,
    };
  }

  private getWeeklySummaryTemplate(user: User, summary: any) {
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563EB 0%, #10B981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .summary-box { background: white; padding: 20px; border-radius: 5px; margin: 15px 0; }
            .stat { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Weekly Financial Summary</h1>
            </div>
            <div class="content">
              <p>Hi ${user.firstName || 'there'},</p>
              <p>Here's your weekly financial summary:</p>
              <div class="summary-box">
                <h3>Income & Expenses</h3>
                <div class="stat">
                  <span>Total Income:</span>
                  <strong>${summary.totalIncome?.toLocaleString() || 0} ${user.currency || 'USD'}</strong>
                </div>
                <div class="stat">
                  <span>Total Expenses:</span>
                  <strong>${summary.totalExpenses?.toLocaleString() || 0} ${user.currency || 'USD'}</strong>
                </div>
                <div class="stat">
                  <span>Net:</span>
                  <strong>${(summary.totalIncome - summary.totalExpenses)?.toLocaleString() || 0} ${user.currency || 'USD'}</strong>
                </div>
              </div>
              <a href="${process.env.EMAIL_BASE_URL}/reports" class="button">View Full Report</a>
              <p>Best regards,<br>The FinMan Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Weekly Summary: Income: ${summary.totalIncome}, Expenses: ${summary.totalExpenses}`,
    };
  }

  getMonthlyReportTemplate(user: User, report: any) {
    // Similar structure to weekly summary but with monthly data
    return {
      html: `<!-- Monthly report template similar to weekly -->`,
      text: `Monthly Report: ${JSON.stringify(report)}`,
    };
  },
};

function htmlToText(html: string): string {
    // Simple HTML to text converter
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
}
```

**Note**: In Next.js, no module file is needed. Simply import `emailService` where needed.

### Email Service Providers

#### Gmail Setup
1. Enable 2-Step Verification in Google Account
2. Generate App Password: Google Account → Security → App Passwords
3. Use app password in `EMAIL_PASSWORD`

#### Other Providers
- **SendGrid**: Professional email service
- **Mailgun**: Developer-friendly email API
- **AWS SES**: Amazon Simple Email Service
- **Postmark**: Transactional email service

### Email Preferences
Add to User Schema:
```typescript
emailPreferences: {
  welcome: Boolean (default: true),
  budgetAlerts: Boolean (default: true),
  goalUpdates: Boolean (default: true),
  weeklySummary: Boolean (default: true),
  monthlyReport: Boolean (default: true),
  transactionAlerts: Boolean (default: false),
  marketing: Boolean (default: false)
}
```

### Scheduled Emails
Use Next.js API routes with Vercel Cron or node-cron for scheduled emails:
```typescript
// app/api/cron/weekly-summaries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email.service';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all users who want weekly summaries
  const users = await User.find({ 'emailPreferences.weeklySummary': true });
  
  for (const user of users) {
    // Generate and send weekly summary
    // Implementation here
  }

  return NextResponse.json({ success: true });
}

// Configure in vercel.json:
// {
//   "crons": [
//     {
//       "path": "/api/cron/weekly-summaries",
//       "schedule": "0 9 * * 1"
//     },
//     {
//       "path": "/api/cron/monthly-reports",
//       "schedule": "0 9 1 * *"
//     }
//   ]
// }
```

### Testing Emails
Use services like:
- **Mailtrap**: Email testing for development
- **Ethereal Email**: Fake SMTP for testing
- **MailHog**: Local email testing server

---

## Background Jobs & Task Scheduling

### Overview
FinMan uses background jobs and scheduled tasks for recurring operations like processing recurring transactions, sending scheduled emails, generating reports, and performing maintenance tasks.

### Task Scheduling Options

#### Option 1: Vercel Cron (Recommended for Vercel)
Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/recurring-transactions",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/weekly-summaries",
      "schedule": "0 9 * * 1"
    },
    {
      "path": "/api/cron/monthly-reports",
      "schedule": "0 9 1 * *"
    },
    {
      "path": "/api/cron/cleanup-logs",
      "schedule": "0 2 * * *"
    }
  ]
}
```

#### Option 2: node-cron (For Self-Hosted)
Create `lib/services/scheduler.service.ts`:
```typescript
import cron from 'node-cron';
import { emailService } from './email.service';
import { transactionsService } from './transactions.service';
import { logger } from './logger.service';

export const schedulerService = {
  start() {
    // Process recurring transactions every hour
    cron.schedule('0 * * * *', async () => {
      logger.info('Processing recurring transactions');
      await this.processRecurringTransactions();
    });

    // Send weekly summaries every Monday at 9 AM
    cron.schedule('0 9 * * 1', async () => {
      logger.info('Sending weekly summaries');
      await this.sendWeeklySummaries();
    });

    // Send monthly reports on 1st of month at 9 AM
    cron.schedule('0 9 1 * *', async () => {
      logger.info('Sending monthly reports');
      await this.sendMonthlyReports();
    });

    // Cleanup old logs daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      logger.info('Cleaning up old logs');
      await this.cleanupLogs();
    });
  },

  async processRecurringTransactions() {
    // Implementation
  },

  async sendWeeklySummaries() {
    // Implementation
  },

  async sendMonthlyReports() {
    // Implementation
  },

  async cleanupLogs() {
    // Implementation
  },
};
```

### Job Queue Setup (Bull/BullMQ)

#### Step 1: Install Dependencies
```bash
npm install bullmq ioredis
npm install -D @types/bullmq
```

#### Step 2: Redis Connection
Create `lib/config/redis.config.ts`:
```typescript
import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

export { connection };
```

#### Step 3: Create Queues
Create `lib/queues/transactions.queue.ts`:
```typescript
import { Queue } from 'bullmq';
import { connection } from '@/lib/config/redis.config';

export const transactionsQueue = new Queue('transactions', { connection });

// Add job
export async function addTransactionJob(data: any) {
  return await transactionsQueue.add('process-transaction', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
}
```

#### Step 4: Create Workers
Create `lib/workers/transactions.worker.ts`:
```typescript
import { Worker } from 'bullmq';
import { connection } from '@/lib/config/redis.config';
import { transactionsService } from '@/lib/services/transactions.service';
import { logger } from '@/lib/services/logger.service';

export const transactionsWorker = new Worker(
  'transactions',
  async (job) => {
    const { type, data } = job.data;

    switch (type) {
      case 'process-transaction':
        await transactionsService.create(data, data.userId);
        break;
      case 'process-recurring':
        await processRecurringTransaction(data);
        break;
      default:
        throw new Error(`Unknown job type: ${type}`);
    }
  },
  { connection }
);

transactionsWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`, { jobId: job.id });
});

transactionsWorker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed`, { jobId: job.id, error: err.message });
});
```

### Recurring Transaction Processing

#### Recurring Transaction Service
Create `lib/services/recurring-transactions.service.ts`:
```typescript
import { Transaction } from '@/models/Transaction';
import { RecurringTransaction } from '@/models/RecurringTransaction';
import { transactionsQueue } from '@/lib/queues/transactions.queue';

export const recurringTransactionsService = {
  async processRecurringTransactions() {
    const now = new Date();
    const recurring = await RecurringTransaction.find({
      isActive: true,
      nextDate: { $lte: now },
    });

    for (const recurringTx of recurring) {
      // Create transaction
      await transactionsQueue.add('process-recurring', {
        recurringId: recurringTx._id,
        transaction: {
          type: recurringTx.type,
          amount: recurringTx.amount,
          categoryId: recurringTx.categoryId,
          description: recurringTx.description,
          userId: recurringTx.userId,
          date: recurringTx.nextDate,
        },
      });

      // Update next date
      const nextDate = this.calculateNextDate(
        recurringTx.nextDate,
        recurringTx.frequency
      );
      await RecurringTransaction.findByIdAndUpdate(recurringTx._id, {
        nextDate,
        lastProcessed: now,
      });
    }
  },

  calculateNextDate(currentDate: Date, frequency: string): Date {
    const next = new Date(currentDate);
    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    return next;
  },
};
```

### Scheduled Email Sending

#### Email Queue
Create `lib/queues/email.queue.ts`:
```typescript
import { Queue } from 'bullmq';
import { connection } from '@/lib/config/redis.config';

export const emailQueue = new Queue('emails', { connection });

export async function addEmailJob(type: string, data: any) {
  return await emailQueue.add(type, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });
}
```

#### Email Worker
Create `lib/workers/email.worker.ts`:
```typescript
import { Worker } from 'bullmq';
import { connection } from '@/lib/config/redis.config';
import { emailService } from '@/lib/services/email.service';

export const emailWorker = new Worker(
  'emails',
  async (job) => {
    const { type, data } = job.data;

    switch (type) {
      case 'welcome':
        await emailService.sendWelcomeEmail(data.user);
        break;
      case 'weekly-summary':
        await emailService.sendWeeklySummaryEmail(data.user, data.summary);
        break;
      case 'monthly-report':
        await emailService.sendMonthlyReportEmail(data.user, data.report);
        break;
      default:
        throw new Error(`Unknown email type: ${type}`);
    }
  },
  { connection }
);
```

### Report Generation Jobs

#### Report Queue
```typescript
import { Queue } from 'bullmq';
import { connection } from '@/lib/config/redis.config';

export const reportQueue = new Queue('reports', { connection });

export async function generateReportJob(userId: string, type: string, dateRange: any) {
  return await reportQueue.add('generate-report', {
    userId,
    type,
    dateRange,
  }, {
    attempts: 2,
    timeout: 300000, // 5 minutes timeout
  });
}
```

### Failed Job Handling and Retries

#### Job Retry Configuration
```typescript
// Automatic retry with exponential backoff
await queue.add('job-name', data, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000, // Start with 2 seconds
  },
  removeOnComplete: {
    age: 86400, // Keep completed jobs for 24 hours
    count: 1000, // Keep last 1000 completed jobs
  },
  removeOnFail: {
    age: 604800, // Keep failed jobs for 7 days
  },
});
```

#### Manual Retry
```typescript
// Retry failed job
await job.retry();

// Retry with new data
await job.updateData(newData);
await job.retry();
```

### Background Job Monitoring

#### Queue Dashboard
```typescript
// Install bull-board for monitoring
npm install @bull-board/api @bull-board/express

// Create dashboard route
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(transactionsQueue),
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(reportQueue),
  ],
  serverAdapter,
});
```

### Best Practices

1. **Idempotency**: Make jobs idempotent (safe to retry)
2. **Error Handling**: Handle errors gracefully
3. **Logging**: Log all job executions
4. **Monitoring**: Monitor queue sizes and processing times
5. **Rate Limiting**: Limit job processing rate
6. **Dead Letter Queue**: Handle permanently failed jobs
7. **Job Priorities**: Use job priorities for important tasks

---

## Logging & Monitoring

### Overview
FinMan implements comprehensive logging for all system activities, errors, and user actions. This ensures proper debugging, security auditing, and system monitoring.

### What to Log

#### 1. Authentication & Authorization Logs
- **User Registration**: Log new user registrations with IP address and timestamp
- **Login Attempts**: Log all login attempts (successful and failed)
- **Logout Events**: Track user logout activities
- **Password Reset Requests**: Log password reset attempts
- **Password Changes**: Track password change events
- **Token Refresh**: Log JWT token refresh activities
- **Failed Authentication**: Log failed login attempts with reasons
- **Account Lockouts**: Log account lockout events
- **Suspicious Activity**: Log unusual login patterns (new device, location)

**Example Log Entry**:
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "service": "auth",
  "event": "user_login",
  "userId": "user123",
  "email": "user@example.com",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "status": "success",
  "metadata": {
    "loginMethod": "email",
    "deviceType": "desktop"
  }
}
```

#### 2. Transaction Logs
- **Transaction Creation**: Log all new transactions
- **Transaction Updates**: Log transaction modifications
- **Transaction Deletion**: Log transaction deletions
- **Bulk Operations**: Log bulk transaction imports
- **Transaction Categorization**: Log AI categorization results
- **Large Transactions**: Log transactions above threshold
- **Recurring Transactions**: Log recurring transaction processing

**Example Log Entry**:
```json
{
  "timestamp": "2024-01-15T10:35:00Z",
  "level": "info",
  "service": "transactions",
  "event": "transaction_created",
  "userId": "user123",
  "transactionId": "trans456",
  "type": "expense",
  "amount": 150.50,
  "currency": "USD",
  "category": "Food",
  "metadata": {
    "paymentMethod": "card",
    "location": "New York, NY"
  }
}
```

#### 3. Budget & Goal Logs
- **Budget Creation**: Log new budget creation
- **Budget Updates**: Log budget modifications
- **Budget Alerts**: Log budget threshold/exceeded alerts
- **Goal Creation**: Log financial goal creation
- **Goal Progress**: Log goal progress updates
- **Goal Completion**: Log goal achievement events

**Example Log Entry**:
```json
{
  "timestamp": "2024-01-15T10:40:00Z",
  "level": "warn",
  "service": "budgets",
  "event": "budget_threshold_reached",
  "userId": "user123",
  "budgetId": "budget789",
  "budgetName": "Groceries",
  "spent": 800,
  "limit": 1000,
  "percentage": 80,
  "metadata": {
    "alertType": "threshold",
    "alertLevel": "warning"
  }
}
```

#### 4. API Request Logs
- **All API Requests**: Log incoming API requests
- **Request Method & Path**: Log HTTP method and endpoint
- **Request Headers**: Log relevant headers (user-agent, content-type)
- **Request Body**: Log request payloads (sanitize sensitive data)
- **Response Status**: Log HTTP response codes
- **Response Time**: Log API response times
- **Error Responses**: Log all error responses with details

**Example Log Entry**:
```json
{
  "timestamp": "2024-01-15T10:45:00Z",
  "level": "info",
  "service": "api",
  "event": "api_request",
  "method": "POST",
  "path": "/api/transactions",
  "userId": "user123",
  "ipAddress": "192.168.1.1",
  "statusCode": 201,
  "responseTime": 125,
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "contentType": "application/json"
  }
}
```

#### 5. Error & Exception Logs
- **Application Errors**: Log all application errors
- **Database Errors**: Log database connection/query errors
- **External API Errors**: Log errors from Gemini, email service, etc.
- **Validation Errors**: Log input validation failures
- **Unhandled Exceptions**: Log unhandled exceptions with stack traces
- **Error Context**: Include full error context and stack traces

**Example Log Entry**:
```json
{
  "timestamp": "2024-01-15T10:50:00Z",
  "level": "error",
  "service": "transactions",
  "event": "transaction_creation_failed",
  "userId": "user123",
  "error": {
    "message": "Database connection timeout",
    "code": "DB_TIMEOUT",
    "stack": "Error: Database connection timeout\n    at..."
  },
  "metadata": {
    "transactionData": { /* sanitized */ },
    "retryAttempt": 1
  }
}
```

#### 6. File Upload & Receipt Logs
- **File Uploads**: Log all file upload attempts
- **Upload Success**: Log successful file uploads
- **Upload Failures**: Log failed uploads with reasons
- **File Processing**: Log receipt processing activities
- **AI Processing**: Log AI receipt extraction results
- **File Deletions**: Log file deletion events

**Example Log Entry**:
```json
{
  "timestamp": "2024-01-15T10:55:00Z",
  "level": "info",
  "service": "receipts",
  "event": "receipt_uploaded",
  "userId": "user123",
  "receiptId": "receipt123",
  "fileName": "receipt.jpg",
  "fileSize": 245678,
  "mimeType": "image/jpeg",
  "metadata": {
    "uploadMethod": "web",
    "processingStatus": "pending"
  }
}
```

#### 7. Email Logs
- **Email Sent**: Log all sent emails
- **Email Failures**: Log failed email deliveries
- **Email Bounces**: Log email bounces
- **Email Opened**: Track email opens (if tracking enabled)
- **Email Preferences**: Log email preference changes

**Example Log Entry**:
```json
{
  "timestamp": "2024-01-15T11:00:00Z",
  "level": "info",
  "service": "email",
  "event": "email_sent",
  "userId": "user123",
  "emailType": "welcome",
  "recipient": "user@example.com",
  "subject": "Welcome to FinMan",
  "status": "sent",
  "metadata": {
    "templateId": "welcome-001",
    "deliveryTime": 250
  }
}
```

#### 8. AI Integration Logs
- **AI Requests**: Log all Gemini API requests
- **AI Responses**: Log AI response times and results
- **AI Failures**: Log AI API failures
- **Categorization Requests**: Log expense categorization requests
- **Insight Generation**: Log AI insight generation
- **Token Usage**: Log API token usage (if applicable)

**Example Log Entry**:
```json
{
  "timestamp": "2024-01-15T11:05:00Z",
  "level": "info",
  "service": "ai",
  "event": "ai_categorization",
  "userId": "user123",
  "transactionId": "trans456",
  "prompt": "Categorize: Grocery store purchase",
  "response": "Food",
  "confidence": 0.95,
  "responseTime": 450,
  "metadata": {
    "model": "gemini-pro",
    "tokensUsed": 150
  }
}
```

#### 9. User Activity Logs
- **Profile Updates**: Log user profile changes
- **Settings Changes**: Log preference/setting modifications
- **Data Exports**: Log data export requests
- **Data Imports**: Log data import activities
- **Account Deletion**: Log account deletion requests
- **Password Changes**: Log password modification events

#### 10. System & Performance Logs
- **Application Startup**: Log application initialization
- **Database Connections**: Log database connection events
- **Memory Usage**: Log memory consumption (periodic)
- **Performance Metrics**: Log slow queries, slow API responses
- **Scheduled Jobs**: Log cron job executions
- **Cache Operations**: Log cache hits/misses (if using caching)

### Logging Setup

#### Step 1: Install Dependencies
```bash
npm install winston winston-daily-rotate-file
npm install -D @types/winston
```

#### Step 2: Logger Configuration
Create `lib/config/logger.config.ts`:
```typescript
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  }),
);

export const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'finman',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // Error log file
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat,
    }),

    // Combined log file
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: logFormat,
    }),

    // Access log file (API requests)
    new DailyRotateFile({
      filename: 'logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      maxSize: '20m',
      maxFiles: '30d',
      format: logFormat,
    }),

    // Audit log file (security events)
    new DailyRotateFile({
      filename: 'logs/audit-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '90d', // Keep audit logs longer
      format: logFormat,
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
};
```

#### Step 3: Logger Service
Create `lib/services/logger.service.ts`:
```typescript
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { loggerConfig } from '@/lib/config/logger.config';

// Create Winston logger instance
const winstonLogger = winston.createLogger(loggerConfig);

export const logger = {

  info(message: string, metadata?: any) {
    winstonLogger.info(message, metadata);
  },

  error(message: string, metadata?: any) {
    winstonLogger.error(message, metadata);
  },

  warn(message: string, metadata?: any) {
    winstonLogger.warn(message, metadata);
  },

  debug(message: string, metadata?: any) {
    winstonLogger.debug(message, metadata);
  },

  verbose(message: string, metadata?: any) {
    winstonLogger.verbose(message, metadata);
  },

  // Custom methods for specific log types
  logAuth(event: string, userId: string, metadata?: any) {
    winstonLogger.info(`Auth: ${event}`, {
      service: 'auth',
      event,
      userId,
      ...metadata,
    });
  },

  logTransaction(event: string, userId: string, transactionId: string, metadata?: any) {
    winstonLogger.info(`Transaction: ${event}`, {
      service: 'transactions',
      event,
      userId,
      transactionId,
      ...metadata,
    });
  },

  logApiRequest(method: string, path: string, userId: string, statusCode: number, responseTime: number, metadata?: any) {
    winstonLogger.http(`API: ${method} ${path}`, {
      service: 'api',
      method,
      path,
      userId,
      statusCode,
      responseTime,
      ...metadata,
    });
  },

  logError(error: Error, context: string, metadata?: any) {
    winstonLogger.error(error.message, {
      service: context,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      ...metadata,
    });
  },
};
```

#### Step 4: Logging Middleware
Create `lib/middleware/logging.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/services/logger.service';

export async function loggingMiddleware(
  request: NextRequest,
  response: NextResponse,
) {
  const startTime = Date.now();
  const method = request.method;
  const path = request.nextUrl.pathname;
  const userId = request.headers.get('x-user-id') || 'anonymous';

  // Log request
  logger.logApiRequest(method, path, userId, 0, 0, {
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    userAgent: request.headers.get('user-agent'),
  });

  // After response
  const responseTime = Date.now() - startTime;
  logger.logApiRequest(method, path, userId, response.status, responseTime);

  return response;
}
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const responseTime = Date.now() - startTime;

          // Sanitize sensitive data from body
          const sanitizedBody = this.sanitizeBody(body);

          this.logger.logApiRequest(
            method,
            url,
            user?.id || 'anonymous',
            response.statusCode,
            responseTime,
            {
              requestBody: sanitizedBody,
              ipAddress: request.ip,
              userAgent: request.get('user-agent'),
            },
          );
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.logger.logError(
            error,
            'api',
            {
              method,
              url,
              userId: request.user?.id || 'anonymous',
              responseTime,
              statusCode: error.status || 500,
            },
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
    const sanitized = { ...body };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}
```

#### Step 5: Environment Variables
Add to `.env`:
```env
# Logging Configuration
LOG_LEVEL=info  # error, warn, info, http, verbose, debug, silly
LOG_DIR=./logs
LOG_MAX_SIZE=20m
LOG_MAX_FILES=30d
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=true
```

#### Step 6: Next.js Middleware Setup
Update `middleware.ts` (Next.js root):
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { loggingMiddleware } from '@/lib/middleware/logging';
import { logger } from '@/lib/services/logger.service';

export function middleware(request: NextRequest) {
  // Initialize logger if needed
  logger.info(`Request: ${request.method} ${request.nextUrl.pathname}`);

  // Apply logging middleware
  const response = NextResponse.next();
  return loggingMiddleware(request, response);
}

export const config = {
  matcher: '/api/:path*',
};
```

**Note**: In Next.js, there's no `main.ts`. The application starts automatically via `next dev` or `next start`. Use `middleware.ts` for request interception.

### Log Levels

- **error**: Error events that might still allow the application to continue
- **warn**: Warning messages for potentially harmful situations
- **info**: Informational messages highlighting progress
- **http**: HTTP request logging
- **verbose**: Detailed information for debugging
- **debug**: Debug-level messages
- **silly**: Most verbose logging level

### Structured Logging Format

All logs follow a consistent JSON structure:
```json
{
  "timestamp": "ISO 8601 timestamp",
  "level": "log level",
  "service": "service name",
  "event": "event type",
  "message": "human-readable message",
  "userId": "user identifier (if applicable)",
  "metadata": {
    "additional": "context data"
  }
}
```

### Log Storage & Rotation

- **Daily Rotation**: Logs rotate daily
- **File Size Limit**: 20MB per file
- **Retention Policy**:
  - Error logs: 14 days
  - Combined logs: 30 days
  - Access logs: 30 days
  - Audit logs: 90 days
  - Exception logs: 30 days

### Security Considerations

1. **Sanitize Sensitive Data**: Never log passwords, tokens, credit card numbers
2. **PII Protection**: Be careful with personally identifiable information
3. **Access Control**: Restrict log file access
4. **Encryption**: Encrypt log files in production
5. **Compliance**: Ensure logs meet GDPR/privacy requirements

### Log Monitoring & Alerting

#### Integration with Monitoring Tools
- **Sentry**: Error tracking and alerting
- **Datadog**: Log aggregation and monitoring
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **CloudWatch**: AWS CloudWatch Logs
- **Google Cloud Logging**: GCP logging service

#### Alert Conditions
- Multiple failed login attempts
- High error rate (>5% of requests)
- Slow API responses (>2 seconds)
- Database connection failures
- External API failures (Gemini, Email)
- Unusual activity patterns

### Log Analysis Queries

Example queries for log analysis:
```javascript
// Find all failed login attempts in last hour
{ level: "warn", service: "auth", event: "login_failed", timestamp: { $gte: "1 hour ago" } }

// Find slow API requests
{ service: "api", responseTime: { $gt: 2000 } }

// Find all errors for a specific user
{ userId: "user123", level: "error" }

// Find budget alerts sent
{ service: "budgets", event: "budget_alert_sent" }
```

### Best Practices

1. **Log at Appropriate Levels**: Use correct log levels
2. **Include Context**: Always include relevant context
3. **Structured Format**: Use JSON for machine parsing
4. **Performance**: Don't log in tight loops
5. **Privacy**: Sanitize sensitive information
6. **Consistency**: Use consistent log format across services
7. **Monitoring**: Set up log monitoring and alerts
8. **Retention**: Follow data retention policies

---

## File Storage & Upload Management (Cloudinary)

### Overview
FinMan uses Cloudinary for secure, scalable file storage and management. Cloudinary provides image optimization, transformation, and delivery features perfect for receipt management and document storage.

### Why Cloudinary?
- **Image Optimization**: Automatic compression and format conversion
- **Transformations**: On-the-fly image resizing, cropping, and effects
- **CDN Delivery**: Fast global content delivery
- **Secure Upload**: Signed uploads and access control
- **Video Support**: Can handle video files if needed
- **Free Tier**: Generous free tier for development
- **Easy Integration**: Simple SDK for Next.js

### Use Cases
1. **Receipt Images**: Store and optimize receipt photos
2. **Document Attachments**: Store financial documents
3. **User Avatars**: Profile picture storage (if needed)
4. **Report Exports**: Store generated PDF reports temporarily

### Setup

#### Step 1: Install Dependencies
```bash
npm install cloudinary
npm install multer @types/multer
```

#### Step 2: Cloudinary Configuration
Create `lib/config/cloudinary.config.ts`:
```typescript
export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  secure: process.env.CLOUDINARY_SECURE === 'true' || true,
};
```

#### Step 3: Environment Variables
Add to `.env`:
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_SECURE=true

# File Upload Settings
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf
UPLOAD_FOLDER=finman/receipts
```

#### Step 4: Cloudinary Service
Create `lib/services/cloudinary.service.ts`:
```typescript
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { cloudinaryConfig } from '@/lib/config/cloudinary.config';

// Initialize Cloudinary
    cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
  secure: cloudinaryConfig.secure,
});

  /**
   * Upload file to Cloudinary
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'finman/receipts',
    userId?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder: userId ? `${folder}/${userId}` : folder,
        resource_type: 'auto', // auto-detect image, video, or raw
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        transformation: [
          {
            quality: 'auto:good',
            fetch_format: 'auto',
          },
        ],
      };

      // For images, add optimization
      if (file.mimetype.startsWith('image/')) {
        uploadOptions.transformation.push({
          width: 2000,
          height: 2000,
          crop: 'limit',
        });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Upload file from URL
   */
  async uploadFromUrl(url: string, folder: string = 'finman/receipts', userId?: string): Promise<UploadApiResponse> {
    const uploadOptions: any = {
      folder: userId ? `${folder}/${userId}` : folder,
      resource_type: 'auto',
      transformation: [
        {
          quality: 'auto:good',
          fetch_format: 'auto',
        },
      ],
    };

    return cloudinary.uploader.upload(url, uploadOptions);
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  /**
   * Get optimized image URL
   */
  getOptimizedUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  }): string {
    const defaultOptions = {
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options,
    };

    return cloudinary.url(publicId, defaultOptions);
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(publicId: string, width: number = 300, height: number = 300): string {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto:good',
      fetch_format: 'auto',
    });
  }

  /**
   * Generate signed upload URL for client-side uploads
   */
  generateUploadSignature(folder: string, userId: string): {
    signature: string;
    timestamp: number;
    folder: string;
  } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folderPath = `finman/receipts/${userId}`;

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: folderPath,
      },
      cloudinaryConfig.apiSecret,
    );

    return {
      signature,
      timestamp,
      folder: folderPath,
    };
  }

  /**
   * Extract file information
   */
  extractFileInfo(cloudinaryResponse: UploadApiResponse) {
    return {
      publicId: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
      width: cloudinaryResponse.width,
      height: cloudinaryResponse.height,
      format: cloudinaryResponse.format,
      resourceType: cloudinaryResponse.resource_type,
      bytes: cloudinaryResponse.bytes,
      createdAt: cloudinaryResponse.created_at,
    };
  }
}
```

#### Step 5: File Upload Validation Utility
Create `lib/utils/file-validation.ts`:
```typescript
import { logger } from '@/lib/services/logger.service';

export function validateFile(file: File): void {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB default
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf').split(',');

  // Check file size
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
  }

  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Check MIME type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];
  
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error(`MIME type not allowed: ${file.type}`);
  }
}

export function validateFiles(files: File[]): void {
  files.forEach((file) => validateFile(file));
}
  }

  private validateFile(file: Express.Multer.File): void {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];

    // Check file size
    if (file.size > maxSize) {
      this.logger.warn('File upload rejected: size too large', 'upload', {
        fileName: file.originalname,
        fileSize: file.size,
        maxSize,
      });
      throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
    }

    // Check MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      this.logger.warn('File upload rejected: invalid type', 'upload', {
        fileName: file.originalname,
        mimeType: file.mimetype,
        allowedTypes: allowedMimeTypes,
      });
      throw new Error(`File type ${file.mimetype} is not allowed`);
    }

    // Additional validation: Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      this.logger.warn('File upload rejected: invalid extension', 'upload', {
        fileName: file.originalname,
        extension: fileExtension,
      });
      throw new Error(`File extension ${fileExtension} is not allowed`);
    }
  }
}
```

#### Step 6: Receipt Upload API Routes
Create `app/api/v1/receipts/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { cloudinaryService } from '@/lib/services/cloudinary.service';
import { receiptsService } from '@/lib/services/receipts.service';
import { logger } from '@/lib/services/logger.service';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary
    const uploadResult = await cloudinaryService.uploadFile(
      { buffer, originalname: file.name, mimetype: file.type } as any,
        'finman/receipts',
        user.id,
      );

    const fileInfo = cloudinaryService.extractFileInfo(uploadResult);

      // Save receipt metadata to database
    const receipt = await receiptsService.create({
        userId: user.id,
      fileName: file.name,
        filePath: fileInfo.url,
        publicId: fileInfo.publicId,
        fileSize: fileInfo.bytes,
      mimeType: file.type,
        cloudinaryData: {
          publicId: fileInfo.publicId,
          url: fileInfo.url,
          width: fileInfo.width,
          height: fileInfo.height,
          format: fileInfo.format,
        },
      });

      // Log upload
    logger.logTransaction('receipt_uploaded', user.id, receipt._id.toString(), {
      fileName: file.name,
        fileSize: file.size,
        publicId: fileInfo.publicId,
      });

    return NextResponse.json({
        success: true,
        data: receipt,
        message: 'Receipt uploaded successfully',
    });
  } catch (error: any) {
    logger.logError(error, 'receipts', {
      userId: user?.id,
    });
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/receipts/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { receiptsService } from '@/lib/services/receipts.service';
import { cloudinaryService } from '@/lib/services/cloudinary.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const receipt = await receiptsService.findOne(params.id, user.id);
    
    // Get optimized URL
    if (receipt.cloudinaryData?.publicId) {
      receipt.optimizedUrl = cloudinaryService.getOptimizedUrl(
        receipt.cloudinaryData.publicId,
        { width: 1200, quality: 'auto:good' },
      );
      receipt.thumbnailUrl = cloudinaryService.getThumbnailUrl(
        receipt.cloudinaryData.publicId,
        300,
        300,
      );
    }

    return NextResponse.json({
      success: true,
      data: receipt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const receipt = await receiptsService.findOne(params.id, user.id);

    // Delete from Cloudinary
    if (receipt.cloudinaryData?.publicId) {
      await cloudinaryService.deleteFile(receipt.cloudinaryData.publicId);
    }

    // Delete from database
    await receiptsService.remove(params.id, user.id);

    return NextResponse.json({
      success: true,
      message: 'Receipt deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```
```

#### Step 7: Update Receipt Schema
Update `models/Receipt.ts`:
```typescript
import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', index: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  publicId: { type: String, required: true, index: true }, // Cloudinary public ID
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  cloudinaryData: {
    publicId: String,
    url: String,
    width: Number,
    height: Number,
    format: String,
  },
  extractedData: {
    merchant: String,
    amount: Number,
    date: Date,
    items: [{
      name: String,
      price: Number,
      quantity: Number,
    }],
    aiProcessed: Boolean,
  },
}, { timestamps: true });

// Indexes
ReceiptSchema.index({ userId: 1, createdAt: -1 });
ReceiptSchema.index({ transactionId: 1 });
ReceiptSchema.index({ publicId: 1 });
```

#### Step 8: Using Cloudinary Service
**Note**: In Next.js, no module file is needed. Simply import `cloudinaryService` from `@/lib/services/cloudinary.service` where needed.

### File Upload Best Practices

#### 1. File Validation
- **Size Limit**: Maximum 5MB per file
- **Type Validation**: Only JPG, JPEG, PNG, PDF
- **Content Validation**: Verify file content matches extension
- **Virus Scanning**: Consider adding virus scanning for production

#### 2. Security
- **Signed Uploads**: Use signed uploads for client-side uploads
- **Access Control**: Restrict file access by user
- **Rate Limiting**: Limit upload frequency per user
- **File Naming**: Use secure, unique file names

#### 3. Optimization
- **Automatic Compression**: Cloudinary automatically optimizes images
- **Format Conversion**: Convert to WebP for better performance
- **Responsive Images**: Generate multiple sizes for different devices
- **Lazy Loading**: Load images on demand

#### 4. Error Handling
- **Upload Failures**: Handle Cloudinary API errors gracefully
- **Retry Logic**: Implement retry for transient failures
- **Fallback**: Have fallback storage option
- **Logging**: Log all upload attempts and failures

### Cloudinary Transformations

#### Common Transformations
```typescript
// Thumbnail (300x300)
cloudinary.url(publicId, {
  width: 300,
  height: 300,
  crop: 'fill',
  quality: 'auto:good',
});

// Optimized for web (1200px width)
cloudinary.url(publicId, {
  width: 1200,
  quality: 'auto:good',
  fetch_format: 'auto',
});

// PDF conversion
cloudinary.url(publicId, {
  format: 'pdf',
  quality: 'auto:best',
});

// Watermark (if needed)
cloudinary.url(publicId, {
  overlay: 'watermark',
  width: 100,
  opacity: 50,
  gravity: 'south_east',
});
```

### Receipt Processing Workflow

1. **Upload**: User uploads receipt image
2. **Validation**: Validate file type and size
3. **Cloudinary Upload**: Upload to Cloudinary with optimization
4. **Database Save**: Save metadata to MongoDB
5. **AI Processing**: Process with Gemini Vision API (optional)
6. **Data Extraction**: Extract merchant, amount, date
7. **Transaction Link**: Link to transaction if applicable

### Environment Variables Summary
```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_SECURE=true

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf
UPLOAD_FOLDER=finman/receipts
```

### Cost Considerations

- **Free Tier**: 25GB storage, 25GB bandwidth/month
- **Paid Plans**: Based on storage and bandwidth usage
- **Optimization**: Use transformations to reduce bandwidth
- **Cleanup**: Delete unused files regularly

### Monitoring & Logging

- Log all upload attempts (success and failure)
- Track file sizes and types
- Monitor Cloudinary API usage
- Alert on upload failures
- Track storage usage

---

## Project Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher) or MongoDB Atlas account
- npm or yarn
- Google Cloud account (for Gemini API)

### Step 1: Initialize Next.js Project
```bash
npx create-next-app@latest finman --typescript --tailwind --app --no-src-dir
cd finman
```

### Step 2: Install Dependencies

#### Core Dependencies
```bash
npm install mongoose bcryptjs jsonwebtoken
npm install zod react-hook-form @hookform/resolvers
npm install axios socket.io-client
npm install date-fns date-fns-tz
npm install winston winston-daily-rotate-file
npm install nodemailer
npm install @google/generative-ai
npm install cloudinary
npm install xlsx pdfkit csv-parser
npm install i18next react-i18next
```

#### State Management Dependencies
```bash
# Redux Toolkit for state management
npm install @reduxjs/toolkit react-redux

# Redux Persist for state persistence
npm install redux-persist

# For React Native: AsyncStorage for Redux Persist
npm install @react-native-async-storage/async-storage

# For Web: localStorage is built-in, but redux-persist handles it automatically
```

#### Radix UI Components
```bash
# Dialog and Modal Components
npm install @radix-ui/react-dialog
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-popover
npm install @radix-ui/react-dropdown-menu

# Form Components
npm install @radix-ui/react-select
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-switch
npm install @radix-ui/react-slider
npm install @radix-ui/react-label
npm install @radix-ui/react-tabs

# Feedback Components
npm install @radix-ui/react-toast
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-progress
npm install @radix-ui/react-hover-card

# Navigation Components
npm install @radix-ui/react-navigation-menu
npm install @radix-ui/react-accordion

# Layout Components
npm install @radix-ui/react-separator
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-avatar
npm install @radix-ui/react-collapsible

# Utility Libraries
npm install class-variance-authority
npm install clsx tailwind-merge
```

#### Development Dependencies
```bash
# Core dependencies
npm install mongoose
npm install bcryptjs
npm install jsonwebtoken
npm install zod  # For validation
npm install next-auth  # For authentication
npm install @google/generative-ai
npm install date-fns date-fns-tz
npm install nodemailer
npm install handlebars
npm install winston winston-daily-rotate-file
npm install cloudinary
npm install csv-writer csv-parse
npm install xlsx exceljs
npm install pdfkit
npm install socket.io socket.io-client
npm install otplib speakeasy qrcode
npm install passport passport-google-oauth20 passport-facebook
npm install i18next i18next-browser-languagedetector react-i18next
npm install moment-timezone
npm install next-pwa react-swipeable idb
npm install node-cache @next/bundle-analyzer
npm install react-intersection-observer @tanstack/react-query
npm install dotenv zod
npm install @aws-sdk/client-secrets-manager  # For AWS Secrets Manager (optional)

# Development dependencies
npm install -D @types/node @types/bcryptjs @types/jsonwebtoken
npm install -D @types/nodemailer
npm install -D @types/passport-google-oauth20
npm install -D @types/passport-facebook
npm install -D @types/qrcode
npm install -D eslint prettier
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D @types/node-vault  # For HashiCorp Vault (optional)
```

### Step 3: Environment Configuration

#### Environment-Specific Configurations

FinMan uses environment-specific configurations for development, staging, and production environments. Each environment has its own configuration file and security settings.

##### Environment Files Structure
```
.env                    # Default/fallback (gitignored)
.env.local              # Local overrides (gitignored)
.env.development        # Development environment
.env.staging            # Staging environment
.env.production         # Production environment (gitignored)
.env.example            # Template (committed to git)
```

#### Development Environment Setup

Create `.env.development`:
```env
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
API_URL=http://localhost:3000/api

# Database
MONGODB_URI=mongodb://localhost:27017/finman_dev
MONGODB_DB_NAME=finman_dev

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Gemini AI
GEMINI_API_KEY=your-dev-gemini-api-key
GEMINI_MODEL=gemini-pro

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=dev-email@gmail.com
EMAIL_PASSWORD=dev-app-password
EMAIL_FROM=noreply-dev@finman.finance
EMAIL_REPLY_TO=support-dev@finman.finance
EMAIL_FROM_NAME=FinMan Dev
EMAIL_BASE_URL=http://localhost:3000
EMAIL_ENABLED=true

# Logging
LOG_LEVEL=debug
LOG_DIR=./logs
LOG_MAX_SIZE=10m
LOG_MAX_FILES=7d
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=true

# Cloudinary (Development)
CLOUDINARY_CLOUD_NAME=dev-cloud-name
CLOUDINARY_API_KEY=dev-api-key
CLOUDINARY_API_SECRET=dev-api-secret
CLOUDINARY_SECURE=false
CLOUDINARY_FOLDER=finman/dev

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf
UPLOAD_DEST=./uploads/dev

# 2FA
ENCRYPTION_KEY=dev-32-byte-hex-key-generate-with-openssl
APP_NAME=FinMan Dev
2FA_ENABLED=true
2FA_ISSUER=FinMan-Dev

# OAuth (Development)
GOOGLE_CLIENT_ID=dev-google-client-id
GOOGLE_CLIENT_SECRET=dev-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

FACEBOOK_APP_ID=dev-facebook-app-id
FACEBOOK_APP_SECRET=dev-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/v1/auth/facebook/callback

# Analytics (Optional)
ANALYTICS_ENABLED=false
ANALYTICS_DEBUG=true

# Performance
ENABLE_CACHE=false
CACHE_TTL=300
REDIS_URL=redis://localhost:6379

# Debugging
DEBUG=true
VERBOSE_LOGGING=true
SHOW_ERROR_STACK=true
```

#### Staging Environment Configuration

Create `.env.staging`:
```env
# Application
NODE_ENV=staging
PORT=3000
APP_URL=https://staging.finman.finance
API_URL=https://staging.finman.finance/api

# Database
MONGODB_URI=mongodb+srv://staging-user:staging-password@cluster.mongodb.net/finman_staging
MONGODB_DB_NAME=finman_staging

# JWT
JWT_SECRET=staging-secret-key-use-strong-random-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Gemini AI
GEMINI_API_KEY=staging-gemini-api-key
GEMINI_MODEL=gemini-pro

# CORS
CORS_ORIGIN=https://staging.finman.finance
CORS_CREDENTIALS=true

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER=staging-email@gmail.com
EMAIL_PASSWORD=staging-app-password
EMAIL_FROM=noreply-staging@finman.finance
EMAIL_REPLY_TO=support-staging@finman.finance
EMAIL_FROM_NAME=FinMan Staging
EMAIL_BASE_URL=https://staging.finman.finance
EMAIL_ENABLED=true

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
LOG_MAX_SIZE=50m
LOG_MAX_FILES=30d
LOG_ENABLE_CONSOLE=false
LOG_ENABLE_FILE=true

# Cloudinary (Staging)
CLOUDINARY_CLOUD_NAME=staging-cloud-name
CLOUDINARY_API_KEY=staging-api-key
CLOUDINARY_API_SECRET=staging-api-secret
CLOUDINARY_SECURE=true
CLOUDINARY_FOLDER=finman/staging

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf
UPLOAD_DEST=./uploads/staging

# 2FA
ENCRYPTION_KEY=staging-32-byte-hex-key-generate-with-openssl
APP_NAME=FinMan Staging
2FA_ENABLED=true
2FA_ISSUER=FinMan-Staging

# OAuth (Staging)
GOOGLE_CLIENT_ID=staging-google-client-id
GOOGLE_CLIENT_SECRET=staging-google-client-secret
GOOGLE_CALLBACK_URL=https://staging.finman.finance/api/v1/auth/google/callback

FACEBOOK_APP_ID=staging-facebook-app-id
FACEBOOK_APP_SECRET=staging-facebook-app-secret
FACEBOOK_CALLBACK_URL=https://staging.finman.finance/api/v1/auth/facebook/callback

# Analytics
ANALYTICS_ENABLED=true
ANALYTICS_DEBUG=false

# Performance
ENABLE_CACHE=true
CACHE_TTL=600
REDIS_URL=redis://staging-redis:6379

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
HTTPS_ONLY=true
SECURE_COOKIES=true
```

#### Production Environment Hardening

Create `.env.production`:
```env
# Application
NODE_ENV=production
PORT=3000
APP_URL=https://finman.finance
API_URL=https://finman.finance/api

# Database
MONGODB_URI=mongodb+srv://prod-user:${MONGODB_PASSWORD}@cluster.mongodb.net/finman_prod?retryWrites=true&w=majority
MONGODB_DB_NAME=finman_prod
MONGODB_SSL=true
MONGODB_REPLICA_SET=rs0

# JWT (Use strong secrets from secrets manager)
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

# Gemini AI
GEMINI_API_KEY=${GEMINI_API_KEY}
GEMINI_MODEL=gemini-pro

# CORS
CORS_ORIGIN=https://finman.finance
CORS_CREDENTIALS=true

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER=${EMAIL_USER}
EMAIL_PASSWORD=${EMAIL_PASSWORD}
EMAIL_FROM=noreply@finman.finance
EMAIL_REPLY_TO=support@finman.finance
EMAIL_FROM_NAME=FinMan
EMAIL_BASE_URL=https://finman.finance
EMAIL_ENABLED=true

# Logging
LOG_LEVEL=warn
LOG_DIR=/var/log/finman
LOG_MAX_SIZE=100m
LOG_MAX_FILES=90d
LOG_ENABLE_CONSOLE=false
LOG_ENABLE_FILE=true
LOG_ENABLE_REMOTE=true
LOG_REMOTE_ENDPOINT=${LOG_REMOTE_ENDPOINT}

# Cloudinary (Production)
CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
CLOUDINARY_SECURE=true
CLOUDINARY_FOLDER=finman/prod

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf
UPLOAD_DEST=/var/uploads/finman

# 2FA
ENCRYPTION_KEY=${ENCRYPTION_KEY}
APP_NAME=FinMan
2FA_ENABLED=true
2FA_ISSUER=FinMan

# OAuth (Production)
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
GOOGLE_CALLBACK_URL=https://finman.finance/api/v1/auth/google/callback

FACEBOOK_APP_ID=${FACEBOOK_APP_ID}
FACEBOOK_APP_SECRET=${FACEBOOK_APP_SECRET}
FACEBOOK_CALLBACK_URL=https://finman.finance/api/v1/auth/facebook/callback

# Analytics
ANALYTICS_ENABLED=true
ANALYTICS_DEBUG=false

# Performance
ENABLE_CACHE=true
CACHE_TTL=3600
REDIS_URL=${REDIS_URL}
REDIS_PASSWORD=${REDIS_PASSWORD}

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
HTTPS_ONLY=true
SECURE_COOKIES=true
HSTS_ENABLED=true
HSTS_MAX_AGE=31536000
CONTENT_SECURITY_POLICY=true

# Monitoring
SENTRY_DSN=${SENTRY_DSN}
SENTRY_ENVIRONMENT=production
MONITORING_ENABLED=true

# Backup
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
```

#### Environment Variable Management

##### Configuration Service

Create `lib/config/env.config.ts`:
```typescript
import { z } from 'zod';

// Define environment schema
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),

  // Database
  MONGODB_URI: z.string().url(),
  MONGODB_DB_NAME: z.string(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Gemini AI
  GEMINI_API_KEY: z.string(),
  GEMINI_MODEL: z.string().default('gemini-pro'),

  // CORS
  CORS_ORIGIN: z.string(),
  CORS_CREDENTIALS: z.string().transform((val) => val === 'true').default('true'),

  // Email
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string().transform(Number),
  EMAIL_SECURE: z.string().transform((val) => val === 'true'),
  EMAIL_USER: z.string().email(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_FROM: z.string().email(),
  EMAIL_REPLY_TO: z.string().email().optional(),
  EMAIL_FROM_NAME: z.string(),
  EMAIL_BASE_URL: z.string().url(),
  EMAIL_ENABLED: z.string().transform((val) => val === 'true').default('true'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_DIR: z.string().default('./logs'),
  LOG_MAX_SIZE: z.string().default('20m'),
  LOG_MAX_FILES: z.string().default('30d'),
  LOG_ENABLE_CONSOLE: z.string().transform((val) => val === 'true').default('true'),
  LOG_ENABLE_FILE: z.string().transform((val) => val === 'true').default('true'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_SECURE: z.string().transform((val) => val === 'true').default('true'),
  CLOUDINARY_FOLDER: z.string().default('finman'),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'),
  ALLOWED_FILE_TYPES: z.string().default('jpg,jpeg,png,pdf'),
  UPLOAD_DEST: z.string().default('./uploads'),

  // 2FA
  ENCRYPTION_KEY: z.string().length(64), // 32 bytes = 64 hex chars
  APP_NAME: z.string().default('FinMan'),
  2FA_ENABLED: z.string().transform((val) => val === 'true').default('true'),
  2FA_ISSUER: z.string().default('FinMan'),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),

  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  FACEBOOK_CALLBACK_URL: z.string().url().optional(),

  // Analytics
  ANALYTICS_ENABLED: z.string().transform((val) => val === 'true').default('false'),
  ANALYTICS_DEBUG: z.string().transform((val) => val === 'true').default('false'),

  // Performance
  ENABLE_CACHE: z.string().transform((val) => val === 'true').default('false'),
  CACHE_TTL: z.string().transform(Number).default('300'),
  REDIS_URL: z.string().url().optional(),

  // Security
  RATE_LIMIT_ENABLED: z.string().transform((val) => val === 'true').default('true'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('15'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  HTTPS_ONLY: z.string().transform((val) => val === 'true').default('false'),
  SECURE_COOKIES: z.string().transform((val) => val === 'true').default('false'),
});

// Validate and parse environment variables
export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

// Export validated config
export const env = validateEnv();
```

##### Environment Loader

Create `lib/config/env-loader.ts`:
```typescript
import { config } from 'dotenv';
import { resolve } from 'path';

export function loadEnv() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Load base .env file
  config({ path: resolve(process.cwd(), '.env') });
  
  // Load environment-specific file
  config({ path: resolve(process.cwd(), `.env.${nodeEnv}`) });
  
  // Load .env.local for local overrides (highest priority)
  config({ path: resolve(process.cwd(), '.env.local') });
  
  // Validate required variables
  validateRequiredEnv();
}

function validateRequiredEnv() {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GEMINI_API_KEY',
  ];
  
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// Load on import
loadEnv();
```

#### Configuration Validation

##### Runtime Validation
```typescript
// lib/config/config.service.ts
import { env } from './env.config';

export class ConfigService {
  private static instance: ConfigService;
  private config: ReturnType<typeof env>;

  private constructor() {
    this.config = env;
    this.validate();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private validate() {
    // Additional validation logic
    if (this.config.NODE_ENV === 'production') {
      if (!this.config.JWT_SECRET || this.config.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters in production');
      }
      
      if (!this.config.ENCRYPTION_KEY || this.config.ENCRYPTION_KEY.length !== 64) {
        throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
      }
      
      if (this.config.HTTPS_ONLY === false) {
        console.warn('⚠️  HTTPS_ONLY is disabled in production. This is not recommended.');
      }
    }
  }

  get(key: keyof typeof env) {
    return this.config[key];
  }

  isDevelopment() {
    return this.config.NODE_ENV === 'development';
  }

  isStaging() {
    return this.config.NODE_ENV === 'staging';
  }

  isProduction() {
    return this.config.NODE_ENV === 'production';
  }
}

export const configService = ConfigService.getInstance();
```

#### Secrets Management

##### Using Environment Variables (Development/Staging)
```bash
# .env.local (gitignored)
JWT_SECRET=your-secret-here
ENCRYPTION_KEY=your-encryption-key-here
```

##### Using Secrets Manager (Production)

**AWS Secrets Manager**:
```typescript
// lib/config/secrets-manager.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export async function loadSecretsFromAWS() {
  if (process.env.NODE_ENV !== 'production') {
    return; // Only use in production
  }

  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || 'us-east-1',
  });

  try {
    const command = new GetSecretValueCommand({
      SecretId: process.env.AWS_SECRET_NAME || 'finman/production',
    });

    const response = await client.send(command);
    const secrets = JSON.parse(response.SecretString || '{}');

    // Merge secrets into environment
    Object.assign(process.env, secrets);
  } catch (error) {
    console.error('Failed to load secrets from AWS:', error);
    throw error;
  }
}
```

**HashiCorp Vault**:
```typescript
// lib/config/vault.ts
import { Vault } from 'node-vault';

export async function loadSecretsFromVault() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const vault = Vault({
    endpoint: process.env.VAULT_ADDR,
    token: process.env.VAULT_TOKEN,
  });

  try {
    const secrets = await vault.read('secret/data/finman/production');
    const data = secrets.data.data;
    
    Object.assign(process.env, data);
  } catch (error) {
    console.error('Failed to load secrets from Vault:', error);
    throw error;
  }
}
```

##### Docker Secrets
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    image: finman:latest
    environment:
      - NODE_ENV=production
    secrets:
      - jwt_secret
      - encryption_key
      - mongodb_password

secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  encryption_key:
    file: ./secrets/encryption_key.txt
  mongodb_password:
    file: ./secrets/mongodb_password.txt
```

#### Environment-Specific Next.js Config

Create `next.config.js` with environment support:
```javascript
/** @type {import('next').NextConfig} */

const isDevelopment = process.env.NODE_ENV === 'development';
const isStaging = process.env.NODE_ENV === 'staging';
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Development settings
  ...(isDevelopment && {
    reactStrictMode: true,
    swcMinify: false,
    compiler: {
      removeConsole: false,
    },
  }),

  // Staging settings
  ...(isStaging && {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'],
      },
    },
  }),

  // Production settings
  ...(isProduction && {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
      removeConsole: true,
    },
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
  }),

  // Common settings
  images: {
    domains: ['res.cloudinary.com'],
  },

  // Environment variables exposed to client
  env: {
    APP_URL: process.env.APP_URL,
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
  },

  // Headers for security
  async headers() {
    const headers = [];

    if (isProduction) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      });
    }

    return headers;
  },
};

module.exports = nextConfig;
```

#### .env.example Template

Create `.env.example`:
```env
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
API_URL=http://localhost:3000/api

# Database
MONGODB_URI=mongodb://localhost:27017/finman
MONGODB_DB_NAME=finman

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@finman.finance
EMAIL_REPLY_TO=support@finman.finance
EMAIL_FROM_NAME=FinMan
EMAIL_BASE_URL=http://localhost:3000
EMAIL_ENABLED=true

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
LOG_MAX_SIZE=20m
LOG_MAX_FILES=30d
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=true

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_SECURE=true
CLOUDINARY_FOLDER=finman

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf
UPLOAD_DEST=./uploads

# 2FA
ENCRYPTION_KEY=generate-with-openssl-rand-hex-32
APP_NAME=FinMan
2FA_ENABLED=true
2FA_ISSUER=FinMan

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/v1/auth/facebook/callback

# Analytics (Optional)
ANALYTICS_ENABLED=false
ANALYTICS_DEBUG=false

# Performance
ENABLE_CACHE=false
CACHE_TTL=300
REDIS_URL=redis://localhost:6379

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
HTTPS_ONLY=false
SECURE_COOKIES=false
```

#### Environment Setup Script

Create `scripts/setup-env.sh`:
```bash
#!/bin/bash

# Setup environment script

echo "🚀 Setting up FinMan environment..."

# Check Node.js version
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# Generate encryption key if not exists
if [ -z "$ENCRYPTION_KEY" ]; then
  echo "Generating encryption key..."
  ENCRYPTION_KEY=$(openssl rand -hex 32)
  echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> .env.local
fi

# Generate JWT secret if not exists
if [ -z "$JWT_SECRET" ]; then
  echo "Generating JWT secret..."
  JWT_SECRET=$(openssl rand -hex 32)
  echo "JWT_SECRET=$JWT_SECRET" >> .env.local
fi

# Copy .env.example if .env doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
fi

echo "✅ Environment setup complete!"
echo "📝 Please review and update .env file with your configuration"
```

#### Best Practices

1. **Never commit secrets**: Use `.gitignore` for `.env*` files (except `.env.example`)
2. **Use strong secrets**: Generate secrets with `openssl rand -hex 32`
3. **Validate on startup**: Validate all required environment variables
4. **Use secrets manager**: Use AWS Secrets Manager or Vault in production
5. **Environment isolation**: Keep development, staging, and production separate
6. **Documentation**: Document all environment variables in `.env.example`
7. **Rotation**: Rotate secrets regularly in production
8. **Monitoring**: Monitor for missing or invalid environment variables

**Generate Encryption Key**:
```bash
# Generate 32-byte hex key for encryption
openssl rand -hex 32
```

### Step 4: Database Setup
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Create account at https://www.mongodb.com/cloud/atlas
```

### Step 5: Project Structure Setup
Create the directory structure as outlined in the Architecture section.

### Step 6: Run Application
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm run start
```

### Step 7: Next.js Configuration
Create `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

module.exports = nextConfig;
```

### Step 8: Data Migration & Seeding

#### Database Migration Strategy

##### Migration Scripts
Create `scripts/migrations/` directory:
```
scripts/
├── migrations/
│   ├── 001-initial-schema.ts
│   ├── 002-add-2fa-fields.ts
│   ├── 003-add-oauth-fields.ts
│   └── index.ts
└── seed.ts
```

##### Migration Runner
Create `scripts/migrations/index.ts`:
```typescript
import mongoose from 'mongoose';
import { readdirSync } from 'fs';
import { join } from 'path';

interface Migration {
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

const migrations: Migration[] = [];

// Load all migration files
const migrationFiles = readdirSync(__dirname)
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
  .sort();

for (const file of migrationFiles) {
  const migration = require(join(__dirname, file));
  migrations.push(migration);
}

export async function runMigrations() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const MigrationLog = mongoose.model('MigrationLog', new mongoose.Schema({
    name: String,
    executedAt: Date,
  }));

  for (const migration of migrations) {
    const executed = await MigrationLog.findOne({ name: migration.name });
    
    if (!executed) {
      console.log(`Running migration: ${migration.name}`);
      await migration.up();
      await MigrationLog.create({
        name: migration.name,
        executedAt: new Date(),
      });
      console.log(`✓ Migration ${migration.name} completed`);
    }
  }

  await mongoose.disconnect();
}

export async function rollbackMigration(migrationName: string) {
  await mongoose.connect(process.env.MONGODB_URI!);

  const migration = migrations.find((m) => m.name === migrationName);
  if (!migration) {
    throw new Error(`Migration ${migrationName} not found`);
  }

  await migration.down();
  
  const MigrationLog = mongoose.model('MigrationLog');
  await MigrationLog.deleteOne({ name: migrationName });

  await mongoose.disconnect();
}
```

##### Example Migration
Create `scripts/migrations/001-initial-schema.ts`:
```typescript
import mongoose from 'mongoose';

export const name = '001-initial-schema';

export async function up() {
  // Create indexes if they don't exist
  const Transaction = mongoose.model('Transaction');
  await Transaction.collection.createIndex({ userId: 1, date: -1 });
  await Transaction.collection.createIndex({ userId: 1, type: 1 });
  
  // Add any schema changes
  // Note: Mongoose handles schema changes automatically
}

export async function down() {
  // Rollback logic
  const Transaction = mongoose.model('Transaction');
  await Transaction.collection.dropIndex('userId_1_date_-1');
}
```

#### Seed Data Scripts

##### Seed Script
Create `scripts/seed.ts`:
```typescript
import mongoose from 'mongoose';
import { User } from '@/models/User';
import { Category } from '@/models/Category';
import bcrypt from 'bcrypt';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);

  // Seed default categories
  const defaultCategories = [
    { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#FF6B6B' },
    { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#4ECDC4' },
    { name: 'Transportation', type: 'expense', icon: '🚗', color: '#45B7D1' },
    { name: 'Bills & Utilities', type: 'expense', icon: '💡', color: '#FFA07A' },
    { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#98D8C8' },
    { name: 'Salary', type: 'income', icon: '💰', color: '#6C5CE7' },
    { name: 'Freelance', type: 'income', icon: '💼', color: '#A29BFE' },
    { name: 'Investment', type: 'income', icon: '📈', color: '#00B894' },
  ];

  console.log('Seeding default categories...');
  for (const category of defaultCategories) {
    await Category.findOneAndUpdate(
      { name: category.name },
      category,
      { upsert: true, new: true }
    );
  }

  // Create test user (optional)
  if (process.env.SEED_TEST_USER === 'true') {
    const hashedPassword = await bcrypt.hash('test123', 10);
    await User.findOneAndUpdate(
      { email: 'test@example.com' },
      {
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
      },
      { upsert: true, new: true }
    );
    console.log('✓ Test user created');
  }

  console.log('✓ Seeding completed');
  await mongoose.disconnect();
}

seed().catch(console.error);
```

##### Default Categories Setup
```typescript
// scripts/seed-categories.ts
import { Category } from '@/models/Category';

export const defaultCategories = {
  expense: [
    { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
    { name: 'Shopping', icon: '🛍️', color: '#4ECDC4' },
    { name: 'Transportation', icon: '🚗', color: '#45B7D1' },
    { name: 'Bills & Utilities', icon: '💡', color: '#FFA07A' },
    { name: 'Entertainment', icon: '🎬', color: '#98D8C8' },
    { name: 'Healthcare', icon: '🏥', color: '#FDCB6E' },
    { name: 'Education', icon: '📚', color: '#E17055' },
    { name: 'Travel', icon: '✈️', color: '#74B9FF' },
  ],
  income: [
    { name: 'Salary', icon: '💰', color: '#6C5CE7' },
    { name: 'Freelance', icon: '💼', color: '#A29BFE' },
    { name: 'Investment', icon: '📈', color: '#00B894' },
    { name: 'Business', icon: '🏢', color: '#55EFC4' },
    { name: 'Rental', icon: '🏠', color: '#81ECEC' },
  ],
};

export async function seedCategories(userId?: string) {
  for (const [type, categories] of Object.entries(defaultCategories)) {
    for (const category of categories) {
      await Category.findOneAndUpdate(
        { userId: userId || null, name: category.name, type },
        { ...category, type, userId: userId || null },
        { upsert: true, new: true }
      );
    }
  }
}
```

#### Data Backup Before Migration

```typescript
// scripts/backup.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupPath = `./backups/backup-${timestamp}.tar.gz`;
  
  await execAsync(
    `mongodump --uri="${process.env.MONGODB_URI}" --archive="${backupPath}" --gzip`
  );
  
  console.log(`✓ Backup created: ${backupPath}`);
  return backupPath;
}
```

#### Rollback Procedures

```typescript
// scripts/rollback.ts
import { restoreMigration } from './migrations';

export async function rollback(migrationName: string) {
  // 1. Backup current state
  await backupDatabase();
  
  // 2. Run migration down
  await restoreMigration(migrationName);
  
  // 3. Verify rollback
  console.log('✓ Rollback completed');
}
```

### Step 9: TypeScript Configuration
Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Next.js vs NestJS Code Conversion Guide

Since this documentation was originally written for NestJS, here's how to convert code examples to Next.js:

#### 1. Controllers → API Routes

**NestJS Controller:**
```typescript
@Controller('api/auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // ...
  }
}
```

**Next.js API Route:**
```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await authService.login(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

#### 2. Services → Service Files

**NestJS Service:**
```typescript
@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    // ...
  }
}
```

**Next.js Service:**
```typescript
// lib/services/auth.service.ts
export const authService = {
  async login(loginDto: LoginDto) {
    // ... same logic
  }
};
```

#### 3. Guards → Middleware/API Route Checks

**NestJS Guard:**
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user) {
  // ...
}
```

**Next.js API Route with Auth:**
```typescript
// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // ... get profile
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### 4. Middleware

**NestJS Interceptor:**
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // ...
  }
}
```

**Next.js Middleware:**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Logging, auth checks, etc.
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

#### 5. Modules → Not Needed

Next.js doesn't use modules. Services are imported directly where needed.

#### 6. Database Connection

**NestJS:**
```typescript
@Module({
  imports: [MongooseModule.forRoot(MONGODB_URI)],
})
```

**Next.js:**
```typescript
// lib/config/database.ts
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
```

---

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow NestJS conventions
- Use ESLint and Prettier
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

### Error Handling & Exception Management

#### Global Error Handling
Create `lib/utils/error-handler.ts`:
```typescript
import { NextResponse } from 'next/server';
import { logger } from '@/lib/services/logger.service';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(404, `${resource} not found${id ? ` with id: ${id}` : ''}`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    logger.error('Application error', {
      service: 'api',
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
      },
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
          details: error.details,
        },
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode }
    );
  }

  // Unknown error
  logger.error('Unknown error', {
    service: 'api',
    error: {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    },
  });

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}
```

#### Error Boundary for Frontend
Create `components/ErrorBoundary.tsx`:
```typescript
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/services/logger.service';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary caught error', {
      service: 'frontend',
      error: {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Standardized Error Response Format
```typescript
// lib/utils/error-response.ts
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    field?: string; // For validation errors
  };
  timestamp: string;
}

// Usage in API routes
export async function GET(request: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    return handleError(error);
  }
}
```

#### Validation Error Handling
```typescript
import { z } from 'zod';
import { ValidationError } from '@/lib/utils/error-handler';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  date: z.string().datetime(),
  description: z.string().optional(),
});

export function validateTransaction(data: any) {
  try {
    return transactionSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', {
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    throw error;
  }
}
```

#### Error Recovery Mechanisms
```typescript
// Retry logic for transient errors
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError!;
}
```

### Validation
- Use DTOs (Data Transfer Objects) with class-validator
- Validate all user inputs
- Sanitize data before database operations

### Testing
- Write unit tests for services
- Write integration tests for controllers
- Test API endpoints
- Aim for >80% code coverage

### Security Best Practices
- Hash passwords with bcrypt
- Use JWT for authentication
- Validate and sanitize all inputs
- Use HTTPS in production
- Implement rate limiting
- Protect against SQL injection (though using MongoDB)
- Secure file uploads
- Use environment variables for secrets

### API Response Format
```typescript
// Success response
{
  success: true,
  data: { ... },
  message: "Operation successful"
}

// Error response
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Error message",
    details: { ... }
  }
}
```

---

## Testing Strategy & Implementation

### Overview
Comprehensive testing is essential for maintaining code quality, preventing regressions, and ensuring reliability in FinMan. This section covers unit testing, integration testing, E2E testing, and testing best practices.

### Testing Setup

#### Step 1: Install Dependencies
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest-environment-jsdom @types/jest ts-jest
npm install --save-dev @playwright/test  # For E2E testing
npm install --save-dev msw  # Mock Service Worker for API mocking
```

#### Step 2: Jest Configuration
Create `jest.config.js`:
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### Step 3: Jest Setup File
Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
```

### Unit Testing

#### Service Testing Example
Create `lib/services/__tests__/transactions.service.test.ts`:
```typescript
import { transactionsService } from '../transactions.service';
import { Transaction } from '@/models/Transaction';
import { connectDB, disconnectDB } from '@/lib/database/connection';

// Mock MongoDB
jest.mock('@/models/Transaction');

describe('TransactionsService', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a transaction successfully', async () => {
      const mockTransaction = {
        _id: '123',
        userId: 'user123',
        type: 'expense',
        amount: 100,
        date: new Date(),
      };

      (Transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await transactionsService.create(
        {
          type: 'expense',
          amount: 100,
          date: new Date(),
        },
        'user123'
      );

      expect(result).toEqual(mockTransaction);
      expect(Transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'expense',
          amount: 100,
          userId: 'user123',
        })
      );
    });

    it('should throw error for invalid amount', async () => {
      await expect(
        transactionsService.create(
          {
            type: 'expense',
            amount: -100, // Invalid
            date: new Date(),
          },
          'user123'
        )
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated transactions', async () => {
      const mockTransactions = [
        { _id: '1', amount: 100 },
        { _id: '2', amount: 200 },
      ];

      (Transaction.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(mockTransactions),
            }),
          }),
        }),
      });

      (Transaction.countDocuments as jest.Mock).mockResolvedValue(2);

      const result = await transactionsService.findAll('user123', {
        page: 1,
        limit: 20,
      });

      expect(result.data).toEqual(mockTransactions);
      expect(result.total).toBe(2);
    });
  });
});
```

#### API Route Testing Example
Create `app/api/v1/transactions/__tests__/route.test.ts`:
```typescript
import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { transactionsService } from '@/lib/services/transactions.service';

jest.mock('@/lib/utils/auth');
jest.mock('@/lib/services/transactions.service');

describe('/api/v1/transactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return transactions for authenticated user', async () => {
      const mockUser = { id: 'user123' };
      (verifyToken as jest.Mock).mockResolvedValue(mockUser);

      const mockTransactions = [
        { _id: '1', amount: 100 },
        { _id: '2', amount: 200 },
      ];
      (transactionsService.findAll as jest.Mock).mockResolvedValue({
        data: mockTransactions,
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      const request = new NextRequest('http://localhost:3000/api/v1/transactions', {
        headers: {
          authorization: 'Bearer token123',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.data).toEqual(mockTransactions);
    });

    it('should return 401 for unauthenticated request', async () => {
      (verifyToken as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/v1/transactions');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});
```

### Integration Testing

#### Database Integration Tests
Create `tests/integration/transactions.integration.test.ts`:
```typescript
import { connectDB, disconnectDB } from '@/lib/database/connection';
import { transactionsService } from '@/lib/services/transactions.service';
import { Transaction } from '@/models/Transaction';
import { User } from '@/models/User';

describe('Transactions Integration', () => {
  let testUser: any;

  beforeAll(async () => {
    await connectDB();
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword',
      firstName: 'Test',
      lastName: 'User',
    });
  });

  afterAll(async () => {
    // Cleanup
    await Transaction.deleteMany({ userId: testUser._id });
    await User.deleteOne({ _id: testUser._id });
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean transactions before each test
    await Transaction.deleteMany({ userId: testUser._id });
  });

  it('should create and retrieve transaction', async () => {
    const transaction = await transactionsService.create(
      {
        type: 'expense',
        amount: 100,
        currency: 'USD',
        date: new Date(),
        description: 'Test transaction',
      },
      testUser._id.toString()
    );

    expect(transaction._id).toBeDefined();
    expect(transaction.amount).toBe(100);

    const retrieved = await transactionsService.findOne(
      transaction._id.toString(),
      testUser._id.toString()
    );

    expect(retrieved).toBeDefined();
    expect(retrieved?.amount).toBe(100);
  });
});
```

### E2E Testing with Playwright

#### Step 1: Playwright Configuration
Create `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Step 2: E2E Test Example
Create `tests/e2e/transactions.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Transactions', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should create a new transaction', async ({ page }) => {
    await page.goto('/transactions');
    await page.click('text=Add Transaction');
    
    await page.selectOption('select[name="type"]', 'expense');
    await page.fill('input[name="amount"]', '100');
    await page.fill('input[name="description"]', 'Test transaction');
    await page.fill('input[name="date"]', '2024-01-01');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Transaction created successfully')).toBeVisible();
    await expect(page.locator('text=Test transaction')).toBeVisible();
  });

  test('should filter transactions', async ({ page }) => {
    await page.goto('/transactions');
    await page.selectOption('select[name="type"]', 'expense');
    await page.click('button:has-text("Filter")');

    // Verify only expenses are shown
    const transactions = page.locator('[data-testid="transaction-item"]');
    const count = await transactions.count();
    
    for (let i = 0; i < count; i++) {
      await expect(transactions.nth(i).locator('[data-type]')).toHaveAttribute('data-type', 'expense');
    }
  });
});
```

### Mocking Strategies

#### Mock MongoDB
Create `tests/__mocks__/mongoose.ts`:
```typescript
export const mockModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  deleteMany: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
};

export const Transaction = mockModel;
export const User = mockModel;
export const Category = mockModel;
```

#### Mock External APIs
Create `tests/__mocks__/gemini.ts`:
```typescript
export const geminiService = {
  generateText: jest.fn().mockResolvedValue('Mocked AI response'),
  analyzeImage: jest.fn().mockResolvedValue('Mocked image analysis'),
  chat: jest.fn().mockResolvedValue('Mocked chat response'),
};
```

#### Mock Service Worker for API Mocking
Create `tests/mocks/handlers.ts`:
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/transactions', () => {
    return HttpResponse.json({
      success: true,
      data: {
        data: [
          { _id: '1', amount: 100, type: 'expense' },
          { _id: '2', amount: 200, type: 'income' },
        ],
        total: 2,
      },
    });
  }),

  http.post('/api/v1/transactions', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        _id: '123',
        ...body,
      },
    }, { status: 201 });
  }),
];
```

### Test Data Factories

#### Create Test Data Factory
Create `tests/factories/transaction.factory.ts`:
```typescript
import { Transaction } from '@/models/Transaction';

export const createTransactionFactory = (overrides = {}) => ({
  userId: 'user123',
  type: 'expense',
  amount: 100,
  currency: 'USD',
  date: new Date(),
  description: 'Test transaction',
  ...overrides,
});

export const createTestTransaction = async (overrides = {}) => {
  return await Transaction.create(createTransactionFactory(overrides));
};
```

### Testing Best Practices

1. **Test Isolation**: Each test should be independent
2. **Arrange-Act-Assert**: Follow AAA pattern
3. **Descriptive Names**: Use clear test descriptions
4. **Mock External Dependencies**: Don't test external services
5. **Test Edge Cases**: Test error conditions and boundaries
6. **Coverage Goals**: Aim for 70%+ code coverage
7. **Fast Tests**: Keep unit tests fast (< 100ms each)
8. **Clean Up**: Clean up test data after tests

### Test Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Performance Optimization

### Overview
FinMan implements comprehensive performance optimization strategies across frontend, backend, database, and infrastructure to ensure fast load times, smooth user experience, and efficient resource utilization.

### Frontend Optimization

#### Code Splitting

##### Route-Based Code Splitting
```typescript
// app/dashboard/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const TransactionsChart = dynamic(() => import('@/components/charts/TransactionsChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR for client-only components
});

const BudgetOverview = dynamic(() => import('@/components/budgets/BudgetOverview'), {
  loading: () => <BudgetSkeleton />,
});

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <TransactionsChart />
      <BudgetOverview />
    </div>
  );
}
```

##### Component-Based Code Splitting
```typescript
// Split large components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const Page = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
};
```

##### Library Splitting
```typescript
// next.config.js
module.exports = {
  webpack: (config) => {
    // Split vendor chunks
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        charts: {
          test: /[\\/]node_modules[\\/](recharts|chart\.js)[\\/]/,
          name: 'charts',
          priority: 20,
        },
      },
    };
    return config;
  },
};
```

#### Lazy Loading

##### Image Lazy Loading
```typescript
import Image from 'next/image';

const LazyImage = ({ src, alt }) => {
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
};
```

##### Component Lazy Loading
```typescript
// Load components only when visible
import { useInView } from 'react-intersection-observer';

const LazySection = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView ? children : <Placeholder />}
    </div>
  );
};
```

##### Data Lazy Loading
```typescript
// Infinite scroll for large lists
import { useInfiniteQuery } from '@tanstack/react-query';

const TransactionsList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['transactions'],
    queryFn: ({ pageParam = 0 }) => fetchTransactions(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return (
    <div>
      {data?.pages.map((page) => (
        page.transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};
```

#### Bundle Optimization

##### Tree Shaking
```typescript
// Import only what you need
import { format } from 'date-fns'; // ✅ Good
import * as dateFns from 'date-fns'; // ❌ Bad

// Use named exports
import { debounce } from 'lodash-es'; // ✅ Good
import _ from 'lodash'; // ❌ Bad
```

##### Bundle Analysis
```bash
# Analyze bundle size
npm install -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js config
});
```

### Backend Optimization

#### Query Optimization

##### MongoDB Query Optimization
```typescript
// Use indexes effectively
const transactions = await Transaction.find({ userId })
  .select('amount date categoryId description') // Only select needed fields
  .lean() // Return plain objects instead of Mongoose documents
  .limit(50)
  .sort({ date: -1 });

// Use aggregation for complex queries
const monthlyStats = await Transaction.aggregate([
  { $match: { userId, date: { $gte: startDate, $lte: endDate } } },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
      totalIncome: {
        $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
      },
      totalExpense: {
        $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
      },
    },
  },
  { $sort: { _id: 1 } },
]);
```

##### Index Strategy
```typescript
// Transaction schema with indexes
const TransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  type: { type: String, enum: ['income', 'expense'], index: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, index: true },
  categoryId: { type: Schema.Types.ObjectId, index: true },
  description: { type: String, index: 'text' },
});

// Compound indexes for common queries
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, categoryId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1, date: -1 });
```

##### Query Caching

#### Comprehensive Caching Strategy

##### Option 1: Node-Cache (In-Memory)
```typescript
// lib/services/cache.service.ts
import NodeCache from 'node-cache';

const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 60, // Check for expired keys every 60 seconds
  maxKeys: 1000, // Maximum number of keys
});

export const cacheService = {
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = cache.get<T>(key);
    if (cached) {
      return cached;
    }

    const data = await fetchFn();
    cache.set(key, data, ttl || 300);
    return data;
  },

  get<T>(key: string): T | undefined {
    return cache.get<T>(key);
  },

  set<T>(key: string, value: T, ttl?: number): void {
    cache.set(key, value, ttl);
  },

  invalidate(pattern: string): void {
    const keys = cache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        cache.del(key);
      }
    });
  },

  clear(): void {
    cache.flushAll();
  },

  getStats() {
    return cache.getStats();
  },
};
```

##### Option 2: Redis (Distributed Caching)
```typescript
// lib/services/redis-cache.service.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export const redisCacheService = {
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 300,
  ): Promise<T> {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    const data = await fetchFn();
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  },

  async get<T>(key: string): Promise<T | null> {
    const cached = await redis.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
  },

  async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },

  async clear(): Promise<void> {
    await redis.flushdb();
  },
};
```

##### What to Cache

1. **User Data** (TTL: 5 minutes)
```typescript
const userCacheKey = `user:${userId}`;
const user = await cacheService.getOrSet(
  userCacheKey,
  () => User.findById(userId).lean(),
  300
);
```

2. **Category Lists** (TTL: 10 minutes)
```typescript
const categoriesCacheKey = `categories:${userId}:${type}`;
const categories = await cacheService.getOrSet(
  categoriesCacheKey,
  () => Category.find({ userId, type }).lean(),
  600
);
```

3. **Reports & Analytics** (TTL: 15 minutes)
```typescript
const reportCacheKey = `report:${userId}:${startDate}:${endDate}`;
const report = await cacheService.getOrSet(
  reportCacheKey,
  () => generateMonthlyReport(userId, startDate, endDate),
  900
);
```

4. **Search Results** (TTL: 5 minutes)
```typescript
const searchCacheKey = `search:${userId}:${query}`;
const results = await cacheService.getOrSet(
  searchCacheKey,
  () => searchService.searchTransactions(userId, query),
  300
);
```

##### Cache Invalidation Strategies

```typescript
// lib/services/cache-invalidation.service.ts
export const cacheInvalidationService = {
  // Invalidate when transaction is created/updated/deleted
  async invalidateTransactionCache(userId: string) {
    await cacheService.invalidate(`transactions:${userId}`);
    await cacheService.invalidate(`reports:${userId}`);
    await cacheService.invalidate(`analytics:${userId}`);
  },

  // Invalidate when category is updated
  async invalidateCategoryCache(userId: string) {
    await cacheService.invalidate(`categories:${userId}`);
    await cacheService.invalidate(`transactions:${userId}`);
  },

  // Invalidate when budget is updated
  async invalidateBudgetCache(userId: string) {
    await cacheService.invalidate(`budgets:${userId}`);
    await cacheService.invalidate(`reports:${userId}`);
  },

  // Invalidate user-specific cache
  async invalidateUserCache(userId: string) {
    await cacheService.invalidate(`user:${userId}`);
  },
};
```

##### Cache Warming

```typescript
// lib/services/cache-warming.service.ts
export const cacheWarmingService = {
  async warmUserCache(userId: string) {
    // Pre-load frequently accessed data
    await cacheService.getOrSet(
      `user:${userId}`,
      () => User.findById(userId).lean(),
      300
    );

    await cacheService.getOrSet(
      `categories:${userId}`,
      () => Category.find({ userId }).lean(),
      600
    );
  },

  async warmPopularReports() {
    // Pre-generate popular reports
    const popularDateRanges = getPopularDateRanges();
    for (const range of popularDateRanges) {
      // Warm cache for common date ranges
    }
  },
};
```

##### Cache TTL Strategies

```typescript
// lib/config/cache-ttl.config.ts
export const cacheTTL = {
  user: 300, // 5 minutes
  categories: 600, // 10 minutes
  transactions: 300, // 5 minutes
  reports: 900, // 15 minutes
  analytics: 1800, // 30 minutes
  search: 300, // 5 minutes
  static: 3600, // 1 hour (for rarely changing data)
};
```

##### Distributed Caching Considerations

1. **Cache Key Naming**: Use consistent naming convention
   - Format: `{entity}:{identifier}:{filter}`
   - Example: `transactions:user123:type=expense`

2. **Cache Versioning**: Version cache keys for schema changes
   - Format: `v1:{entity}:{identifier}`
   - Example: `v1:transactions:user123`

3. **Cache Sharding**: Distribute cache across multiple Redis instances

4. **Cache Replication**: Replicate cache for high availability

#### API Response Time Optimization

##### Response Compression
```typescript
// next.config.js
const compression = require('compression');

module.exports = {
  // Next.js handles compression automatically
  compress: true,
  
  // Or use middleware
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Encoding',
            value: 'gzip',
          },
        ],
      },
    ];
  },
};
```

##### Pagination
```typescript
// Implement cursor-based pagination for better performance
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || '20');

  const query: any = {};
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const transactions = await Transaction.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = transactions.length > limit;
  const data = hasMore ? transactions.slice(0, limit) : transactions;
  const nextCursor = hasMore ? data[data.length - 1]._id : null;

  return NextResponse.json({
    data,
    pagination: {
      hasMore,
      nextCursor,
    },
  });
}
```

##### Batch Operations
```typescript
// Batch multiple operations
export async function batchCreateTransactions(
  transactions: CreateTransactionDto[],
  userId: string,
) {
  // Use bulk operations
  const operations = transactions.map((t) => ({
    insertOne: {
      document: { ...t, userId },
    },
  }));

  await Transaction.bulkWrite(operations);
}
```

### Image Optimization

#### Next.js Image Optimization
```typescript
import Image from 'next/image';

// Automatic optimization
<Image
  src="/receipt.jpg"
  alt="Receipt"
  width={800}
  height={600}
  quality={85}
  priority={false} // Only for above-the-fold images
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### Cloudinary Optimization
```typescript
// Use Cloudinary transformations
const optimizedUrl = cloudinary.url(publicId, {
  quality: 'auto',
  fetch_format: 'auto',
  width: 800,
  height: 600,
  crop: 'limit',
});
```

#### Image Formats
```typescript
// Serve modern formats (WebP, AVIF)
const getOptimizedImage = (src: string) => {
  // Use WebP if supported
  if (supportsWebP()) {
    return src.replace(/\.(jpg|jpeg|png)$/, '.webp');
  }
  return src;
};
```

### CDN Setup

#### Cloudinary CDN
```typescript
// lib/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Generate CDN URLs
export const getCDNUrl = (publicId: string, options?: any) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  });
};
```

#### Static Asset CDN
```typescript
// next.config.js
module.exports = {
  // Use CDN for static assets
  assetPrefix: process.env.CDN_URL || '',
  
  images: {
    domains: ['res.cloudinary.com', 'cdn.finman.finance'],
    loader: 'cloudinary',
  },
};
```

#### CDN Caching Strategy
```typescript
// Set cache headers for static assets
export async function GET(request: NextRequest) {
  const response = NextResponse.json(data);
  
  // Cache for 1 year
  response.headers.set(
    'Cache-Control',
    'public, max-age=31536000, immutable'
  );
  
  return response;
}
```

### Database Query Optimization

#### Index Optimization
```typescript
// Analyze query performance
const explainResult = await Transaction.find({ userId })
  .explain('executionStats');

console.log(explainResult.executionStats);

// Create indexes based on query patterns
await Transaction.collection.createIndex(
  { userId: 1, date: -1 },
  { name: 'userId_date_idx' }
);
```

#### Aggregation Pipeline Optimization
```typescript
// Optimize aggregation pipelines
const pipeline = [
  { $match: { userId, date: { $gte: startDate } } }, // Match early
  { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
  { $sort: { total: -1 } },
  { $limit: 10 },
];

// Use $facet for multiple aggregations in one query
const results = await Transaction.aggregate([
  { $match: { userId } },
  {
    $facet: {
      income: [
        { $match: { type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ],
      expenses: [
        { $match: { type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ],
    },
  },
]);
```

#### Connection Pooling
```typescript
// lib/config/database.ts
import mongoose from 'mongoose';

const options = {
  maxPoolSize: 10, // Maximum number of connections
  minPoolSize: 5, // Minimum number of connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(process.env.MONGODB_URI!, options);
```

#### Read Replicas (if using MongoDB Atlas)
```typescript
// Use read preferences for read-heavy operations
const transactions = await Transaction.find({ userId })
  .read('secondary') // Read from replica
  .lean();
```

### API Response Time Optimization

#### Response Caching
```typescript
// Cache API responses
export async function GET(request: NextRequest) {
  const cacheKey = `api:${request.nextUrl.pathname}:${request.nextUrl.search}`;
  const cached = await cache.get(cacheKey);
  
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        'X-Cache': 'HIT',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
  
  const data = await fetchData();
  await cache.set(cacheKey, data, 300);
  
  return NextResponse.json(data, {
    headers: {
      'X-Cache': 'MISS',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
```

#### Database Connection Optimization
```typescript
// Reuse database connections
let dbConnection: mongoose.Connection | null = null;

export async function getDatabaseConnection() {
  if (!dbConnection) {
    dbConnection = await mongoose.createConnection(process.env.MONGODB_URI!);
  }
  return dbConnection;
}
```

#### Async Processing
```typescript
// Move heavy operations to background jobs
import { Queue } from 'bull';

const reportQueue = new Queue('reports', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Queue heavy operations
export async function generateReport(userId: string) {
  const job = await reportQueue.add('generate-report', { userId });
  return { jobId: job.id };
}

// Process in background
reportQueue.process('generate-report', async (job) => {
  const { userId } = job.data;
  // Generate report...
});
```

### Performance Monitoring

#### Frontend Performance Monitoring
```typescript
// Track Core Web Vitals
export function reportWebVitals(metric: any) {
  // Send to analytics
  fetch('/api/analytics/performance', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}

// next.config.js
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
};
```

#### Backend Performance Monitoring
```typescript
// Track API response times
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const data = await fetchData();
    const responseTime = Date.now() - startTime;
    
    // Log performance
    await logPerformance({
      endpoint: request.nextUrl.pathname,
      method: 'GET',
      responseTime,
      status: 200,
    });
    
    return NextResponse.json(data);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logPerformance({
      endpoint: request.nextUrl.pathname,
      method: 'GET',
      responseTime,
      status: 500,
      error: error.message,
    });
    throw error;
  }
}
```

### Performance Best Practices

1. **Frontend**:
   - Code split by route and component
   - Lazy load images and components
   - Minimize bundle size
   - Use React.memo for expensive components
   - Optimize re-renders with useMemo and useCallback

2. **Backend**:
   - Use database indexes effectively
   - Implement query caching
   - Use pagination for large datasets
   - Batch operations when possible
   - Compress responses

3. **Database**:
   - Create appropriate indexes
   - Use aggregation pipelines efficiently
   - Implement connection pooling
   - Use read replicas for read-heavy operations
   - Monitor slow queries

4. **Images**:
   - Use Next.js Image component
   - Serve modern formats (WebP, AVIF)
   - Implement lazy loading
   - Use CDN for image delivery
   - Optimize image sizes

5. **CDN**:
   - Use CDN for static assets
   - Set appropriate cache headers
   - Use Cloudinary for image optimization
   - Implement cache invalidation strategy

6. **Monitoring**:
   - Track Core Web Vitals
   - Monitor API response times
   - Set up performance alerts
   - Regular performance audits

---

## Features List

### Core Features
1. **User Management**
   - User registration and authentication
   - Profile management
   - Password reset functionality
   - User preferences
   - Email verification
   - Welcome emails

2. **Transaction Management**
   - Add/edit/delete transactions
   - Transaction categorization
   - Transaction search and filtering
   - Bulk transaction import
   - Transaction export (CSV/JSON)
   - Recurring transactions

3. **Category Management**
   - Create custom categories
   - Category hierarchy (parent/child)
   - Category icons and colors
   - Default categories

4. **Budget Management**
   - Create budgets by category
   - Budget periods (weekly/monthly/yearly)
   - Budget progress tracking
   - Budget alerts (email notifications)
   - Budget vs actual comparison
   - Threshold and exceeded alerts

5. **Financial Goals**
   - Set financial goals
   - Track goal progress
   - Goal categories (savings, debt payoff, etc.)
   - Goal completion tracking
   - Progress update emails
   - Milestone celebrations

6. **Reports & Analytics**
   - Financial overview dashboard
   - Income vs expense reports
   - Category breakdown charts
   - Spending trends
   - Cash flow analysis
   - Custom date range reports
   - Export reports (PDF/Excel)
   - Weekly summary emails
   - Monthly report emails

7. **Investment Tracking**
   - Add investments
   - Track investment performance
   - Portfolio summary
   - Investment types (stocks, crypto, etc.)

8. **Receipt Management**
   - Upload receipt images
   - AI-powered receipt processing
   - Receipt storage
   - Link receipts to transactions

9. **AI Features**
   - Automatic expense categorization
   - Budget recommendations
   - Financial insights
   - Spending pattern analysis
   - AI chat assistant
   - Receipt OCR

10. **Email Notifications**
    - Welcome emails
    - Password reset emails
    - Budget alerts
    - Goal progress updates
    - Weekly summaries
    - Monthly reports
    - Transaction alerts
    - Security notifications
    - Customizable email preferences

11. **Additional Features**
    - Multi-currency support
    - Transaction tags
    - Location tracking
    - Payment method tracking
    - Dark/light theme
    - Responsive design
    - Data export/import

---

## Analytics & User Tracking (Optional)

### Overview
FinMan includes optional analytics and user tracking capabilities to understand user behavior, improve features, and optimize performance. All tracking is privacy-compliant, respects user preferences, and can be disabled by users.

### User Analytics Setup

#### Privacy-First Approach
- **Opt-in/Opt-out**: Users can enable/disable analytics
- **Anonymization**: Personal data is anonymized
- **GDPR Compliant**: Follows GDPR guidelines
- **No PII Tracking**: No personally identifiable information tracked
- **Transparent**: Clear privacy policy and data usage

#### Analytics Schema

Create `models/AnalyticsEvent.ts`:
```typescript
import mongoose from 'mongoose';

interface IAnalyticsEvent extends mongoose.Document {
  userId?: string; // Optional, can be null for anonymous
  sessionId: string;
  eventType: string;
  eventName: string;
  properties: Record<string, any>;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string; // Hashed for privacy
  page?: string;
  referrer?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser?: string;
  os?: string;
}

const AnalyticsEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'click', 'form_submit', 'feature_use', 'error', 'performance'],
    index: true,
  },
  eventName: {
    type: String,
    required: true,
    index: true,
  },
  properties: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  userAgent: String,
  ipAddress: String, // Stored hashed
  page: String,
  referrer: String,
  deviceType: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop'],
  },
  browser: String,
  os: String,
}, {
  timestamps: true,
});

// Indexes for efficient queries
AnalyticsEventSchema.index({ userId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsEventSchema.index({ eventName: 1, timestamp: -1 });
AnalyticsEventSchema.index({ sessionId: 1, timestamp: -1 });

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
```

### Analytics Service

Create `lib/services/analytics.service.ts`:
```typescript
import { AnalyticsEvent } from '@/models/AnalyticsEvent';
import * as crypto from 'crypto';

interface TrackEventParams {
  userId?: string;
  sessionId: string;
  eventType: 'page_view' | 'click' | 'form_submit' | 'feature_use' | 'error' | 'performance';
  eventName: string;
  properties?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  page?: string;
  referrer?: string;
}

export const analyticsService = {
  /**
   * Hash IP address for privacy
   */
  hashIP(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
  },

  /**
   * Detect device type from user agent
   */
  detectDevice(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    if (!userAgent) return 'desktop';
    
    const ua = userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod/.test(ua)) {
      return 'mobile';
    }
    if (/tablet|ipad/.test(ua)) {
      return 'tablet';
    }
    return 'desktop';
  },

  /**
   * Parse browser from user agent
   */
  parseBrowser(userAgent: string): string {
    if (!userAgent) return 'unknown';
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'chrome';
    if (ua.includes('firefox')) return 'firefox';
    if (ua.includes('safari')) return 'safari';
    if (ua.includes('edge')) return 'edge';
    return 'other';
  },

  /**
   * Parse OS from user agent
   */
  parseOS(userAgent: string): string {
    if (!userAgent) return 'unknown';
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('windows')) return 'windows';
    if (ua.includes('mac')) return 'macos';
    if (ua.includes('linux')) return 'linux';
    if (ua.includes('android')) return 'android';
    if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'ios';
    return 'other';
  },

  /**
   * Track analytics event
   */
  async trackEvent(params: TrackEventParams): Promise<void> {
    try {
      // Check if user has analytics enabled
      if (params.userId) {
        const User = (await import('@/models/User')).default;
        const user = await User.findById(params.userId);
        if (user && user.preferences?.analyticsEnabled === false) {
          return; // User has disabled analytics
        }
      }

      const event = new AnalyticsEvent({
        userId: params.userId || undefined,
        sessionId: params.sessionId,
        eventType: params.eventType,
        eventName: params.eventName,
        properties: params.properties || {},
        timestamp: new Date(),
        userAgent: params.userAgent,
        ipAddress: params.ipAddress ? this.hashIP(params.ipAddress) : undefined,
        page: params.page,
        referrer: params.referrer,
        deviceType: params.userAgent ? this.detectDevice(params.userAgent) : 'desktop',
        browser: params.userAgent ? this.parseBrowser(params.userAgent) : undefined,
        os: params.userAgent ? this.parseOS(params.userAgent) : undefined,
      });

      await event.save();
    } catch (error) {
      // Silently fail analytics to not impact user experience
      console.error('Analytics tracking failed:', error);
    }
  },

  /**
   * Track page view
   */
  async trackPageView(
    userId: string | undefined,
    sessionId: string,
    page: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'page_view',
      eventName: 'page_view',
      properties: { page },
      page,
      userAgent,
      ipAddress,
    });
  },

  /**
   * Track feature usage
   */
  async trackFeatureUse(
    userId: string | undefined,
    sessionId: string,
    featureName: string,
    properties?: Record<string, any>,
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'feature_use',
      eventName: featureName,
      properties,
    });
  },

  /**
   * Track click events
   */
  async trackClick(
    userId: string | undefined,
    sessionId: string,
    elementId: string,
    page: string,
    properties?: Record<string, any>,
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'click',
      eventName: 'click',
      properties: {
        elementId,
        ...properties,
      },
      page,
    });
  },

  /**
   * Track form submissions
   */
  async trackFormSubmit(
    userId: string | undefined,
    sessionId: string,
    formName: string,
    success: boolean,
    properties?: Record<string, any>,
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'form_submit',
      eventName: formName,
      properties: {
        success,
        ...properties,
      },
    });
  },

  /**
   * Track errors
   */
  async trackError(
    userId: string | undefined,
    sessionId: string,
    errorType: string,
    errorMessage: string,
    page?: string,
    properties?: Record<string, any>,
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'error',
      eventName: errorType,
      properties: {
        errorMessage,
        ...properties,
      },
      page,
    });
  },

  /**
   * Track performance metrics
   */
  async trackPerformance(
    userId: string | undefined,
    sessionId: string,
    metricName: string,
    value: number,
    page?: string,
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'performance',
      eventName: metricName,
      properties: {
        value,
        unit: 'ms',
      },
      page,
    });
  },
};
```

### Feature Usage Tracking

#### Track Feature Usage
```typescript
// In components or API routes
import { analyticsService } from '@/lib/services/analytics.service';

// Track when user uses a feature
await analyticsService.trackFeatureUse(
  user?.id,
  sessionId,
  'budget_created',
  {
    budgetAmount: budget.amount,
    budgetCategory: budget.categoryId,
    period: budget.period,
  }
);

// Track AI feature usage
await analyticsService.trackFeatureUse(
  user?.id,
  sessionId,
  'ai_categorization',
  {
    category: suggestedCategory,
    confidence: confidenceScore,
  }
);
```

### Performance Metrics

#### Track Performance
```typescript
// Track page load time
export const trackPageLoad = async (userId: string | undefined, sessionId: string, page: string) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      analyticsService.trackPerformance(
        userId,
        sessionId,
        'page_load_time',
        pageLoadTime,
        page,
      );
    });
  }
};

// Track API response time
export const trackAPIResponse = async (
  userId: string | undefined,
  sessionId: string,
  endpoint: string,
  responseTime: number,
) => {
  await analyticsService.trackPerformance(
    userId,
    sessionId,
    'api_response_time',
    responseTime,
    endpoint,
  );
};
```

### User Behavior Analysis

#### Analytics API Routes

Create `app/api/analytics/track/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/services/analytics.service';
import { verifyToken } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, eventName, properties, page } = body;

    // Get user from token (optional)
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    let userId: string | undefined;
    
    if (token) {
      try {
        const user = await verifyToken(token);
        userId = user?.id;
      } catch {
        // Invalid token, continue as anonymous
      }
    }

    // Get session ID from cookie or generate
    const { randomUUID } = await import('crypto');
    const sessionId = request.cookies.get('sessionId')?.value || 
                     randomUUID();

    // Get user agent and IP
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     undefined;

    await analyticsService.trackEvent({
      userId,
      sessionId,
      eventType,
      eventName,
      properties,
      page,
      userAgent,
      ipAddress,
      referrer: request.headers.get('referer') || undefined,
    });

    // Set session cookie if not exists
    const response = NextResponse.json({ success: true });
    if (!request.cookies.get('sessionId')) {
      response.cookies.set('sessionId', sessionId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### Analytics Dashboard API

Create `app/api/analytics/dashboard/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEvent } from '@/models/AnalyticsEvent';
import { verifyToken } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Only admins can access analytics dashboard
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || 
                     new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get('endDate') || new Date().toISOString();

    // Feature usage statistics
    const featureUsage = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'feature_use',
          timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$eventName',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          feature: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Page views
    const pageViews = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'page_view',
          timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Device types
    const deviceTypes = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$deviceType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Daily active users
    const dailyActiveUsers = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          userId: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          date: '$_id',
          count: { $size: '$uniqueUsers' },
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Error tracking
    const errors = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'error',
          timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$eventName',
          count: { $sum: 1 },
          lastOccurred: { $max: '$timestamp' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Performance metrics
    const performance = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'performance',
          timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$eventName',
          avgValue: { $avg: '$properties.value' },
          minValue: { $min: '$properties.value' },
          maxValue: { $max: '$properties.value' },
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        featureUsage,
        pageViews,
        deviceTypes,
        dailyActiveUsers,
        errors,
        performance,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Frontend Analytics Hook

Create `hooks/useAnalytics.ts`:
```typescript
'use client';

import { useCallback } from 'react';
import { useUser } from '@/store/userStore';
import { useSessionId } from './useSessionId';

export const useAnalytics = () => {
  const { user } = useUser();
  const sessionId = useSessionId();

  const track = useCallback(async (
    eventType: 'page_view' | 'click' | 'form_submit' | 'feature_use' | 'error' | 'performance',
    eventName: string,
    properties?: Record<string, any>,
    page?: string,
  ) => {
    // Check if user has analytics enabled
    if (user && user.preferences?.analyticsEnabled === false) {
      return;
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && { Authorization: `Bearer ${localStorage.getItem('token')}` }),
        },
        body: JSON.stringify({
          eventType,
          eventName,
          properties,
          page: page || window.location.pathname,
        }),
      });
    } catch (error) {
      // Silently fail
      console.error('Analytics tracking failed:', error);
    }
  }, [user, sessionId]);

  const trackPageView = useCallback((page: string) => {
    track('page_view', 'page_view', {}, page);
  }, [track]);

  const trackFeatureUse = useCallback((featureName: string, properties?: Record<string, any>) => {
    track('feature_use', featureName, properties);
  }, [track]);

  const trackClick = useCallback((elementId: string, properties?: Record<string, any>) => {
    track('click', 'click', { elementId, ...properties });
  }, [track]);

  const trackFormSubmit = useCallback((formName: string, success: boolean, properties?: Record<string, any>) => {
    track('form_submit', formName, { success, ...properties });
  }, [track]);

  const trackError = useCallback((errorType: string, errorMessage: string, properties?: Record<string, any>) => {
    track('error', errorType, { errorMessage, ...properties });
  }, [track]);

  const trackPerformance = useCallback((metricName: string, value: number) => {
    track('performance', metricName, { value });
  }, [track]);

  return {
    track,
    trackPageView,
    trackFeatureUse,
    trackClick,
    trackFormSubmit,
    trackError,
    trackPerformance,
  };
};
```

### Privacy-Compliant Tracking

#### User Preferences
Add to User schema:
```typescript
{
  preferences: {
    // ... existing preferences
    analyticsEnabled: Boolean (default: true),
    trackingConsent: Boolean (default: false),
    trackingConsentDate: Date (optional),
  }
}
```

#### Consent Management
```typescript
// components/analytics/ConsentBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { trackFeatureUse } = useAnalytics();

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = async () => {
    localStorage.setItem('analytics-consent', 'accepted');
    setShowBanner(false);
    trackFeatureUse('analytics_consent_accepted');
    // Update user preferences
    await fetch('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify({ analyticsEnabled: true }),
    });
  };

  const handleDecline = async () => {
    localStorage.setItem('analytics-consent', 'declined');
    setShowBanner(false);
    // Update user preferences
    await fetch('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify({ analyticsEnabled: false }),
    });
  };

  if (!showBanner) return null;

  return (
    <div className="consent-banner fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-sm">
            We use analytics to improve your experience. Your data is anonymized and privacy-protected.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDecline} className="btn-secondary">
            Decline
          </button>
          <button onClick={handleAccept} className="btn-primary">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Analytics Dashboard Component

```typescript
// components/analytics/AnalyticsDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export const AnalyticsDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="analytics-dashboard">
      <h1>Analytics Dashboard</h1>
      
      <section>
        <h2>Feature Usage</h2>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Usage Count</th>
              <th>Unique Users</th>
            </tr>
          </thead>
          <tbody>
            {data.featureUsage.map((item: any) => (
              <tr key={item.feature}>
                <td>{item.feature}</td>
                <td>{item.count}</td>
                <td>{item.uniqueUsers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Page Views</h2>
        {/* Chart or table */}
      </section>

      <section>
        <h2>Device Types</h2>
        {/* Chart */}
      </section>

      <section>
        <h2>Daily Active Users</h2>
        {/* Chart */}
      </section>

      <section>
        <h2>Errors</h2>
        {/* Error list */}
      </section>

      <section>
        <h2>Performance Metrics</h2>
        {/* Performance metrics */}
      </section>
    </div>
  );
};
```

### API Endpoints

Add to API Endpoints section:
```
### Analytics Endpoints (Optional)
POST   /api/analytics/track         # Track analytics event
GET    /api/analytics/dashboard     # Get analytics dashboard data (admin only)
```

### Best Practices

1. **Privacy First**: Always respect user privacy and consent
2. **Opt-in/Opt-out**: Allow users to control analytics
3. **Anonymization**: Hash or anonymize sensitive data
4. **Performance**: Don't impact user experience
5. **Transparency**: Clear privacy policy
6. **Data Retention**: Set retention policies
7. **GDPR Compliance**: Follow GDPR guidelines
8. **Error Handling**: Fail silently to not impact UX

---

## User Onboarding Flow

### Overview
FinMan provides a comprehensive onboarding experience for first-time users to help them get started quickly and understand the system's features. The onboarding flow guides users through initial setup, creates sample data, and introduces key features through an interactive tour.

### First-Time User Experience

#### Onboarding Flow Steps

1. **Welcome Screen**
   - Welcome message and system introduction
   - Brief overview of FinMan capabilities
   - "Get Started" button

2. **Account Setup**
   - Complete profile information
   - Set currency preference
   - Set timezone
   - Choose language
   - Set date/time format preferences

3. **Initial Configuration**
   - Create first category (or use defaults)
   - Set up first budget (optional)
   - Create first financial goal (optional)

4. **Sample Data Creation**
   - Option to create sample transactions
   - Option to create sample budgets
   - Option to create sample goals
   - Preview of how data looks

5. **Feature Tour**
   - Interactive tour of main features
   - Highlight key sections
   - Show important actions

6. **Onboarding Completion**
   - Checklist completion
   - Access to full dashboard
   - Quick tips panel

### Onboarding Schema

Add to User schema:
```typescript
{
  // ... existing fields
  onboarding: {
    completed: Boolean (default: false),
    currentStep: Number (default: 0),
    completedSteps: [Number],
    skipped: Boolean (default: false),
    completedAt: Date (optional),
    sampleDataCreated: Boolean (default: false),
    tourCompleted: Boolean (default: false),
  }
}
```

### Onboarding Service

Create `lib/services/onboarding.service.ts`:
```typescript
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { Budget } from '@/models/Budget';
import { Goal } from '@/models/Goal';
import { Category } from '@/models/Category';

export const onboardingService = {
  /**
   * Get onboarding progress
   */
  async getOnboardingProgress(userId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const totalSteps = 6;
    const completedSteps = user.onboarding?.completedSteps?.length || 0;
    const progress = (completedSteps / totalSteps) * 100;

    return {
      completed: user.onboarding?.completed || false,
      currentStep: user.onboarding?.currentStep || 0,
      completedSteps: user.onboarding?.completedSteps || [],
      progress: Math.round(progress),
      totalSteps,
      sampleDataCreated: user.onboarding?.sampleDataCreated || false,
      tourCompleted: user.onboarding?.tourCompleted || false,
    };
  },

  /**
   * Mark step as completed
   */
  async completeStep(userId: string, step: number) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.onboarding) {
      user.onboarding = {
        completed: false,
        currentStep: 0,
        completedSteps: [],
        skipped: false,
        sampleDataCreated: false,
        tourCompleted: false,
      };
    }

    if (!user.onboarding.completedSteps.includes(step)) {
      user.onboarding.completedSteps.push(step);
    }

    user.onboarding.currentStep = Math.max(
      user.onboarding.currentStep,
      step + 1,
    );

    // Check if all steps are completed
    if (user.onboarding.completedSteps.length >= 6) {
      user.onboarding.completed = true;
      user.onboarding.completedAt = new Date();
    }

    await user.save();
    return user.onboarding;
  },

  /**
   * Create sample data for user
   */
  async createSampleData(userId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.onboarding?.sampleDataCreated) {
      return { message: 'Sample data already created' };
    }

    // Create sample categories
    const categories = await this.createSampleCategories(userId);

    // Create sample transactions
    const transactions = await this.createSampleTransactions(
      userId,
      categories,
    );

    // Create sample budget
    const budget = await this.createSampleBudget(userId, categories[0]._id);

    // Create sample goal
    const goal = await this.createSampleGoal(userId);

    // Mark sample data as created
    if (!user.onboarding) {
      user.onboarding = {
        completed: false,
        currentStep: 0,
        completedSteps: [],
        skipped: false,
        sampleDataCreated: false,
        tourCompleted: false,
      };
    }

    user.onboarding.sampleDataCreated = true;
    await user.save();

    return {
      message: 'Sample data created successfully',
      categories: categories.length,
      transactions: transactions.length,
      budget: budget ? 1 : 0,
      goal: goal ? 1 : 0,
    };
  },

  /**
   * Create sample categories
   */
  async createSampleCategories(userId: string) {
    const sampleCategories = [
      {
        userId,
        name: 'Food & Dining',
        type: 'expense',
        icon: '🍔',
        color: '#FF6B6B',
        isDefault: true,
      },
      {
        userId,
        name: 'Transportation',
        type: 'expense',
        icon: '🚗',
        color: '#4ECDC4',
        isDefault: true,
      },
      {
        userId,
        name: 'Shopping',
        type: 'expense',
        icon: '🛍️',
        color: '#95E1D3',
        isDefault: true,
      },
      {
        userId,
        name: 'Salary',
        type: 'income',
        icon: '💰',
        color: '#F38181',
        isDefault: true,
      },
      {
        userId,
        name: 'Freelance',
        type: 'income',
        icon: '💼',
        color: '#AA96DA',
        isDefault: true,
      },
    ];

    const categories = await Category.insertMany(sampleCategories);
    return categories;
  },

  /**
   * Create sample transactions
   */
  async createSampleTransactions(userId: string, categories: any[]) {
    const user = await User.findById(userId);
    const expenseCategories = categories.filter((c) => c.type === 'expense');
    const incomeCategories = categories.filter((c) => c.type === 'income');

    const now = new Date();
    const sampleTransactions = [
      // Income transactions
      {
        userId,
        type: 'income',
        amount: 5000,
        currency: user.currency || 'USD',
        categoryId: incomeCategories[0]._id,
        description: 'Monthly Salary',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        paymentMethod: 'bank_transfer',
      },
      {
        userId,
        type: 'income',
        amount: 800,
        currency: user.currency || 'USD',
        categoryId: incomeCategories[1]?._id || incomeCategories[0]._id,
        description: 'Freelance Project',
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        paymentMethod: 'digital_wallet',
      },
      // Expense transactions
      {
        userId,
        type: 'expense',
        amount: 45.50,
        currency: user.currency || 'USD',
        categoryId: expenseCategories[0]._id,
        description: 'Lunch at Restaurant',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        paymentMethod: 'card',
      },
      {
        userId,
        type: 'expense',
        amount: 120.00,
        currency: user.currency || 'USD',
        categoryId: expenseCategories[1]._id,
        description: 'Gas Station',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        paymentMethod: 'card',
      },
      {
        userId,
        type: 'expense',
        amount: 89.99,
        currency: user.currency || 'USD',
        categoryId: expenseCategories[2]._id,
        description: 'Online Shopping',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        paymentMethod: 'card',
      },
      {
        userId,
        type: 'expense',
        amount: 35.00,
        currency: user.currency || 'USD',
        categoryId: expenseCategories[0]._id,
        description: 'Groceries',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        paymentMethod: 'card',
      },
    ];

    const transactions = await Transaction.insertMany(sampleTransactions);
    return transactions;
  },

  /**
   * Create sample budget
   */
  async createSampleBudget(userId: string, categoryId: string) {
    const user = await User.findById(userId);
    const budget = await Budget.create({
      userId,
      name: 'Monthly Food Budget',
      categoryId,
      amount: 500,
      currency: user.currency || 'USD',
      period: 'monthly',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      alertThreshold: 80,
    });

    return budget;
  },

  /**
   * Create sample goal
   */
  async createSampleGoal(userId: string) {
    const user = await User.findById(userId);
    const goal = await Goal.create({
      userId,
      title: 'Emergency Fund',
      description: 'Build an emergency fund of $10,000',
      targetAmount: 10000,
      currentAmount: 0,
      currency: user.currency || 'USD',
      targetDate: new Date(
        new Date().getFullYear() + 1,
        new Date().getMonth(),
        new Date().getDate(),
      ),
      category: 'savings',
    });

    return goal;
  },

  /**
   * Skip onboarding
   */
  async skipOnboarding(userId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.onboarding) {
      user.onboarding = {
        completed: false,
        currentStep: 0,
        completedSteps: [],
        skipped: false,
        sampleDataCreated: false,
        tourCompleted: false,
      };
    }

    user.onboarding.skipped = true;
    user.onboarding.completed = true;
    user.onboarding.completedAt = new Date();
    await user.save();

    return { message: 'Onboarding skipped' };
  },

  /**
   * Mark tour as completed
   */
  async completeTour(userId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.onboarding) {
      user.onboarding = {
        completed: false,
        currentStep: 0,
        completedSteps: [],
        skipped: false,
        sampleDataCreated: false,
        tourCompleted: false,
      };
    }

    user.onboarding.tourCompleted = true;
    await user.save();

    return { message: 'Tour completed' };
  },
};
```

### Onboarding API Routes

Create `app/api/onboarding/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { onboardingService } from '@/lib/services/onboarding.service';

// GET - Get onboarding progress
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const progress = await onboardingService.getOnboardingProgress(user.id);
    return NextResponse.json({ success: true, data: progress });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST - Complete step
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { step, action } = body;

    if (action === 'complete-step') {
      const result = await onboardingService.completeStep(user.id, step);
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'create-sample-data') {
      const result = await onboardingService.createSampleData(user.id);
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'skip') {
      const result = await onboardingService.skipOnboarding(user.id);
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'complete-tour') {
      const result = await onboardingService.completeTour(user.id);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Onboarding Checklist Component

Create `components/onboarding/OnboardingChecklist.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
}

export const OnboardingChecklist = () => {
  const { progress, completedSteps, completeStep } = useOnboarding();
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const checklistItems: ChecklistItem[] = [
      {
        id: 0,
        title: 'Complete Profile',
        description: 'Add your name and preferences',
        completed: completedSteps.includes(0),
      },
      {
        id: 1,
        title: 'Set Currency',
        description: 'Choose your preferred currency',
        completed: completedSteps.includes(1),
      },
      {
        id: 2,
        title: 'Create Category',
        description: 'Add your first transaction category',
        completed: completedSteps.includes(2),
      },
      {
        id: 3,
        title: 'Add Transaction',
        description: 'Record your first transaction',
        completed: completedSteps.includes(3),
      },
      {
        id: 4,
        title: 'Create Budget',
        description: 'Set up your first budget',
        completed: completedSteps.includes(4),
      },
      {
        id: 5,
        title: 'Take Tour',
        description: 'Learn about key features',
        completed: completedSteps.includes(5),
      },
    ];

    setItems(checklistItems);
  }, [completedSteps]);

  return (
    <div className="onboarding-checklist">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <h3>Getting Started</h3>
      <ul className="checklist">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.completed ? 'completed' : ''}
          >
            <input
              type="checkbox"
              checked={item.completed}
              readOnly
            />
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
            {!item.completed && item.action && (
              <button onClick={item.action}>Start</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Tutorial/Tour Implementation

Create `components/onboarding/FeatureTour.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';

interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'dashboard',
    target: '#dashboard',
    title: 'Welcome to Dashboard',
    content: 'This is your financial overview. See your balance, recent transactions, and budget progress.',
    position: 'bottom',
  },
  {
    id: 'transactions',
    target: '#transactions-section',
    title: 'Transaction Management',
    content: 'Add, edit, and track all your income and expenses here. Use filters to find specific transactions.',
    position: 'right',
  },
  {
    id: 'budgets',
    target: '#budgets-section',
    title: 'Budget Planning',
    content: 'Create budgets for different categories and track your spending against them.',
    position: 'right',
  },
  {
    id: 'goals',
    target: '#goals-section',
    title: 'Financial Goals',
    content: 'Set and track your financial goals. Monitor progress and get insights.',
    position: 'right',
  },
  {
    id: 'reports',
    target: '#reports-section',
    title: 'Reports & Analytics',
    content: 'View detailed reports and charts to understand your spending patterns.',
    position: 'right',
  },
];

export const FeatureTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { completeTour, tourCompleted } = useOnboarding();

  useEffect(() => {
    // Start tour if not completed
    if (!tourCompleted) {
      setIsActive(true);
    }
  }, [tourCompleted]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    completeTour();
  };

  const handleComplete = () => {
    setIsActive(false);
    completeTour();
  };

  if (!isActive) return null;

  const step = tourSteps[currentStep];

  return (
    <div className="feature-tour-overlay">
      <div className="tour-highlight" data-target={step.target} />
      <div className={`tour-popup tour-popup-${step.position}`}>
        <div className="tour-header">
          <h3>{step.title}</h3>
          <button onClick={handleSkip} className="tour-close">×</button>
        </div>
        <div className="tour-content">
          <p>{step.content}</p>
        </div>
        <div className="tour-footer">
          <div className="tour-progress">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
          <div className="tour-actions">
            {currentStep > 0 && (
              <button onClick={handlePrevious}>Previous</button>
            )}
            <button onClick={handleNext}>
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Onboarding Hook

Create `hooks/useOnboarding.ts`:
```typescript
import { useState, useEffect } from 'react';
import { useUser } from '@/store/userStore';

export const useOnboarding = () => {
  const { user } = useUser();
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/onboarding', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setProgress(data.data);
    } catch (error) {
      console.error('Failed to fetch onboarding progress:', error);
    }
  };

  const completeStep = async (step: number) => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action: 'complete-step', step }),
      });
      const data = await response.json();
      setProgress(data.data);
      return data;
    } catch (error) {
      console.error('Failed to complete step:', error);
    }
  };

  const createSampleData = async () => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action: 'create-sample-data' }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to create sample data:', error);
    }
  };

  const skipOnboarding = async () => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action: 'skip' }),
      });
      const data = await response.json();
      setProgress({ ...progress, completed: true, skipped: true });
      return data;
    } catch (error) {
      console.error('Failed to skip onboarding:', error);
    }
  };

  const completeTour = async () => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action: 'complete-tour' }),
      });
      const data = await response.json();
      setProgress({ ...progress, tourCompleted: true });
      return data;
    } catch (error) {
      console.error('Failed to complete tour:', error);
    }
  };

  return {
    progress,
    completedSteps: progress?.completedSteps || [],
    currentStep: progress?.currentStep || 0,
    completed: progress?.completed || false,
    sampleDataCreated: progress?.sampleDataCreated || false,
    tourCompleted: progress?.tourCompleted || false,
    completeStep,
    createSampleData,
    skipOnboarding,
    completeTour,
    refresh: fetchProgress,
  };
};
```

### Feature Discovery

Create `components/onboarding/FeatureDiscovery.tsx`:
```typescript
'use client';

import { useState } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

const features: Feature[] = [
  {
    id: 'ai-insights',
    title: 'AI Insights',
    description: 'Get intelligent financial recommendations powered by AI',
    icon: '🤖',
    link: '/ai-insights',
  },
  {
    id: 'recurring',
    title: 'Recurring Transactions',
    description: 'Automate your recurring income and expenses',
    icon: '🔄',
    link: '/transactions/recurring',
  },
  {
    id: 'reports',
    title: 'Advanced Reports',
    description: 'Generate detailed financial reports and analytics',
    icon: '📊',
    link: '/reports',
  },
  {
    id: 'goals',
    title: 'Financial Goals',
    description: 'Set and track your financial objectives',
    icon: '🎯',
    link: '/goals',
  },
];

export const FeatureDiscovery = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="feature-discovery">
      <button
        className="discovery-close"
        onClick={() => setDismissed(true)}
      >
        ×
      </button>
      <h3>Discover Features</h3>
      <div className="features-grid">
        {features.map((feature) => (
          <a
            key={feature.id}
            href={feature.link}
            className="feature-card"
          >
            <div className="feature-icon">{feature.icon}</div>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
```

### API Endpoints

Add to API Endpoints section:
```
### Onboarding Endpoints
GET    /api/onboarding              # Get onboarding progress
POST   /api/onboarding              # Complete step, create sample data, skip, or complete tour
```

### Best Practices

1. **Progressive Disclosure**: Show features gradually, not all at once
2. **Skip Option**: Always allow users to skip onboarding
3. **Sample Data**: Make sample data optional and clearly marked
4. **Tour Persistence**: Allow users to restart the tour later
5. **Mobile Responsive**: Ensure onboarding works on all devices
6. **Accessibility**: Make onboarding accessible to all users
7. **Performance**: Load onboarding components lazily
8. **Analytics**: Track onboarding completion rates

---

## Data Export/Import Functionality

### Overview
FinMan provides comprehensive data export and import capabilities, allowing users to export their financial data in multiple formats (CSV, Excel, PDF) and import transactions from CSV/Excel files. This enables data portability, backup, and bulk data entry.

### Export Functionality

#### 1. CSV Export

**Use Cases**:
- Export transactions for spreadsheet analysis
- Backup financial data
- Import to other financial tools
- Data migration

**Implementation**:

Create `lib/services/export.service.ts`:
```typescript
import { transactionsService } from './transactions.service';
import { createObjectCsvStringifier } from 'csv-writer';

export const exportService = {

  /**
   * Export transactions to CSV
   */
  async exportTransactionsToCSV(
    userId: string,
    filters: any,
  ): Promise<string> {
    const transactions = await transactionsService.findAll(userId, filters);

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'date', title: 'Date' },
        { id: 'type', title: 'Type' },
        { id: 'amount', title: 'Amount' },
        { id: 'currency', title: 'Currency' },
        { id: 'category', title: 'Category' },
        { id: 'description', title: 'Description' },
        { id: 'paymentMethod', title: 'Payment Method' },
        { id: 'tags', title: 'Tags' },
        { id: 'createdAt', title: 'Created At' },
      ],
    });

    const records = transactions.map((transaction) => ({
      date: transaction.date.toISOString().split('T')[0],
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      category: transaction.categoryId?.name || '',
      description: transaction.description || '',
      paymentMethod: transaction.paymentMethod || '',
      tags: transaction.tags?.join('; ') || '',
      createdAt: transaction.createdAt.toISOString(),
    }));

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    return csvContent;
  },

  /**
   * Export budgets to CSV
   */
  async exportBudgetsToCSV(userId: string): Promise<string> {
    // Similar implementation for budgets
    return '';
  },

  /**
   * Export goals to CSV
   */
  async exportGoalsToCSV(userId: string): Promise<string> {
    // Similar implementation for goals
    return '';
  },
};
```

**API Route**:
Create `app/api/v1/transactions/export/csv/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { exportService } from '@/lib/services/export.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      // Parse filters from query params
    };

    const csvContent = await exportService.exportTransactionsToCSV(user.id, filters);

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=transactions-${Date.now()}.csv`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
  await this.exportService.exportTransactionsToCSV(user.id, filters, res);
}
```

#### 2. Excel Export (XLSX)

**Use Cases**:
- Professional reports with formatting
- Multiple sheets in one file
- Charts and formulas support
- Better data visualization

**Implementation**:

Install dependencies:
```bash
npm install xlsx
npm install exceljs
```

Create Excel export method:
```typescript
import * as ExcelJS from 'exceljs';

async exportTransactionsToExcel(
  userId: string,
  filters: any,
  res: Response,
): Promise<void> {
  const transactions = await this.transactionsService.findAll(userId, filters);
  const budgets = await this.budgetsService.findAll(userId);
  const goals = await this.goalsService.findAll(userId);

  const workbook = new ExcelJS.Workbook();
  
  // Transactions Sheet
  const transactionsSheet = workbook.addWorksheet('Transactions');
  transactionsSheet.columns = [
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Type', key: 'type', width: 10 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Currency', key: 'currency', width: 10 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Payment Method', key: 'paymentMethod', width: 15 },
    { header: 'Tags', key: 'tags', width: 20 },
  ];

  transactions.forEach((transaction) => {
    transactionsSheet.addRow({
      date: transaction.date,
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      category: transaction.categoryId?.name || '',
      description: transaction.description || '',
      paymentMethod: transaction.paymentMethod || '',
      tags: transaction.tags?.join(', ') || '',
    });
  });

  // Add summary row
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  transactionsSheet.addRow({
    date: 'TOTAL',
    type: '',
    amount: totalIncome - totalExpenses,
    currency: transactions[0]?.currency || 'USD',
    category: 'Net',
    description: '',
    paymentMethod: '',
    tags: '',
  });

  // Style header row
  transactionsSheet.getRow(1).font = { bold: true };
  transactionsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Budgets Sheet
  const budgetsSheet = workbook.addWorksheet('Budgets');
  budgetsSheet.columns = [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Spent', key: 'spent', width: 15 },
    { header: 'Remaining', key: 'remaining', width: 15 },
    { header: 'Period', key: 'period', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  budgets.forEach((budget) => {
    const spent = await this.calculateBudgetSpent(budget._id);
    budgetsSheet.addRow({
      name: budget.name,
      category: budget.categoryId?.name || '',
      amount: budget.amount,
      spent: spent,
      remaining: budget.amount - spent,
      period: budget.period,
      status: spent > budget.amount ? 'Exceeded' : 'Active',
    });
  });

  budgetsSheet.getRow(1).font = { bold: true };
  budgetsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Goals Sheet
  const goalsSheet = workbook.addWorksheet('Goals');
  goalsSheet.columns = [
    { header: 'Title', key: 'title', width: 25 },
    { header: 'Target Amount', key: 'targetAmount', width: 15 },
    { header: 'Current Amount', key: 'currentAmount', width: 15 },
    { header: 'Progress %', key: 'progress', width: 15 },
    { header: 'Target Date', key: 'targetDate', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  goals.forEach((goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    goalsSheet.addRow({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      progress: `${progress.toFixed(1)}%`,
      targetDate: goal.targetDate?.toISOString().split('T')[0] || '',
      status: goal.isCompleted ? 'Completed' : 'In Progress',
    });
  });

  goalsSheet.getRow(1).font = { bold: true };
  goalsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Summary Sheet
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.addRow(['Financial Summary']);
  summarySheet.addRow(['Total Income', totalIncome]);
  summarySheet.addRow(['Total Expenses', totalExpenses]);
  summarySheet.addRow(['Net', totalIncome - totalExpenses]);
  summarySheet.addRow(['Active Budgets', budgets.length]);
  summarySheet.addRow(['Active Goals', goals.filter((g) => !g.isCompleted).length]);

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer();

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=finman-export-${Date.now()}.xlsx`,
  );
  res.send(buffer);
}
```

#### 3. PDF Report Generation

**Use Cases**:
- Professional financial reports
- Printable statements
- Email attachments
- Document archiving

**Implementation**:

Install dependencies:
```bash
npm install pdfkit
npm install pdfmake
```

Create PDF export method:
```typescript
import PDFDocument from 'pdfkit';
import { Response } from 'express';

async exportTransactionsToPDF(
  userId: string,
  filters: any,
  res: Response,
): Promise<void> {
  const transactions = await this.transactionsService.findAll(userId, filters);
  const user = await this.usersService.findOne(userId);

  const doc = new PDFDocument({ margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=transactions-report-${Date.now()}.pdf`,
  );

  doc.pipe(res);

  // Header
  doc.fontSize(20).text('FinMan - Transaction Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(2);

  // Summary
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  doc.fontSize(14).text('Summary', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).text(`Total Income: ${user.currency} ${totalIncome.toFixed(2)}`);
  doc.text(`Total Expenses: ${user.currency} ${totalExpenses.toFixed(2)}`);
  doc.text(`Net: ${user.currency} ${(totalIncome - totalExpenses).toFixed(2)}`);
  doc.moveDown(2);

  // Transactions Table
  doc.fontSize(14).text('Transactions', { underline: true });
  doc.moveDown(0.5);

  let yPosition = doc.y;
  const tableTop = yPosition;
  const itemHeight = 20;
  const pageHeight = doc.page.height - 100;

  // Table Headers
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Date', 50, yPosition);
  doc.text('Type', 120, yPosition);
  doc.text('Amount', 180, yPosition);
  doc.text('Category', 250, yPosition);
  doc.text('Description', 350, yPosition);
  yPosition += itemHeight;

  // Table Rows
  doc.font('Helvetica');
  transactions.forEach((transaction) => {
    if (yPosition > pageHeight) {
      doc.addPage();
      yPosition = 50;
    }

    doc.text(transaction.date.toISOString().split('T')[0], 50, yPosition);
    doc.text(transaction.type, 120, yPosition);
    doc.text(
      `${transaction.currency} ${transaction.amount.toFixed(2)}`,
      180,
      yPosition,
    );
    doc.text(transaction.categoryId?.name || '', 250, yPosition);
    doc.text(transaction.description || '', 350, yPosition, {
      width: 200,
      ellipsis: true,
    });
    yPosition += itemHeight;
  });

  // Footer
  doc.fontSize(8).text(
    `Page ${doc.page.number}`,
    50,
    doc.page.height - 50,
    { align: 'center' },
  );

  doc.end();
}
```

### Import Functionality

#### 1. CSV/Excel Import

**Use Cases**:
- Bulk transaction import
- Data migration from other tools
- Bank statement import
- Historical data entry

**Implementation**:

Create `lib/services/import.service.ts`:
```typescript
import { transactionsService } from './transactions.service';
import { categoriesService } from './categories.service';
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import { logger } from './logger.service';

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}

export const importService = {

  /**
   * Import transactions from CSV file
   */
  async importTransactionsFromCSV(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    try {
      // Parse CSV
      const records = parse(file.buffer.toString(), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      // Validate and import each record
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const rowNumber = i + 2; // +2 because header is row 1, and arrays are 0-indexed

        try {
          // Validate record
          const validationResult = this.validateTransactionRecord(record);
          if (!validationResult.valid) {
            result.failed++;
            result.errors.push({
              row: rowNumber,
              error: validationResult.error,
              data: record,
            });
            continue;
          }

          // Find or create category
          let category = await categoriesService.findByName(
            userId,
            record.category || record.Category,
          );
          if (!category && record.category) {
            category = await categoriesService.create({
              userId,
              name: record.category || record.Category,
              type: record.type?.toLowerCase() === 'income' ? 'income' : 'expense',
            });
          }

          // Create transaction
          await transactionsService.create({
            userId,
            type: (record.type || record.Type || 'expense').toLowerCase(),
            amount: parseFloat(record.amount || record.Amount),
            currency: record.currency || record.Currency || 'USD',
            categoryId: category?._id,
            description: record.description || record.Description || '',
            date: new Date(record.date || record.Date),
            paymentMethod: record.paymentMethod || record['Payment Method'] || 'other',
            tags: record.tags
              ? record.tags.split(',').map((t: string) => t.trim())
              : [],
          });

          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push({
            row: rowNumber,
            error: error.message,
            data: record,
          });
        }
      }

      // Log import
      this.logger.logTransaction('bulk_import', userId, '', {
        totalRecords: records.length,
        success: result.success,
        failed: result.failed,
      });

      return result;
    } catch (error) {
      this.logger.logError(error, 'import', { userId });
      throw new Error(`Failed to parse CSV file: ${error.message}`);
    }
  }

  /**
   * Import transactions from Excel file
   */
  async importTransactionsFromExcel(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    try {
      // Parse Excel
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const records = XLSX.utils.sheet_to_json(worksheet);

      // Process similar to CSV
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const rowNumber = i + 2;

        try {
          const validationResult = this.validateTransactionRecord(record);
          if (!validationResult.valid) {
            result.failed++;
            result.errors.push({
              row: rowNumber,
              error: validationResult.error,
              data: record,
            });
            continue;
          }

          // Similar processing as CSV
          let category = await this.categoriesService.findByName(
            userId,
            record.category || record.Category,
          );
          if (!category && record.category) {
            category = await this.categoriesService.create({
              userId,
              name: record.category || record.Category,
              type: record.type?.toLowerCase() === 'income' ? 'income' : 'expense',
            });
          }

          await this.transactionsService.create({
            userId,
            type: (record.type || record.Type || 'expense').toLowerCase(),
            amount: parseFloat(record.amount || record.Amount),
            currency: record.currency || record.Currency || 'USD',
            categoryId: category?._id,
            description: record.description || record.Description || '',
            date: new Date(record.date || record.Date),
            paymentMethod: record.paymentMethod || record['Payment Method'] || 'other',
            tags: record.tags
              ? record.tags.split(',').map((t: string) => t.trim())
              : [],
          });

          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push({
            row: rowNumber,
            error: error.message,
            data: record,
          });
        }
      }

      this.logger.logTransaction('bulk_import', userId, '', {
        totalRecords: records.length,
        success: result.success,
        failed: result.failed,
        fileType: 'excel',
      });

      return result;
    } catch (error) {
      this.logger.logError(error, 'import', { userId });
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
  }

  /**
   * Validate transaction record
   */
  private validateTransactionRecord(record: any): {
    valid: boolean;
    error?: string;
  } {
    // Required fields
    if (!record.date && !record.Date) {
      return { valid: false, error: 'Date is required' };
    }

    if (!record.amount && !record.Amount) {
      return { valid: false, error: 'Amount is required' };
    }

    // Validate date
    const date = new Date(record.date || record.Date);
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }

    // Validate amount
    const amount = parseFloat(record.amount || record.Amount);
    if (isNaN(amount) || amount <= 0) {
      return { valid: false, error: 'Invalid amount (must be a positive number)' };
    }

    // Validate type
    const type = (record.type || record.Type || 'expense').toLowerCase();
    if (!['income', 'expense'].includes(type)) {
      return { valid: false, error: 'Type must be "income" or "expense"' };
    }

    return { valid: true };
  }

  /**
   * Get import template (CSV)
   */
  generateImportTemplate(): string {
    const headers = [
      'Date',
      'Type',
      'Amount',
      'Currency',
      'Category',
      'Description',
      'Payment Method',
      'Tags',
    ];

    const exampleRow = [
      '2024-01-15',
      'expense',
      '150.50',
      'USD',
      'Food',
      'Grocery shopping',
      'card',
      'groceries, weekly',
    ];

    return [headers.join(','), exampleRow.join(',')].join('\n');
  }
}
```

**API Routes**:
Create `app/api/v1/transactions/import/csv/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { importService } from '@/lib/services/import.service';
import { validateFile } from '@/lib/utils/file-validation';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

  if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    validateFile(file);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileObj = {
      buffer,
      originalname: file.name,
      mimetype: file.type,
    } as any;

    const result = await importService.importTransactionsFromCSV(
    user.id,
      fileObj,
  );

    return NextResponse.json({
    success: true,
    data: result,
    message: `Imported ${result.success} transactions. ${result.failed} failed.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/transactions/import/excel/route.ts` (similar structure) and `app/api/v1/transactions/import/template/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { importService } from '@/lib/services/import.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const template = importService.generateImportTemplate();
    
    return new NextResponse(template, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=import-template.csv',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Import Validation & Error Handling

#### Validation Rules
1. **Required Fields**: Date, Amount, Type
2. **Data Types**: Validate date format, numeric amounts
3. **Business Rules**: Amount > 0, valid transaction type
4. **Category Validation**: Auto-create categories if missing
5. **Currency Validation**: Default to user's currency if missing

#### Error Handling
- **Row-level Errors**: Continue processing other rows
- **Detailed Error Report**: Return errors with row numbers
- **Partial Success**: Allow partial imports
- **Logging**: Log all import attempts and results

### Dependencies

Add to `package.json`:
```bash
npm install csv-writer
npm install csv-parse
npm install xlsx
npm install exceljs
npm install pdfkit
```

### API Endpoints Summary

**Version Information**:
```
GET  /api/versions                   # Get API version information
```

**Export Endpoints (v1)**:
```
GET  /api/v1/transactions/export/csv    # Export transactions as CSV
GET  /api/v1/transactions/export/excel   # Export transactions as Excel
GET  /api/v1/transactions/export/pdf     # Export transactions as PDF
GET  /api/v1/reports/export/excel       # Export full report as Excel
GET  /api/v1/reports/export/pdf         # Export full report as PDF
```

**Import Endpoints (v1)**:
```
POST /api/v1/transactions/import/csv    # Import transactions from CSV
POST /api/v1/transactions/import/excel  # Import transactions from Excel
GET  /api/v1/transactions/import/template # Download import template
```

**Note**: All endpoints use versioned URLs. Replace `/api/v1/` with appropriate version as needed.

### Best Practices

1. **File Size Limits**: Limit import file size (e.g., 10MB)
2. **Batch Processing**: Process large imports in batches
3. **Progress Tracking**: Provide progress updates for large imports
4. **Data Sanitization**: Sanitize all imported data
5. **Duplicate Detection**: Check for duplicate transactions
6. **Backup Before Import**: Suggest backup before large imports
7. **Preview Mode**: Allow users to preview before final import

---

## Security Considerations

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt (salt rounds: 10)
- Token expiration and refresh mechanism
- Role-based access control (if needed for future)
- Two-Factor Authentication (2FA) with TOTP

### Two-Factor Authentication (2FA)

#### Overview
FinMan implements Time-based One-Time Password (TOTP) two-factor authentication to add an extra layer of security. Users can enable 2FA using authenticator apps like Google Authenticator, Authy, or Microsoft Authenticator.

#### 2FA Setup

##### Step 1: Install Dependencies
```bash
npm install otplib
npm install qrcode
npm install speakeasy
npm install -D @types/qrcode
```

##### Step 2: Update User Schema
Add 2FA fields to User schema:
```typescript
{
  // ... existing fields
  twoFactorEnabled: Boolean (default: false),
  twoFactorSecret: String (encrypted, optional),
  twoFactorBackupCodes: [String] (encrypted, optional),
  twoFactorVerified: Boolean (default: false),
  twoFactorEnabledAt: Date (optional),
  twoFactorLastUsed: Date (optional)
}
```

##### Step 3: 2FA Service
Create `lib/services/two-factor.service.ts`:
```typescript
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { User } from '@/models/User';

export const twoFactorService = {
  appName: process.env.APP_NAME || 'FinMan',

  /**
   * Generate 2FA secret and QR code
   */
  async generateTwoFactorSecret(user: User): Promise<{
    secret: string;
    qrCodeUrl: string;
    manualEntryKey: string;
  }> {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${this.appName} (${user.email})`,
      issuer: this.appName,
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32!,
      qrCodeUrl,
      manualEntryKey: secret.base32!,
    };
  },

  /**
   * Verify TOTP token
   */
  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps (60 seconds) before/after
    });
  },

  /**
   * Generate backup codes
   */
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-digit backup code
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  },

  /**
   * Encrypt backup codes
   */
  encryptBackupCodes(codes: string[]): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(
      process.env.ENCRYPTION_KEY || '',
      'hex',
    );
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(codes), 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    // Combine IV, authTag, and encrypted data
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

  /**
   * Decrypt backup codes
   */
  decryptBackupCodes(encrypted: string): string[] {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(
      this.configService.get('ENCRYPTION_KEY') || '',
      'hex',
    );

    const data = Buffer.from(encrypted, 'base64');
    const iv = data.slice(0, 16);
    const authTag = data.slice(16, 32);
    const encryptedData = data.slice(32);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString('utf8'));
  }

  /**
   * Verify backup code
   */
  verifyBackupCode(encryptedCodes: string, code: string): boolean {
    try {
      const codes = this.decryptBackupCodes(encryptedCodes);
      const index = codes.indexOf(code.toUpperCase());
      
      if (index === -1) {
        return false;
      }

      // Remove used backup code
      codes.splice(index, 1);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate recovery codes (one-time use)
   */
  generateRecoveryCode(): string {
    return crypto.randomBytes(16).toString('hex').toUpperCase();
  }
}
```

##### Step 4: 2FA API Routes
Create `app/api/v1/auth/2fa/setup/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { twoFactorService } from '@/lib/services/two-factor.service';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { secret, qrCodeUrl, manualEntryKey } = await twoFactorService.generateTwoFactorSecret(dbUser);

    // Store secret temporarily (user needs to verify before enabling)
    dbUser.twoFactorSecret = secret;
    await dbUser.save();

    return NextResponse.json({
      success: true,
      data: {
        qrCodeUrl,
        manualEntryKey,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Create `app/api/v1/auth/2fa/verify/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { twoFactorService } from '@/lib/services/two-factor.service';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token: totpToken } = body;

    const dbUser = await User.findById(user.id);
    if (!dbUser || !dbUser.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA not set up' },
        { status: 400 }
      );
    }

    const isValid = twoFactorService.verifyToken(dbUser.twoFactorSecret, totpToken);

      if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Enable 2FA
    dbUser.twoFactorEnabled = true;
    dbUser.twoFactorVerified = true;
    dbUser.twoFactorEnabledAt = new Date();
    
    // Generate backup codes
    const backupCodes = twoFactorService.generateBackupCodes();
    dbUser.twoFactorBackupCodes = twoFactorService.encryptBackupCodes(backupCodes);
    
    await dbUser.save();

    return NextResponse.json({
      success: true,
      data: {
        backupCodes, // Show only once
        message: '2FA enabled successfully',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

**Note**: Create similar routes for `/disable`, `/backup-codes/regenerate`, `/status`, etc.
    private twoFactorService: TwoFactorService,
    private authService: AuthService,
    private usersService: UsersService,
    private auditService: AuditService,
  ) {}

**Note**: The 2FA API routes were already converted earlier. See the "Two-Factor Authentication (2FA)" section for the Next.js API route implementations.

For reference, here are the remaining 2FA endpoints that should be implemented as Next.js API routes:

- `POST /api/v1/auth/2fa/disable` - Disable 2FA
- `POST /api/v1/auth/2fa/backup-codes/regenerate` - Regenerate backup codes
- `GET /api/v1/auth/2fa/status` - Get 2FA status
- `POST /api/v1/auth/2fa/recover` - Account recovery
- `POST /api/v1/auth/2fa/verify-login` - Verify 2FA during login

All of these should follow the same pattern as the setup and verify routes shown earlier, using Next.js API routes with `verifyToken` for authentication.

**Example Implementation Pattern**:
```typescript
// app/api/v1/auth/2fa/disable/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { twoFactorService } from '@/lib/services/two-factor.service';
import { User } from '@/models/User';
import { auditService } from '@/lib/services/audit.service';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { password, token: twoFactorToken } = body;

    const dbUser = await User.findById(user.id);
    // Implementation: verify password, verify 2FA token if provided, disable 2FA
    
    return NextResponse.json({ success: true, message: '2FA disabled successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

##### Step 7: Environment Variables
Add to `.env`:
```env
# 2FA Configuration
ENCRYPTION_KEY=your-32-byte-hex-encryption-key  # Generate with: openssl rand -hex 32
APP_NAME=FinMan
2FA_ENABLED=true
2FA_ISSUER=FinMan
```

#### 2FA Verification Flow

1. **User logs in** with email and password
2. **If 2FA enabled**, system returns temporary token
3. **User enters 2FA code** from authenticator app
4. **System verifies code** and issues access token
5. **Backup codes** can be used if authenticator is unavailable

#### Recovery Procedures

##### Option 1: Backup Codes
- Users receive 10 backup codes when enabling 2FA
- Each code can be used once
- Codes can be regenerated (requires password)
- Codes are encrypted in database

##### Option 2: Account Recovery
```typescript
// app/api/v1/auth/2fa/recover/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import { auditService } from '@/lib/services/audit.service';
import { emailService } from '@/lib/services/email.service';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, recoveryCode } = body;
  
  // Verify recovery code (sent via email during 2FA setup)
  // Disable 2FA if recovery code is valid
  // Send email notification
  // Implementation here
}
```

##### Option 3: Admin Recovery
- Admin can disable 2FA for users (with proper authorization)
- Requires admin privileges and audit logging
- User is notified via email

#### Security Best Practices

1. **Encrypt Secrets**: Always encrypt 2FA secrets in database
2. **Time Window**: Use window of 2 time steps (60 seconds) for token verification
3. **Rate Limiting**: Limit 2FA verification attempts (e.g., 5 per 15 minutes)
4. **Backup Codes**: Encrypt and securely store backup codes
5. **Audit Logging**: Log all 2FA-related activities
6. **Session Management**: Invalidate sessions when 2FA is disabled
7. **Email Notifications**: Notify users when 2FA is enabled/disabled
8. **Recovery Options**: Provide multiple recovery methods
9. **Token Expiration**: Temporary tokens expire quickly (5 minutes)
10. **Device Trust**: Optionally remember trusted devices

#### 2FA API Endpoints

```
POST   /api/auth/2fa/setup              # Initiate 2FA setup
POST   /api/auth/2fa/verify             # Verify and enable 2FA
POST   /api/auth/2fa/disable            # Disable 2FA
POST   /api/auth/2fa/backup-codes/regenerate # Regenerate backup codes
GET    /api/auth/2fa/status             # Get 2FA status
POST   /api/auth/2fa/verify-login       # Verify 2FA during login
POST   /api/auth/2fa/recover            # Account recovery
```

#### Frontend Integration

```typescript
// React component for 2FA setup
const TwoFactorSetup = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [token, setToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleSetup = async () => {
    const response = await api.post('/api/auth/2fa/setup');
    setQrCode(response.data.data.qrCodeUrl);
  };

  const handleVerify = async () => {
    const response = await api.post('/api/auth/2fa/verify', { token });
    setBackupCodes(response.data.data.backupCodes);
    // Show backup codes modal
  };

  return (
    <div>
      {!qrCode && <button onClick={handleSetup}>Enable 2FA</button>}
      {qrCode && (
        <div>
          <img src={qrCode} alt="QR Code" />
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter 6-digit code"
          />
          <button onClick={handleVerify}>Verify</button>
        </div>
      )}
    </div>
  );
};
```

#### Rate Limiting for 2FA

```typescript
// Use Next.js middleware or a rate limiting library
// app/api/v1/auth/2fa/verify/route.ts
import { rateLimit } from '@/lib/utils/rate-limit';

const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export async function POST(request: NextRequest) {
  await limiter.check(5, request); // 5 requests per interval
  
  // Verification logic
}
```

#### Email Notifications for 2FA

- **2FA Enabled**: Send email confirmation with backup codes
- **2FA Disabled**: Send email notification
- **Backup Codes Regenerated**: Send email with new codes
- **Failed Verification Attempts**: Send security alert after multiple failures

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Validate and sanitize all user inputs
- Protect against XSS attacks
- Implement CSRF protection

### API Security
- Rate limiting on API endpoints
- Request validation
- Secure file uploads (type and size validation)
- API key protection for Gemini

### Database Security
- Use MongoDB authentication
- Implement connection string encryption
- Regular database backups
- Index optimization for performance

### Best Practices
- Never commit secrets to version control
- Use environment variables for configuration
- Regular dependency updates
- Security audits
- Input validation on both client and server

---

## Deployment Guide

### Environment Setup
1. Set up production MongoDB (MongoDB Atlas recommended)
2. Configure environment variables
3. Set up reverse proxy (Nginx)
4. Configure SSL certificate

### Build for Production
```bash
npm run build
```

### Deployment Options

#### Option 1: Traditional Server
- Deploy to VPS (DigitalOcean, AWS EC2, etc.)
- Use PM2 for process management
- Configure Nginx as reverse proxy
- Set up SSL with Let's Encrypt

#### Option 2: Cloud Platform
- **Vercel**: Good for serverless deployment
- **Heroku**: Easy deployment with add-ons
- **AWS**: Elastic Beanstalk or EC2
- **Google Cloud**: App Engine or Cloud Run
- **Azure**: App Service

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-secret-key>
GEMINI_API_KEY=<gemini-api-key>
CORS_ORIGIN=https://finman.finance
```

### Monitoring & Maintenance
- Set up error tracking (Sentry)
- Configure logging (Winston)
- Set up monitoring (PM2 monitoring or cloud services)
- Regular backups
- Performance monitoring

---

## Additional Resources

### Learning Resources
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Documentation: https://docs.mongodb.com
- Gemini API Documentation: https://ai.google.dev/docs
- TypeScript Handbook: https://www.typescriptlang.org/docs

### Useful Packages
- `node-cron` or Vercel Cron - Task scheduling
- `node-cache` or Redis - Caching
- `bull` or `bullmq` - Queue management
- `winston` - Logging
- `helmet` - Security headers
- `compression` - Response compression

### Development Workflow
1. Create feature branch
2. Implement feature
3. Write tests
4. Update documentation
5. Create pull request
6. Code review
7. Merge to main

---

## Conclusion

This documentation provides a comprehensive guide for building a full-featured financial and expense management system. Follow the structure, implement features incrementally, and ensure security and best practices throughout development.

For questions or clarifications, refer to the official documentation of the technologies used or consult the codebase as it develops.

---

**Document Version**: 1.0  
**Last Updated**: 24/11/2025
**Author**: Financial Management System Documentation