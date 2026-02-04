---
id: ROAD-027
title: E2E Tests
status: proposed
created: "2026-01-31"
phase: 3
priority: Medium
governance:
  adrs:
    validated: false
  bdd:
    id: BDD-027
    status: draft
  nfrs:
    applicable: [NFR-TEST-001, NFR-UX-001]
    status: pending
blocks: []
depends_on: []
blocked_by: []
---

# ROAD-027: E2E Tests

## Description
Set up end-to-end testing with Playwright to validate critical user paths through the UI. Cover enrollment flows, commitment creation, order book interactions, and other key user journeys to ensure the platform works correctly from the user's perspective.

## Status
🎯 **Proposed**

## Acceptance Criteria
- [ ] Playwright configured with TypeScript
- [ ] E2E test environment setup (staging or local)
- [ ] Enrollment flow E2E test
- [ ] Commitment creation E2E test
- [ ] Order book interaction E2E test
- [ ] Commitment acceptance and execution E2E test
- [ ] Account operations E2E test
- [ ] Cross-browser testing (Chrome, Firefox, WebKit)
- [ ] Mobile viewport E2E tests
- [ ] Visual regression testing setup (optional)
- [ ] CI/CD integration with artifact storage

## Technical Details

### Critical Paths to Test
| Path | Steps | Priority |
|------|-------|----------|
| Enrollment | Visit → Fill → Submit → Verify | Critical |
| Commitment Creation | Login → Create → Validate → List | Critical |
| Order Book | Browse → Filter → View Details | High |
| Commitment Acceptance | View → Accept → Holdback Created | High |
| Execution | Start → Submit Proof → Complete | High |

### Test Data Management
- Seeded test accounts for E2E tests
- Isolated test database to prevent pollution
- Data cleanup after test runs
- Unique identifiers to prevent conflicts

### Dependencies
- **ROAD-025**: Unit Tests (test infrastructure)
- **ROAD-026**: Integration Tests (backend validation)
- **ROAD-024**: Mobile Responsive (viewport testing)
- UI implementations for all tested flows

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
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
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

## Implementation Notes

E2E tests should focus on user journeys, not implementation details. Use data-testid attributes for element selection rather than CSS classes or text content when possible.

## Performance Targets

- Test suite execution: `<10 minutes`
- Individual test timeout: 30 seconds
- Parallel execution where possible

---

## Customer Signature

| Customer | Action | Timestamp |
|-------|--------|-----------|
| @code-writer | Created | 2026-01-31T00:00:00Z |
