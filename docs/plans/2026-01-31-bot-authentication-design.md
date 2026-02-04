---
title: ROAD-005 Bot Authentication Design
---

# ROAD-005: Bot Authentication Design

**Date**: 2026-01-31  
**Roadmap Item**: ROAD-005  
**Status**: In Progress  

## Overview

Enable bots to authenticate using API keys when accessing protected platform resources. This is the foundation for all secured API operations in PrimaDemo.

## Current State

- ✅ Bot registration complete (ROAD-004)
- ✅ API keys generated and stored as SHA-256 hashes
- ✅ `BotAccount` aggregate with `apiKey` field
- ✅ BDD scenarios defined in `stack-tests/features/api/bot-identity/02_bot_authentication.feature`

## Requirements

### Functional Requirements

1. **API Key Verification Middleware**
   - Extract API key from `Authorization: Bearer <key>` header
   - Hash incoming key and compare against stored hash
   - Attach authenticated bot context to request

2. **Protected Endpoints**
   - `GET /api/bots/me` - Get current bot's profile
   - All future protected operations require authentication

3. **Error Handling**
   - 401 for missing/invalid API key
   - 429 for rate-limited requests

4. **Rate Limiting**
   - Track failed authentication attempts per IP/API key
   - Limit: 100 failed attempts per minute
   - Block subsequent requests with 429 status

5. **API Key Rotation**
   - `POST /api/bots/me/regenerate-api-key` endpoint
   - Invalidate old key immediately
   - Return new plaintext key (shown once)

### Non-Functional Requirements

- Authentication must complete in `&lt;50ms`
- Use constant-time comparison to prevent timing attacks
- Stateless - no session storage required

## Architecture

### Domain Layer

**Value Objects:**
- `ApiKey` - already exists, handles hashing/verification

**Aggregate:**
- `BotAccount` - already exists, has `regenerateApiKey()` method

### Application Layer

**Services:**
- `AuthenticationService` - Verify API keys, handle rate limiting logic

**DTOs:**
- `AuthenticatedBotContext` - Bot ID, permissions, rate limit status

### Infrastructure Layer

**Convex Functions:**
- `getBotByApiKey` query - Look up bot by API key hash
- `verifyApiKey` action - Hash and verify key against stored hash
- `recordAuthAttempt` mutation - Track failed attempts for rate limiting
- `regenerateApiKey` mutation - Generate new key, invalidate old

**Middleware:**
- `withAuth` HOC - Wrap API routes to require authentication

## API Design

### GET /api/bots/me
```
Headers:
  Authorization: Bearer sk_...

Response 200:
{
  "botId": "...",
  "displayName": "...",
  "email": "...",
  "verificationStatus": "...",
  "reputationScore": 100,
  "createdAt": "..."
}

Response 401:
{
  "error": "API key required" | "Invalid API key" | "API key not found"
}
```

### POST /api/bots/me/regenerate-api-key
```
Headers:
  Authorization: Bearer sk_...

Response 200:
{
  "apiKey": "sk_...",  // New key - shown once!
  "botId": "..."
}

Response 401:
{
  "error": "Authentication required"
}
```

## Data Flow

### Authentication Flow
```
1. Request → Next.js API Route
2. withAuth middleware
3. Extract Bearer token from Authorization header
4. Call convex.verifyApiKey(plainKey)
5. Hash plain key → compare with stored hash
6. Return bot ID or null
7. Attach bot context to request
8. Proceed to handler or return 401
```

### Rate Limiting Flow
```
1. Failed auth attempt detected
2. Record attempt in Redis/memory (key: apiKey or IP)
3. Check count in time window
4. If > 100 → return 429
5. Successful auth → clear failed attempts
```

## Testing Strategy

### BDD Scenarios (already defined)

1. ✅ Successfully authenticate with valid API key
2. ✅ Reject request with missing API key
3. ✅ Reject request with invalid API key format
4. ✅ Reject request with non-existent API key
5. ✅ Rate limit excessive authentication attempts
6. ✅ Regenerate API key invalidates old key

### Unit Tests

- `ApiKey.verify()` - constant-time comparison
- `AuthenticationService.authenticate()` - success/failure cases
- Rate limiting algorithm - edge cases

### Integration Tests

- Full authentication flow end-to-end
- Key rotation flow
- Rate limiting enforcement

## Implementation Plan

### Task 1: Update BDD Scenarios (if needed)
- Review existing scenarios
- Add any missing edge cases
- Mark as @pending → @implemented

### Task 2: Domain Layer
- No changes needed (ApiKey, BotAccount already support this)

### Task 3: Application Layer
- Create `AuthenticatedBotContext` type
- Create `AuthenticationService` with `authenticate()` method
- Implement rate limiting logic

### Task 4: Infrastructure Layer (Convex)
- `getBotByApiKey` query
- `verifyApiKey` action
- `recordAuthAttempt` mutation
- `regenerateApiKey` mutation

### Task 5: Infrastructure Layer (Next.js)
- `withAuth` middleware/HOC
- `GET /api/bots/me` route
- `POST /api/bots/me/regenerate-api-key` route

### Task 6: Verify Architecture
- Check hexagonal compliance
- Verify dependency direction

### Task 7: Run Tests
- Execute all BDD scenarios
- Fix any failures

### Task 8: CI Validation
- Lint, typecheck, all tests

## Security Considerations

1. **Timing Attacks**: Use constant-time comparison for API key verification
2. **Key Storage**: Only store SHA-256 hashes, never plaintext
3. **Rate Limiting**: Prevent brute force attacks
4. **Key Rotation**: Immediate invalidation of old keys
5. **HTTPS Only**: Never transmit API keys over HTTP

## Open Questions

1. Should we implement IP-based rate limiting in addition to API key-based?
2. Do we need audit logging for authentication events?
3. Should successful authentications also be rate limited (prevent abuse)?

## References

- BDD Scenarios: `stack-tests/features/api/bot-identity/02_bot_authentication.feature`
- Domain Model: `src/bot-identity/domain/BotAccount.ts`
- API Key: `src/bot-identity/domain/ApiKey.ts`
- Schema: `convex/schema.ts`
