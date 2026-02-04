---
sidebar_position: 1
title: BDD Overview
---

# Behavior-Driven Development (BDD) Overview

AquaTrack uses **Behavior-Driven Development (BDD)** to ensure all features are defined, tested, and implemented correctly. BDD bridges the gap between business requirements and technical implementation.

## What is BDD?

BDD is an agile software development technique that encourages collaboration among developers, QA, and non-technical participants in a software project. It extends Test-Driven Development (TDD) by writing test cases in a natural language that non-programmers can read.

```mermaid
graph LR
    A[Business<br/>Requirements] --> B[Plain Language<br/>Scenarios]
    B --> C[Automated<br/>Tests]
    C --> D[Working<br/>Code]
    D --> E[Living<br/>Documentation]

    style A fill:#e1f5ff
    style B fill:#fff4cc
    style C fill:#e8f5e9
    style D fill:#ccffcc
    style E fill:#f3e5f5
```

## The BDD Cycle

PrimaDemo follows a strict **Red-Green-Refactor** cycle:

### 1. Red Phase - Write Scenarios
Define expected behavior **before** writing any code. Tests should fail initially.

### 2. Green Phase - Implement Feature
Make tests pass by implementing the feature correctly.

### 3. Refactor Phase - Improve Code
Clean up code while keeping tests green.

```mermaid
graph TD
    A[🔴 Red Phase<br/>Write Scenarios] --> B[🟢 Green Phase<br/>Implement Code]
    B --> C[🔵 Refactor Phase<br/>Improve Code]
    C --> D[✅ Feature Complete]

    style A fill:#ffcccc
    style B fill:#ccffcc
    style C fill:#ccccff
    style D fill:#c8e6c9
```

## BDD at AquaTrack

### Our Approach

We integrate BDD with **Domain-Driven Design (DDD)** to ensure our tests reflect real business behavior:

```mermaid
graph TB
    subgraph "DDD Concepts"
        D1[Bounded Contexts]
        D2[Ubiquitous Language]
        D3[Aggregates]
        D4[Domain Events]
        D5[Use Cases]
    end

    subgraph "BDD Scenarios"
        B1[Feature Files]
        B2[Gherkin Syntax]
        B3[Given/When/Then]
        B4[Scenario Outlines]
    end

    subgraph "Implementation"
        I1[Step Definitions]
        I2[Domain Logic]
        I3[Automated Tests]
    end

    D2 --> B1
    D5 --> B2
    B1 --> I1
    B2 --> I3

    style D2 fill:#fff4cc
    style B1 fill:#e8f5e9
    style I3 fill:#ccffcc
```

### Key Benefits

1. **Shared Understanding** - Business and technical teams speak the same language
2. **Living Documentation** - Feature files document system behavior
3. **Regression Safety** - Automated tests catch breaking changes
4. **DDD Alignment** - Tests use domain terminology from ubiquitous language
5. **Quality Assurance** - Every feature has acceptance criteria

## Gherkin: The Language of BDD

We use **Gherkin** syntax to write scenarios in plain English:

```gherkin
Feature: Meter Registration
  As a customer
  I want to register my water meter
  So that I can track consumption

  Scenario: Successfully register a new meter
    Given a customer with a valid address
    When they submit registration with meter number "WM-001"
    Then a new meter should be created
    And the meter should have a unique ID
    And the registration timestamp should be recorded
```

### Gherkin Structure

```mermaid
flowchart TD
    Feature[Feature: Description<br/>━━━━━━━━━━<br/>Business value statement] --> Background[Background:<br/>━━━━━━━━━━<br/>Shared preconditions]
    
    Background --> Scenario1[Scenario: Name<br/>━━━━━━━━━━<br/>Given precondition<br/>When action<br/>Then result]
    
    Background --> Scenario2[Scenario Outline: Name<br/>━━━━━━━━━━<br/>Parameterized scenario<br/>Examples: Data table]
    
    Scenario1 --> Tags1["@ROAD-001\n@smoke\n@api"]
    Scenario2 --> Tags2["@ROAD-001\n@validation"]

    style Feature fill:#e1f5ff
    style Scenario1 fill:#ccffcc
    style Scenario2 fill:#fff4cc
```

## Feature Organization

Our BDD scenarios are organized by domain area:

```
stack-tests/features/
├── api/
│   ├── meter-management/      # Meter registration, readings, alerts
│   ├── customer-management/   # Customer enrollment, profiles, billing
│   ├── water-supply/          # Supply scheduling, pressure management
│   └── billing-settlement/    # Meter verification, billing, payments
├── ui/
│   ├── meter-registration-ui/ # UI flows for meter registration
│   ├── dashboard-ui/          # Dashboard and reporting UI
│   └── billing-management-ui/ # Billing UI
└── hybrid/
    └── end-to-end-meter-flow/ # Full user journeys
```

## Connecting DDD and BDD

BDD scenarios directly map to DDD concepts:

| DDD Concept | BDD Application |
|-------------|-----------------|
| **Bounded Context** | Feature file organization by domain area |
| **Ubiquitous Language** | Scenario vocabulary matches domain terms |
| **Aggregates** | Scenarios test aggregate behavior and invariants |
| **Domain Events** | Scenarios verify events are published |
| **Use Cases** | Each use case has corresponding feature file |

### AquaTrack Domain Example

Water infrastructure systems include meters, customers, readings, and billing—each representing key domain concepts.

### Example Mapping

```mermaid
graph LR
    subgraph "DDD: Meter Management Context"
        A[Meter Aggregate]
        B[Registration<br/>Use Case]
        C[MeterRegistered<br/>Domain Event]
    end

    subgraph "BDD: Feature File"
        D[Feature: Meter<br/>Registration]
        E[Scenario: Register<br/>new meter]
        F[Scenario: Prevent<br/>duplicate meters]
    end

    subgraph "Test Results"
        G[✅ Tests Pass]
        H[Living<br/>Documentation]
    end

    A --> D
    B --> E
    C --> F
    D --> G
    E --> H

    style A fill:#fff4cc
    style D fill:#e8f5e9
    style G fill:#ccffcc
```

## Running BDD Tests

### Quick Commands

```bash
# Install dependencies
just bdd-install

# Run all BDD tests
just bdd-test

# Run tests for specific roadmap item
just bdd-roadmap ROAD-001

# Run with visible browser (UI tests)
just bdd-headed

# Generate test report
just bdd-report
```

### Test Categories

| Command | Description |
|---------|-------------|
| `just bdd-api` | API tests only |
| `just bdd-ui` | UI tests only |
| `just bdd-hybrid` | E2E tests only |
| `just bdd-tag @smoke` | Tests tagged with @smoke |
| `just bdd-gen` | Generate step definitions |

## The Complete Workflow

```mermaid
flowchart TD
    Start([Start Feature]) --> Research[Research Domain<br/>Review DDD Docs]
    
    Research --> Draft[Draft Scenarios<br/>Use Ubiquitous Language]
    Draft --> Review[User Review<br/>Refine Scenarios]
    
    Review --> Create["Create Feature File, Tag with ROAD-XXX"]
    Create --> RunRed[Run Tests<br/>RED Phase]
    
    RunRed --> Implement[Implement Feature<br/>Domain → App → Infra]
    Implement --> RunGreen[Run Tests<br/>GREEN Phase]
    
    RunGreen --> Refactor[Refactor Code<br/>Keep Tests Green]
    Refactor --> Complete([Feature Complete])

    style Start fill:#e1f5ff
    style RunRed fill:#ffcccc
    style RunGreen fill:#ccffcc
    style Complete fill:#c8e6c9
```

## Capability Testing

BDD tests are tagged with capability identifiers to ensure coverage:

```gherkin
@CAP-001 @CAP-002
Feature: Bot Registration
  # Tests authentication (CAP-001) and audit logging (CAP-002) capabilities
```

See [Capability Tags](./capability-tags) for full tagging guide.

## Next Steps

- [Learn Gherkin Syntax](./gherkin-syntax) - Full Gherkin reference guide
- [View Feature Index](./feature-index) - Browse all feature files
- [DDD-BDD Mapping](./ddd-bdd-mapping) - See how domain concepts map to tests
- [Capability Tags](./capability-tags) - Test tagging by system capability
- [BDD Loop Workflow](../agents/bdd-loop) - Detailed development workflow
- [Agent Coordination](../agents/coordination) - How agents automate BDD

---

**Related**: [DDD Overview](../ddd/domain-overview) • [Ubiquitous Language](../ddd/ubiquitous-language) • [Use Cases](../ddd/use-cases) • [Capabilities](../capabilities/index)
