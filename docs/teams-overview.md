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

<div style={{
  padding: '24px',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
  marginBottom: '24px'
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
    <div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Customer Services Team</div>
      <div style={{ fontSize: '13px', color: '#64748b' }}>Owns the <strong>Customer Account Management</strong> bounded context</div>
    </div>
    <div style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#3b82f6', fontWeight: '600' }}>Supporting Subdomain</div>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
    Responsible for the complete customer lifecycle -- enrollment, profile management, account standing, service deposits, and customer communications. This team is the front door for every water service customer.
  </div>

  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>Team Members</div>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px',
    marginBottom: '16px'
  }}>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/sarah-chen.jpg" alt="Sarah Chen" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Sarah Chen</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Team Lead / Senior Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>8 years in customer platforms. Previously led account systems at Pacific Gas. Drives the enrollment and account management domain.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/marcus-rivera.jpg" alt="Marcus Rivera" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Marcus Rivera</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Full-Stack Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Convex + Next.js specialist. Owns the self-service portal frontend and real-time account status sync.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/aisha-patel.jpg" alt="Aisha Patel" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Aisha Patel</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Frontend Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Accessibility advocate. Built the customer dashboard and notification center. WCAG 2.1 AA compliance lead.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/james-kowalski.jpg" alt="James Kowalski" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>James Kowalski</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>QA / BDD Specialist</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Authors Gherkin scenarios for enrollment, activation, and account management. Maintains the customer services test suite.</div>
      </div>
    </div>
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
    <div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Key Aggregates</div>
      <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
        &#x2022; CustomerAccount<br/>
        &#x2022; AccountStatus<br/>
        &#x2022; ServiceDeposit
      </div>
    </div>
    <div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Domain Events Owned</div>
      <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
        &#x2022; AccountCreated<br/>
        &#x2022; StatusChanged<br/>
        &#x2022; DepositReleased
      </div>
    </div>
  </div>

  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
    <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Capabilities Owned</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/capabilities/CAP-001" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}>CAP-001 Portal Auth</a>
      <a href="/docs/capabilities/CAP-005" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '600', textDecoration: 'none' }}>CAP-005 Self-Service Portal</a>
    </div>
  </div>

  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
    <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Serves Personas</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/personas/PER-001-utility-administrator" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-001 Utility Admin</a>
      <a href="/docs/personas/PER-003-residential-customer" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-003 Residential</a>
      <a href="/docs/personas/PER-004-commercial-customer" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-004 Commercial</a>
    </div>
  </div>
</div>

---

## Operations {#operations}

<div style={{
  padding: '24px',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
  marginBottom: '24px'
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
    <div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Operations Team</div>
      <div style={{ fontSize: '13px', color: '#64748b' }}>Owns the <strong>Usage Tracking</strong> bounded context</div>
    </div>
    <div style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '600' }}>Core Domain</div>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
    Responsible for the heartbeat of the system -- collecting meter readings, calculating consumption, validating data quality, detecting anomalies, and providing real-time usage data to customers and operators. This is the most data-intensive context.
  </div>

  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>Team Members</div>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px',
    marginBottom: '16px'
  }}>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/david-okonkwo.jpg" alt="David Okonkwo" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>David Okonkwo</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Team Lead / Backend Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>12 years in data systems. Ex-AWS. Designed the meter reading pipeline and real-time consumption engine.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/emily-zhang.jpg" alt="Emily Zhang" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Emily Zhang</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Data Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Owns the usage data pipeline, ETL workflows, and data quality validation. Background in IoT telemetry at Siemens.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/raj-gupta.jpg" alt="Raj Gupta" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Raj Gupta</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Full-Stack Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Builds the operator dashboards and usage history views. Handles the Convex real-time subscriptions for live usage feeds.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/lisa-nakamura.jpg" alt="Lisa Nakamura" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Lisa Nakamura</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>ML / Analytics Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Built the anomaly detection system (CAP-004). Maintains usage alert thresholds and predictive consumption models.</div>
      </div>
    </div>
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
    <div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Key Aggregates</div>
      <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
        &#x2022; MeterReading<br/>
        &#x2022; UsagePeriod<br/>
        &#x2022; ConsumptionRecord
      </div>
    </div>
    <div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Domain Events Owned</div>
      <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
        &#x2022; ReadingRecorded<br/>
        &#x2022; UsageCalculated<br/>
        &#x2022; AnomalyDetected
      </div>
    </div>
  </div>

  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
    <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Capabilities Owned</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/capabilities/CAP-002" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600', textDecoration: 'none' }}>CAP-002 Usage Logging</a>
      <a href="/docs/capabilities/CAP-003" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '600', textDecoration: 'none' }}>CAP-003 Usage Alerts</a>
      <a href="/docs/capabilities/CAP-004" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}>CAP-004 Anomaly Detection</a>
    </div>
  </div>

  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
    <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Serves Personas</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/personas/PER-002-treatment-operator" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-002 Treatment Operator</a>
      <a href="/docs/personas/PER-003-residential-customer" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-003 Residential</a>
      <a href="/docs/personas/PER-004-commercial-customer" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-004 Commercial</a>
    </div>
  </div>
</div>

---

## Finance {#finance}

<div style={{
  padding: '24px',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
  marginBottom: '24px'
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
    <div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Finance Team</div>
      <div style={{ fontSize: '13px', color: '#64748b' }}>Owns the <strong>Billing & Payments</strong> bounded context</div>
    </div>
    <div style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600' }}>Core Domain</div>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
    Owns the revenue engine -- generating invoices from usage data, managing billing cycles, processing payments, handling disputes, and ensuring financial compliance. Tightly coupled with Usage Tracking via a shared kernel for the billing flow.
  </div>

  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>Team Members</div>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px',
    marginBottom: '16px'
  }}>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/priya-sharma.jpg" alt="Priya Sharma" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Priya Sharma</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Team Lead / Backend Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>10 years in fintech. Previously built payment systems at Stripe. Architects the billing cycle engine and invoice pipeline.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/carlos-mendez.jpg" alt="Carlos Mendez" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Carlos Mendez</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Payment Systems Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Payment gateway integrations, PCI compliance, and dispute resolution workflows. Previously at Square.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/anna-bergstrom.jpg" alt="Anna Bergstrom" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Anna Bergstrom</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Full-Stack Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Builds billing dashboards and payment history views. Owns the shared kernel integration with Operations for usage-to-invoice flow.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/tom-ikeda.jpg" alt="Tom Ikeda" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Tom Ikeda</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Compliance / Security Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Financial audit trails, regulatory compliance, and SOC 2 readiness. Ensures all billing data meets utility commission standards.</div>
      </div>
    </div>
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
    <div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Key Aggregates</div>
      <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
        &#x2022; Invoice<br/>
        &#x2022; BillingCycle<br/>
        &#x2022; Payment
      </div>
    </div>
    <div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Domain Events Owned</div>
      <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
        &#x2022; InvoiceGenerated<br/>
        &#x2022; PaymentReceived<br/>
        &#x2022; BillFinalized
      </div>
    </div>
  </div>

  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
    <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Capabilities Owned</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/capabilities/CAP-006" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600', textDecoration: 'none' }}>CAP-006 Service Coverage</a>
    </div>
  </div>

  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
    <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Serves Personas</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/personas/PER-001-utility-administrator" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-001 Utility Admin</a>
      <a href="/docs/personas/PER-003-residential-customer" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-003 Residential</a>
      <a href="/docs/personas/PER-004-commercial-customer" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-004 Commercial</a>
    </div>
  </div>
</div>

---

## Field Services {#field-services}

<div style={{
  padding: '24px',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6',
  marginBottom: '24px'
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
    <div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Field Services Team</div>
      <div style={{ fontSize: '13px', color: '#64748b' }}>Owns the <strong>Meter Operations</strong> bounded context</div>
    </div>
    <div style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '600' }}>Supporting Subdomain</div>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
    Manages the physical infrastructure -- meter installation, calibration, maintenance scheduling, service requests, technician dispatch, and SCADA/hardware integration. This is the most independent context and the first candidate for microservice extraction.
  </div>

  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>Team Members</div>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px',
    marginBottom: '16px'
  }}>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/olga-petrov.jpg" alt="Olga Petrov" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Olga Petrov</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Team Lead / IoT Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Former SCADA systems architect at Honeywell. Designed the smart meter protocol layer and hardware integration framework.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/kevin-brooks.jpg" alt="Kevin Brooks" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Kevin Brooks</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Embedded Systems Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Firmware and device communication protocols. Maintains meter certification workflows (CAP-008) and calibration scheduling.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/maria-gonzalez.jpg" alt="Maria Gonzalez" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Maria Gonzalez</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>Full-Stack Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Builds the technician dispatch UI and service request management portal. Owns the mobile-first field worker experience.</div>
      </div>
    </div>
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <img src="/img/team/yusuf-ali.jpg" alt="Yusuf Ali" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Yusuf Ali</div>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '6px' }}>GIS / Integration Engineer</div>
        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>Geospatial data, service area mapping, and third-party system integrations (CAP-007). Built the asset location tracking system.</div>
      </div>
    </div>
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
    <div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Key Aggregates</div>
      <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
        &#x2022; Meter<br/>
        &#x2022; ServiceRequest<br/>
        &#x2022; MaintenanceSchedule
      </div>
    </div>
    <div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Domain Events Owned</div>
      <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
        &#x2022; MeterRegistered<br/>
        &#x2022; MaintenanceScheduled<br/>
        &#x2022; ServiceCompleted
      </div>
    </div>
  </div>

  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
    <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Capabilities Owned</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/capabilities/CAP-007" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '600', textDecoration: 'none' }}>CAP-007 System Integration</a>
      <a href="/docs/capabilities/CAP-008" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}>CAP-008 Meter Certification</a>
    </div>
  </div>

  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
    <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Serves Personas</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/personas/PER-002-treatment-operator" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-002 Treatment Operator</a>
      <a href="/docs/personas/PER-005-meter-technician" style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '500', textDecoration: 'none' }}>PER-005 Meter Technician</a>
    </div>
  </div>
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

## User Story Ownership {#user-story-ownership}

Each user story is owned by the team that owns the primary bounded context it operates in.

| Team | User Stories | Count |
|:-----|:------------|:---:|
| **Customer Services** | [US-001](/docs/user-stories/US-001-customer-enrollment) Enrollment, [US-002](/docs/user-stories/US-002-service-activation) Activation, [US-006](/docs/user-stories/US-006-service-area-lookup) Area Lookup, [US-009](/docs/user-stories/US-009-customer-communication) Communications | 4 |
| **Operations** | [US-004](/docs/user-stories/US-004-meter-reading) Meter Reading, [US-005](/docs/user-stories/US-005-view-usage-history) Usage History | 2 |
| **Finance** | *(Billing stories pending -- invoicing, payments, disputes)* | 0 |
| **Field Services** | [US-007](/docs/user-stories/US-007-submit-service-request) Service Request, [US-008](/docs/user-stories/US-008-technician-dispatch) Dispatch, [US-010](/docs/user-stories/US-010-smart-meter-integration) Smart Meter | 3 |

---

## Compliance Dashboard {#compliance-dashboard}

### BDD Coverage by Team

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
  marginBottom: '24px'
}}>
  <div style={{ padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Customer Services</div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>~35</div>
    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>BDD scenarios across 4 feature files</div>
    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0' }}>
      <div style={{ width: '85%', height: '100%', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>~85% passing</div>
  </div>
  <div style={{ padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Operations</div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>~45</div>
    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>BDD scenarios across 5 feature files</div>
    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0' }}>
      <div style={{ width: '90%', height: '100%', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>~90% passing</div>
  </div>
  <div style={{ padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Finance</div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>~40</div>
    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>BDD scenarios across 4 feature files</div>
    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0' }}>
      <div style={{ width: '75%', height: '100%', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>~75% passing</div>
  </div>
  <div style={{ padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Field Services</div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>~40</div>
    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>BDD scenarios across 5 feature files</div>
    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0' }}>
      <div style={{ width: '80%', height: '100%', borderRadius: '3px', backgroundColor: '#3b82f6' }}></div>
    </div>
    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>~80% passing</div>
  </div>
</div>

### ADR Responsibility

Which teams authored or are most affected by each architecture decision:

| ADR | Decision | Primary Team | Affected Teams |
|:----|:---------|:-------------|:--------------|
| ADR-001 | Domain-Driven Design | All teams | All teams |
| ADR-002 | Modular Monolith | All teams | All teams |
| ADR-003 | Convex Backend | Operations | All teams |
| ADR-004 | Next.js Frontend | Customer Services | All teams |
| ADR-005 | Event-Driven Comms | Operations | All teams |
| ADR-006 | Aggregate Boundaries | Operations | Finance, Field Services |
| ADR-009 | API Key Auth | Customer Services | All teams |
| ADR-015 | Eventual Consistency | Operations | Finance |
| ADR-016 | Convex Functions | Operations | All teams |
| ADR-017 | Bun Runtime | Field Services | All teams |
| ADR-018 | Vercel Deployment | Customer Services | All teams |
| ADR-019 | Tailwind CSS | Customer Services | All teams |
| ADR-020 | shadcn/ui | Customer Services | All teams |
| ADR-021 | Clerk Auth | Customer Services | All teams |

### NFR Ownership

Which team is the primary owner for each NFR category:

| NFR Category | Primary Owner | Responsible For | Key NFRs |
|:-------------|:-------------|:---------------|:---------|
| **Performance** | Operations | API response times, real-time feeds, dashboard speed | NFR-PERF-001, NFR-PERF-002, NFR-PERF-003 |
| **Security** | Customer Services | Auth, session management, API keys, audit trails | NFR-SEC-001 through NFR-SEC-007 |
| **Reliability** | Field Services | System integration uptime, data durability, retry logic | NFR-REL-001 through NFR-REL-004 |
| **Accessibility** | Customer Services | WCAG compliance, screen reader support, keyboard nav | NFR-A11Y-001 |

---

## Next Steps

- [System Architecture](./system-overview) -- Full system overview with subsystems and capabilities
- [Users & Personas](./users-overview) -- Persona details and user story catalog
- [Domain Model](./ddd/domain-overview) -- DDD bounded contexts and aggregates
- [Agent Coordination](./agents/coordination) -- How AI agents collaborate across teams

---

**Related**: [Context Map](./ddd/context-map) | [Bounded Contexts](./ddd/bounded-contexts) | [Capabilities](./capabilities/)
