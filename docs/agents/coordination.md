---
sidebar_position: 4
title: Agent Coordination
---

# Agent Coordination Patterns

How agents work together to deliver features efficiently through structured communication and delegation patterns.

## Coordination Architecture

```mermaid
graph TD
    subgraph "Main Orchestrator Layer"
        M[🎯 Main Orchestrator<br/>Delegates & Synthesizes]
    end

    subgraph "Development Layer"
        SK[🏠 Site Keeper<br/>Servers & Infrastructure]
        CW[💻 Code Writer<br/>Implementation]
    end

    subgraph "Quality Layer"
        CI[⚙️ CI Runner<br/>Automated Checks]
        BR[🧪 BDD Runner<br/>Test Execution]
        BW[✍️ BDD Writer<br/>Scenario Creation]
    end

    subgraph "Review Layer"
        AI[🏗️ Architecture Inspector<br/>Hexagonal Audit]
        DA[📐 DDD Aligner<br/>Domain Compliance]
        UI[🎨 UX/UI Inspector<br/>Experience Review]
    end

    M --> SK
    M --> CW
    M --> BW
    M --> BR
    M --> CI

    CW --> AI
    CW --> DA
    CW --> UI

    BW --> DA
    BR --> SK
    BR --> CW

    style M fill:#fff4cc
    style SK fill:#e8f5e9
    style CW fill:#e1f5ff
    style CI fill:#f3e5f5
    style BR fill:#e0f2f1
    style BW fill:#fff9c4
    style AI fill:#fce4ec
    style DA fill:#e8eaf6
    style UI fill:#f1f8e9
```

## Delegation Patterns

### Pattern 1: Simple Request-Response

```mermaid
sequenceDiagram
    participant M as Main
    participant A as Agent

    M->>A: Request task
    activate A
    A->>A: Execute task
    A->>M: Report result
    deactivate A
    M->>M: Continue
```

**Example**:
```
Main → Site Keeper: "Ensure servers are running"
Site Keeper: [Checks, fixes, starts if needed]
Site Keeper → Main: "✅ Servers up (Next.js:3001, Convex:connected)"
```

### Pattern 2: Delegated Review

```mermaid
sequenceDiagram
    participant M as Main
    participant CW as Code Writer
    participant AI as Architecture Inspector

    M->>CW: Implement feature
    activate CW
    CW->>CW: Write code
    CW->>AI: Review implementation
    deactivate CW

    activate AI
    AI->>AI: Check architecture
    alt Issues Found
        AI->>CW: ❌ Violations found
        activate CW
        CW->>CW: Fix issues
        CW->>AI: Review again
        deactivate CW
    else All Good
        AI->>CW: ✅ Approved
    end
    deactivate AI

    activate CW
    CW->>M: ✅ Complete
    deactivate CW
```

### Pattern 3: Parallel Execution

```mermaid
sequenceDiagram
    participant M as Main
    participant CI as CI Runner
    participant BR as BDD Runner
    participant UI as UX/UI Inspector

    M->>CI: Run quality checks
    M->>BR: Run smoke tests
    M->>UI: Review UI

    par All Execute in Parallel
        CI->>CI: Lint + Typecheck + Tests
        BR->>BR: Execute BDD smoke tests
        UI->>UI: Check accessibility
    end

    CI->>M: ✅ Checks passed
    BR->>M: ✅ 15/15 smoke tests
    UI->>M: ✅ WCAG AA compliant

    M->>M: Synthesize results
    M->>M: Report to user
```

### Pattern 4: Escalation Chain

```mermaid
flowchart TD
    A[Agent Encounters Issue] --> B{Can Agent<br/>Handle It?}

    B -->|Yes| C[Agent Handles]
    C --> D[Report to Main]

    B -->|No| E[Escalate to Main]
    E --> F{Needs Other<br/>Agent?}

    F -->|Yes| G[Main Delegates<br/>to Appropriate Agent]
    G --> H[Agent Resolves]
    H --> D

    F -->|No| I{Needs User<br/>Input?}

    I -->|Yes| J[Main Asks User]
    J --> K[User Decides]
    K --> D

    I -->|No| L[Main Handles]
    L --> D

    D --> Done([Issue Resolved])

    style Done fill:#c8e6c9
```

## Complete Feature Workflow

### Full Implementation Flow with All Agents

```mermaid
sequenceDiagram
    autonumber

    participant U as 👤 User
    participant M as 🎯 Main
    participant BW as ✍️ BDD Writer
    participant BR as 🧪 BDD Runner
    participant SK as 🏠 Site Keeper
    participant CW as 💻 Code Writer
    participant AI as 🏗️ Arch Inspector
    participant DA as 📐 DDD Aligner
    participant CI as ⚙️ CI Runner

    U->>M: Request: Implement ROAD-005
    M->>BW: Draft scenarios

    activate BW
    BW->>BW: Research & draft
    BW->>M: Scenarios ready
    deactivate BW

    M->>U: Review scenarios
    U->>M: Approved

    M->>BW: Create feature file
    activate BW
    BW->>BW: Tag with @ROAD-005
    BW->>M: ✅ Feature file created
    deactivate BW

    M->>SK: Ensure servers up
    activate SK
    SK->>SK: Check & start
    SK->>M: ✅ Servers running
    deactivate SK

    M->>BR: Run tests
    activate BR
    BR->>BR: Execute BDD
    BR->>M: ❌ 5 scenarios failing
    deactivate BR

    Note over M,CW: RED PHASE COMPLETE

    M->>CW: Implement feature
    activate CW
    CW->>CW: Domain layer
    CW->>CW: Application layer
    CW->>CW: Infrastructure layer

    CW->>AI: Review architecture
    deactivate CW

    activate AI
    AI->>AI: Check hexagonal
    AI->>CW: ✅ Compliant
    deactivate AI

    activate CW
    CW->>DA: Check domain
    deactivate CW

    activate DA
    DA->>DA: Verify alignment
    DA->>CW: ✅ Aligned
    deactivate DA

    activate CW
    CW->>M: ✅ Implemented
    deactivate CW

    M->>BR: Re-run tests
    activate BR
    BR->>BR: Execute BDD
    BR->>M: ✅ 5/5 passing
    deactivate BR

    Note over M,CI: GREEN PHASE COMPLETE

    M->>CI: Full quality check
    activate CI
    CI->>CI: Lint, typecheck, tests
    CI->>M: ✅ All passed
    deactivate CI

    M->>CW: Refactor
    activate CW
    CW->>CW: Clean up code
    CW->>M: ✅ Refactored
    deactivate CW

    M->>BR: Final test
    activate BR
    BR->>BR: Execute BDD
    BR->>M: ✅ Still passing
    deactivate BR

    Note over M,U: REFACTOR PHASE COMPLETE

    M->>M: Update docs
    M->>U: ✅ ROAD-005 complete!
```

## Coordination Scenarios

### Scenario 1: Test Failure Triage

```mermaid
flowchart TD
    Start[BDD Runner:<br/>12 Tests Failing] --> Categorize[BDD Runner:<br/>Categorize Failures]

    Categorize --> C1[2 Server Issues]
    Categorize --> C2[8 Missing Implementations]
    Categorize --> C3[2 Wrong Scenarios]

    C1 --> Report1[Report to Main]
    C2 --> Report1
    C3 --> Report1

    Report1 --> Main{Main:<br/>Delegate}

    Main --> |Server| SK[Site Keeper:<br/>Fix Servers]
    Main --> |Implementation| CW[Code Writer:<br/>Implement Features]
    Main --> |Scenarios| BW[BDD Writer:<br/>Fix Scenarios]

    SK --> SK1[Identify port conflict]
    SK1 --> SK2[Kill process & restart]
    SK2 --> Done1[✅ Fixed]

    CW --> CW1[Implement 8 endpoints]
    CW1 --> Done2[✅ Implemented]

    BW --> BW1[Correct 2 scenarios]
    BW1 --> Done3[✅ Fixed]

    Done1 --> Retest[BDD Runner:<br/>Re-run All Tests]
    Done2 --> Retest
    Done3 --> Retest

    Retest --> Result{Result?}
    Result -->|All Pass| Success[✅ 12/12 Passing]
    Result -->|Still Issues| Main

    style Success fill:#c8e6c9
```

### Scenario 2: UI Feature with Reviews

```mermaid
graph TD
    Start[User: Create<br/>Registration UI] --> M1[Main:<br/>Delegate to Code Writer]

    M1 --> CW1[Code Writer:<br/>Implement Component]
    CW1 --> CW2[React Component<br/>with Form]

    CW2 --> M2[Main:<br/>Delegate to UX Inspector]

    M2 --> UX1[UX Inspector:<br/>Review]
    UX1 --> UX2{Issues<br/>Found?}

    UX2 -->|Yes| UX3[Report Issues:<br/>- Keyboard access<br/>- Screen reader<br/>- Contrast]
    UX3 --> M3[Main:<br/>Back to Code Writer]
    M3 --> CW3[Code Writer:<br/>Fix Issues]
    CW3 --> M2

    UX2 -->|No| UX4[✅ Approved]
    UX4 --> M4[Main:<br/>Delegate to BDD Writer]

    M4 --> BW1[BDD Writer:<br/>Draft UI Scenarios]
    BW1 --> BW2{User<br/>Approves?}
    BW2 -->|No| BW1
    BW2 -->|Yes| BW3[Create Feature File]

    BW3 --> M5[Main:<br/>Delegate to BDD Runner]
    M5 --> BR1[BDD Runner:<br/>Execute UI Tests]
    BR1 --> BR2{Tests<br/>Pass?}

    BR2 -->|No| M6[Main:<br/>Back to Code Writer]
    M6 --> CW3
    BR2 -->|Yes| Complete[✅ UI Feature Complete]

    style Complete fill:#c8e6c9
```

### Scenario 3: Parallel Quality Checks

```mermaid
gantt
    title Parallel vs Sequential Quality Checks
    dateFormat mm:ss

    section Sequential (Slow)
    CI: Lint+Type+Test  :00:00, 05:00
    BDD: Smoke Tests    :05:00, 03:00
    UX: Accessibility   :08:00, 02:00

    section Parallel (Fast)
    CI: Lint+Type+Test  :10:00, 05:00
    BDD: Smoke Tests    :10:00, 03:00
    UX: Accessibility   :10:00, 02:00
```

Sequential: **10 minutes total**
Parallel: **5 minutes total** (2x faster!)

## Communication Protocols

### Status Reporting Format

```mermaid
flowchart TD
    subgraph "Report Structure"
        R1[Status Indicator<br/>✅ ❌ ⚠️]
        R2[Agent Name & Role]
        R3[Summary<br/>High-level overview]
        R4[Details<br/>Specific findings]
        R5[Action Items<br/>What needs doing]
        R6[Next Steps<br/>Who does what]
    end

    R1 --> R2 --> R3 --> R4 --> R5 --> R6
    R6 --> Done([Clear Communication])

    style Done fill:#c8e6c9
```

### Example: Good Report

```
✅ Architecture Inspector Report: Hexagonal Compliance Verified

Summary:
  Reviewed bot authentication implementation.
  All hexagonal patterns correctly applied.

Details:
  ✅ Domain layer: No external dependencies
  ✅ Ports defined: BotRepository, EventPublisher
  ✅ Adapters implement ports correctly
  ✅ Dependency arrows point inward

Files Reviewed:
  - src/supplier-identity/domain/SupplierAccount.ts:1-85
  - src/supplier-identity/domain/ports/BotRepository.ts:1-12
  - convex/botIdentity/mutations.ts:42-67

Action Items:
  None - implementation is clean

Next Steps:
  1. Code Writer proceeds to DDD alignment check
  2. Then ready for testing
```

### Communication Flow

```mermaid
flowchart LR
    A[Agent Completes Task] --> B[Generate Report]
    B --> C{Report To<br/>Whom?}

    C -->|Delegating Agent| D[Return to Caller]
    C -->|Main Orchestrator| E[Escalate to Main]
    C -->|User| F[Via Main to User]

    D --> G[Caller Continues Workflow]
    E --> H[Main Decides Next Action]
    F --> I[User Makes Decision]

    style G fill:#e1f5ff
    style H fill:#fff4cc
    style I fill:#f3e5f5
```

## Conflict Resolution

### Handling Agent Disagreements

```mermaid
stateDiagram-v2
    [*] --> AgentsWork: Agents Working

    AgentsWork --> Conflict: Issue Detected

    Conflict --> Type: Categorize

    Type --> FileLock: Same File Conflict
    Type --> Opinion: Different Opinions
    Type --> Unclear: Unclear Requirement

    FileLock --> Serialize: Main Serializes
    Serialize --> AgentsWork: Sequential Execution

    Opinion --> Escalate: Escalate to Main
    Escalate --> MainDecides: Main Decides
    MainDecides --> AgentsWork: Continue with Decision

    Unclear --> AskUser: Ask User
    AskUser --> UserClarity: User Clarifies
    UserClarity --> AgentsWork: Continue with Clarity

    AgentsWork --> [*]: Task Complete
```

### Example Conflicts

```mermaid
graph TD
    subgraph "Conflict 1: File Lock"
        C1[Code Writer wants<br/>to modify SupplierAccount.ts]
        C2[DDD Aligner also wants<br/>to modify SupplierAccount.ts]
        C1 --> S1[Main: Serialize]
        C2 --> S1
        S1 --> R1[Code Writer first,<br/>then DDD Aligner]
    end

    subgraph "Conflict 2: Opinion Difference"
        C3[Architecture Inspector:<br/>Split into 2 files]
        C4[DDD Aligner:<br/>Keep in 1 aggregate]
        C3 --> S2[Main: Evaluate Both]
        C4 --> S2
        S2 --> R2[Main decides:<br/>Follow DDD principle]
    end

    subgraph "Conflict 3: Unclear Requirement"
        C5[BDD Writer:<br/>Unclear scenario logic]
        C5 --> S3[Main: Ask User]
        S3 --> R3[User clarifies,<br/>BDD Writer continues]
    end

    style R1 fill:#c8e6c9
    style R2 fill:#c8e6c9
    style R3 fill:#c8e6c9
```

## Coordination Best Practices

### Do's and Don'ts

```mermaid
graph LR
    subgraph "✅ DO"
        D1[Delegate to specialists]
        D2[Run in parallel when possible]
        D3[Report with clear status]
        D4[Escalate when stuck]
        D5[Follow autonomy levels]
    end

    subgraph "❌ DON'T"
        N1[Do everything yourself]
        N2[Wait unnecessarily]
        N3[Give vague reports]
        N4[Spin wheels in isolation]
        N5[Override permissions]
    end

    D1 -.-> N1
    D2 -.-> N2
    D3 -.-> N3
    D4 -.-> N4
    D5 -.-> N5

    style D1 fill:#c8e6c9
    style D2 fill:#c8e6c9
    style D3 fill:#c8e6c9
    style D4 fill:#c8e6c9
    style D5 fill:#c8e6c9

    style N1 fill:#ffcccc
    style N2 fill:#ffcccc
    style N3 fill:#ffcccc
    style N4 fill:#ffcccc
    style N5 fill:#ffcccc
```

## Success Metrics

### Effective Coordination

```mermaid
mindmap
  root((Effective<br/>Coordination))
    Fast Turnaround
      Parallel execution
      No waiting
      Quick handoffs
    Clear Communication
      Structured reports
      Action items
      Status indicators
    Right Agent
      Specialist expertise
      Within autonomy
      Proper delegation
    Quality Results
      All checks pass
      No rework
      Documentation updated
```

## Next Steps

- [Understand the BDD Loop](./bdd-loop)
- [Read Workflow Examples](./workflows)
- [View Quick Reference](./quick-reference)

---

**Related**: [Multi-Agent Overview](./overview) • [Just Commands](./quick-reference)
