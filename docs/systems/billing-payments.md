---
title: "Billing & Payments"
sidebar_label: "Billing & Payments"
---

<div style={{ maxWidth: '960px', margin: '0 auto' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
    <h2 style={{ margin: '0', fontSize: '22px', color: '#0f172a' }}>Billing & Payments</h2>
    <span style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '9999px', border: '1px solid #cbd5e1' }}>Core Domain</span>
  </div>
  <div style={{ fontSize: '14px', color: '#475569' }}>
    Owned by <a href="/docs/teams/finance">Finance Team</a>
  </div>
</div>

### Description {#description}

<p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '32px' }}>
  The revenue engine -- transforms usage data into invoices, manages billing cycles and rate structures, processes payments through integrated gateways, handles disputes and adjustments, and maintains financial audit trails for regulatory compliance.
</p>

### Architecture {#architecture}

#### Key Aggregates {#key-aggregates}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Invoice</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Generated from finalized usage data per billing cycle. Tracks line items, adjustments, taxes, due dates, and payment status through its complete lifecycle.</div>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>BillingCycle</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Defines billing periods, rate structures, and tiered pricing. Manages the cadence of invoice generation and the rules applied to consumption calculations.</div>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Payment</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Tracks payment processing and reconciliation across multiple gateways. Manages partial payments, refunds, chargebacks, and payment plan installments.</div>
</div>

</div>

#### Domain Events {#domain-events}

<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>InvoiceGenerated</span>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>PaymentReceived</span>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>BillFinalized</span>
</div>

#### Integration Pattern {#integration-pattern}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '32px', fontSize: '13px', color: '#475569', lineHeight: '1.7' }}>
  <strong style={{ color: '#0f172a' }}>Shared Kernel</strong> with Usage Tracking -- receives finalized consumption records through a shared set of usage value objects. Both teams must agree on changes to the shared model.
  <br /><br />
  <strong style={{ color: '#0f172a' }}>Conformist</strong> from Customer Account Management -- uses the account structure as-is without translation, reducing integration overhead and ensuring consistent customer identity across billing.
</div>

### Capabilities Provided {#capabilities-provided}

<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>CAP-006</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Service Coverage</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
    End-to-end billing pipeline from usage data ingestion to invoice delivery and payment processing. Includes rate management, tiered pricing, dispute resolution, payment gateway integration, and financial reporting for regulatory compliance.
  </div>
  <a href="/docs/capabilities/CAP-006" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Capability &#8594;</a>
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
    <a href="/docs/adr/ADR-006" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>ADR-006 Billing Domain</a>
    <a href="/docs/adr/ADR-009" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>ADR-009 Payment Processing</a>
  </div>
</div>

<div style={{ marginBottom: '16px' }}>
  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Non-Functional Requirements</div>
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', fontWeight: '500' }}>NFR-SEC-001 Security (PCI compliance)</span>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', fontWeight: '500' }}>NFR-PERF-001 Performance</span>
  </div>
</div>

<div>
  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>BDD Coverage</div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>~40 scenarios across 4 feature files</div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ flex: '1', background: '#e2e8f0', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
      <div style={{ width: '75%', background: '#3b82f6', height: '100%', borderRadius: '9999px' }}></div>
    </div>
    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', minWidth: '40px' }}>75%</span>
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
  <a href="/docs/teams/finance" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Finance Team</a>
  <a href="/docs/systems" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>All Contexts</a>
  <a href="/docs/practice-areas" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Practice Areas</a>
  <a href="/docs/system-overview" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
</div>

</div>
