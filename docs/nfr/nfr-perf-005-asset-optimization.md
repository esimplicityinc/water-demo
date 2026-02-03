---
id: NFR-PERF-005
title: Asset Optimization
category: performance
priority: must
status: active
created: 2026-01-31
---

# NFR-PERF-005: Asset Optimization

## Requirement

Frontend assets must be optimized to ensure fast initial page loads and efficient bandwidth utilization.

## Rationale

Asset optimization is critical for:
- First impressions and user engagement (users leave slow sites)
- Mobile users on limited bandwidth or metered connections
- SEO rankings (page speed is a ranking factor)
- Conversion rates in the marketplace
- Global accessibility (users with slower internet connections)
- Reducing server bandwidth costs

In the LLM Compute Futures Marketplace, traders need quick access to market data and trading interfaces. Slow-loading assets can result in missed trading opportunities and frustrated users.

## Specifications

### Page Load Performance Targets

| Metric | Target | Maximum | Measurement Point |
|--------|--------|---------|-------------------|
| First Contentful Paint (FCP) | < 1.0s | 1.5s | User browser |
| Largest Contentful Paint (LCP) | < 1.5s | 2.5s | User browser |
| Time to Interactive (TTI) | < 2.0s | 3.5s | User browser |
| Total Blocking Time (TBT) | < 200ms | 350ms | User browser |
| Cumulative Layout Shift (CLS) | < 0.1 | 0.25 | User browser |
| Initial Page Load | < 2 seconds | 3 seconds | Lighthouse |

### Bundle Size Targets

| Asset Type | Target Size | Maximum Size | Compression |
|------------|-------------|--------------|-------------|
| Initial JS Bundle | < 200KB | 300KB | Gzipped |
| Initial CSS Bundle | < 50KB | 75KB | Gzipped |
| Total Initial Bundle | < 500KB | 750KB | Gzipped |
| Images (per page) | < 500KB | 1MB | Optimized |
| Fonts | < 100KB | 150KB | WOFF2 |

### Coverage Areas

- **Code Splitting**: Route-based and component-based code splitting
- **Lazy Loading**: Deferred loading of non-critical components and data
- **Compression**: Gzip/Brotli compression for all text assets
- **Image Optimization**: WebP/AVIF formats with fallbacks, responsive images
- **Font Optimization**: Subset fonts, font-display: swap, preload critical fonts
- **Tree Shaking**: Elimination of unused code
- **Minification**: Minified JS, CSS, and HTML

### Resource Loading Strategy

| Priority | Resource Type | Loading Strategy |
|----------|--------------|------------------|
| Critical | Above-fold CSS, fonts | Inline + preload |
| High | Core JS bundle | Async loading |
| Medium | Images in viewport | Lazy loading with blur-up |
| Low | Below-fold content | Intersection Observer |
| Deferred | Analytics, chat widgets | After TTI |

## Measurement

- **Tool**: Lighthouse CI + WebPageTest + Chrome DevTools
- **Frequency**: Every CI/CD build + weekly audits
- **Environment**: Production + staging
- **Metrics Tracked**:
  - Core Web Vitals (LCP, FID, CLS)
  - Bundle sizes by route
  - Image optimization scores
  - Compression ratios
  - Resource loading waterfall

## Validation Criteria

```gherkin
Feature: Asset Optimization Performance

  Scenario: Initial page load meets performance target
    Given a user visits the marketplace homepage
    When the page loads on a simulated 4G connection
    Then the Largest Contentful Paint should occur within 1.5 seconds
    And the Time to Interactive should be within 2.0 seconds
    And the total transferred data should be under 500KB
    And the Lighthouse performance score should be >= 90

  Scenario: JavaScript bundle size meets target
    When the production build completes
    Then the initial JavaScript bundle should be under 200KB gzipped
    And the total initial bundle should be under 500KB gzipped
    And code splitting should create separate chunks for each route
    And no single chunk should exceed 100KB gzipped

  Scenario: Images are optimized for web delivery
    Given product images are uploaded to the system
    When images are served to users
    Then images should be served in WebP format with JPEG fallback
    And images should be responsive with srcset attributes
    And image file sizes should be under 100KB each
    And lazy loading should defer offscreen images

  Scenario: Fonts load efficiently without blocking
    When a user visits any page
    Then fonts should use font-display: swap
    And critical fonts should be preloaded
    And font files should be under 50KB each
    And font subsets should include only used characters

  Scenario: Code splitting reduces initial load
    Given the application has multiple routes
    When a user visits the homepage
    Then only the homepage JavaScript should load initially
    And other route bundles should load on demand
    And the initial bundle should not contain unused components

  Scenario: Compression reduces transfer size
    When assets are served to users
    Then JavaScript files should be Brotli compressed
    And CSS files should be Brotli compressed
    And compression should reduce size by at least 70%
    And browsers without Brotli support should receive Gzip
```

## Acceptance Criteria

1. **Page Load Speed**: Initial page load completes in < 2 seconds on 4G connections
2. **Bundle Size**: Total initial bundle < 500KB gzipped, JS < 200KB gzipped
3. **Core Web Vitals**: LCP < 1.5s, FID < 100ms, CLS < 0.1
4. **Image Optimization**: All images served in modern formats (WebP/AVIF) with fallbacks
5. **Code Splitting**: Route-based splitting implemented for all major routes
6. **Lazy Loading**: Non-critical resources load only when needed
7. **Compression**: All text assets compressed with Brotli (or Gzip fallback)
8. **Font Optimization**: No invisible text during font loading (FOIT eliminated)

## Related ADRs

- [ADR-023](../adr/adr-023-performance.md) - Performance Best Practices
- [ADR-032](../adr/adr-032-code-splitting.md) - Code Splitting Strategy
- [ADR-033](../adr/adr-033-image-optimization.md) - Image Optimization Pipeline
- [ADR-034](../adr/adr-034-font-loading.md) - Font Loading Strategy
- [ADR-035](../adr/adr-035-bundling.md) - Bundle Optimization

## Verification Approach

1. **Lighthouse CI**: Automated performance audits on every PR
2. **Bundle Analysis**: Weekly webpack-bundle-analyzer reports
3. **Real User Monitoring**: Core Web Vitals tracking from actual users
4. **Visual Regression**: Screenshots to detect layout shifts
5. **Mobile Testing**: Regular testing on low-end devices and slow connections

## Exceptions

- Admin dashboards may have larger bundles due to data visualization libraries
- Third-party integrations (analytics, support chat) are excluded from bundle size targets
- Development builds are exempt from optimization requirements

## Related

- [NFR-PERF-001](./nfr-perf-001-api-response-time.md) - API Response Time
- [NFR-PERF-003](./nfr-perf-003-concurrent-user-load.md) - Concurrent User Load
- [NFR-PERF-004](./nfr-perf-004-caching-strategy.md) - Caching Strategy
- [NFR-A11Y-001](./nfr-a11y-001-wcag-compliance.md) - WCAG Compliance (font loading accessibility)
