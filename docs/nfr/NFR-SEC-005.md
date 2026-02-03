---
id: NFR-SEC-005
title: Vulnerability Scanning
category: security
priority: must
status: active
created: 2026-01-31
---

# NFR-SEC-005: Vulnerability Scanning

## Requirement

The system must perform comprehensive vulnerability scanning on a weekly basis with automated detection and rapid remediation of critical vulnerabilities to maintain a secure codebase and infrastructure.

## Specifications

### Weekly Automated Scanning Schedule

- **Dependency Scanning**: Every Monday at 02:00 UTC
  - npm packages (via npm audit and Snyk)
  - Python dependencies (via pip-audit)
  - Container images (via Trivy)
  - Third-party libraries and frameworks

- **Static Application Security Testing (SAST)**: Every Tuesday at 02:00 UTC
  - Source code analysis (via SonarQube, CodeQL)
  - Secret detection (via GitLeaks, TruffleHog)
  - Code quality and security patterns
  - Custom rule sets for project-specific risks

- **Dynamic Application Security Testing (DAST)**: Every Wednesday at 02:00 UTC
  - Running application scanning (via OWASP ZAP)
  - API endpoint testing
  - Authentication flow validation
  - Injection and XSS attempt detection

- **Infrastructure Scanning**: Every Thursday at 02:00 UTC
  - Cloud configuration (via Prowler, ScoutSuite)
  - Network security groups and firewalls
  - IAM policies and permissions
  - Encryption and key management validation

### Critical Vulnerability Response

- **Detection to Notification**: Within 1 hour of scan completion
- **Triage and Assignment**: Within 4 hours
- **Patch Development**: Within 12 hours for critical issues
- **Deployment**: Within 24 hours of detection
- **Verification**: Automated re-scan within 1 hour of deployment

### Vulnerability Classification

| Severity | CVSS Score | Response Time | Examples |
|----------|-----------|---------------|----------|
| Critical | 9.0-10.0 | 24 hours | RCE, SQL injection, auth bypass |
| High | 7.0-8.9 | 72 hours | XSS, sensitive data exposure |
| Medium | 4.0-6.9 | 2 weeks | CSRF, information disclosure |
| Low | 0.1-3.9 | Next release | Best practice violations |

### Scan Coverage Requirements

- 100% of production dependencies scanned weekly
- 100% of source code analyzed by SAST
- All public API endpoints tested by DAST
- All cloud resources scanned for misconfigurations
- Zero false-positive tolerance for critical findings

### Reporting and Tracking

- Weekly vulnerability report to security team
- Dashboard showing current vulnerability status
- Trend analysis and SLA compliance metrics
- Integration with JIRA for vulnerability tracking
- Executive summary for leadership (monthly)

## Security Headers

All vulnerability scanning API responses must include:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Scan-Status: <status>
Cache-Control: no-store
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Validation Criteria

```gherkin
Feature: Vulnerability Scanning
  
  Scenario: Weekly dependency scan execution
    Given the scheduled scan time of Monday 02:00 UTC
    When the dependency scan job runs
    Then all npm packages should be analyzed
    And all container images should be scanned
    And results should be available within 2 hours
    
  Scenario: Critical vulnerability detection and response
    Given a critical vulnerability is discovered in production
    When the scan completes
    Then security team should be notified within 1 hour
    And a JIRA ticket should be automatically created
    And the vulnerability should be patched within 24 hours
    
  Scenario: SAST scan coverage
    Given the weekly SAST scan runs
    When analyzing the source code
    Then 100% of production code should be scanned
    And all secrets should be detected
    And custom security rules should be validated
    
  Scenario: DAST scan of API endpoints
    Given the weekly DAST scan runs
    When testing API endpoints
    Then all public endpoints should be tested
    And authentication flows should be validated
    And injection attempts should be simulated
    
  Scenario: Infrastructure misconfiguration detection
    Given the weekly infrastructure scan runs
    When checking cloud configurations
    Then all IAM policies should be validated
    And encryption settings should be verified
    And network security rules should be checked
    
  Scenario: Vulnerability remediation verification
    Given a critical vulnerability has been patched
    When the automated re-scan runs
    Then the vulnerability should no longer be detected
    And the JIRA ticket should be marked resolved
    And the security dashboard should be updated
```

## Compliance

- OWASP Top 10 - Continuous security testing
- SOC 2 Type II - CC7.1 Security operations and monitoring
- ISO 27001 - A.12.6 Technical vulnerability management
- NIST Cybersecurity Framework - PR.IP-12 (Vulnerability management)

## Related

- [ADR-022](../adr/adr-022-security-best-practices.md) - Security Best Practices
- [ADR-017](../adr/adr-017-bun-runtime.md) - Bun Runtime (dependency management)
- [NFR-SEC-001](./nfr-sec-001-authentication.md) - Authentication Requirements
