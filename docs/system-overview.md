---
sidebar_position: 1
title: System Architecture
---

# System Architecture

AquaTrack is a **Municipal Water Tracking & Management System** built on Domain-Driven Design principles with a modern cloud-native stack. This section maps the full system -- from high-level subsystems down to individual capabilities and technology choices.

---

## At a Glance

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Core subsystems</div>
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
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Cross-cutting services</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>24</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>ADRs</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Architecture decisions</div>
  </div>

  <div style={{
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>6</div>
    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Stack Layers</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Frontend to infra</div>
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
  <a href="#subsystems" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    textDecoration: 'none',
    color: '#334155',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Subsystems</a>

  <a href="#capabilities" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    textDecoration: 'none',
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Capabilities</a>

  <a href="#technology-stack" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Tech Stack</a>

  <a href="#architecture-decisions" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: '#0f172a',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>ADRs</a>

  <a href="#system-integration" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: '#0f172a',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>Integration</a>

  <a href="#nfrs" style={{
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'center'
  }}>NFRs</a>
</div>

---

## Subsystems {#subsystems}

AquaTrack is decomposed into four bounded contexts, each owning its own domain model and data.

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
    <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Customer Account Management</div>
    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>
      Manages the full lifecycle of customer water service accounts -- enrollment, profiles, account standing, and service deposits.
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Key Aggregates</strong></div>
    <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
      <div>&#x2022; CustomerAccount</div>
      <div>&#x2022; AccountStatus</div>
      <div>&#x2022; ServiceDeposit</div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
      <strong>Events:</strong> AccountCreated, StatusChanged, DepositReleased
    </div>
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#3b82f6', fontWeight: '600' }}>Team: Customer Services</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155' }}>PER-001, PER-003, PER-004</span>
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
    <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Usage Tracking</div>
    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>
      Collects and validates meter readings, calculates consumption, and provides real-time usage data to customers and operators.
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Key Aggregates</strong></div>
    <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
      <div>&#x2022; MeterReading</div>
      <div>&#x2022; UsagePeriod</div>
      <div>&#x2022; ConsumptionRecord</div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
      <strong>Events:</strong> ReadingRecorded, UsageCalculated, AnomalyDetected
    </div>
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '600' }}>Team: Operations</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155' }}>PER-002, PER-003, PER-004</span>
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
    <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Billing & Payments</div>
    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>
      Generates invoices from usage data, manages billing cycles, processes payments, and handles settlement and disputes.
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Key Aggregates</strong></div>
    <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
      <div>&#x2022; Invoice</div>
      <div>&#x2022; BillingCycle</div>
      <div>&#x2022; Payment</div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
      <strong>Events:</strong> InvoiceGenerated, PaymentReceived, BillFinalized
    </div>
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600' }}>Team: Finance</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155' }}>PER-001, PER-003, PER-004</span>
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
    <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Meter Operations</div>
    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>
      Manages the physical meter lifecycle -- installation, calibration, maintenance scheduling, service requests, and hardware integration.
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}><strong>Key Aggregates</strong></div>
    <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
      <div>&#x2022; Meter</div>
      <div>&#x2022; ServiceRequest</div>
      <div>&#x2022; MaintenanceSchedule</div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
      <strong>Events:</strong> MeterRegistered, MaintenanceScheduled, ServiceCompleted
    </div>
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '600' }}>Team: Field Services</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155' }}>PER-002, PER-005</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569' }}>~40 BDD scenarios</span>
    </div>
  </div>
</div>

### Context Relationships

```mermaid
graph TD
    CAM[Customer Account<br/>Management]
    UT[Usage Tracking]
    BP[Billing &<br/>Payments]
    MO[Meter Operations]

    CAM -->|provides customer info| UT
    CAM -->|provides customer info| BP
    UT -->|triggers billing| BP
    CAM -->|requests meter ops| MO
    MO -->|feeds readings| UT

    style CAM fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style UT fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style BP fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style MO fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
```

---

## Capabilities {#capabilities}

Capabilities are **cross-cutting system services** that span multiple subsystems. Each capability is independently testable and has defined NFR requirements.

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '16px',
  marginBottom: '32px'
}}>
  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>CAP-001</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#3b82f6', fontWeight: '600' }}>Security</span>
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Portal Authentication</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Access token generation, validation, and session management across all contexts.</div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>CAP-002</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600' }}>Observability</span>
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Usage Logging</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Records all state-changing operations for audit trails, compliance, and debugging.</div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>CAP-003</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '600' }}>Communication</span>
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Usage Alerts</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Push notifications and real-time updates to customers and operators.</div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>CAP-004</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#3b82f6', fontWeight: '600' }}>Security</span>
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Anomaly Detection</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Identifies unusual usage patterns, potential leaks, and meter tampering.</div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>CAP-005</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '600' }}>Experience</span>
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Self-Service Portal</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Customer-facing dashboards for account management, usage monitoring, and billing.</div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>CAP-006</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600' }}>Business</span>
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Service Coverage</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Geographic service area mapping, coverage validation, and zone management.</div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>CAP-007</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '600' }}>Communication</span>
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>System Integration</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>External system connectors for SCADA, GIS, and third-party utility platforms.</div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>CAP-008</span>
      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#3b82f6', fontWeight: '600' }}>Security</span>
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Meter Certification</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Hardware verification, calibration tracking, and compliance certification for meters.</div>
  </div>
</div>

### Capability Dependencies

```mermaid
graph TD
    CAP001[CAP-001: Authentication] --> CAP002[CAP-002: Usage Logging]
    CAP001 --> CAP004[CAP-004: Anomaly Detection]
    CAP003[CAP-003: Usage Alerts] --> CAP001
    CAP005[CAP-005: Self-Service] --> CAP001
    CAP005 --> CAP002
    CAP006[CAP-006: Service Coverage] --> CAP002
    CAP007[CAP-007: Integration] --> CAP002
    CAP007 --> CAP003
    CAP008[CAP-008: Meter Cert] --> CAP002

    style CAP001 fill:#f8fafc,stroke:#3b82f6
    style CAP002 fill:#f8fafc,stroke:#3b82f6
    style CAP003 fill:#f8fafc,stroke:#3b82f6
    style CAP004 fill:#f8fafc,stroke:#3b82f6
    style CAP005 fill:#f8fafc,stroke:#3b82f6
    style CAP006 fill:#f8fafc,stroke:#3b82f6
    style CAP007 fill:#f8fafc,stroke:#3b82f6
    style CAP008 fill:#f8fafc,stroke:#3b82f6
```

---

## Technology Stack {#technology-stack}

<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '12px',
  marginBottom: '32px'
}}>
  <div style={{
    padding: '16px 24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Frontend</div>
      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Client-side application layer</div>
    </div>
    <div style={{ fontSize: '13px', color: '#334155', textAlign: 'right' }}>
      <strong>Next.js</strong> &middot; React &middot; TypeScript &middot; Tailwind CSS &middot; shadcn/ui
    </div>
  </div>

  <div style={{
    padding: '16px 24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Backend</div>
      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Server-side logic and API</div>
    </div>
    <div style={{ fontSize: '13px', color: '#334155', textAlign: 'right' }}>
      <strong>Convex</strong> &middot; Server Functions &middot; Real-time Subscriptions
    </div>
  </div>

  <div style={{
    padding: '16px 24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Database</div>
      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Persistent storage layer</div>
    </div>
    <div style={{ fontSize: '13px', color: '#334155', textAlign: 'right' }}>
      <strong>Convex DB</strong> &middot; Document Model &middot; ACID Transactions
    </div>
  </div>

  <div style={{
    padding: '16px 24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Authentication</div>
      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Identity and access control</div>
    </div>
    <div style={{ fontSize: '13px', color: '#334155', textAlign: 'right' }}>
      <strong>Clerk</strong> &middot; API Key Auth &middot; Session Management
    </div>
  </div>

  <div style={{
    padding: '16px 24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Deployment</div>
      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Hosting and CI/CD</div>
    </div>
    <div style={{ fontSize: '13px', color: '#334155', textAlign: 'right' }}>
      <strong>Vercel</strong> &middot; Edge Functions &middot; Preview Deployments
    </div>
  </div>

  <div style={{
    padding: '16px 24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#475569' }}>Runtime & Tooling</div>
      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Developer experience</div>
    </div>
    <div style={{ fontSize: '13px', color: '#334155', textAlign: 'right' }}>
      <strong>Bun</strong> &middot; TypeScript &middot; ESLint &middot; Prettier
    </div>
  </div>
</div>

---

## Architecture Decisions {#architecture-decisions}

Key ADRs that define the system's shape:

| ADR | Decision | Category | Status |
|:----|:---------|:---------|:-------|
| ADR-001 | Domain-Driven Design | Architecture | Accepted |
| ADR-002 | Modular Monolith | Architecture | Accepted |
| ADR-003 | Convex for Backend & Database | Infrastructure | Accepted |
| ADR-004 | Next.js for Frontend | Infrastructure | Accepted |
| ADR-005 | Event-Driven Communication | Architecture | Accepted |
| ADR-006 | Aggregates as Consistency Boundaries | Architecture | Accepted |
| ADR-009 | API Key Authentication | Security | Accepted |
| ADR-015 | Eventual Consistency Between Contexts | Architecture | Accepted |
| ADR-016 | Convex Functions as Application Services | Architecture | Accepted |
| ADR-017 | Bun as Runtime | Infrastructure | Accepted |
| ADR-018 | Vercel for Deployment | Infrastructure | Accepted |
| ADR-019 | Tailwind CSS for Styling | Infrastructure | Accepted |
| ADR-020 | shadcn/ui for Components | Infrastructure | Accepted |
| ADR-021 | Clerk for Authentication | Security | Accepted |

---

## System Integration {#system-integration}

```mermaid
graph LR
    subgraph "Client Layer"
        WEB[Web App<br/>Next.js]
        MOB[Mobile App]
    end

    subgraph "API Layer"
        CONV[Convex<br/>Backend]
        AUTH[Clerk<br/>Auth]
    end

    subgraph "Domain Layer"
        CAM2[Customer<br/>Accounts]
        UT2[Usage<br/>Tracking]
        BP2[Billing &<br/>Payments]
        MO2[Meter<br/>Operations]
    end

    subgraph "External"
        SCADA[SCADA<br/>Systems]
        GIS[GIS<br/>Mapping]
        PAY[Payment<br/>Gateway]
    end

    WEB --> CONV
    MOB --> CONV
    WEB --> AUTH
    CONV --> CAM2
    CONV --> UT2
    CONV --> BP2
    CONV --> MO2
    MO2 --> SCADA
    CAM2 --> GIS
    BP2 --> PAY

    style WEB fill:#f8fafc,stroke:#3b82f6
    style CONV fill:#f8fafc,stroke:#3b82f6
    style AUTH fill:#f8fafc,stroke:#3b82f6
    style CAM2 fill:#f8fafc,stroke:#3b82f6
    style UT2 fill:#f8fafc,stroke:#3b82f6
    style BP2 fill:#f8fafc,stroke:#3b82f6
    style MO2 fill:#f8fafc,stroke:#3b82f6
```

---

## Non-Functional Requirements {#nfrs}

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px',
  marginBottom: '32px'
}}>
  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff'
  }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Performance</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
      <div>&#x2022; API response &lt; 200ms (p95)</div>
      <div>&#x2022; Dashboard load &lt; 2s</div>
      <div>&#x2022; Real-time updates &lt; 500ms</div>
    </div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff'
  }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Security</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
      <div>&#x2022; API key auth on all endpoints</div>
      <div>&#x2022; SHA-256 key hashing</div>
      <div>&#x2022; Audit logging on mutations</div>
    </div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff'
  }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Reliability</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
      <div>&#x2022; 99.9% uptime target</div>
      <div>&#x2022; Automatic failover</div>
      <div>&#x2022; Data backup &lt; 1hr RPO</div>
    </div>
  </div>

  <div style={{
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff'
  }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Accessibility</div>
    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
      <div>&#x2022; WCAG 2.1 AA compliance</div>
      <div>&#x2022; Screen reader support</div>
      <div>&#x2022; Keyboard navigation</div>
    </div>
  </div>
</div>

---

## User Story Mapping {#user-story-mapping}

How user stories flow through the system architecture:

| User Story | Primary Subsystem | Capabilities Used | Personas | Team |
|:-----------|:-----------------|:------------------|:---------|:-----|
| [US-001](/docs/user-stories/US-001-customer-enrollment) Customer Enrollment | Customer Account Mgmt | CAP-001, CAP-002, CAP-006 | PER-003, PER-004 | Customer Services |
| [US-002](/docs/user-stories/US-002-service-activation) Service Activation | Customer Account Mgmt | CAP-001, CAP-002, CAP-006 | PER-001, PER-003 | Customer Services |
| [US-004](/docs/user-stories/US-004-meter-reading) Meter Reading | Usage Tracking | CAP-002, CAP-007, CAP-008 | PER-002, PER-005 | Operations |
| [US-005](/docs/user-stories/US-005-view-usage-history) View Usage History | Usage Tracking | CAP-001, CAP-002, CAP-005 | PER-003, PER-004 | Operations |
| [US-006](/docs/user-stories/US-006-service-area-lookup) Service Area Lookup | Customer Account Mgmt | CAP-006 | PER-003, PER-004 | Customer Services |
| [US-007](/docs/user-stories/US-007-submit-service-request) Service Request | Meter Operations | CAP-001, CAP-002, CAP-005 | PER-003, PER-004 | Field Services |
| [US-008](/docs/user-stories/US-008-technician-dispatch) Technician Dispatch | Meter Operations | CAP-002, CAP-007 | PER-002, PER-005 | Field Services |
| [US-009](/docs/user-stories/US-009-customer-communication) Customer Comms | Customer Account Mgmt | CAP-001, CAP-003, CAP-005 | PER-001, PER-003 | Customer Services |
| [US-010](/docs/user-stories/US-010-smart-meter-integration) Smart Meter | Meter Operations | CAP-007, CAP-008 | PER-005, PER-002 | Field Services |

---

## Compliance Coverage {#compliance-coverage}

### ADR-to-Subsystem Matrix

| ADR | Decision | Customer Acct | Usage Tracking | Billing | Meter Ops |
|:----|:---------|:---:|:---:|:---:|:---:|
| ADR-001 | Domain-Driven Design | Applies | Applies | Applies | Applies |
| ADR-002 | Modular Monolith | Applies | Applies | Applies | Applies |
| ADR-003 | Convex Backend | Applies | Applies | Applies | Applies |
| ADR-005 | Event-Driven Comms | Publishes | Publishes | Subscribes | Publishes |
| ADR-006 | Aggregate Boundaries | 3 aggregates | 3 aggregates | 3 aggregates | 3 aggregates |
| ADR-009 | API Key Auth | Auth gate | Auth gate | Auth gate | Auth gate |
| ADR-015 | Eventual Consistency | -- | Consumer | Consumer | Producer |
| ADR-016 | Convex Functions | App services | App services | App services | App services |
| ADR-021 | Clerk Auth | User sessions | -- | -- | -- |

### NFR-to-Capability Matrix

| NFR | Target | Capabilities Constrained |
|:----|:-------|:------------------------|
| NFR-PERF-001 | API response < 200ms (p95) | CAP-001, CAP-003 |
| NFR-PERF-002 | Dashboard load < 2s | CAP-002, CAP-005, CAP-006 |
| NFR-SEC-001 | Token validation on every request | CAP-001 |
| NFR-SEC-003 | Immutable audit log | CAP-002 |
| NFR-REL-001 | 99.9% alert delivery | CAP-003 |
| NFR-REL-003 | Retry with exponential backoff | CAP-007 |
| NFR-A11Y-001 | WCAG 2.1 AA | CAP-005 |

### BDD Spec Coverage

| Subsystem | Est. Scenarios | Feature Files | Owning Team | Pass Rate |
|:----------|:---:|:---:|:------------|:---:|
| Customer Account Mgmt | ~35 | 4 | Customer Services | ~85% |
| Usage Tracking | ~45 | 5 | Operations | ~90% |
| Billing & Payments | ~40 | 4 | Finance | ~75% |
| Meter Operations | ~40 | 5 | Field Services | ~80% |
| **Total** | **~160** | **18** | | **~83%** |

---

## Next Steps

- [Domain Overview](./ddd/domain-overview) -- Full DDD domain model
- [Bounded Contexts](./ddd/bounded-contexts) -- Detailed context boundaries
- [Architecture Decisions](./adr/README) -- Complete ADR catalog
- [System Specs](./bdd/feature-index) -- BDD test coverage

---

**Related**: [Users & Personas](./users-overview) | [Teams & Ownership](./teams-overview) | [Capabilities](./capabilities/) | [Domain Events](./ddd/domain-events) | [BDD Feature Index](./bdd/feature-index) | [ADR Catalog](./adr/README) | [NFR Index](./nfr/)
