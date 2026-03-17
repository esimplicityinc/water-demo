---
sidebar_position: 1
title: Teams & Ownership
---

# Teams & Ownership

AquaTrack is organized around **four product teams**, each owning a bounded context end-to-end -- from domain model through deployment. Teams are cross-functional, self-organizing, and aligned to business outcomes rather than technology layers.

---

## At a Glance

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
  gap: '16px',
  marginBottom: '32px'
}}>
  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>4</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Product Teams</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Context-aligned squads</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>16</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Team Members</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Across all squads</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>8</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Capabilities</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Owned across teams</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>8</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>AI Agents</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Automated workforce</div>
  </div>
</div>

---

## Quick Navigation

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '12px',
  marginBottom: '28px'
}}>
  <a href="#customer-services" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    textDecoration: 'none',
    color: '#334155',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Customer Services</a>

  <a href="#operations" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    textDecoration: 'none',
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Operations</a>

  <a href="#finance" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Finance</a>

  <a href="#field-services" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: '#0f172a',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Field Services</a>

  <a href="#practice-areas" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    textDecoration: 'none',
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Practice Areas</a>

  <a href="#ai-agents" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: '#0f172a',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>AI Agents</a>

  <a href="#ownership-matrix" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Ownership Matrix</a>
</div>

---

## Team Structure

```mermaid
graph TD
    subgraph "AquaTrack Engineering"
        CS["Customer Services<br/>4 members"]
        OPS["Operations<br/>4 members"]
        FIN["Finance<br/>4 members"]
        FS["Field Services<br/>4 members"]
    end

    subgraph "AI Agent Layer"
        ORCH["Main Orchestrator"]
        DEV["Development Agents"]
        QA["Quality Agents"]
        REV["Review Agents"]
    end

    CS --> CAM["Customer Account<br/>Management"]
    OPS --> UT["Usage Tracking"]
    FIN --> BP["Billing &<br/>Payments"]
    FS --> MO["Meter Operations"]

    ORCH --> DEV
    ORCH --> QA
    ORCH --> REV

    DEV -.->|supports| CAM
    DEV -.->|supports| UT
    DEV -.->|supports| BP
    DEV -.->|supports| MO

    style CS fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style OPS fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style FIN fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style FS fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style CAM fill:#f8fafc,stroke:#3b82f6
    style UT fill:#f8fafc,stroke:#3b82f6
    style BP fill:#f8fafc,stroke:#3b82f6
    style MO fill:#f8fafc,stroke:#3b82f6
    style ORCH fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style DEV fill:#f8fafc,stroke:#3b82f6
    style QA fill:#f8fafc,stroke:#3b82f6
    style REV fill:#f8fafc,stroke:#3b82f6
```

---

## Customer Services {#customer-services}

<div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc', marginBottom: '24px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
    <div>
      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Customer Services Team</div>
      <div style={{ fontSize: '13px', color: '#475569' }}>Owns the <strong>Customer Account Management</strong> bounded context</div>
    </div>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '600' }}>Supporting Subdomain</span>
  </div>
  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>Responsible for the complete customer lifecycle -- enrollment, profile management, account standing, service deposits, and customer communications.</div>
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
    <div style={{ display: 'flex', gap: '-8px' }}>
      <img src="/img/team/sarah-chen.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }} />
      <img src="/img/team/marcus-rivera.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
      <img src="/img/team/aisha-patel.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
      <img src="/img/team/james-kowalski.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
    </div>
    <span style={{ fontSize: '12px', color: '#64748b' }}>4 members</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>|</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>2 capabilities</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>|</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>~35 BDD scenarios</span>
  </div>
  <a href="/docs/teams/customer-services" style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View team detail →</a>
</div>

---

## Operations {#operations}

<div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc', marginBottom: '24px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
    <div>
      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Operations Team</div>
      <div style={{ fontSize: '13px', color: '#475569' }}>Owns the <strong>Usage Tracking</strong> bounded context</div>
    </div>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '600' }}>Core Domain</span>
  </div>
  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>Responsible for the heartbeat of the system -- collecting meter readings, calculating consumption, validating data quality, detecting anomalies, and providing real-time usage data.</div>
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
    <div style={{ display: 'flex', gap: '-8px' }}>
      <img src="/img/team/david-okonkwo.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }} />
      <img src="/img/team/emily-zhang.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
      <img src="/img/team/raj-gupta.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
      <img src="/img/team/lisa-nakamura.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
    </div>
    <span style={{ fontSize: '12px', color: '#64748b' }}>4 members</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>|</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>3 capabilities</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>|</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>~45 BDD scenarios</span>
  </div>
  <a href="/docs/teams/operations" style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View team detail →</a>
</div>

---

## Finance {#finance}

<div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc', marginBottom: '24px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
    <div>
      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Finance Team</div>
      <div style={{ fontSize: '13px', color: '#475569' }}>Owns the <strong>Billing & Payments</strong> bounded context</div>
    </div>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '600' }}>Core Domain</span>
  </div>
  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>Owns the revenue engine -- generating invoices from usage data, managing billing cycles, processing payments, handling disputes, and ensuring financial compliance.</div>
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
    <div style={{ display: 'flex', gap: '-8px' }}>
      <img src="/img/team/priya-sharma.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }} />
      <img src="/img/team/carlos-mendez.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
      <img src="/img/team/anna-bergstrom.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
      <img src="/img/team/tom-ikeda.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
    </div>
    <span style={{ fontSize: '12px', color: '#64748b' }}>4 members</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>|</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>1 capability</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>|</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>~40 BDD scenarios</span>
  </div>
  <a href="/docs/teams/finance" style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View team detail →</a>
</div>

---

## Field Services {#field-services}

<div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc', marginBottom: '24px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
    <div>
      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Field Services Team</div>
      <div style={{ fontSize: '13px', color: '#475569' }}>Owns the <strong>Meter Operations</strong> bounded context</div>
    </div>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '600' }}>Supporting Subdomain</span>
  </div>
  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>Manages the physical infrastructure -- meter installation, calibration, maintenance scheduling, service requests, technician dispatch, and SCADA/hardware integration.</div>
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
    <div style={{ display: 'flex', gap: '-8px' }}>
      <img src="/img/team/olga-petrov.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }} />
      <img src="/img/team/kevin-brooks.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
      <img src="/img/team/maria-gonzalez.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
      <img src="/img/team/yusuf-ali.jpg" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-8px', objectFit: 'cover' }} />
    </div>
    <span style={{ fontSize: '12px', color: '#64748b' }}>4 members</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>|</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>2 capabilities</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>|</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>~40 BDD scenarios</span>
  </div>
  <a href="/docs/teams/field-services" style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View team detail →</a>
</div>

---

## Practice Areas {#practice-areas}

<div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc', marginBottom: '24px' }}>
  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Practice Areas & Competency Dashboard</div>
  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>6 practice areas, 18 competencies, team adoption tracking, and individual proficiency assessments following the Katalyst model.</div>
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>DDD</span>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>BDD & Test</span>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>Cloud Infra</span>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>API Design</span>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>Security</span>
    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>Data Eng</span>
  </div>
  <a href="/docs/practice-areas/" style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View practice areas dashboard →</a>
</div>

---

## AI Agents {#ai-agents}

The engineering teams are augmented by a fleet of **8 AI agents** organized in three layers. These agents operate across all bounded contexts, providing automated development, quality assurance, and architectural review.

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '16px',
  marginBottom: '24px'
}}>
  <div style={{
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f8fafc'
  }}>
    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Main Orchestrator</div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>Top-level coordinator -- delegates to specialist agents, synthesizes results, makes final decisions</div>
    <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#3b82f6', fontWeight: '600', display: 'inline-block' }}>Coordination Layer</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff'
  }}>
    <div style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Development Layer</div>
    <div style={{ fontSize: '13px', color: '#0f172a', lineHeight: '2' }}>
      &#x2022; <strong>Site Keeper</strong> -- Server management, builds, infrastructure<br/>
      &#x2022; <strong>Code Writer</strong> -- Feature implementation, refactoring
    </div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff'
  }}>
    <div style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Quality Layer</div>
    <div style={{ fontSize: '13px', color: '#0f172a', lineHeight: '2' }}>
      &#x2022; <strong>CI Runner</strong> -- Lint, format, type-check, test<br/>
      &#x2022; <strong>BDD Runner</strong> -- Execute behavioral tests<br/>
      &#x2022; <strong>BDD Writer</strong> -- Author Gherkin scenarios
    </div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff'
  }}>
    <div style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Review Layer</div>
    <div style={{ fontSize: '13px', color: '#0f172a', lineHeight: '2' }}>
      &#x2022; <strong>Architecture Inspector</strong> -- Hexagonal audit<br/>
      &#x2022; <strong>DDD Aligner</strong> -- Domain compliance<br/>
      &#x2022; <strong>UX/UI Inspector</strong> -- Experience review
    </div>
  </div>
</div>

<div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
  <a href="/docs/agents/overview">Agent Architecture Overview</a> &middot; <a href="/docs/agents/coordination">Agent Coordination Protocol</a> &middot; <a href="/docs/agents/bdd-loop">BDD Loop Workflow</a>
</div>

---

## Ownership Matrix {#ownership-matrix}

A complete map of which team owns which bounded context, capabilities, aggregates, and personas.

### Context Ownership

| Team | Bounded Context | Classification | Capabilities | Aggregates |
|:-----|:----------------|:---------------|:-------------|:-----------|
| **Customer Services** | Customer Account Management | Supporting | CAP-001, CAP-005 | CustomerAccount, AccountStatus, ServiceDeposit |
| **Operations** | Usage Tracking | Core | CAP-002, CAP-003, CAP-004 | MeterReading, UsagePeriod, ConsumptionRecord |
| **Finance** | Billing & Payments | Core | CAP-006 | Invoice, BillingCycle, Payment |
| **Field Services** | Meter Operations | Supporting | CAP-007, CAP-008 | Meter, ServiceRequest, MaintenanceSchedule |

### Capability Ownership

| Capability | Owner | Category | Consumers |
|:-----------|:------|:---------|:----------|
| CAP-001 Portal Authentication | Customer Services | Security | All teams |
| CAP-002 Usage Logging | Operations | Observability | All teams |
| CAP-003 Usage Alerts | Operations | Communication | Customer Services, Finance |
| CAP-004 Anomaly Detection | Operations | Security | Customer Services, Field Services |
| CAP-005 Self-Service Portal | Customer Services | Experience | Operations, Finance |
| CAP-006 Service Coverage | Finance | Business | Customer Services, Field Services |
| CAP-007 System Integration | Field Services | Communication | Operations |
| CAP-008 Meter Certification | Field Services | Security | Operations |

### Persona Coverage

| Persona | Primary Team | Secondary Teams |
|:--------|:-------------|:----------------|
| PER-001 Utility Administrator | Customer Services | Finance |
| PER-002 Treatment Operator | Operations | Field Services |
| PER-003 Residential Customer | Customer Services | Operations, Finance |
| PER-004 Commercial Customer | Customer Services | Operations, Finance |
| PER-005 Meter Technician | Field Services | Operations |

---

## Cross-Team Dependencies

```mermaid
graph LR
    CS["Customer<br/>Services"]
    OPS["Operations"]
    FIN["Finance"]
    FS["Field<br/>Services"]

    CS -->|"customer info<br/>(Customer-Supplier)"| OPS
    CS -->|"customer info<br/>(Conformist)"| FIN
    OPS -->|"usage data<br/>(Shared Kernel)"| FIN
    CS -->|"service requests<br/>(Partnership)"| FS
    FS -->|"meter readings<br/>(Partnership)"| OPS

    style CS fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style OPS fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style FIN fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style FS fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
```

### Integration Patterns

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '12px',
  marginBottom: '24px'
}}>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Customer Services &#8594; Operations</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Customer-Supplier pattern. Customer Services publishes account data; Operations consumes it for usage attribution.</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Customer Services &#8594; Finance</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Conformist pattern. Finance conforms to Customer Services' account model for billing association.</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Operations &#8596; Finance</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Shared Kernel. Tightly coupled for the billing flow -- usage data drives invoice generation.</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Customer Services &#8596; Field Services</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Partnership pattern. Joint ownership of service request flow -- customers request, technicians execute.</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Field Services &#8596; Operations</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Partnership pattern. Meter readings from Field Services feed into Operations' usage tracking pipeline.</div>
  </div>
</div>

---

## Coordination Ceremonies

| Ceremony | Frequency | Participants | Purpose |
|:---------|:----------|:-------------|:--------|
| Cross-team standup | Weekly | All team leads | Dependency sync, blockers, shared schema changes |
| Event schema review | Bi-weekly | All engineers | Review and version domain event contracts |
| Architecture review | Monthly | All teams + AI agents | ADR proposals, capability assessments, NFR tracking |
| Sprint demo | Bi-weekly | All teams + stakeholders | Feature demos, feedback, priority alignment |

---

## Compliance {#compliance}

<div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc', marginBottom: '24px' }}>
  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Compliance Dashboard</div>
  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>BDD coverage, ADR responsibility, and NFR ownership are tracked per team. Visit each team's detail page for their compliance status.</div>
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    <a href="/docs/teams/customer-services#compliance" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>Customer Services →</a>
    <a href="/docs/teams/operations#compliance" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>Operations →</a>
    <a href="/docs/teams/finance#compliance" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>Finance →</a>
    <a href="/docs/teams/field-services#compliance" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>Field Services →</a>
  </div>
</div>

---

## Next Steps

- [System Architecture](./system-overview) -- Full system overview with subsystems and capabilities
- [Users & Personas](./users-overview) -- Persona details and user story catalog
- [Domain Model](./ddd/domain-overview) -- DDD bounded contexts and aggregates
- [Agent Coordination](./agents/coordination) -- How AI agents collaborate across teams
- [Practice Areas](/docs/practice-areas/) -- Competency dashboard and team adoption tracking
- [Tools & Technology](/docs/tools/) -- Technology stack and tooling decisions
- [Bounded Contexts](/docs/systems/) -- System architecture and bounded context details

---

**Related**: [Context Map](./ddd/context-map) | [Bounded Contexts](./ddd/bounded-contexts) | [Capabilities](./capabilities/)
