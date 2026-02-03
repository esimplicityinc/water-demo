@ROAD-028 @api @security @hardening @pending
Feature: Security Hardening
  As a security engineer
  I want comprehensive security controls and validation
  So that the ClawMarket platform is protected against common attack vectors

  Background:
    Given the API security middleware is active
    And the rate limiting service is enabled
    And the audit logging system is operational

  # ============================================
  # API Key Validation and Rejection
  # ============================================

  @api-key @authentication
  Scenario: Reject requests with missing API key
    When I GET "/api/v1/compute/listings" without API key header
    Then the response status should be 401
    And the value at "error.code" should equal "MISSING_API_KEY"
    And the value at "error.message" should equal "API key is required"

  @api-key @authentication
  Scenario: Reject requests with invalid API key format
    Given I set header "X-API-Key" to "invalid-key-format"
    When I GET "/api/v1/compute/listings"
    Then the response status should be 401
    And the value at "error.code" should equal "INVALID_API_KEY"
    And the response header "X-RateLimit-Remaining" should not be present

  @api-key @authentication
  Scenario: Reject requests with expired API key
    Given I set header "X-API-Key" to "expired_key_12345"
    When I GET "/api/v1/compute/listings"
    Then the response status should be 401
    And the value at "error.code" should equal "API_KEY_EXPIRED"
    And the value at "error.details.expiredAt" should be a valid ISO8601 date

  @api-key @authentication
  Scenario: Reject requests with revoked API key
    Given I set header "X-API-Key" to "revoked_key_67890"
    When I GET "/api/v1/compute/listings"
    Then the response status should be 403
    And the value at "error.code" should equal "API_KEY_REVOKED"
    And an audit log entry should be created with event type "API_KEY_REVOKED_ATTEMPT"

  # ============================================
  # Rate Limiting Enforcement
  # ============================================

  @rate-limit @throttling
  Scenario: Enforce rate limit on public endpoints
    Given I set header "X-API-Key" to "valid_public_key"
    When I send 101 GET requests to "/api/v1/compute/listings" within 60 seconds
    Then the last response status should be 429
    And the value at "error.code" should equal "RATE_LIMIT_EXCEEDED"
    And the response header "Retry-After" should be present
    And the response header "X-RateLimit-Limit" should equal "100"
    And the response header "X-RateLimit-Remaining" should equal "0"

  @rate-limit @throttling
  Scenario: Enforce stricter rate limit on authenticated endpoints
    Given I am authenticated as a user via API
    When I send 1001 POST requests to "/api/v1/orders" within 60 seconds
    Then the last response status should be 429
    And the value at "error.code" should equal "RATE_LIMIT_EXCEEDED"
    And the response header "X-RateLimit-Limit" should equal "1000"

  @rate-limit @throttling
  Scenario: Rate limit per API key is isolated
    Given I set header "X-API-Key" to "key_a"
    When I send 100 GET requests to "/api/v1/compute/listings"
    And I set header "X-API-Key" to "key_b"
    And I GET "/api/v1/compute/listings"
    Then the response status should be 200
    And the response header "X-RateLimit-Remaining" should equal "99"

  # ============================================
  # SQL Injection Prevention
  # ============================================

  @sql-injection @input-validation
  Scenario Outline: Prevent SQL injection in query parameters
    Given I set header "X-API-Key" to "valid_api_key"
    When I GET "/api/v1/compute/listings?search=<injection_payload>"
    Then the response status should be 400
    And the value at "error.code" should equal "INVALID_INPUT"
    And the database query log should contain no raw SQL injection patterns

    Examples:
      | injection_payload                    |
      | ' OR '1'='1                          |
      | '; DROP TABLE users; --              |
      | 1 UNION SELECT * FROM passwords      |
      | ' OR 1=1--                           |
      | "; DELETE FROM orders WHERE '1'='1"  |

  @sql-injection @input-validation
  Scenario: Prevent SQL injection in JSON body parameters
    Given I set header "X-API-Key" to "valid_api_key"
    When I POST "/api/v1/compute/listings/search" with JSON body:
      """
      {
        "query": "'; DROP TABLE compute_listings; --",
        "filters": {
          "provider": "1 OR 1=1"
        }
      }
      """
    Then the response status should be 400
    And the value at "error.code" should equal "INVALID_INPUT"
    And no database tables should be modified

  # ============================================
  # XSS Attack Prevention
  # ============================================

  @xss @input-sanitization
  Scenario Outline: Sanitize XSS payloads in user input
    Given I am authenticated as a user via API
    When I POST "/api/v1/compute/listings" with JSON body:
      """
      {
        "title": "<xss_payload>",
        "description": "Test listing",
        "price": 100
      }
      """
    Then the response status should be 201
    When I GET "/api/v1/compute/listings?search=Test listing"
    Then the value at "data[0].title" should not contain "<script>"
    And the value at "data[0].title" should not contain "javascript:"
    And the value at "data[0].title" should be HTML escaped

    Examples:
      | xss_payload                                      |
      | <script>alert('XSS')</script>                    |
      | <img src=x onerror=alert('XSS')>                 |
      | javascript:alert('XSS')                          |
      | <svg onload=alert('XSS')>                        |
      | <iframe src="javascript:alert('XSS')"></iframe>  |

  @xss @output-encoding
  Scenario: Prevent reflected XSS in error messages
    Given I set header "X-API-Key" to "valid_api_key"
    When I GET "/api/v1/compute/listings/<script>alert('XSS')</script>"
    Then the response status should be 400
    And the response body should not contain unescaped "<script>"
    And the value at "error.message" should be HTML escaped

  # ============================================
  # CSRF Protection
  # ============================================

  @csrf @session-security
  Scenario: Reject state-changing requests without CSRF token
    Given I am authenticated as a user via API
    And I clear header "X-CSRF-Token"
    When I POST "/api/v1/orders" with JSON body:
      """
      {
        "listingId": "listing-123",
        "quantity": 10
      }
      """
    Then the response status should be 403
    And the value at "error.code" should equal "CSRF_TOKEN_MISSING"
    And the order should not be created in the database

  @csrf @session-security
  Scenario: Reject requests with invalid CSRF token
    Given I am authenticated as a user via API
    And I set header "X-CSRF-Token" to "invalid_csrf_token_123"
    When I POST "/api/v1/orders" with JSON body:
      """
      {
        "listingId": "listing-123",
        "quantity": 10
      }
      """
    Then the response status should be 403
    And the value at "error.code" should equal "CSRF_TOKEN_INVALID"

  @csrf @session-security
  Scenario: Accept state-changing requests with valid CSRF token
    Given I am authenticated as a user via API
    And I have obtained a valid CSRF token
    And I set header "X-CSRF-Token" to "{csrfToken}"
    When I POST "/api/v1/orders" with JSON body:
      """
      {
        "listingId": "listing-123",
        "quantity": 10
      }
      """
    Then the response status should be 201
    And the order should be created in the database

  # ============================================
  # Input Validation and Sanitization
  # ============================================

  @input-validation @data-integrity
  Scenario Outline: Validate required fields in API requests
    Given I am authenticated as a user via API
    When I POST "/api/v1/compute/listings" with JSON body:
      """
      {
        "title": "<title>",
        "description": "<description>",
        "price": <price>
      }
      """
    Then the response status should be 400
    And the value at "error.code" should equal "VALIDATION_ERROR"
    And the value at "error.fields[0].field" should equal "<field>"

    Examples:
      | title | description | price | field       |
      |       | Test desc   | 100   | title       |
      | Test  |             | 100   | description |
      | Test  | Test desc   | -1    | price       |
      | Test  | Test desc   | abc   | price       |

  @input-validation @data-integrity
  Scenario: Enforce maximum field length limits
    Given I am authenticated as a user via API
    When I POST "/api/v1/compute/listings" with JSON body:
      """
      {
        "title": "A very long title that exceeds the maximum allowed length of 200 characters and should be rejected by the API validation layer to prevent database issues and potential buffer overflow attacks",
        "description": "Valid description",
        "price": 100
      }
      """
    Then the response status should be 400
    And the value at "error.code" should equal "VALIDATION_ERROR"
    And the value at "error.fields[0].constraint" should equal "maxLength"

  @input-validation @data-integrity
  Scenario: Reject requests with malformed JSON
    Given I am authenticated as a user via API
    When I POST "/api/v1/compute/listings" with body:
      """
      { invalid json content: missing quotes and braces
      """
    Then the response status should be 400
    And the value at "error.code" should equal "MALFORMED_JSON"
    And the response should not expose internal parser error details

  # ============================================
  # Authentication Bypass Attempts
  # ============================================

  @authentication @bypass-attempts
  Scenario: Reject requests with tampered JWT tokens
    Given I set header "Authorization" to "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.payload.signature"
    When I GET "/api/v1/user/profile"
    Then the response status should be 401
    And the value at "error.code" should equal "INVALID_TOKEN"
    And an audit log entry should be created with event type "AUTHENTICATION_FAILURE"

  @authentication @bypass-attempts
  Scenario: Reject requests with expired JWT tokens
    Given I set header "Authorization" to "Bearer {expiredToken}"
    When I GET "/api/v1/user/profile"
    Then the response status should be 401
    And the value at "error.code" should equal "TOKEN_EXPIRED"
    And the value at "error.details.expiredAt" should be a valid ISO8601 date

  @authentication @bypass-attempts
  Scenario: Reject requests with manipulated session cookies
    Given I set cookie "session" to "manipulated_session_value"
    When I GET "/api/v1/user/profile"
    Then the response status should be 401
    And the value at "error.code" should equal "INVALID_SESSION"
    And the session cookie should be cleared in the response

  # ============================================
  # Authorization Checks
  # ============================================

  @authorization @access-control
  Scenario: Prevent users from accessing other users' resources
    Given I am authenticated as user "user-a" via API
    And user "user-b" has a compute listing with id "listing-b-123"
    When I GET "/api/v1/compute/listings/listing-b-123"
    Then the response status should be 403
    And the value at "error.code" should equal "ACCESS_DENIED"
    And the value at "error.message" should equal "You do not have permission to access this resource"

  @authorization @access-control
  Scenario: Prevent non-admin users from accessing admin endpoints
    Given I am authenticated as a user via API
    When I GET "/api/v1/admin/users"
    Then the response status should be 403
    And the value at "error.code" should equal "INSUFFICIENT_PRIVILEGES"
    And an audit log entry should be created with event type "UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT"

  @authorization @access-control
  Scenario: Allow admin users to access admin endpoints
    Given I am authenticated as an admin via API
    When I GET "/api/v1/admin/users"
    Then the response status should be 200
    And the response should be a JSON array

  @authorization @access-control
  Scenario: Enforce role-based access control on mutations
    Given I am authenticated as a user via API
    When I POST "/api/v1/admin/compute-listings/bulk-delete" with JSON body:
      """
      {
        "listingIds": ["listing-1", "listing-2"]
      }
      """
    Then the response status should be 403
    And no compute listings should be deleted

  # ============================================
  # Sensitive Data Exposure Prevention
  # ============================================

  @data-protection @sensitive-data
  Scenario: Mask sensitive fields in API responses
    Given I am authenticated as a user via API
    When I GET "/api/v1/user/profile"
    Then the response status should be 200
    And the value at "email" should match pattern "***@***.***"
    And the value at "phone" should match pattern "***-***-****"
    And the response should not contain field "passwordHash"
    And the response should not contain field "apiSecretKey"

  @data-protection @sensitive-data
  Scenario: Exclude internal IDs from public responses
    Given I set header "X-API-Key" to "valid_public_key"
    When I GET "/api/v1/compute/listings"
    Then the response status should be 200
    And the response should not contain field "internalDatabaseId"
    And the response should not contain field "rowVersion"
    And each item should have public "id" field present

  @data-protection @sensitive-data
  Scenario: Prevent stack traces in production error responses
    Given I set header "X-API-Key" to "valid_api_key"
    When I GET "/api/v1/trigger-error"
    Then the response status should be 500
    And the response body should not contain "at "
    And the response body should not contain "Stack trace"
    And the response body should not contain file paths
    And the value at "error.code" should equal "INTERNAL_ERROR"
    And the value at "error.message" should equal "An internal error occurred"

  @data-protection @sensitive-data
  Scenario: Redact sensitive data in query parameters from logs
    Given I am authenticated as a user via API
    When I GET "/api/v1/compute/listings?apiKey=secret123&password=mypass"
    Then the response status should be 200
    And the access log entry should contain "apiKey=***REDACTED***"
    And the access log entry should contain "password=***REDACTED***"

  # ============================================
  # Security Headers Validation
  # ============================================

  @security-headers @transport-security
  Scenario: Enforce security headers on all responses
    Given I set header "X-API-Key" to "valid_api_key"
    When I GET "/api/v1/compute/listings"
    Then the response status should be 200
    And the response header "X-Content-Type-Options" should equal "nosniff"
    And the response header "X-Frame-Options" should equal "DENY"
    And the response header "X-XSS-Protection" should equal "1; mode=block"
    And the response header "Strict-Transport-Security" should be present
    And the response header "Content-Security-Policy" should be present
    And the response header "Referrer-Policy" should equal "strict-origin-when-cross-origin"

  @security-headers @transport-security
  Scenario: Prevent MIME type sniffing attacks
    Given I set header "X-API-Key" to "valid_api_key"
    When I GET "/api/v1/compute/listings"
    Then the response status should be 200
    And the response header "Content-Type" should equal "application/json"
    And the response header "X-Content-Type-Options" should equal "nosniff"

  @security-headers @transport-security
  Scenario: Enforce HTTPS in production environment
    Given the environment is set to "production"
    And I set header "X-API-Key" to "valid_api_key"
    When I GET "http://api.clawmarket.com/api/v1/compute/listings"
    Then the response status should be 301
    And the response header "Location" should start with "https://"

  # ============================================
  # Audit Logging of Security Events
  # ============================================

  @audit-logging @security-monitoring
  Scenario: Log failed authentication attempts
    Given I set header "X-API-Key" to "invalid_api_key"
    When I GET "/api/v1/compute/listings"
    Then the response status should be 401
    And an audit log entry should be created with:
      | field          | value                     |
      | eventType      | AUTHENTICATION_FAILURE    |
      | severity       | WARNING                   |
      | resource       | /api/v1/compute/listings  |
      | clientIp       | present                   |
      | timestamp      | within last 5 seconds     |

  @audit-logging @security-monitoring
  Scenario: Log authorization failures
    Given I am authenticated as a user via API
    When I GET "/api/v1/admin/users"
    Then the response status should be 403
    And an audit log entry should be created with:
      | field          | value                          |
      | eventType      | AUTHORIZATION_FAILURE          |
      | severity       | WARNING                        |
      | userId         | present                        |
      | attemptedResource | /api/v1/admin/users         |
      | reason         | INSUFFICIENT_PRIVILEGES        |

  @audit-logging @security-monitoring
  Scenario: Log rate limit violations
    Given I set header "X-API-Key" to "valid_public_key"
    When I send 101 GET requests to "/api/v1/compute/listings" within 60 seconds
    Then an audit log entry should be created with:
      | field          | value                     |
      | eventType      | RATE_LIMIT_EXCEEDED       |
      | severity       | INFO                      |
      | limit          | 100                       |
      | window         | 60s                       |
      | clientIp       | present                   |

  @audit-logging @security-monitoring
  Scenario: Log suspicious input patterns
    Given I set header "X-API-Key" to "valid_api_key"
    When I GET "/api/v1/compute/listings?search='; DROP TABLE users; --"
    Then the response status should be 400
    And an audit log entry should be created with:
      | field          | value                     |
      | eventType      | SUSPICIOUS_INPUT_DETECTED |
      | severity       | HIGH                      |
      | patternType    | SQL_INJECTION_ATTEMPT     |
      | clientIp       | present                   |
      | actionTaken    | REQUEST_BLOCKED           |

  @audit-logging @security-monitoring
  Scenario: Log successful security events
    Given I am authenticated as an admin via API
    When I GET "/api/v1/admin/users"
    Then the response status should be 200
    And an audit log entry should be created with:
      | field          | value                     |
      | eventType      | ADMIN_ACCESS              |
      | severity       | INFO                      |
      | userId         | present                     |
      | resource       | /api/v1/admin/users       |
      | success        | true                      |

  # ============================================
  # Advanced Attack Simulation
  # ============================================

  @attack-simulation @advanced-security
  Scenario: Prevent path traversal attacks
    Given I set header "X-API-Key" to "valid_api_key"
    When I GET "/api/v1/files/../../../etc/passwd"
    Then the response status should be 400
    And the value at "error.code" should equal "INVALID_PATH"
    And the file system should not be accessed outside allowed directories

  @attack-simulation @advanced-security
  Scenario: Prevent command injection attacks
    Given I am authenticated as an admin via API
    When I POST "/api/v1/admin/system/exec" with JSON body:
      """
      {
        "command": "ls; rm -rf /"
      }
      """
    Then the response status should be 400
    And the value at "error.code" should equal "INVALID_COMMAND"
    And no system command should be executed

  @attack-simulation @advanced-security
  Scenario: Prevent XML External Entity (XXE) attacks
    Given I set header "Content-Type" to "application/xml"
    And I set header "X-API-Key" to "valid_api_key"
    When I POST "/api/v1/import" with body:
      """
      <?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE foo [
        <!ENTITY xxe SYSTEM "file:///etc/passwd">
      ]>
      <import>
        <data>&xxe;</data>
      </import>
      """
    Then the response status should be 400
    And the value at "error.code" should equal "XML_PARSE_ERROR"
    And the response body should not contain "root:x:"

  @attack-simulation @advanced-security
  Scenario: Prevent NoSQL injection attacks
    Given I set header "X-API-Key" to "valid_api_key"
    When I POST "/api/v1/compute/listings/search" with JSON body:
      """
      {
        "query": {
          "$where": "this.price > 0 || sleep(5000)"
        }
      }
      """
    Then the response status should be 400
    And the value at "error.code" should equal "INVALID_QUERY"
    And the database should not execute the injected operator

  @attack-simulation @advanced-security
  Scenario: Prevent Server-Side Request Forgery (SSRF)
    Given I am authenticated as a user via API
    When I POST "/api/v1/webhooks" with JSON body:
      """
      {
        "url": "http://169.254.169.254/latest/meta-data/"
      }
      """
    Then the response status should be 400
    And the value at "error.code" should equal "INVALID_URL"
    And no internal metadata service should be accessed

  @attack-simulation @advanced-security
  Scenario: Prevent HTTP Parameter Pollution
    Given I set header "X-API-Key" to "valid_api_key"
    When I GET "/api/v1/compute/listings?id=listing-1&id=listing-2&id=listing-3"
    Then the response status should be 400
    And the value at "error.code" should equal "DUPLICATE_PARAMETER"
    And the response should use the first or last value consistently

  @attack-simulation @advanced-security
   Scenario: Prevent HTTP Method Override attacks
     Given I set header "X-API-Key" to "valid_api_key"
     And I set header "X-HTTP-Method-Override" to "DELETE"
     When I GET "/api/v1/compute/listings/listing-123"
     Then the response status should be 200 or 400
     And the listing should not be deleted
    And the value at "error.code" should equal "METHOD_OVERRIDE_NOT_ALLOWED"

   @attack-simulation @advanced-security
   Scenario: Prevent Host Header Injection
     Given I set header "X-API-Key" to "valid_api_key"
     And I set header "Host" to "malicious-site.com"
     When I GET "/api/v1/compute/listings"
     Then the response status should be 400 or 403
    And the value at "error.code" should be one of:
      | INVALID_HOST          |
      | HOST_HEADER_MISMATCH  |

  @attack-simulation @advanced-security
  Scenario: Prevent Large Payload (DoS) attacks
    Given I am authenticated as a user via API
    When I POST "/api/v1/compute/listings" with JSON body containing 100MB of data
    Then the response status should be 413
    And the value at "error.code" should equal "PAYLOAD_TOO_LARGE"
    And the server should remain responsive

   @attack-simulation @advanced-security
   Scenario: Prevent Slowloris-style attacks
     Given I set header "X-API-Key" to "valid_api_key"
     When I send a request with headers sent slowly over 60 seconds
     Then the connection should be closed by server after timeout
     And the response status should be 408 or connection terminated

  @attack-simulation @advanced-security
  Scenario: Prevent JSON depth bombing attacks
    Given I am authenticated as a user via API
    When I POST "/api/v1/compute/listings" with deeply nested JSON body (1000 levels)
    Then the response status should be 400
    And the value at "error.code" should equal "JSON_DEPTH_EXCEEDED"
    And the server memory usage should remain stable
