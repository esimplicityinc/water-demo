---
title: "Customer Account Management"
sidebar_label: "Customer Account Mgmt"
---

<div style={{ maxWidth: '960px', margin: '0 auto' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
    <h2 style={{ margin: '0', fontSize: '22px', color: '#0f172a' }}>Customer Account Management</h2>
    <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '9999px', border: '1px solid #cbd5e1' }}>Supporting Subdomain</span>
  </div>
  <div style={{ fontSize: '14px', color: '#475569' }}>
    Owned by <a href="/docs/teams/customer-services">Customer Services Team</a>
  </div>
</div>

### Description {#description}

<p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '32px' }}>
  The Customer Account Management context handles the complete customer lifecycle -- enrollment, identity verification, profile management, account standing, service deposits, and customer communications. It is the entry point for every water service customer and provides customer identity to all other contexts.
</p>

### Architecture {#architecture}

#### Key Aggregates {#key-aggregates}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>CustomerAccount</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Aggregate root: manages customer enrollment, identity verification, and status transitions across the full account lifecycle.</div>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>AccountStatus</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Tracks account standing, flags, and holds. Governs whether an account can receive service or requires intervention.</div>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>ServiceDeposit</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Manages the deposit lifecycle including collection, holding, interest accrual, and refund eligibility determination.</div>
</div>

</div>

#### Domain Events {#domain-events}

<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>AccountCreated</span>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>StatusChanged</span>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>DepositReleased</span>
</div>

#### Integration Pattern {#integration-pattern}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '32px', fontSize: '13px', color: '#475569', lineHeight: '1.7' }}>
  <strong style={{ color: '#0f172a' }}>Customer-Supplier</strong> to Usage Tracking -- this context supplies customer identity and account references that Usage Tracking consumes downstream.
  <br /><br />
  <strong style={{ color: '#0f172a' }}>Conformist</strong> to Billing -- the Billing & Payments context conforms to the account structure defined here, adopting the model without translation.
</div>

### Capabilities Provided {#capabilities-provided}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>CAP-001</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Portal Auth</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
    Authentication and authorization for customer portal access. Manages login flows, session management, role-based permissions, and multi-factor authentication.
  </div>
  <a href="/docs/capabilities/CAP-001" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Capability &#8594;</a>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>CAP-005</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Self-Service Portal</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
    Customer dashboard, profile management, and account actions. Enables customers to update information, view history, manage payment methods, and submit service requests.
  </div>
  <a href="/docs/capabilities/CAP-005" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Capability &#8594;</a>
</div>

</div>

### Technology Stack {#technology-stack}

<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/tools/convex" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Convex</a>
  <a href="/docs/tools/nextjs" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Next.js</a>
  <a href="/docs/tools/clerk" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Clerk</a>
  <a href="/docs/tools/typescript" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>TypeScript</a>
  <a href="/docs/tools/vitest" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Vitest</a>
  <a href="/docs/tools/vercel" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Vercel</a>
</div>

### Compliance {#compliance}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>

<div style={{ marginBottom: '16px' }}>
  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Architecture Decision Records</div>
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <a href="/docs/adr/ADR-001" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>ADR-001 Convex Backend</a>
    <a href="/docs/adr/ADR-003" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>ADR-003 Clerk Auth</a>
    <a href="/docs/adr/ADR-010" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>ADR-010 Account Domain Model</a>
  </div>
</div>

<div style={{ marginBottom: '16px' }}>
  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Non-Functional Requirements</div>
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', fontWeight: '500' }}>NFR-SEC-001 Security</span>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', fontWeight: '500' }}>NFR-A11Y-001 Accessibility</span>
  </div>
</div>

<div>
  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>BDD Coverage</div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>~35 scenarios across 4 feature files</div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ flex: '1', background: '#e2e8f0', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
      <div style={{ width: '85%', background: '#3b82f6', height: '100%', borderRadius: '9999px' }}></div>
    </div>
    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', minWidth: '40px' }}>85%</span>
  </div>
</div>

</div>

### Serves Personas {#serves-personas}

<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/personas/PER-001" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>PER-001 Utility Admin</a>
  <a href="/docs/personas/PER-003" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>PER-003 Residential Customer</a>
  <a href="/docs/personas/PER-004" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>PER-004 Commercial Customer</a>
</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
  <a href="/docs/teams/customer-services" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Customer Services Team</a>
  <a href="/docs/systems" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>All Contexts</a>
  <a href="/docs/practice-areas" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Practice Areas</a>
  <a href="/docs/system-overview" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
</div>

</div>
