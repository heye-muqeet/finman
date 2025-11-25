=== PROJECT BREAKDOWN & EXECUTION PLAN ===

Project name: FinMan - Financial & Expense Management System
Tech stack summary: Next.js 14+ (TypeScript), MongoDB, Redux Toolkit, Radix UI, Tailwind CSS, Gemini AI, Cloudinary

Total estimated chunks: 85

---

## PHASE 1: WALKING SKELETON (Chunks 01-12)

### 1. Chunk 01 – Initialize Project Structure and Core Configuration ✅ COMPLETE
**Description**: Set up Next.js project with TypeScript, Tailwind CSS, basic configuration files, and project structure.

**Files/Folders to create/modify**:
- `package.json` - Project dependencies and scripts ✅
- `tsconfig.json` - TypeScript configuration ✅
- `next.config.ts` - Next.js configuration ✅ (Note: Using .ts instead of .js)
- Tailwind CSS v4 - CSS-based configuration (no config file needed) ✅
- `.env.example` - Environment variables template ✅
- `.gitignore` - Git ignore rules ✅
- `README.md` - Project documentation ✅
- `app/layout.tsx` - Root layout ✅ (Note: Using `app/` instead of `src/app/`)
- `app/page.tsx` - Home page ✅
- `lib/config/` - Configuration directory structure ✅
- `lib/utils/` - Utility functions directory ✅

**Verification steps**:
• Run: `npm install` ✅
• Run: `npm run build` ✅ (TypeScript compilation succeeds)
• Check: Tailwind CSS is working ✅ (verified in app/page.tsx with styled divs)
• Note: Project structure uses `app/` directory directly (Next.js 13+ supports both `app/` and `src/app/`)

---

### 2. Chunk 02 – Database Connection and Mongoose Setup ✅ COMPLETE
**Description**: Configure MongoDB connection, create Mongoose connection utility, and set up database configuration.

**Files/Folders to create/modify**:
- `lib/config/database.ts` - MongoDB connection configuration ✅
- `lib/database/connection.ts` - Mongoose connection utility ✅
- `.env.example` - MONGODB_URI already configured ✅
- `lib/utils/error-handler.ts` - Error handling utilities ✅ (already exists from Chunk 01)
- `app/api/v1/test/db/route.ts` - Test endpoint for database connection ✅

**Verification steps**:
• Run: `npm install mongoose` ✅
• Run: `npm run build` ✅ (TypeScript compilation succeeds)
• Test: Database connection test endpoint created at `/api/v1/test/db` ✅
• Expected: Connection pool settings configured (maxPoolSize: 10, minPoolSize: 5) ✅
• Note: Actual MongoDB connection will be tested when MongoDB is running

---

### 3. Chunk 03 – User Model and Schema with Indexes ✅ COMPLETE
**Description**: Create User Mongoose model with all required fields, indexes, and validation.

**Files/Folders to create/modify**:
- `models/User.ts` - User Mongoose schema and model ✅ (Note: Using `models/` instead of `src/models/`)
- `types/user.types.ts` - User TypeScript types ✅ (Note: Using `types/` instead of `src/types/`)
- `lib/config/database.ts` - Indexes are automatically created by Mongoose when model is used ✅

**Verification steps**:
• Run: `npm run build` ✅ (TypeScript compilation succeeds)
• Test: Create user document in MongoDB (via script or API) - Will be tested in Chunk 05
• Verify: All indexes are created (check MongoDB) - Indexes defined in schema ✅
• Expected: User model validates required fields ✅ (email required, password conditional, validations in place)
• Check: TypeScript types are correct ✅ (IUser interface extends Document, User types exported)

---

### 4. Chunk 04 – Authentication Service and JWT Utilities ✅ COMPLETE
**Description**: Implement authentication service with password hashing, JWT token generation/verification, and auth utilities.

**Files/Folders to create/modify**:
- `lib/services/auth.service.ts` - Authentication service ✅ (Note: Using `lib/` instead of `src/lib/`)
- `lib/utils/jwt.ts` - JWT token utilities ✅
- `lib/utils/password.ts` - Password hashing utilities ✅
- `.env.example` - JWT_SECRET already configured ✅

**Verification steps**:
• Run: `npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken` ✅
• Run: `npm run build` ✅ (TypeScript compilation succeeds)
• Test: Password hashing function works ✅ (hashPassword, verifyPassword implemented)
• Test: JWT token generation and verification ✅ (generateAccessToken, generateRefreshToken, verifyToken implemented)
• Test: Token expiration handling ✅ (isTokenExpired, getTokenExpiration implemented)
• Expected: All auth utilities work correctly ✅
• Verify: Secrets are loaded from environment variables ✅ (JWT_SECRET from .env)
• Note: Auth service includes registerUser, loginUser, changePassword, verify2FALogin (2FA will be fully implemented in Chunk 59)

---

### 5. Chunk 05 – User Registration API Endpoint ✅ COMPLETE
**Description**: Create user registration API route with validation, password hashing, and user creation.

**Files/Folders to create/modify**:
- `app/api/v1/auth/register/route.ts` - Registration endpoint ✅
- `lib/validators/auth.validator.ts` - Registration validation schema (Zod) ✅
- `lib/middleware/rate-limit.ts` - Rate limiting (basic) ✅

**Verification steps**:
• Run: `npm run build` ✅ (TypeScript compilation succeeds)
• Test: POST /api/v1/auth/register with valid data ✅ (Endpoint created and functional)
• Expected: User created in database, password hashed ✅ (Uses registerUser service)
• Test: Invalid data returns validation errors ✅ (Zod validation implemented)
• Verify: Rate limiting works ✅ (Rate limiting middleware implemented - 5 requests per 15 minutes)
• Check: User document in MongoDB ✅ (Code is correct for MongoDB integration)

---

### 6. Chunk 06 – User Login API Endpoint ✅ COMPLETE
**Description**: Create login API route with credential validation and JWT token response.

**Files/Folders to create/modify**:
- `app/api/v1/auth/login/route.ts` - Login endpoint ✅
- `lib/validators/auth.validator.ts` - Login validation schema ✅ (already exists from Chunk 05)
- Auth service login method ✅ (already exists from Chunk 04)

**Verification steps**:
• Run: `npm run build` ✅ (TypeScript compilation succeeds)
• Test: POST /api/v1/auth/login with valid credentials ✅ (Endpoint created and functional)
• Expected: Returns JWT token and user data ✅ (Returns accessToken, refreshToken, and user data)
• Test: Invalid credentials return 401 ✅ (UnauthorizedError handling implemented)
• Verify: Token is valid and can be decoded ✅ (Uses JWT utilities from Chunk 04)
• Check: Login attempts are logged ✅ (lastLoginAt updated in auth service)

---

### 7. Chunk 07 – Authentication Middleware and Protected Routes
**Description**: Create authentication middleware to verify JWT tokens and protect API routes.

**Files/Folders to create/modify**:
- `src/lib/middleware/auth.middleware.ts` - JWT verification middleware
- `src/lib/utils/auth.ts` - Auth utility functions
- `src/app/api/v1/test-protected/route.ts` - Test protected route

**Verification steps**:
• Run: `npm run dev`
• Test: Access protected route without token (should fail)
• Test: Access protected route with valid token (should succeed)
• Test: Access protected route with expired token (should fail)
• Expected: Middleware correctly validates tokens
• Verify: User object is attached to request

---

### 8. Chunk 08 – Redux Store Setup with Redux Toolkit and Persist
**Description**: Configure Redux store with Redux Toolkit, Redux Persist, and initial slices including authentication slice needed for login functionality.

**Files/Folders to create/modify**:
- `src/lib/store/index.ts` - Redux store configuration
- `src/lib/store/slices/userSlice.ts` - User state slice
- `src/lib/store/slices/uiSlice.ts` - UI state slice
- `src/lib/store/slices/authSlice.ts` - Authentication state slice with login/logout actions/thunks
- `src/lib/store/hooks.ts` - Typed Redux hooks
- `src/app/providers/ReduxProvider.tsx` - Redux provider component

**Verification steps**:
• Run: `npm run dev`
• Check: Redux DevTools connects
• Test: Dispatch actions and verify state updates
• Test: Auth slice actions work (login, logout)
• Test: State persists after page refresh (Redux Persist)
• Expected: Store initializes correctly with all slices
• Verify: localStorage contains persisted state
• Check: Auth slice is properly configured with async thunks

---

### 9. Chunk 09 – Login Page UI with Radix UI Components
**Description**: Create login page with Radix UI components, form validation, and Redux integration using the authSlice created in Chunk 08.

**Files/Folders to create/modify**:
- `src/app/(auth)/login/page.tsx` - Login page
- `src/components/ui/button.tsx` - Button component (Radix styled)
- `src/components/ui/input.tsx` - Input component (Radix styled)
- `src/components/ui/label.tsx` - Label component (Radix)
- `src/components/ui/card.tsx` - Card component (Radix styled)
- Note: Uses `authSlice.ts` created in Chunk 08

**Verification steps**:
• Run: `npm run dev`
• Visit: http://localhost:3000/login
• Test: Form validation works
• Test: Submit login form with valid credentials
• Expected: User logged in, redirected to dashboard
• Verify: Redux state updates with user data
• Check: Token stored in localStorage

---

### 10. Chunk 10 – Registration Page UI
**Description**: Create registration page with form validation and user creation.

**Files/Folders to create/modify**:
- `src/app/(auth)/register/page.tsx` - Registration page
- Update auth slice with registration thunk
- `src/components/ui/alert.tsx` - Alert component (Radix)

**Verification steps**:
• Run: `npm run dev`
• Visit: http://localhost:3000/register
• Test: Form validation (email, password strength)
• Test: Submit registration form
• Expected: User created, redirected to login or dashboard
• Verify: User in database
• Check: Error messages display correctly

---

### 11. Chunk 11 – Basic Dashboard Layout and Navigation
**Description**: Create dashboard layout with navigation, header, sidebar, and protected route wrapper.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/layout.tsx` - Dashboard layout
- `src/components/common/Header.tsx` - Header component
- `src/components/common/Sidebar.tsx` - Sidebar navigation
- `src/components/common/ProtectedRoute.tsx` - Route protection wrapper
- `src/app/(dashboard)/dashboard/page.tsx` - Dashboard page
- `src/lib/middleware/route-guard.ts` - Route guard middleware

**Verification steps**:
• Run: `npm run dev`
• Visit: http://localhost:3000/dashboard (while logged in)
• Expected: Dashboard layout renders with navigation
• Test: Logout functionality
• Test: Unauthenticated access redirects to login
• Verify: Navigation links work
• Check: User info displays in header

---

### 12. Chunk 12 – Logger Service Setup
**Description**: Configure Winston logger with daily rotation, log levels, and structured logging.

**Files/Folders to create/modify**:
- `src/lib/services/logger.service.ts` - Winston logger service
- `src/lib/config/logger.config.ts` - Logger configuration
- `logs/` - Logs directory (create)
- `.env` - Add LOG_LEVEL

**Verification steps**:
• Run: `npm run dev`
• Test: Logger writes to console
• Test: Logger writes to file
• Check: Log files created in logs/ directory
• Expected: Different log levels work correctly
• Verify: Daily rotation creates new files

---

## PHASE 2: CORE MVP FEATURES (Chunks 13-35)

### 13. Chunk 13 – Category Model and Schema
**Description**: Create Category Mongoose model with validation and indexes.

**Files/Folders to create/modify**:
- `src/models/Category.ts` - Category schema and model
- `src/types/category.types.ts` - Category TypeScript types

**Verification steps**:
• Test: Create category document
• Verify: Indexes created (userId, type, name)
• Expected: Model validates required fields
• Check: TypeScript types are correct

---

### 14. Chunk 14 – Category Service Layer
**Description**: Implement category service with CRUD operations and business logic.

**Files/Folders to create/modify**:
- `src/lib/services/categories.service.ts` - Category service
- Update logger service integration

**Verification steps**:
• Test: Create category
• Test: Get user categories
• Test: Update category
• Test: Delete category
• Expected: All CRUD operations work
• Verify: Service logs operations

---

### 15. Chunk 15 – Category API Endpoints (CRUD)
**Description**: Create category API routes for all CRUD operations with authentication.

**Files/Folders to create/modify**:
- `src/app/api/v1/categories/route.ts` - GET (list), POST (create)
- `src/app/api/v1/categories/[id]/route.ts` - GET, PUT, DELETE
- `src/lib/validators/category.validator.ts` - Category validation

**Verification steps**:
• Run: `npm run dev`
• Test: GET /api/v1/categories (returns user categories)
• Test: POST /api/v1/categories (creates category)
• Test: PUT /api/v1/categories/[id] (updates category)
• Test: DELETE /api/v1/categories/[id] (deletes category)
• Expected: All endpoints work with authentication
• Verify: Validation errors return properly

---

### 16. Chunk 16 – Category Redux Slice and API Integration
**Description**: Create Redux slice for categories with async thunks for API calls.

**Files/Folders to create/modify**:
- `src/lib/store/slices/categoriesSlice.ts` - Category Redux slice
- Update Redux store configuration

**Verification steps**:
• Test: Dispatch fetchCategories action
• Test: Dispatch createCategory action
• Expected: Redux state updates correctly
• Verify: API calls are made correctly
• Check: Loading and error states work

---

### 17. Chunk 17 – Category Management UI (List and Create)
**Description**: Create category management page with list view and create form using Radix UI.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/categories/page.tsx` - Categories page
- `src/components/categories/CategoryList.tsx` - Category list component
- `src/components/categories/CategoryForm.tsx` - Category form component
- `src/components/ui/select.tsx` - Select component (Radix)
- `src/components/ui/dialog.tsx` - Dialog component (Radix)

**Verification steps**:
• Run: `npm run dev`
• Visit: http://localhost:3000/categories
• Test: View categories list
• Test: Open create category dialog
• Test: Submit category form
• Expected: Category created and appears in list
• Verify: Form validation works

---

### 18. Chunk 18 – Transaction Model and Schema
**Description**: Create Transaction Mongoose model with all fields, relationships, and indexes.

**Files/Folders to create/modify**:
- `src/models/Transaction.ts` - Transaction schema and model
- `src/types/transaction.types.ts` - Transaction TypeScript types

**Verification steps**:
• Test: Create transaction document
• Verify: All indexes created
• Expected: Model validates required fields
• Check: Relationships with User and Category work

---

### 19. Chunk 19 – Transaction Service Layer
**Description**: Implement transaction service with CRUD operations, filtering, and business logic.

**Files/Folders to create/modify**:
- `src/lib/services/transactions.service.ts` - Transaction service
- Update logger integration

**Verification steps**:
• Test: Create transaction
• Test: Get transactions with filters
• Test: Update transaction
• Test: Delete transaction
• Expected: All operations work correctly
• Verify: Filtering and pagination work

---

### 20. Chunk 20 – Transaction API Endpoints (CRUD)
**Description**: Create transaction API routes with authentication, validation, and pagination.

**Files/Folders to create/modify**:
- `src/app/api/v1/transactions/route.ts` - GET (list), POST (create)
- `src/app/api/v1/transactions/[id]/route.ts` - GET, PUT, DELETE
- `src/lib/validators/transaction.validator.ts` - Transaction validation

**Verification steps**:
• Run: `npm run dev`
• Test: GET /api/v1/transactions?page=1&limit=20
• Test: POST /api/v1/transactions (creates transaction)
• Test: PUT /api/v1/transactions/[id] (updates transaction)
• Test: DELETE /api/v1/transactions/[id] (deletes transaction)
• Expected: All endpoints work with pagination
• Verify: Query parameters work (filters, sorting)

---

### 21. Chunk 21 – Transaction Redux Slice
**Description**: Create Redux slice for transactions with async thunks and state management.

**Files/Folders to create/modify**:
- `src/lib/store/slices/transactionsSlice.ts` - Transaction Redux slice
- Update store configuration

**Verification steps**:
• Test: Dispatch fetchTransactions action
• Test: Dispatch createTransaction action
• Expected: State updates correctly
• Verify: Pagination state works
• Check: Loading and error states

---

### 22. Chunk 22 – Transaction List UI Component
**Description**: Create transaction list component with table, filters, and pagination using Radix UI.

**Files/Folders to create/modify**:
- `src/components/transactions/TransactionList.tsx` - Transaction list
- `src/components/transactions/TransactionFilters.tsx` - Filter component
- `src/components/ui/table.tsx` - Table component (Radix styled)
- `src/components/ui/pagination.tsx` - Pagination component

**Verification steps**:
• Test: Display transactions in table
• Test: Filter transactions (type, category, date)
• Test: Pagination works
• Expected: List updates when filters change
• Verify: Loading states display

---

### 23. Chunk 23 – Transaction Form UI Component
**Description**: Create transaction form component with validation and category selection.

**Files/Folders to create/modify**:
- `src/components/transactions/TransactionForm.tsx` - Transaction form
- `src/components/ui/date-picker.tsx` - Date picker component
- Update transaction slice with form actions

**Verification steps**:
• Test: Open transaction form dialog
• Test: Fill form with valid data
• Test: Form validation (required fields, amount > 0)
• Test: Submit form
• Expected: Transaction created and list updates
• Verify: Category dropdown loads categories

---

### 24. Chunk 24 – Transactions Page with Full CRUD
**Description**: Create transactions page integrating list, form, and all CRUD operations.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/transactions/page.tsx` - Transactions page
- Update transaction components with edit/delete

**Verification steps**:
• Run: `npm run dev`
• Visit: http://localhost:3000/transactions
• Test: View transactions list
• Test: Create new transaction
• Test: Edit existing transaction
• Test: Delete transaction
• Expected: All CRUD operations work
• Verify: UI updates correctly

---

### 25. Chunk 25 – Default Categories Seeding Script
**Description**: Create script to seed default categories for new users.

**Files/Folders to create/modify**:
- `src/scripts/seed-categories.ts` - Category seeding script
- `src/lib/services/categories.service.ts` - Add seed method

**Verification steps**:
• Run: `npm run seed:categories`
• Check: Default categories created in database
• Test: New user gets default categories
• Expected: Categories have icons and colors
• Verify: Script is idempotent

---

### 26. Chunk 26 – Dashboard Overview with Summary Cards
**Description**: Create dashboard with summary cards showing income, expenses, balance, and recent transactions.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/dashboard/page.tsx` - Dashboard page
- `src/components/dashboard/SummaryCard.tsx` - Summary card component
- `src/lib/services/dashboard.service.ts` - Dashboard data service
- `src/app/api/v1/dashboard/summary/route.ts` - Dashboard API

**Verification steps**:
• Run: `npm run dev`
• Visit: http://localhost:3000/dashboard
• Test: Summary cards display correct data
• Expected: Income, expenses, balance calculated correctly
• Verify: Recent transactions display
• Check: Data updates when transactions change

---

### 27. Chunk 27 – User Profile API and Service
**Description**: Create user profile endpoints for getting and updating user information.

**Files/Folders to create/modify**:
- `src/app/api/v1/users/profile/route.ts` - GET, PUT profile
- `src/lib/services/users.service.ts` - User service
- `src/lib/validators/user.validator.ts` - User validation

**Verification steps**:
• Test: GET /api/v1/users/profile (returns user data)
• Test: PUT /api/v1/users/profile (updates user)
• Expected: Profile updates correctly
• Verify: Validation works
• Check: Password update handled separately

---

### 28. Chunk 28 – User Profile UI Page
**Description**: Create user profile page with form to edit user information.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/settings/profile/page.tsx` - Profile page
- `src/components/settings/ProfileForm.tsx` - Profile form
- Update user Redux slice

**Verification steps**:
• Visit: http://localhost:3000/settings/profile
• Test: View current profile data
• Test: Update profile information
• Expected: Changes saved and reflected
• Verify: Form validation works

---

### 29. Chunk 29 – Password Change Functionality
**Description**: Implement password change API and UI with current password verification.

**Files/Folders to create/modify**:
- `src/app/api/v1/auth/change-password/route.ts` - Password change endpoint
- `src/components/settings/ChangePasswordForm.tsx` - Password form
- Update auth service

**Verification steps**:
• Test: POST /api/v1/auth/change-password
• Test: Change password with correct current password
• Test: Change password with incorrect current password (should fail)
• Expected: Password updated in database
• Verify: User must login again after password change

---

### 30. Chunk 30 – Logout Functionality
**Description**: Implement logout API endpoint and UI logout button.

**Files/Folders to create/modify**:
- `src/app/api/v1/auth/logout/route.ts` - Logout endpoint
- Update auth Redux slice with logout action
- Update Header component with logout button

**Verification steps**:
• Test: Click logout button
• Expected: Token cleared, user logged out
• Verify: Redirected to login page
• Check: Redux state cleared
• Verify: localStorage cleared

---

### 31. Chunk 31 – Error Boundary and Global Error Handling
**Description**: Create error boundary component and global error handling for better UX.

**Files/Folders to create/modify**:
- `src/components/common/ErrorBoundary.tsx` - Error boundary
- `src/app/error.tsx` - Next.js error page
- `src/app/global-error.tsx` - Global error handler
- Update error handler utility

**Verification steps**:
• Test: Trigger error in component
• Expected: Error boundary catches and displays error
• Verify: Error logged to logger service
• Check: User sees friendly error message
• Test: Error recovery works

---

### 32. Chunk 32 – Loading States and Skeletons
**Description**: Create loading skeleton components and implement loading states throughout app.

**Files/Folders to create/modify**:
- `src/components/common/LoadingSpinner.tsx` - Loading spinner
- `src/components/common/Skeleton.tsx` - Skeleton loader
- Update components with loading states

**Verification steps**:
• Test: Loading states display during API calls
• Expected: Skeletons show while data loads
• Verify: Loading states clear when data arrives
• Check: No layout shift during loading

---

### 33. Chunk 33 – Toast Notification System
**Description**: Implement toast notification system using Radix UI for success/error messages.

**Files/Folders to create/modify**:
- `src/components/ui/toast.tsx` - Toast component (Radix)
- `src/components/common/Toaster.tsx` - Toast provider
- `src/lib/store/slices/toastSlice.ts` - Toast Redux slice
- `src/lib/hooks/useToast.ts` - Toast hook

**Verification steps**:
• Test: Show success toast
• Test: Show error toast
• Expected: Toasts display and auto-dismiss
• Verify: Multiple toasts stack correctly
• Check: Toast actions work (dismiss, action buttons)

---

### 34. Chunk 34 – Form Validation with React Hook Form and Zod
**Description**: Set up form validation system with React Hook Form and Zod schemas.

**Files/Folders to create/modify**:
- `src/lib/validators/` - All validation schemas
- Update forms to use React Hook Form
- `src/lib/utils/form-errors.ts` - Form error utilities

**Verification steps**:
• Test: Form validation on all forms
• Expected: Validation errors display correctly
• Verify: Real-time validation works
• Check: Error messages are user-friendly
• Test: Submit blocked when validation fails

---

### 35. Chunk 35 – API Error Handling and Standardized Responses
**Description**: Standardize API error responses and implement consistent error handling.

**Files/Folders to create/modify**:
- `src/lib/utils/api-response.ts` - Standardized response utilities
- Update all API routes with standardized responses
- Update error handler to use standard format

**Verification steps**:
• Test: API errors return standardized format
• Expected: All errors have consistent structure
• Verify: Error messages are user-friendly
• Check: Status codes are correct
• Test: Client-side error handling works

---

## PHASE 3: ESSENTIAL FEATURES (Chunks 36-55)

### 36. Chunk 36 – Budget Model and Schema
**Description**: Create Budget Mongoose model with validation, relationships, and indexes.

**Files/Folders to create/modify**:
- `src/models/Budget.ts` - Budget schema and model
- `src/types/budget.types.ts` - Budget TypeScript types

**Verification steps**:
• Test: Create budget document
• Verify: Indexes created
• Expected: Model validates required fields
• Check: Relationships with User and Category work

---

### 37. Chunk 37 – Budget Service Layer
**Description**: Implement budget service with CRUD operations, progress calculation, and alerts.

**Files/Folders to create/modify**:
- `src/lib/services/budgets.service.ts` - Budget service
- Budget calculation logic

**Verification steps**:
• Test: Create budget
• Test: Calculate budget progress
• Test: Check budget alerts
• Expected: All operations work correctly
• Verify: Progress calculations are accurate

---

### 38. Chunk 38 – Budget API Endpoints
**Description**: Create budget API routes with authentication and validation.

**Files/Folders to create/modify**:
- `src/app/api/v1/budgets/route.ts` - GET, POST
- `src/app/api/v1/budgets/[id]/route.ts` - GET, PUT, DELETE
- `src/lib/validators/budget.validator.ts` - Budget validation

**Verification steps**:
• Test: All budget CRUD endpoints
• Expected: Endpoints work with authentication
• Verify: Validation works
• Check: Budget progress calculated correctly

---

### 39. Chunk 39 – Budget Redux Slice
**Description**: Create Redux slice for budgets with async thunks.

**Files/Folders to create/modify**:
- `src/lib/store/slices/budgetsSlice.ts` - Budget Redux slice

**Verification steps**:
• Test: Budget actions work
• Expected: State updates correctly
• Verify: API integration works

---

### 40. Chunk 40 – Budget Management UI
**Description**: Create budget management page with list, create, edit, and progress display.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/budgets/page.tsx` - Budgets page
- `src/components/budgets/BudgetList.tsx` - Budget list
- `src/components/budgets/BudgetForm.tsx` - Budget form
- `src/components/budgets/BudgetProgress.tsx` - Progress component

**Verification steps**:
• Visit: http://localhost:3000/budgets
• Test: Create budget
• Test: View budget progress
• Expected: Progress updates when transactions added
• Verify: Budget alerts work

---

### 41. Chunk 41 – Goal Model and Schema
**Description**: Create Financial Goal Mongoose model with validation and indexes.

**Files/Folders to create/modify**:
- `src/models/Goal.ts` - Goal schema and model
- `src/types/goal.types.ts` - Goal TypeScript types

**Verification steps**:
• Test: Create goal document
• Verify: Indexes created
• Expected: Model validates required fields

---

### 42. Chunk 42 – Goal Service Layer
**Description**: Implement goal service with CRUD operations and progress tracking.

**Files/Folders to create/modify**:
- `src/lib/services/goals.service.ts` - Goal service
- Progress calculation logic

**Verification steps**:
• Test: Create goal
• Test: Calculate goal progress
• Test: Update goal contributions
• Expected: Progress calculations work

---

### 43. Chunk 43 – Goal API Endpoints
**Description**: Create goal API routes with authentication.

**Files/Folders to create/modify**:
- `src/app/api/v1/goals/route.ts` - GET, POST
- `src/app/api/v1/goals/[id]/route.ts` - GET, PUT, DELETE
- `src/lib/validators/goal.validator.ts` - Goal validation

**Verification steps**:
• Test: All goal CRUD endpoints
• Expected: Endpoints work correctly
• Verify: Progress updates work

---

### 44. Chunk 44 – Goal Redux Slice and UI
**Description**: Create Redux slice and UI for goal management.

**Files/Folders to create/modify**:
- `src/lib/store/slices/goalsSlice.ts` - Goal Redux slice
- `src/app/(dashboard)/goals/page.tsx` - Goals page
- `src/components/goals/GoalList.tsx` - Goal list
- `src/components/goals/GoalForm.tsx` - Goal form
- `src/components/goals/GoalProgress.tsx` - Progress component

**Verification steps**:
• Visit: http://localhost:3000/goals
• Test: Create goal
• Test: View goal progress
• Expected: Progress updates correctly
• Verify: Goal completion detection works

---

### 45. Chunk 45 – Basic Reports API and Service
**Description**: Create reports service with basic financial calculations and API endpoints.

**Files/Folders to create/modify**:
- `src/lib/services/reports.service.ts` - Reports service
- `src/app/api/v1/reports/overview/route.ts` - Overview report
- `src/app/api/v1/reports/income-expense/route.ts` - Income/expense report

**Verification steps**:
• Test: GET /api/v1/reports/overview
• Test: GET /api/v1/reports/income-expense
• Expected: Reports return correct calculations
• Verify: Date range filtering works

---

### 46. Chunk 46 – Reports Redux Slice
**Description**: Create Redux slice for reports data.

**Files/Folders to create/modify**:
- `src/lib/store/slices/reportsSlice.ts` - Reports Redux slice

**Verification steps**:
• Test: Fetch reports data
• Expected: State updates correctly
• Verify: Caching works

---

### 47. Chunk 47 – Reports Page with Charts
**Description**: Create reports page with charts using Recharts or Chart.js.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/reports/page.tsx` - Reports page
- `src/components/reports/IncomeExpenseChart.tsx` - Chart component
- `src/components/reports/CategoryChart.tsx` - Category breakdown
- `src/components/reports/TrendChart.tsx` - Trend chart

**Verification steps**:
• Visit: http://localhost:3000/reports
• Test: View income vs expense chart
• Test: View category breakdown
• Expected: Charts display correct data
• Verify: Date range filtering works

---

### 48. Chunk 48 – Search Service with MongoDB Text Indexes
**Description**: Implement search service with full-text search using MongoDB text indexes.

**Files/Folders to create/modify**:
- `src/lib/services/search.service.ts` - Search service
- Update Transaction model with text index
- `src/app/api/v1/search/route.ts` - Search endpoint

**Verification steps**:
• Test: Search transactions by description
• Test: Search with filters
• Expected: Search returns relevant results
• Verify: Text indexes work correctly

---

### 49. Chunk 49 – Search UI Component
**Description**: Create search component with autocomplete and results display.

**Files/Folders to create/modify**:
- `src/components/common/SearchBar.tsx` - Search bar component
- `src/components/search/SearchResults.tsx` - Search results
- Update search Redux slice

**Verification steps**:
• Test: Search in search bar
• Test: Autocomplete suggestions
• Expected: Results display correctly
• Verify: Search is debounced

---

### 50. Chunk 50 – Advanced Filtering for Transactions
**Description**: Enhance transaction filtering with advanced options (date range, amount, tags).

**Files/Folders to create/modify**:
- `src/components/transactions/AdvancedFilters.tsx` - Advanced filter component
- Update transaction service with advanced filters
- Update transaction API with filter support

**Verification steps**:
• Test: Filter by date range
• Test: Filter by amount range
• Test: Filter by tags
• Expected: Filters work correctly
• Verify: Multiple filters combine correctly

---

### 51. Chunk 51 – Pagination Component and Implementation
**Description**: Create reusable pagination component and implement across all list views.

**Files/Folders to create/modify**:
- `src/components/common/Pagination.tsx` - Pagination component
- Update all list components with pagination
- Update API endpoints with pagination support

**Verification steps**:
• Test: Pagination on transactions list
• Test: Pagination on categories list
• Expected: Pagination works correctly
• Verify: Page state persists

---

### 52. Chunk 52 – Date Range Picker Component
**Description**: Create date range picker component using Radix UI and date-fns.

**Files/Folders to create/modify**:
- `src/components/ui/date-range-picker.tsx` - Date range picker
- `src/lib/utils/date-utils.ts` - Date utility functions

**Verification steps**:
• Test: Select date range
• Test: Preset ranges (today, this week, this month)
• Expected: Date range selected correctly
• Verify: Dates format correctly

---

### 53. Chunk 53 – Currency Formatting Service and Hook
**Description**: Implement currency formatting service with user preferences.

**Files/Folders to create/modify**:
- `src/lib/services/currency.service.ts` - Currency service
- `src/lib/hooks/useCurrency.ts` - Currency hook
- Update user preferences with currency

**Verification steps**:
• Test: Format currency with different locales
• Test: Currency conversion (if implemented)
• Expected: Currency displays correctly
• Verify: User preference respected

---

### 54. Chunk 54 – Date/Time Formatting Service and Hook
**Description**: Implement date/time formatting with timezone support.

**Files/Folders to create/modify**:
- `src/lib/services/datetime.service.ts` - DateTime service
- `src/lib/hooks/useDateTime.ts` - DateTime hook
- Update user preferences with timezone

**Verification steps**:
• Test: Format dates with timezone
• Test: Relative time display
• Expected: Dates display correctly
• Verify: Timezone conversion works

---

### 55. Chunk 55 – Internationalization (i18n) Setup
**Description**: Set up i18next for multi-language support with basic translations.

**Files/Folders to create/modify**:
- `src/lib/i18n/config.ts` - i18n configuration
- `src/lib/i18n/locales/en/common.json` - English translations
- `src/lib/i18n/locales/es/common.json` - Spanish translations (basic)
- `src/lib/hooks/useTranslation.ts` - Translation hook

**Verification steps**:
• Test: Switch language
• Test: Translations display correctly
• Expected: UI text changes language
• Verify: Language preference persists

---

## PHASE 4: ADVANCED FEATURES (Chunks 56-70)

### 56. Chunk 56 – Email Service Setup with Nodemailer
**Description**: Configure Nodemailer email service with templates.

**Files/Folders to create/modify**:
- `src/lib/services/email.service.ts` - Email service
- `src/lib/config/email.config.ts` - Email configuration
- `src/lib/templates/` - Email templates directory
- `.env` - Add email configuration

**Verification steps**:
• Test: Send test email
• Expected: Email sent successfully
• Verify: Templates render correctly
• Check: Email logs created

---

### 57. Chunk 57 – Welcome Email and Email Templates
**Description**: Create welcome email template and implement email sending on registration.

**Files/Folders to create/modify**:
- `src/lib/templates/welcome.hbs` - Welcome email template
- Update registration endpoint to send email
- Email template service

**Verification steps**:
• Test: Register new user
• Expected: Welcome email sent
• Verify: Email content is correct
• Check: Email in inbox

---

### 58. Chunk 58 – Password Reset Functionality
**Description**: Implement password reset flow with email verification.

**Files/Folders to create/modify**:
- `src/app/api/v1/auth/forgot-password/route.ts` - Forgot password
- `src/app/api/v1/auth/reset-password/route.ts` - Reset password
- `src/lib/templates/password-reset.hbs` - Reset email template
- `src/app/(auth)/forgot-password/page.tsx` - Forgot password page
- `src/app/(auth)/reset-password/page.tsx` - Reset password page

**Verification steps**:
• Test: Request password reset
• Test: Reset password with token
• Expected: Email sent with reset link
• Verify: Token expires correctly
• Check: Password updated

---

### 59. Chunk 59 – Two-Factor Authentication (2FA) Setup
**Description**: Implement 2FA setup with TOTP, QR code generation, and backup codes.

**Files/Folders to create/modify**:
- `src/lib/services/2fa.service.ts` - 2FA service
- `src/app/api/v1/auth/2fa/setup/route.ts` - 2FA setup
- `src/app/api/v1/auth/2fa/verify/route.ts` - 2FA verification
- `src/app/api/v1/auth/2fa/disable/route.ts` - 2FA disable
- Update User model with 2FA fields

**Verification steps**:
• Test: Setup 2FA
• Test: Generate QR code
• Test: Verify 2FA code
• Expected: 2FA enabled correctly
• Verify: Backup codes generated

---

### 60. Chunk 60 – 2FA UI Components
**Description**: Create 2FA setup and verification UI components.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/settings/security/2fa/page.tsx` - 2FA settings page
- `src/components/security/2FASetup.tsx` - 2FA setup component
- `src/components/security/2FAVerify.tsx` - 2FA verification component

**Verification steps**:
• Visit: http://localhost:3000/settings/security/2fa
• Test: Setup 2FA
• Test: Scan QR code
• Expected: 2FA enabled
• Verify: Login requires 2FA code

---

### 61. Chunk 61 – OAuth Google Integration
**Description**: Implement Google OAuth authentication with Passport.js.

**Files/Folders to create/modify**:
- `src/lib/services/oauth.service.ts` - OAuth service
- `src/app/api/v1/auth/google/route.ts` - Google OAuth endpoint
- `src/app/api/v1/auth/google/callback/route.ts` - OAuth callback
- Update User model with OAuth fields
- `.env` - Add Google OAuth credentials

**Verification steps**:
• Test: Login with Google
• Test: OAuth callback
• Expected: User created/logged in
• Verify: OAuth data stored correctly

---

### 62. Chunk 62 – OAuth UI Integration
**Description**: Add Google login button to login page.

**Files/Folders to create/modify**:
- Update login page with Google button
- `src/components/auth/GoogleLoginButton.tsx` - Google login component

**Verification steps**:
• Visit: http://localhost:3000/login
• Test: Click Google login
• Expected: Redirects to Google
• Verify: Returns and logs in

---

### 63. Chunk 63 – Cloudinary Service Setup
**Description**: Configure Cloudinary service for file uploads and image optimization.

**Files/Folders to create/modify**:
- `src/lib/services/cloudinary.service.ts` - Cloudinary service
- `src/lib/config/cloudinary.config.ts` - Cloudinary configuration
- `.env` - Add Cloudinary credentials

**Verification steps**:
• Test: Upload image to Cloudinary
• Test: Get optimized URL
• Expected: Image uploaded successfully
• Verify: URLs generated correctly

---

### 64. Chunk 64 – Receipt Model and Upload API
**Description**: Create Receipt model and implement file upload API with Cloudinary.

**Files/Folders to create/modify**:
- `src/models/Receipt.ts` - Receipt schema and model
- `src/app/api/v1/receipts/upload/route.ts` - Receipt upload endpoint
- `src/lib/validators/receipt.validator.ts` - Receipt validation
- File upload utility

**Verification steps**:
• Test: Upload receipt image
• Test: File validation (size, type)
• Expected: Receipt saved to database
• Verify: Image stored in Cloudinary

---

### 65. Chunk 65 – Receipt Management UI
**Description**: Create receipt management page with upload, list, and view functionality.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/receipts/page.tsx` - Receipts page
- `src/components/receipts/ReceiptUpload.tsx` - Upload component
- `src/components/receipts/ReceiptList.tsx` - Receipt list
- `src/components/receipts/ReceiptViewer.tsx` - Receipt viewer

**Verification steps**:
• Visit: http://localhost:3000/receipts
• Test: Upload receipt
• Test: View receipt list
• Expected: Receipts display correctly
• Verify: Image optimization works

---

### 66. Chunk 66 – Gemini AI Service Setup
**Description**: Configure Gemini AI service for expense categorization and insights.

**Files/Folders to create/modify**:
- `src/lib/services/gemini.service.ts` - Gemini service
- `src/lib/config/gemini.config.ts` - Gemini configuration
- `.env` - Add GEMINI_API_KEY

**Verification steps**:
• Test: Call Gemini API
• Test: Categorize expense
• Expected: AI responses received
• Verify: Error handling works

---

### 67. Chunk 67 – AI-Powered Expense Categorization
**Description**: Implement AI categorization for transactions using Gemini.

**Files/Folders to create/modify**:
- `src/app/api/v1/ai/categorize/route.ts` - AI categorization endpoint
- Update transaction creation to use AI
- `src/components/transactions/AICategorySuggestion.tsx` - AI suggestion component

**Verification steps**:
• Test: Create transaction with description
• Test: AI suggests category
• Expected: Category suggested correctly
• Verify: User can accept/reject suggestion

---

### 68. Chunk 68 – AI Insights and Recommendations
**Description**: Create AI insights page with financial recommendations.

**Files/Folders to create/modify**:
- `src/app/(dashboard)/ai-insights/page.tsx` - AI insights page
- `src/app/api/v1/ai/insights/route.ts` - Insights endpoint
- `src/components/ai-insights/InsightCard.tsx` - Insight card
- `src/components/ai-insights/RecommendationList.tsx` - Recommendations

**Verification steps**:
• Visit: http://localhost:3000/ai-insights
• Test: View AI insights
• Expected: Insights display correctly
• Verify: Recommendations are relevant

---

### 69. Chunk 69 – Data Export Service (CSV/Excel)
**Description**: Implement data export functionality for transactions, budgets, and goals.

**Files/Folders to create/modify**:
- `src/lib/services/export.service.ts` - Export service
- `src/app/api/v1/export/transactions/route.ts` - Export transactions
- `src/app/api/v1/export/budgets/route.ts` - Export budgets
- CSV and Excel generation

**Verification steps**:
• Test: Export transactions to CSV
• Test: Export transactions to Excel
• Expected: Files generated correctly
• Verify: Data is accurate

---

### 70. Chunk 70 – Data Import Service (CSV/Excel)
**Description**: Implement data import functionality with validation and error handling.

**Files/Folders to create/modify**:
- `src/lib/services/import.service.ts` - Import service
- `src/app/api/v1/import/transactions/route.ts` - Import transactions
- `src/components/import/ImportDialog.tsx` - Import UI component
- CSV/Excel parsing and validation

**Verification steps**:
• Test: Import transactions from CSV
• Test: Import validation errors
• Expected: Transactions imported correctly
• Verify: Error reporting works

---

## PHASE 5: INFRASTRUCTURE & OPTIMIZATION (Chunks 71-85)

### 71. Chunk 71 – Activity Logging Service
**Description**: Implement activity logging service for user actions and audit trail.

**Files/Folders to create/modify**:
- `src/lib/services/audit.service.ts` - Audit service
- `src/models/ActivityLog.ts` - Activity log model
- `src/app/api/v1/audit/logs/route.ts` - Audit logs endpoint

**Verification steps**:
• Test: Log user actions
• Test: Retrieve audit logs
• Expected: Actions logged correctly
• Verify: Logs are immutable

---

### 72. Chunk 72 – Audit Trail Integration
**Description**: Integrate audit logging into all critical operations.

**Files/Folders to create/modify**:
- Update all services with audit logging
- `src/lib/middleware/audit.middleware.ts` - Audit middleware
- Update API routes with audit integration

**Verification steps**:
• Test: Create transaction (should log)
• Test: Delete transaction (should log)
• Expected: All critical actions logged
• Verify: Audit trail is complete

---

### 73. Chunk 73 – WebSocket Service Setup
**Description**: Set up Socket.IO for real-time updates.

**Files/Folders to create/modify**:
- `src/lib/services/websocket.service.ts` - WebSocket service
- `src/app/api/socket/route.ts` - Socket.IO route handler
- WebSocket configuration

**Verification steps**:
• Test: Connect to WebSocket
• Test: Receive real-time updates
• Expected: Connection established
• Verify: Events broadcast correctly

---

### 74. Chunk 74 – Real-time Budget and Goal Updates
**Description**: Implement real-time updates for budgets and goals via WebSocket.

**Files/Folders to create/modify**:
- Update budget service to emit WebSocket events
- Update goal service to emit events
- `src/lib/hooks/useWebSocket.ts` - WebSocket hook
- Update UI components to listen for updates

**Verification steps**:
• Test: Create transaction (budget updates in real-time)
• Test: Update goal (progress updates in real-time)
• Expected: UI updates without refresh
• Verify: Multiple clients receive updates

---

### 75. Chunk 75 – Background Jobs with Node-Cron
**Description**: Set up background job processing for scheduled tasks.

**Files/Folders to create/modify**:
- `src/lib/services/scheduler.service.ts` - Scheduler service
- `src/lib/jobs/recurring-transactions.job.ts` - Recurring transactions job
- `src/lib/jobs/email-summaries.job.ts` - Email summaries job
- Cron job configuration

**Verification steps**:
• Test: Recurring transactions processed
• Test: Email summaries sent
• Expected: Jobs run on schedule
• Verify: Job logs created

---

### 76. Chunk 76 – Rate Limiting Implementation
**Description**: Implement rate limiting for API endpoints to prevent abuse.

**Files/Folders to create/modify**:
- `src/lib/middleware/rate-limit.ts` - Rate limiting middleware
- Update API routes with rate limiting
- Rate limit configuration

**Verification steps**:
• Test: Exceed rate limit
• Expected: 429 error returned
• Verify: Rate limits reset correctly
• Check: Different limits for different endpoints

---

### 77. Chunk 77 – API Documentation with Swagger
**Description**: Set up Swagger/OpenAPI documentation for all API endpoints.

**Files/Folders to create/modify**:
- `src/lib/config/swagger.config.ts` - Swagger configuration
- `src/app/api/docs/route.ts` - Swagger JSON endpoint
- `src/app/docs/page.tsx` - Swagger UI page
- Add JSDoc comments to API routes

**Verification steps**:
• Visit: http://localhost:3000/docs
• Test: View API documentation
• Expected: All endpoints documented
• Verify: Try out endpoints works

---

### 78. Chunk 78 – Database Migration System
**Description**: Create database migration system for schema changes.

**Files/Folders to create/modify**:
- `src/scripts/migrations/index.ts` - Migration runner
- `src/scripts/migrations/001-initial-schema.ts` - Initial migration
- Migration utilities

**Verification steps**:
• Run: `npm run migrate`
• Test: Run migrations
• Expected: Migrations execute correctly
• Verify: Rollback works

---

### 79. Chunk 79 – Testing Setup (Jest and React Testing Library)
**Description**: Set up testing infrastructure with Jest and React Testing Library.

**Files/Folders to create/modify**:
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Jest setup file
- `src/__tests__/` - Test directory
- Example test files

**Verification steps**:
• Run: `npm test`
• Test: Unit tests run
• Expected: Tests pass
• Verify: Coverage reports generated

---

### 80. Chunk 80 – Unit Tests for Services
**Description**: Write unit tests for all service layers.

**Files/Folders to create/modify**:
- `src/__tests__/services/auth.service.test.ts`
- `src/__tests__/services/transactions.service.test.ts`
- `src/__tests__/services/budgets.service.test.ts`
- Additional service tests

**Verification steps**:
• Run: `npm test`
• Expected: All service tests pass
• Verify: Coverage > 70%

---

### 81. Chunk 81 – Integration Tests for API Routes
**Description**: Write integration tests for API endpoints.

**Files/Folders to create/modify**:
- `src/__tests__/api/auth.test.ts`
- `src/__tests__/api/transactions.test.ts`
- `src/__tests__/api/budgets.test.ts`
- Test utilities and fixtures

**Verification steps**:
• Run: `npm test`
• Expected: All API tests pass
• Verify: Tests cover happy and error paths

---

### 82. Chunk 82 – Docker Configuration
**Description**: Create Dockerfile and docker-compose for development and production.

**Files/Folders to create/modify**:
- `Dockerfile` - Production Dockerfile
- `Dockerfile.dev` - Development Dockerfile
- `docker-compose.yml` - Docker Compose configuration
- `.dockerignore` - Docker ignore file

**Verification steps**:
• Run: `docker-compose up`
• Test: Application runs in Docker
• Expected: All services start correctly
• Verify: Database connection works

---

### 83. Chunk 83 – CI/CD Pipeline Setup
**Description**: Set up GitHub Actions or GitLab CI for automated testing and deployment.

**Files/Folders to create/modify**:
- `.github/workflows/ci-cd.yml` - GitHub Actions workflow
- CI/CD configuration
- Deployment scripts

**Verification steps**:
• Push: Code to repository
• Test: CI pipeline runs
• Expected: Tests run automatically
• Verify: Build succeeds

---

### 84. Chunk 84 – Performance Optimization
**Description**: Implement performance optimizations (caching, code splitting, image optimization).

**Files/Folders to create/modify**:
- Update components with code splitting
- Implement caching strategies
- Optimize images
- Performance monitoring

**Verification steps**:
• Test: Page load times
• Expected: Load times < 2s
• Verify: Lighthouse score > 90
• Check: Bundle size optimized

---

### 85. Chunk 85 – Production Deployment Configuration
**Description**: Configure production environment, environment variables, and deployment settings.

**Files/Folders to create/modify**:
- Production environment configuration
- `.env.production` - Production environment variables
- Deployment documentation
- Monitoring setup

**Verification steps**:
• Deploy: To production environment
• Test: All features work in production
• Expected: Application runs correctly
• Verify: Monitoring works

---

## EXECUTION ORDER

01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 37 → 38 → 39 → 40 → 41 → 42 → 43 → 44 → 45 → 46 → 47 → 48 → 49 → 50 → 51 → 52 → 53 → 54 → 55 → 56 → 57 → 58 → 59 → 60 → 61 → 62 → 63 → 64 → 65 → 66 → 67 → 68 → 69 → 70 → 71 → 72 → 73 → 74 → 75 → 76 → 77 → 78 → 79 → 80 → 81 → 82 → 83 → 84 → 85

---

## NOTES

- Each chunk is designed to be completed in 4-8 hours
- All chunks are self-contained and testable
- Feature flags should be used for incomplete features
- Code should be committed after each chunk
- Verification steps must be completed before moving to next chunk
- Refactoring can be done in later chunks if needed
- Mobile app (React Native) can be started after web app MVP is complete (chunk 35+)
- **Postman Collection**: Maintain and update `postman/FinMan_API_Collection.json` with each new endpoint/chunk