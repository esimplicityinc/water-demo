# Domain Overview: AquaTrack

AquaTrack is a **Municipal Water Tracking & Management System** where municipal utilities, water districts, and commercial water operators collaborate to efficiently manage water resources, track consumption, bill customers, and optimize distribution.

---

## At a Glance

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Bounded Contexts</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Domain decomposition</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>12</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Aggregates</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Consistency boundaries</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>15</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Domain Events</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Cross-context signals</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>10</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Language Terms</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Ubiquitous language</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>5</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Personas</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Domain actors</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>~160</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>BDD Scenarios</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Spec coverage</div>
  </div>
</div>

---

## Quick Navigation

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '12px',
  marginBottom: '28px'
}}>
  <a href="#bounded-contexts" style={{
    padding: '12px 16px', borderRadius: '6px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1',
    textDecoration: 'none', color: '#334155', fontWeight: '500', fontSize: '13px', textAlign: 'center'
  }}>Bounded Contexts</a>
  <a href="#domain-actors" style={{
    padding: '12px 16px', borderRadius: '6px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1',
    textDecoration: 'none', color: '#3b82f6', fontWeight: '500', fontSize: '13px', textAlign: 'center'
  }}>Domain Actors</a>
  <a href="#user-story-mapping" style={{
    padding: '12px 16px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
    textDecoration: 'none', color: '#475569', fontWeight: '500', fontSize: '13px', textAlign: 'center'
  }}>User Stories</a>
  <a href="#strategic-classification" style={{
    padding: '12px 16px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
    textDecoration: 'none', color: '#0f172a', fontWeight: '500', fontSize: '13px', textAlign: 'center'
  }}>Classification</a>
  <a href="#compliance-traceability" style={{
    padding: '12px 16px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
    textDecoration: 'none', color: '#0f172a', fontWeight: '500', fontSize: '13px', textAlign: 'center'
  }}>Compliance</a>
  <a href="#ubiquitous-language" style={{
    padding: '12px 16px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
    textDecoration: 'none', color: '#475569', fontWeight: '500', fontSize: '13px', textAlign: 'center'
  }}>Language</a>
</div>

---

## Core Domain

**Water Utility Operations** -- A multi-sided system connecting:
- **Water Utilities**: Municipalities managing water distribution and billing
- **Customers**: Residential and commercial water consumers
- **Service Operators**: Field technicians managing meters and service calls
- **Billing System**: Automated billing and payment processing

This is a **transactional domain** with elements of an **operational domain**:
- *Transactional*: Clear billing mechanics, payment settlement, service contracts
- *Operational*: Real-time usage tracking, meter management, emergency response

### Key Problems Solved

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '12px',
  marginBottom: '24px'
}}>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Usage Accuracy</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Ensure accurate meter readings and usage attribution</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Billing Efficiency</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Automate billing cycles and payment processing</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Service Management</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Track service requests, repairs, and meter maintenance</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Conservation</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Monitor usage patterns to promote water conservation</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Compliance</div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Maintain regulatory compliance and audit trails</div>
  </div>
</div>

---

## Bounded Contexts {#bounded-contexts}

AquaTrack is decomposed into four bounded contexts, each owning its domain model, data, and team.

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  marginBottom: '32px'
}}>
  <div style={{
    padding: '24px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>Customer Account Management</div>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#3b82f6', fontWeight: '600' }}>Supporting</span>
    </div>
    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>
      Customer lifecycle -- enrollment, profiles, account standing, service deposits.
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Aggregates:</strong> CustomerAccount, AccountStatus, ServiceDeposit</div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Events:</strong> AccountCreated, StatusChanged, DepositReleased</div>
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155' }}>Team: Customer Services</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>~35 BDD scenarios</span>
    </div>
  </div>

  <div style={{
    padding: '24px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>Usage Tracking</div>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '600' }}>Core</span>
    </div>
    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>
      Meter readings, consumption calculation, usage history, anomaly detection.
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Aggregates:</strong> MeterReading, UsagePeriod, ConsumptionRecord</div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Events:</strong> ReadingRecorded, UsageCalculated, AnomalyDetected</div>
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155' }}>Team: Operations</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>~45 BDD scenarios</span>
    </div>
  </div>

  <div style={{
    padding: '24px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>Billing & Payments</div>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600' }}>Core</span>
    </div>
    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>
      Invoice generation, billing cycles, payment processing, settlement, disputes.
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Aggregates:</strong> Invoice, BillingCycle, Payment</div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Events:</strong> InvoiceGenerated, PaymentReceived, BillFinalized</div>
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155' }}>Team: Finance</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>~40 BDD scenarios</span>
    </div>
  </div>

  <div style={{
    padding: '24px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>Meter Operations</div>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '600' }}>Supporting</span>
    </div>
    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>
      Meter lifecycle, installation, calibration, maintenance, technician dispatch.
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Aggregates:</strong> Meter, ServiceRequest, MaintenanceSchedule</div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Events:</strong> MeterRegistered, MaintenanceScheduled, ServiceCompleted</div>
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155' }}>Team: Field Services</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>~40 BDD scenarios</span>
    </div>
  </div>
</div>

### Context Map

```mermaid
graph TD
    CAM[Customer Account<br/>Management]
    UT[Usage Tracking]
    BP[Billing &<br/>Payments]
    MO[Meter Operations]

    CAM -->|"Customer-Supplier"| UT
    CAM -->|"Conformist"| BP
    UT -->|"Shared Kernel"| BP
    CAM -->|"Partnership"| MO
    MO -->|"Partnership"| UT

    style CAM fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style UT fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style BP fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style MO fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
```

---

## Domain Actors {#domain-actors}

Each bounded context is accessed by specific personas. This matrix shows the primary interactions.

| Persona | Customer Account Mgmt | Usage Tracking | Billing & Payments | Meter Operations |
|:--------|:---:|:---:|:---:|:---:|
| [PER-001 Utility Admin](/docs/personas/PER-001-utility-administrator) | Manages accounts | Reviews logs | Oversees billing | Approves work |
| [PER-002 Treatment Operator](/docs/personas/PER-002-treatment-operator) | -- | Monitors readings | -- | Coordinates maintenance |
| [PER-003 Residential Customer](/docs/personas/PER-003-residential-customer) | Enrolls, manages profile | Views usage | Pays invoices | Requests service |
| [PER-004 Commercial Customer](/docs/personas/PER-004-commercial-customer) | Manages fleet accounts | Monitors usage | Manages payments | Requests service |
| [PER-005 Meter Technician](/docs/personas/PER-005-meter-technician) | -- | Records readings | -- | Installs, calibrates |

---

## User Story Mapping {#user-story-mapping}

Each user story maps to one or more bounded contexts and is served by capabilities:

| User Story | Description | Primary Context | Capabilities | Owning Team |
|:-----------|:------------|:----------------|:-------------|:------------|
| [US-001](/docs/user-stories/US-001-customer-enrollment) | Customer Enrollment | Customer Account Mgmt | CAP-001, CAP-002, CAP-006 | Customer Services |
| [US-002](/docs/user-stories/US-002-service-activation) | Service Activation | Customer Account Mgmt | CAP-001, CAP-002, CAP-006 | Customer Services |
| [US-004](/docs/user-stories/US-004-meter-reading) | Meter Reading | Usage Tracking | CAP-002, CAP-007, CAP-008 | Operations |
| [US-005](/docs/user-stories/US-005-view-usage-history) | View Usage History | Usage Tracking | CAP-001, CAP-002, CAP-005 | Operations |
| [US-006](/docs/user-stories/US-006-service-area-lookup) | Service Area Lookup | Customer Account Mgmt | CAP-006 | Customer Services |
| [US-007](/docs/user-stories/US-007-submit-service-request) | Submit Service Request | Meter Operations | CAP-001, CAP-002, CAP-005 | Field Services |
| [US-008](/docs/user-stories/US-008-technician-dispatch) | Technician Dispatch | Meter Operations | CAP-002, CAP-007 | Field Services |
| [US-009](/docs/user-stories/US-009-customer-communication) | Customer Communication | Customer Account Mgmt | CAP-001, CAP-003, CAP-005 | Customer Services |
| [US-010](/docs/user-stories/US-010-smart-meter-integration) | Smart Meter Integration | Meter Operations | CAP-007, CAP-008 | Field Services |

---

## Strategic Classification {#strategic-classification}

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '16px',
  marginBottom: '24px'
}}>
  <div style={{
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f8fafc'
  }}>
    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Core Domain</div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Highest business value -- competitive differentiator. Custom-built, heavily tested.</div>
    <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
      &#x2022; <strong>Usage Tracking</strong> -- Real-time consumption data<br/>
      &#x2022; <strong>Billing & Payments</strong> -- Revenue engine
    </div>
    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b' }}>
      Teams: Operations, Finance | ADRs: ADR-001, ADR-005, ADR-006, ADR-015 | ~85 BDD scenarios
    </div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f8fafc'
  }}>
    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Supporting Subdomain</div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Necessary but not differentiating. Could eventually use off-the-shelf solutions.</div>
    <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
      &#x2022; <strong>Customer Account Mgmt</strong> -- Account lifecycle<br/>
      &#x2022; <strong>Meter Operations</strong> -- Physical infrastructure
    </div>
    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b' }}>
      Teams: Customer Services, Field Services | ADRs: ADR-002, ADR-016 | ~75 BDD scenarios
    </div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #64748b',
    backgroundColor: '#f8fafc'
  }}>
    <div style={{ fontSize: '15px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Generic Subdomain</div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Commodity functions. Use third-party services where possible.</div>
    <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
      &#x2022; <strong>Payment Processing</strong> -- via payment gateway<br/>
      &#x2022; <strong>Authentication</strong> -- via Clerk (ADR-021)<br/>
      &#x2022; <strong>Email/SMS</strong> -- via notification provider
    </div>
    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b' }}>
      ADRs: ADR-003, ADR-009, ADR-021 | NFRs: NFR-SEC-001, NFR-SEC-002
    </div>
  </div>
</div>

---

## Compliance Traceability {#compliance-traceability}

### ADRs by Bounded Context

| Bounded Context | ADRs | Category Focus |
|:----------------|:-----|:---------------|
| **Customer Account Mgmt** | ADR-001, ADR-002, ADR-009, ADR-016, ADR-021 | DDD, modular monolith, auth, Convex functions, Clerk |
| **Usage Tracking** | ADR-001, ADR-003, ADR-005, ADR-006, ADR-015 | DDD, Convex backend, events, aggregates, eventual consistency |
| **Billing & Payments** | ADR-001, ADR-005, ADR-006, ADR-015, ADR-016 | DDD, events, aggregates, eventual consistency, Convex functions |
| **Meter Operations** | ADR-001, ADR-002, ADR-005, ADR-009 | DDD, modular monolith, events, API auth |
| **Cross-cutting** | ADR-004, ADR-017, ADR-018, ADR-019, ADR-020 | Next.js, Bun, Vercel, Tailwind, shadcn/ui |

### NFRs by Bounded Context

| Bounded Context | Performance | Security | Reliability | Accessibility |
|:----------------|:---:|:---:|:---:|:---:|
| **Customer Account Mgmt** | NFR-PERF-001 | NFR-SEC-001, NFR-SEC-002, NFR-SEC-005 | NFR-REL-002 | NFR-A11Y-001 |
| **Usage Tracking** | NFR-PERF-001, NFR-PERF-002, NFR-PERF-003 | NFR-SEC-003, NFR-SEC-004 | NFR-REL-001 | -- |
| **Billing & Payments** | NFR-PERF-001, NFR-PERF-002 | NFR-SEC-001, NFR-SEC-003 | NFR-REL-001, NFR-REL-002 | NFR-A11Y-001 |
| **Meter Operations** | NFR-PERF-001 | NFR-SEC-006, NFR-SEC-007 | NFR-REL-003, NFR-REL-004 | -- |

### BDD Coverage by Context

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '12px',
  marginBottom: '24px'
}}>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Customer Account Mgmt</div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>~35</div>
    <div style={{ fontSize: '11px', color: '#64748b' }}>scenarios across 4 feature files</div>
    <div style={{ marginTop: '8px', height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0' }}>
      <div style={{ width: '85%', height: '100%', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>85% passing</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Usage Tracking</div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>~45</div>
    <div style={{ fontSize: '11px', color: '#64748b' }}>scenarios across 5 feature files</div>
    <div style={{ marginTop: '8px', height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0' }}>
      <div style={{ width: '90%', height: '100%', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>90% passing</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Billing & Payments</div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>~40</div>
    <div style={{ fontSize: '11px', color: '#64748b' }}>scenarios across 4 feature files</div>
    <div style={{ marginTop: '8px', height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0' }}>
      <div style={{ width: '75%', height: '100%', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>75% passing</div>
  </div>
  <div style={{ padding: '14px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Meter Operations</div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>~40</div>
    <div style={{ fontSize: '11px', color: '#64748b' }}>scenarios across 5 feature files</div>
    <div style={{ marginTop: '8px', height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0' }}>
      <div style={{ width: '80%', height: '100%', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>80% passing</div>
  </div>
</div>

---

## Ubiquitous Language {#ubiquitous-language}

Key terms used consistently across code, docs, and communication:

| Term | Definition | Context |
|:-----|:----------|:--------|
| **Customer Account** | Service agreement for water delivery to a property | Customer Account Mgmt |
| **Meter** | Device measuring water consumption (cubic meters) | Meter Operations |
| **Reading** | Recorded meter value at specific date/time | Usage Tracking |
| **Usage** | Calculated consumption based on meter readings | Usage Tracking |
| **Service Deposit** | Upfront payment required for account activation | Customer Account Mgmt |
| **Billing Cycle** | Regular interval (monthly/quarterly) for billing | Billing & Payments |
| **Invoice** | Bill for water consumption and services | Billing & Payments |
| **Payment** | Customer's settlement of invoice | Billing & Payments |
| **Service Request** | Request for meter reading, repair, or maintenance | Meter Operations |
| **Account Standing** | Customer's payment and contract status | Customer Account Mgmt |

See [full Ubiquitous Language glossary](./ubiquitous-language) for the complete reference.

---

## Business Model

| Revenue Stream | Description | Related Context |
|:---------------|:------------|:----------------|
| **Usage Billing** | Recurring monthly/quarterly billings based on consumption | Billing & Payments |
| **Service Fees** | Charges for service calls, meter inspections, and maintenance | Meter Operations |
| **Late Payments** | Interest/penalties on overdue accounts | Billing & Payments |
| **Conservation Rebates** | Incentives for low usage or efficient practices | Usage Tracking |

### Success Metrics

| Metric | Target | Measured By |
|:-------|:-------|:------------|
| Billing Accuracy | > 99.5% | Correctly billed customers / total | 
| Payment Collection Rate | > 95% | Invoices paid on time / total invoices |
| Meter Reading Accuracy | < 2% variance | Estimated vs actual readings |
| Service Response Time | < 4 hours | Average time to resolve service requests |
| Customer Satisfaction | > 4.2/5.0 | Satisfaction surveys and complaint rates |

---

## Domain Boundaries

### In Scope
- Customer account management and lifecycle
- Water meter operations and reading collection
- Usage tracking and billing calculation
- Payment processing and settlement
- Service request management
- Account standing and status

### Out of Scope (Initially)
- Water treatment plants (managed separately)
- Infrastructure maintenance (separate operations)
- Advanced conservation modeling (v2 feature)
- Multi-currency support (single currency MVP)
- Predictive analytics (v2 feature)

---

## Next Steps

- [Bounded Contexts](./bounded-contexts) -- Detailed context boundaries and integration patterns
- [Ubiquitous Language](./ubiquitous-language) -- Complete domain terminology
- [Aggregates & Entities](./aggregates-entities) -- Consistency boundaries and object model
- [Domain Events](./domain-events) -- Cross-context event catalog
- [Use Cases](./use-cases) -- System interaction patterns

---

**Related**: [System Architecture](/docs/system-overview) | [Users & Personas](/docs/users-overview) | [Teams & Ownership](/docs/teams-overview) | [Capabilities](/docs/capabilities/) | [BDD Feature Index](/docs/bdd/feature-index)
