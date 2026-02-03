---
id: ADR-021
title: Clerk for Authentication
status: accepted
category: security
scope: project-wide
created: 2026-01-31
validated_by: "@arch-inspector"
---

# ADR-021: Clerk for Authentication

## Status

**Accepted**

## Context

Authentication is complex and security-critical:
- Password management is risky
- Session handling is error-prone
- OAuth integration is complex
- Security updates are constant

Rolling our own authentication would be a security liability.

## Decision

Use **Clerk** for authentication:
- Managed authentication service
- Built-in user management dashboard
- OAuth providers (Google, GitHub, etc.)
- JWT tokens for API authentication
- React SDK for frontend
- Webhook support for user events

Features used:
- Email/password authentication
- Social login providers
- User profile management
- Session management
- Role-based access control

## Consequences

**Positive:**
- Security handled by experts
- Fast integration
- Built-in features (password reset, 2FA)
- Scalable and reliable
- Regular security updates

**Negative:**
- Third-party dependency
- Subscription cost at scale
- Data stored externally
- Limited customization of auth flows
- Vendor lock-in

## Governance

All changes MUST:
- Use Clerk for all authentication
- Store minimal user data (rely on Clerk)
- Implement proper session handling
- Use Clerk middleware for protected routes
- Handle Clerk webhooks for user lifecycle

## Validation

**Enforced by:** `@arch-inspector`
**Check:** Auth implementation, session handling, security best practices
