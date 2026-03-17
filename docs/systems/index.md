---
title: "Bounded Contexts"
sidebar_label: "Overview"
---

<div style={{ maxWidth: '960px', margin: '0 auto' }}>

<p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.7', marginBottom: '32px' }}>
  AquaTrack's domain is divided into <strong style={{ color: '#0f172a' }}>4 bounded contexts</strong>, each owned end-to-end by a dedicated product team.
</p>

### At a Glance {#at-a-glance}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
  <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>4</div>
  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Bounded Contexts</div>
</div>

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
  <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>2</div>
  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Core Domains</div>
</div>

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
  <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>2</div>
  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Supporting Subdomains</div>
</div>

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
  <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>8</div>
  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Capabilities</div>
</div>

</div>

### Context Summary {#context-summary}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px' }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
    <h4 style={{ margin: '0', fontSize: '16px', color: '#0f172a' }}>Customer Account Management</h4>
    <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '9999px', border: '1px solid #cbd5e1' }}>Supporting Subdomain</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
    <strong style={{ color: '#64748b' }}>Owner:</strong>{' '}
    <a href="/docs/teams/customer-services">Customer Services Team</a>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
    <strong style={{ color: '#64748b' }}>Key Aggregates:</strong>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>CustomerAccount</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>AccountStatus</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>ServiceDeposit</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
    <strong style={{ color: '#64748b' }}>Capabilities:</strong>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>CAP-001</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>CAP-005</span>
  </div>
  <a href="/docs/systems/customer-account-mgmt" style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Details &#8594;</a>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px' }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
    <h4 style={{ margin: '0', fontSize: '16px', color: '#0f172a' }}>Usage Tracking</h4>
    <span style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '9999px', border: '1px solid #cbd5e1' }}>Core Domain</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
    <strong style={{ color: '#64748b' }}>Owner:</strong>{' '}
    <a href="/docs/teams/operations">Operations Team</a>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
    <strong style={{ color: '#64748b' }}>Key Aggregates:</strong>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>MeterReading</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>UsagePeriod</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>ConsumptionRecord</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
    <strong style={{ color: '#64748b' }}>Capabilities:</strong>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>CAP-002</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>CAP-003</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>CAP-004</span>
  </div>
  <a href="/docs/systems/usage-tracking" style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Details &#8594;</a>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px' }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
    <h4 style={{ margin: '0', fontSize: '16px', color: '#0f172a' }}>Billing & Payments</h4>
    <span style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '9999px', border: '1px solid #cbd5e1' }}>Core Domain</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
    <strong style={{ color: '#64748b' }}>Owner:</strong>{' '}
    <a href="/docs/teams/finance">Finance Team</a>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
    <strong style={{ color: '#64748b' }}>Key Aggregates:</strong>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>Invoice</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>BillingCycle</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>Payment</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
    <strong style={{ color: '#64748b' }}>Capabilities:</strong>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>CAP-006</span>
  </div>
  <a href="/docs/systems/billing-payments" style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Details &#8594;</a>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px' }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
    <h4 style={{ margin: '0', fontSize: '16px', color: '#0f172a' }}>Meter Operations</h4>
    <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '9999px', border: '1px solid #cbd5e1' }}>Supporting Subdomain</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
    <strong style={{ color: '#64748b' }}>Owner:</strong>{' '}
    <a href="/docs/teams/field-services">Field Services Team</a>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
    <strong style={{ color: '#64748b' }}>Key Aggregates:</strong>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>Meter</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>ServiceRequest</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>MaintenanceSchedule</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
    <strong style={{ color: '#64748b' }}>Capabilities:</strong>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>CAP-007</span>{' '}
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px 6px', fontSize: '12px', color: '#0f172a' }}>CAP-008</span>
  </div>
  <a href="/docs/systems/meter-operations" style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Details &#8594;</a>
</div>

</div>

### Context Relationships {#context-relationships}

```mermaid
graph LR
    CAM[Customer Account<br/>Management] -->|provides customer info| UT[Usage Tracking]
    UT -->|feeds usage data| BP[Billing &<br/>Payments]
    CAM -->|requests service| MO[Meter Operations]
    MO -->|feeds readings| UT
    style CAM fill:#f8fafc,stroke:#3b82f6,stroke-width:2px
    style UT fill:#f8fafc,stroke:#2563eb,stroke-width:2px
    style BP fill:#f8fafc,stroke:#1d4ed8,stroke-width:2px
    style MO fill:#f8fafc,stroke:#1e40af,stroke-width:2px
```

### Integration Patterns {#integration-patterns}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '40px' }}>

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Customer-Supplier</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
    Customer Account Management acts as the upstream supplier, providing customer identity and account data to Usage Tracking and Billing. The downstream contexts consume the data model as published.
  </div>
</div>

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Shared Kernel</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
    Usage Tracking and Billing & Payments share a small kernel of usage-related value objects (consumption units, reading types). Changes require agreement from both teams.
  </div>
</div>

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Conformist</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
    Billing & Payments conforms to the account model defined by Customer Account Management. It adopts the upstream model without translation, reducing integration complexity.
  </div>
</div>

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Partnership</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
    Meter Operations and Usage Tracking operate as partners, jointly coordinating reading schedules and data collection. Neither dominates; changes are negotiated between the Operations and Field Services teams.
  </div>
</div>

</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
  <a href="/docs/system-overview" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
  <a href="/docs/teams-overview" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Teams</a>
  <a href="/docs/ddd/domain-overview" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Domain Overview</a>
</div>

</div>
