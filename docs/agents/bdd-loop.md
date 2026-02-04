---
sidebar_position: 3
title: BDD Loop Workflow
---

# BDD Loop Workflow

AquaTrack follows a strict **Behavior-Driven Development (BDD)** loop ensuring all features are defined, tested, and implemented correctly.

## The Three Phases

```mermaid
graph LR
    A[🔴 Red Phase<br/>Write Scenarios] --> B[🟢 Green Phase<br/>Implement Code]
    B --> C[🔵 Refactor Phase<br/>Improve Code]
    C --> D[✅ Feature Complete]

    style A fill:#ffcccc
    style B fill:#ccffcc
    style C fill:#ccccff
    style D fill:#ccffaa
```

## Complete BDD Loop Flow

```mermaid
flowchart TD
    Start([User Requests Feature]) --> Research[BDD Writer: Research Domain]
    Research --> Draft[BDD Writer: Draft Scenarios]
    Draft --> Ask{BDD Writer:<br/>Ask Permission}
    Ask -->|User Rejects| Revise[Revise Scenarios]
    Revise --> Ask
    Ask -->|User Approves| Create[BDD Writer: Create Feature File]

    Create --> TagRoadmap["Tag Scenarios with ROAD-XXX and CAP-XXX"]
    TagRoadmap --> RunRed[BDD Runner: Execute Tests]
    RunRed --> RedResult{Tests Pass?}

    RedResult -->|No - RED PHASE ✓| Implement[Code Writer: Implement Feature]
    RedResult -->|Yes - ERROR!| Error[Something Wrong:<br/>Tests should fail initially]

    Implement --> Domain[1. Domain Layer<br/>Pure Business Logic]
    Domain --> App[2. Application Layer<br/>Orchestration]
    App --> Infra[3. Infrastructure Layer<br/>Convex Integration]
    Infra --> Steps[4. Step Definitions<br/>BDD Test Steps]

    Steps --> ReviewArch[Architecture Inspector:<br/>Review Hexagonal Compliance]
    ReviewArch --> ArchOK{Compliant?}
    ArchOK -->|No| FixArch[Code Writer: Fix Issues]
    FixArch --> ReviewArch
    ArchOK -->|Yes| ReviewDDD[DDD Aligner:<br/>Check Domain Alignment]

    ReviewDDD --> DDDOK{Aligned?}
    DDDOK -->|No| FixDDD[Code Writer: Fix Domain Issues]
    FixDDD --> ReviewDDD
    DDDOK -->|Yes| RunGreen[BDD Runner: Re-run Tests]

    RunGreen --> GreenResult{Tests Pass?}
    GreenResult -->|No| Debug[Debug Issues]
    Debug --> Implement
    GreenResult -->|Yes - GREEN PHASE ✓| CI[CI Runner: Full Quality Checks]

    CI --> CIOK{All Checks Pass?}
    CIOK -->|No| FixCI[Fix Issues]
    FixCI --> CI
    CIOK -->|Yes| Refactor[Code Writer: Refactor]

    Refactor --> RefactorTest[Run Tests After Each Change]
    RefactorTest --> StillGreen{Still Green?}
    StillGreen -->|No| RevertRefactor[Revert Last Change]
    RevertRefactor --> Refactor
    StillGreen -->|Yes| MoreRefactor{More to Refactor?}
    MoreRefactor -->|Yes| Refactor
    MoreRefactor -->|No| FinalCI[CI Runner: Final Check]

    FinalCI --> UpdateDocs[Main: Update Changelog & Roadmap]
    UpdateDocs --> Complete([✅ Feature Complete!])

    style Start fill:#e1f5ff
    style Complete fill:#c8e6c9
    style RedResult fill:#ffcccc
    style GreenResult fill:#ccffcc
    style Refactor fill:#ccccff
```

## Phase 1: Red Phase - Write Scenarios

**Goal**: Define expected behavior BEFORE writing any code

```mermaid
sequenceDiagram
    participant U as User
    participant M as Main Orchestrator
    participant BW as BDD Writer
    participant DA as DDD Aligner
    participant BR as BDD Runner

    U->>M: Request feature (ROAD-XXX)
    M->>BW: "Draft BDD scenarios"

    activate BW
    BW->>BW: Research domain docs
    BW->>BW: Review use cases
    BW->>DA: "Verify terminology"
    DA-->>BW: "✅ Language correct"
    BW->>BW: Draft scenarios
    deactivate BW

    BW->>M: "Scenarios drafted"
    M->>U: "Review scenarios"

    alt User Approves
        U->>M: "Approved"
        M->>BW: "Create feature file"
        BW->>BW: Create with @ROAD-XXX tag
        BW->>M: "✅ Feature file created"
    else User Rejects
        U->>M: "Revise"
        M->>BW: "Make changes"
        BW->>M: "Revised"
        M->>U: "Review again"
    end

    M->>BR: "Run tests"
    BR->>BR: Execute BDD tests
    BR->>M: "❌ Tests failing (expected)"
    M->>U: "Red phase complete"

    Note over U,BR: Tests SHOULD fail - no implementation yet!
```

### Red Phase Checklist

```mermaid
flowchart LR
    subgraph "Red Phase Requirements"
        R1[✅ Scenarios use<br/>ubiquitous language]
        R2["✅ Tagged with ROAD-XXX"]
        R2b["✅ Tagged with CAP-XXX"]
        R3[✅ Cover happy path]
        R4[✅ Include validations]
        R5[✅ Edge cases included]
        R6[✅ User approved]
        R7[✅ Tests run & fail]
    end

    R1 --> R2 --> R2b --> R3 --> R4 --> R5 --> R6 --> R7
    R7 --> Done([Ready for Green Phase])

    style Done fill:#ccffcc
```

## Phase 2: Green Phase - Implement Feature

**Goal**: Make tests pass by implementing the feature correctly

```mermaid
sequenceDiagram
    participant M as Main Orchestrator
    participant CW as Code Writer
    participant AI as Architecture Inspector
    participant DA as DDD Aligner
    participant BR as BDD Runner
    participant CI as CI Runner

    M->>CW: "Implement feature"

    activate CW
    Note over CW: Layer-by-Layer Implementation

    CW->>CW: 1. Domain Layer<br/>(Pure business logic)
    CW->>CW: 2. Application Layer<br/>(Orchestration)
    CW->>CW: 3. Infrastructure Layer<br/>(Convex adapters)
    CW->>CW: 4. Step Definitions<br/>(BDD test glue)
    deactivate CW

    CW->>AI: "Review architecture"
    activate AI
    AI->>AI: Check ports & adapters
    AI->>AI: Verify dependency direction
    alt Architecture Issues
        AI->>CW: "❌ Violations found"
        CW->>CW: Fix issues
        CW->>AI: "Review again"
    else Architecture Good
        AI->>CW: "✅ Hexagonal compliant"
    end
    deactivate AI

    CW->>DA: "Check domain alignment"
    activate DA
    DA->>DA: Verify ubiquitous language
    DA->>DA: Check aggregate boundaries
    alt Domain Issues
        DA->>CW: "❌ Domain misaligned"
        CW->>CW: Fix domain issues
        CW->>DA: "Check again"
    else Domain Aligned
        DA->>CW: "✅ Domain aligned"
        DA->>DA: Update docs if needed
    end
    deactivate DA

    CW->>M: "✅ Implementation complete"
    M->>BR: "Run tests"

    activate BR
    BR->>BR: Execute BDD tests
    alt Tests Fail
        BR->>M: "❌ Tests still failing"
        M->>CW: "Debug & fix"
        CW->>M: "Fixed"
        M->>BR: "Re-run tests"
    else Tests Pass
        BR->>M: "✅ All tests passing!"
    end
    deactivate BR

    M->>CI: "Run full checks"
    activate CI
    CI->>CI: Lint
    CI->>CI: Type check
    CI->>CI: Unit tests
    CI->>M: "✅ All checks passed"
    deactivate CI

    M->>M: "Green phase complete"
```

### Implementation Layers

```mermaid
graph TD
    subgraph "Hexagonal Architecture Layers"
        Domain[Domain Layer<br/>━━━━━━━━━━<br/>Aggregates<br/>Value Objects<br/>Domain Events<br/>━━━━━━━━━━<br/>NO external dependencies]

        App[Application Layer<br/>━━━━━━━━━━<br/>Use Cases<br/>Services<br/>Orchestration<br/>━━━━━━━━━━<br/>Uses domain ports]

        Infra[Infrastructure Layer<br/>━━━━━━━━━━<br/>Convex Adapters<br/>Database<br/>External APIs<br/>━━━━━━━━━━<br/>Implements ports]

        Steps[Step Definitions<br/>━━━━━━━━━━<br/>BDD Test Glue<br/>Given/When/Then<br/>━━━━━━━━━━<br/>Calls infrastructure]
    end

    Steps --> Infra
    Infra --> App
    App --> Domain

    style Domain fill:#fff4cc
    style App fill:#e1f5ff
    style Infra fill:#f0f0f0
    style Steps fill:#e8f5e9
```

### Green Phase Checklist

```mermaid
flowchart LR
    subgraph "Green Phase Requirements"
        G1[✅ Domain layer<br/>implemented]
        G2[✅ Application layer<br/>orchestrates]
        G3[✅ Infrastructure<br/>wired up]
        G4[✅ Step definitions<br/>complete]
        G5[✅ Architecture<br/>reviewed]
        G6[✅ DDD alignment<br/>verified]
        G7[✅ All tests<br/>passing]
        G8[✅ CI checks<br/>passed]
    end

    G1 --> G2 --> G3 --> G4 --> G5 --> G6 --> G7 --> G8
    G8 --> Done([Ready for Refactor Phase])

    style Done fill:#ccccff
```

## Phase 3: Refactor Phase - Improve Code

**Goal**: Clean up code while keeping tests green

```mermaid
flowchart TD
    Start([Code Working<br/>Tests Passing]) --> Identify[Identify<br/>Code Smells]

    Identify --> Extract{Extract<br/>Duplication?}
    Extract -->|Yes| MakeChange1[Extract to Method/Class]
    Extract -->|No| Rename{Improve<br/>Naming?}

    Rename -->|Yes| MakeChange2[Rename Variables/Methods]
    Rename -->|No| Optimize{Optimize<br/>Performance?}

    Optimize -->|Yes| MakeChange3[Improve Algorithm/Query]
    Optimize -->|No| CheckMore{More to<br/>Refactor?}

    MakeChange1 --> RunTests1[Run Tests]
    MakeChange2 --> RunTests1
    MakeChange3 --> RunTests1

    RunTests1 --> TestsPass{Tests<br/>Still Pass?}

    TestsPass -->|No - STOP| Revert[Revert Last Change]
    Revert --> Identify

    TestsPass -->|Yes| Commit[Commit Change]
    Commit --> CheckMore

    CheckMore -->|Yes| Identify
    CheckMore -->|No| FinalCheck[Run Full CI Suite]

    FinalCheck --> AllGood{Everything<br/>Pass?}
    AllGood -->|No| Fix[Fix Issues]
    Fix --> FinalCheck
    AllGood -->|Yes| Complete([✅ Refactor Complete])

    style Start fill:#ccffcc
    style TestsPass fill:#fff4cc
    style Revert fill:#ffcccc
    style Complete fill:#c8e6c9
```

### Refactoring Examples

```mermaid
graph TD
    subgraph "Before Refactoring"
        B1[Code duplication]
        B2[Unclear names]
        B3[Long methods]
        B4[Mixed concerns]
    end

    subgraph "After Refactoring"
        A1[DRY - extracted methods]
        A2[Clear, intention-revealing names]
        A3[Small, focused methods]
        A4[Separated concerns]
    end

    B1 -.->|Refactor| A1
    B2 -.->|Refactor| A2
    B3 -.->|Refactor| A3
    B4 -.->|Refactor| A4

    style B1 fill:#ffcccc
    style B2 fill:#ffcccc
    style B3 fill:#ffcccc
    style B4 fill:#ffcccc

    style A1 fill:#ccffcc
    style A2 fill:#ccffcc
    style A3 fill:#ccffcc
    style A4 fill:#ccffcc
```

### Refactor Phase Checklist

```mermaid
flowchart LR
    subgraph "Refactor Phase Requirements"
        RF1[✅ Code is DRY]
        RF2[✅ Names are clear]
        RF3[✅ Methods are small]
        RF4[✅ Performance optimized]
        RF5[✅ Tests still passing]
        RF6[✅ Coverage maintained]
    end

    RF1 --> RF2 --> RF3 --> RF4 --> RF5 --> RF6
    RF6 --> Done([Feature Complete!])

    style Done fill:#c8e6c9
```

## Complete Example: Implementing ROAD-005 (Bot Authentication)

### Timeline Visualization

```mermaid
gantt
    title Bot Authentication Implementation (ROAD-005)
    dateFormat HH:mm
    axisFormat %H:%M

    section Red Phase
    Research domain docs       :00:00, 5m
    Draft scenarios           :00:05, 5m
    Get user approval         :00:10, 2m
    Create feature file       :00:12, 3m
    Run tests (fail)          :00:15, 2m

    section Green Phase
    Implement domain layer    :00:17, 8m
    Implement app layer       :00:25, 5m
    Implement infrastructure  :00:30, 7m
    Implement step defs       :00:37, 5m
    Architecture review       :00:42, 3m
    DDD alignment check       :00:45, 3m
    Run tests (pass)          :00:48, 2m

    section Refactor Phase
    Extract duplications      :00:50, 5m
    Improve naming            :00:55, 3m
    Optimize queries          :00:58, 4m
    Final CI check            :01:02, 3m
```

**Total Time**: ~65 minutes from start to completion

### Feature Flow with Agents

```mermaid
graph TD
    U[👤 User:<br/>Implement ROAD-005] --> M[🎯 Main Orchestrator]

    M --> BW[✍️ BDD Writer:<br/>Draft Scenarios]
    BW -.-> M
    M -.-> U
    U --> M2[👤 User: Approve]
    M2 --> BW2[✍️ BDD Writer:<br/>Create Feature File]

    BW2 --> BR1[🧪 BDD Runner:<br/>Run Tests - RED ❌]
    BR1 --> M3[🎯 Main:<br/>Delegate Implementation]

    M3 --> CW[💻 Code Writer:<br/>Implement Feature]
    CW --> AI[🏗️ Architecture Inspector:<br/>Review]
    AI --> DA[📐 DDD Aligner:<br/>Check Domain]

    DA --> BR2[🧪 BDD Runner:<br/>Run Tests - GREEN ✅]
    BR2 --> CI[⚙️ CI Runner:<br/>Full Quality Check]

    CI --> CW2[💻 Code Writer:<br/>Refactor]
    CW2 --> BR3[🧪 BDD Runner:<br/>Tests Still Green ✅]

    BR3 --> M4[🎯 Main:<br/>Update Docs]
    M4 --> Done[✅ ROAD-005 Complete]

    style U fill:#e1f5ff
    style Done fill:#c8e6c9
    style BR1 fill:#ffcccc
    style BR2 fill:#ccffcc
    style BR3 fill:#ccffcc
```

## Key Principles

### 1. Tests Drive Implementation

```mermaid
flowchart LR
    A[Write Test<br/>Define Behavior] --> B[Test Fails<br/>RED]
    B --> C[Write Code<br/>Minimum to Pass]
    C --> D[Test Passes<br/>GREEN]
    D --> E[Improve Code<br/>Refactor]
    E --> F[Tests Still Pass<br/>Still GREEN]

    style B fill:#ffcccc
    style D fill:#ccffcc
    style F fill:#ccffcc
```

### 2. Never Skip Phases

```mermaid
flowchart TD
    Skip{Skip Red Phase?} -->|Yes| Bad1[❌ No behavior definition<br/>❌ Unclear requirements<br/>❌ No acceptance criteria]
    Skip -->|No| Good1[✅ Clear behavior<br/>✅ Testable criteria<br/>✅ Living documentation]

    Skip2{Skip Green Phase?} -->|Yes| Bad2[❌ No implementation<br/>❌ Tests never pass<br/>❌ Feature incomplete]
    Skip2 -->|No| Good2[✅ Working code<br/>✅ Tests passing<br/>✅ Feature complete]

    Skip3{Skip Refactor Phase?} -->|Yes| Bad3[❌ Code debt accumulates<br/>❌ Hard to maintain<br/>❌ Performance issues]
    Skip3 -->|No| Good3[✅ Clean code<br/>✅ Easy to maintain<br/>✅ Optimized performance]

    style Bad1 fill:#ffcccc
    style Bad2 fill:#ffcccc
    style Bad3 fill:#ffcccc
    style Good1 fill:#ccffcc
    style Good2 fill:#ccffcc
    style Good3 fill:#ccffcc
```

### 3. Always Keep Tests Green

```mermaid
stateDiagram-v2
    [*] --> Red: Write Test
    Red --> Green: Implement Code
    Green --> Green: Refactor (tests pass)
    Green --> Red: Add New Behavior
    Green --> [*]: Feature Complete

    Red --> Red: Fix Test
    Green --> Red: Test Breaks (REVERT!)

    note right of Red
        Tests failing
        Expected state initially
        Fix: implement code
    end note

    note right of Green
        Tests passing
        Desired state always
        Maintain while refactoring
    end note
```

## Running the BDD Loop

### Commands by Phase

```mermaid
flowchart TD
    subgraph "Red Phase Commands"
        R1[just bdd-gen<br/>Generate test files]
        R2[just bdd-validate-cap-tags<br/>Validate capability tags]
        R3[just bdd-roadmap ROAD-XXX<br/>Run tests for feature]
        R1 --> R2 --> R3
    end

    subgraph "Green Phase Commands"
        G1[just typecheck<br/>Check types]
        G2[just lint<br/>Check style]
        G3[just test<br/>Run unit tests]
        G4[just bdd-roadmap ROAD-XXX<br/>Run BDD tests]
        G1 --> G2 --> G3 --> G4
    end

    subgraph "Refactor Phase Commands"
        RF1[just bdd-test<br/>Run all BDD]
        RF2[just check<br/>Full CI check]
        RF3[just bdd-report<br/>View results]
        RF1 --> RF2 --> RF3
    end

    R2 --> |Tests Fail ❌| G1
    G4 --> |Tests Pass ✅| RF1
    RF3 --> Done([Complete])

    style Done fill:#c8e6c9
```

## Success Metrics

```mermaid
graph LR
    subgraph "BDD Loop Success"
        S1["✅ All scenarios tagged with ROAD-XXX"]
        S2[✅ Red phase:<br/>tests fail initially]
        S3[✅ Green phase:<br/>tests pass after impl]
        S4[✅ Refactor phase:<br/>tests stay green]
        S5[✅ Coverage:<br/>≥ 80%]
        S6[✅ Documentation:<br/>up to date]
    end

    S1 --> S2 --> S3 --> S4 --> S5 --> S6
    S6 --> Success([🎉 High Quality<br/>Deliverable])

    style Success fill:#c8e6c9
```

## Next Steps

- [Learn about Agent Coordination](./coordination)
- [Read Agent Workflows](./workflows)
- [View Quick Reference](./quick-reference)

---

**Related**: [Multi-Agent Overview](./overview) • [DDD Documentation](../ddd/domain-overview)
