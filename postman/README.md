# FinMan API - Postman Collection

This directory contains Postman collections and environments for testing the FinMan API.

## Files

- **FinMan_API_Collection.json** - Main API collection with all endpoints
- **FinMan_Environment.json** - Environment variables for local development

## Setup Instructions

### 1. Import Collection

1. Open Postman
2. Click **Import** button
3. Select `FinMan_API_Collection.json`
4. The collection will be imported with all endpoints organized by feature

### 2. Import Environment

1. Click **Environments** in the left sidebar
2. Click **Import**
3. Select `FinMan_Environment.json`
4. Select "FinMan - Local Development" environment from the dropdown

### 3. Configure Base URL

The default base URL is set to `http://localhost:3000`. To change it:

1. Select the "FinMan - Local Development" environment
2. Edit the `baseUrl` variable with your server URL
3. Save the environment

## Collection Structure

The collection is organized by feature/chunk:

- **Test & Health** - System health and database connectivity endpoints
- **Authentication** - User registration, login, and session management
- **Categories** - Category CRUD operations (list, create, get, update, delete)

## Environment Variables

### Available Variables

- `baseUrl` - API base URL (default: http://localhost:3000)
- `environment` - Current environment name (local, staging, production)
- `accessToken` - JWT access token (auto-set after login/register)
- `refreshToken` - JWT refresh token (auto-set after login/register)
- `userId` - Current user ID (auto-set after login/register)

### Auto-Set Variables

Some variables are automatically set by test scripts:
- `accessToken` - Set after successful registration or login
- `refreshToken` - Set after successful registration or login
- `userId` - Set after successful registration or login
- `categoryId` - Set after successful category creation

## Usage

### Testing Registration

1. Open the **Authentication > Register User** request
2. Update the request body with valid user data
3. Click **Send**
4. On success, `accessToken`, `refreshToken`, and `userId` will be automatically set

### Testing Authenticated Endpoints

Most endpoints require authentication. The `accessToken` is automatically included in the `Authorization` header for requests that need it.

## Rate Limiting

**Important**: Authentication endpoints have rate limiting:
- **5 requests per 15 minutes** for auth endpoints
- If you exceed the limit, you'll receive a 429 error

## Chunk Progress

This collection is maintained and updated with each development chunk:

- ✅ **Chunk 02** - Database Connection Test endpoint
- ✅ **Chunk 05** - User Registration endpoint
- ✅ **Chunk 06** - User Login endpoint
- ✅ **Chunk 07** - Protected Route Test endpoint
- ✅ **Chunk 09** - Login Page UI with Radix UI Components (No new API endpoints)
- ✅ **Chunk 10** - Registration Page UI with password strength indicator (No new API endpoints)
- ✅ **Chunk 15** - Category API Endpoints (GET list, POST create, GET by ID, PUT update, DELETE)
- ⏳ Additional endpoints will be added as chunks are completed

## Updating the Collection

When new chunks are completed:

1. Add new endpoints to the appropriate folder
2. Include chunk number in the endpoint description
3. Add test scripts to auto-set tokens where applicable
4. Update this README with the new endpoints
5. Commit changes to the repository

## Notes

- All timestamps in responses are in ISO 8601 format
- Error responses follow a standardized format with `code`, `message`, and optional `details`
- Rate limit headers are included in responses: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

