---
id: ADR-009
title: API Key Authentication
status: accepted
category: security
scope: project-wide
created: 2026-01-31
validated_by: "@security-auditor"
---

# ADR-009: API Key Authentication

## Status

**Accepted**

## Context

Water suppliers and system integrators need programmatic access to the platform. Traditional user/password auth is not suitable for automated system-to-system communication.

## Decision

Use **API Key Authentication**:
- Unique API key per supplier
- Key rotation support
- Scoped permissions per key
- Rate limiting per key

## Consequences

**Positive:**
- Simple for systems to use
- Easy to rotate keys
- Fine-grained access control
- Good audit trail

**Negative:**
- Keys must be stored securely
- No built-in expiration (needs implementation)
- Single point of compromise if leaked

## Governance

All changes MUST:
- Validate API keys on every request
- Support key rotation workflow
- Log all API key usage
- Enforce rate limits per key

## Validation

**Enforced by:** `@security-auditor`
**Check:** API key handling, rotation procedures, rate limiting
