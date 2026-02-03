---
id: NFR-A11Y-001
title: WCAG 2.1 AA Compliance
category: accessibility
priority: must
status: active
created: 2026-01-31
---

# NFR-A11Y-001: WCAG 2.1 AA Compliance

## Requirement

All user-facing web interfaces must meet WCAG 2.1 Level AA standards.

## Specifications

### Perceivable

#### Text Alternatives
- All images must have descriptive alt text
- Decorative images must have empty alt attributes
- Complex charts must have detailed text descriptions

#### Color Contrast
- Normal text: minimum 4.5:1 contrast ratio
- Large text (18pt+): minimum 3:1 contrast ratio
- UI components: minimum 3:1 contrast ratio

#### Resize Text
- Text must be readable when zoomed to 200%
- No horizontal scrolling required at 1280px width

### Operable

#### Keyboard Navigation
- All functionality must be available via keyboard
- Focus indicators must be clearly visible
- Tab order must follow logical reading order

#### Timing
- No auto-refreshing content without user control
- Session timeouts must provide 2-minute warnings

### Understandable

#### Readable
- Content must not rely solely on color
- Error messages must be clear and actionable
- Form labels must be associated with inputs

#### Predictable
- Navigation must be consistent across pages
- Form submissions must not change context unexpectedly

### Robust

#### Compatible
- Must work with screen readers (NVDA, JAWS, VoiceOver)
- Must work with voice control software
- Valid HTML5 markup

## Validation Criteria

```gherkin
Feature: Accessibility Compliance
  
  Scenario: Keyboard navigation works
    Given I am using only the keyboard
    When I navigate through the bot registration form
    Then all fields should be focusable
    And the submit button should be activatable with Enter
    
  Scenario: Screen reader compatibility
    Given I am using a screen reader
    When I visit the dashboard
    Then all navigation items should be announced
    And status changes should be announced
    
  Scenario: Color contrast meets standards
    When I check the contrast of all text elements
    Then all text should meet WCAG AA contrast requirements
```

## Testing Tools

- axe DevTools
- Lighthouse Accessibility Audit
- WAVE Browser Extension
- Manual screen reader testing

## Related

- [ROAD-022](../roads/ROAD-022.md) - Accessibility Improvements
- [ADR-019](../adr/adr-019-tailwind-css.md) - Tailwind CSS (includes accessibility utilities)
