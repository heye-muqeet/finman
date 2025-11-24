# Postman Collection Update Guide

This document outlines how to update the Postman collection when new chunks are completed.

## When to Update

Update the Postman collection (`FinMan_API_Collection.json`) whenever:
- A new API endpoint is created
- An existing endpoint is modified
- New request/response formats are introduced
- New authentication requirements are added

## How to Update

### 1. Adding a New Endpoint

Add the new endpoint to the appropriate folder in the collection:

```json
{
  "name": "Endpoint Name",
  "request": {
    "method": "GET|POST|PUT|DELETE|PATCH",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{accessToken}}",
        "type": "text"
      },
      {
        "key": "Content-Type",
        "value": "application/json",
        "type": "text"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"key\": \"value\"\n}",
      "options": {
        "raw": {
          "language": "json"
        }
      }
    },
    "url": {
      "raw": "{{baseUrl}}/api/v1/your-endpoint",
      "host": ["{{baseUrl}}"],
      "path": ["api", "v1", "your-endpoint"]
    },
    "description": "Endpoint description.\n\n**Chunk**: XX - Chunk Name\n\nAdditional notes about the endpoint."
  }
}
```

### 2. Adding Test Scripts (Auto-Set Variables)

For endpoints that return tokens or user data, add a test script:

```json
"event": [
  {
    "listen": "test",
    "script": {
      "exec": [
        "if (pm.response.code === 200 || pm.response.code === 201) {",
        "    const response = pm.response.json();",
        "    if (response.data && response.data.token) {",
        "        pm.environment.set(\"accessToken\", response.data.token);",
        "        pm.environment.set(\"refreshToken\", response.data.refreshToken || \"\");",
        "    }",
        "}"
      ],
      "type": "text/javascript"
    }
  }
]
```

### 3. Organizing by Folder

- **Test & Health** - System health, database, connectivity
- **Authentication** - Login, register, logout, password management
- **Categories** - Category CRUD operations
- **Transactions** - Transaction management
- **Budgets** - Budget management
- **Goals** - Financial goals
- **Reports** - Reports and analytics
- **User Profile** - User profile management
- **Settings** - Application settings

### 4. Required Information in Description

Always include:
- Chunk number and name
- Rate limiting information (if applicable)
- Authentication requirements
- Request/response examples
- Error codes and meanings

### 5. Example Request Body

Include realistic example data:
- Use `{{variableName}}` for dynamic values
- Use descriptive placeholder values
- Match the actual request schema

### 6. Update README

After updating the collection:
1. Update `postman/README.md` with new endpoints
2. Update the "Chunk Progress" section
3. Add any new environment variables if needed

## Chunk Checklist

For each chunk, update:
- [ ] Add new endpoints to collection
- [ ] Add test scripts if tokens are returned
- [ ] Update README.md with chunk progress
- [ ] Verify all example data is correct
- [ ] Test the collection import works
- [ ] Commit changes to repository

## Validation

After updating:
1. Import the collection into Postman
2. Verify all requests are valid
3. Test at least one endpoint from each folder
4. Verify environment variables work correctly
5. Check that test scripts execute properly

## Tips

- Keep endpoint descriptions detailed and up-to-date
- Use consistent naming conventions
- Group related endpoints in folders
- Include rate limiting information where applicable
- Add pre-request scripts for authentication when needed
- Use environment variables for dynamic values

