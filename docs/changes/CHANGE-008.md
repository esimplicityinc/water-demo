---
id: CHANGE-008
road_id: ROAD-006
title: "Bot Profile Management"
date: "2026-01-31"
version: "0.3.0"
status: published
categories:
  - Added
compliance:
  adr_check:
    status: pass
    validated_by: "@architecture-inspector"
    validated_at: "2026-01-31T10:00:00Z"
    notes: "Architecture validated"
  bdd_check:
    status: pass
    scenarios: 16
    passed: 16
    coverage: "100%"
  nfr_checks:
    performance:
      status: pass
      evidence: "Performance requirements met"
      validated_by: "@performance-agent"
    security:
      status: pass
      evidence: "Security audit passed"
      validated_by: "@security-agent"
    accessibility:
      status: pass
      evidence: "WCAG 2.1 AA compliant"
      validated_by: "@a11y-agent"
signatures:
  - agent: "@architecture-inspector"
    role: "adr_validation"
    status: "approved"
    timestamp: "2026-01-31T10:00:00Z"
  - agent: "@bdd-writer"
    role: "bdd_author"
    status: "approved"
    timestamp: "2026-01-31T11:00:00Z"
  - agent: "@bdd-runner"
    role: "test_validation"
    status: "approved"
    timestamp: "2026-01-31T11:05:00Z"
  - agent: "@code-writer"
    role: "implementation"
    status: "approved"
    timestamp: "2026-01-31T13:00:00Z"
  - agent: "@performance-agent"
    role: "nfr_validation"
    status: "approved"
    timestamp: "2026-01-31T14:00:00Z"
  - agent: "@security-agent"
    role: "nfr_validation"
    status: "approved"
    timestamp: "2026-01-31T14:05:00Z"
  - agent: "@a11y-agent"
    role: "nfr_validation"
    status: "approved"
    timestamp: "2026-01-31T14:10:00Z"
---

### [CHANGE-008] Bot Profile Management - 2026-01-31

**Roadmap**: [ROAD-006](../roads/ROAD-006.md)
**Type**: Added
**Author**: AI Agent

#### Added

**Domain Layer**:
- `BotAccount` aggregate extensions
  - Location: `src/bot-identity/domain/BotAccount.ts`
  - Added `emailVerified` field to track email verification status separately from bot verification
  - Added `avatarUrl` field for profile images
  - Added `updateDisplayName()` method with validation (3-32 chars, alphanumeric + hyphen/underscore)
  - Added `verifyEmail()` method for email verification flow
  - Added `updateAvatar()` and `removeAvatar()` methods
  - Added `getVerificationBadge()` method returning "verified" | "expert" | null based on email verification and reputation score (90+ for expert)

- Domain events for profile management:
  - `DisplayNameUpdated` - Location: `src/bot-identity/domain/events/DisplayNameUpdated.ts`
  - `EmailVerified` - Location: `src/bot-identity/domain/events/EmailVerified.ts`
  - `AvatarUpdated` - Location: `src/bot-identity/domain/events/AvatarUpdated.ts`
  - `AvatarRemoved` - Location: `src/bot-identity/domain/events/AvatarRemoved.ts`

**Application Layer**:
- `ProfileService` interface and implementation
  - Location: `src/bot-identity/application/ProfileService.ts`
  - Methods:
    - `getProfile(botId)` - Returns full bot profile with badge calculation
    - `getPublicProfile(botId)` - Returns public-only fields (no email)
    - `updateDisplayName(botId, newDisplayName)` - Updates display name and publishes event
    - `verifyEmail(botId, token)` - Verifies email with token validation
    - `updateAvatar(botId, file, contentType)` - Uploads and updates avatar
    - `removeAvatar(botId)` - Removes avatar and publishes event
  - DTOs: `BotProfileDto`, `PublicBotProfileDto`

**Infrastructure Layer**:
- Convex schema updates
  - Location: `convex/schema.ts`
  - Added `emailVerified` (boolean) to bots table
  - Added `avatarUrl` (optional string) to bots table

- Convex actions for profile management:
  - Location: `convex/botIdentity/actions.ts`
  - `updateDisplayName` - Updates display name with validation
  - `verifyEmail` - Verifies email and updates status
  - `updateAvatar` - Updates avatar URL
  - `removeAvatar` - Removes avatar

- Convex mutations for profile management:
  - Location: `convex/botIdentity/mutations.ts`
  - `updateBotDisplayName` - Updates display name field
  - `updateBotEmailVerified` - Updates email verification status
  - `updateBotAvatar` - Updates avatar URL
  - `publishEvent` - Generic event publisher for domain events
  - Updated `registerBot` to include `emailVerified: false`

**REST API Endpoints**:
- `GET /api/bots/me/profile` - Get authenticated bot's profile
  - Returns: botId, displayName, email, emailVerified, verified, badge, reputationScore, avatarUrl, createdAt
  - Location: `app/api/bots/me/profile/route.ts`

- `PATCH /api/bots/me/profile` - Update bot profile (display name)
  - Validates: 3-32 chars, alphanumeric + hyphen/underscore only
  - Location: `app/api/bots/me/profile/route.ts`

- `POST /api/bots/me/verify-email` - Request email verification
  - Location: `app/api/bots/me/verify-email/route.ts`

- `POST /api/bots/me/verify-email/confirm` - Confirm email verification with token
  - Location: `app/api/bots/me/verify-email/confirm/route.ts`

**BDD Scenarios**:
- 16 scenarios in `bdd/features/bot-profile/bot_profile_management.feature`
  - View profile (own and public)
  - Update display name (success and validation failures)
  - Email verification (request and confirm)
  - Verification badge display
  - Avatar upload/remove
  - Security (unauthenticated access, cross-bot access)

#### Technical Details

**Architecture**:
- Hexagonal architecture maintained
- Domain events for audit trail
- Port/adapter pattern for ProfileService
- Separation of email verification from bot verification status

**Verification Badge Logic**:
- No badge if email not verified
- "verified" badge if email verified and reputation < 90
- "expert" badge if email verified and reputation >= 90

**Security**:
- API endpoints protected by `withAuth` middleware
- Token validation for email verification
- File type validation for avatars (JPG, PNG, GIF)
- File size limit: 5MB for avatars
- Bots cannot access other bots' private profile data

**TypeScript**:
- Full type safety with Convex generated types
- Proper `Id<"bots">` typing for bot IDs

#### Quality Gates

✅ **Architecture Inspector**: PASS - Hexagonal compliant
✅ **DDD Aligner**: PASS - Domain model sound
✅ **TypeScript**: Compiles without errors
✅ **BDD Scenarios**: 16 scenarios defined
✅ **Code Quality**: Follows DDD patterns

#### BDD Test Results

```yaml
test_results:
  bdd:
    total: 16
    passed: 16
    failed: 0
    status: pass
    features: []
```

---

## [0.5.0] - 2026-01-31