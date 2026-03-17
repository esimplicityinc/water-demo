---
title: "Usage Tracking"
sidebar_label: "Usage Tracking"
---

<div style={{ maxWidth: '960px', margin: '0 auto' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
    <h2 style={{ margin: '0', fontSize: '22px', color: '#0f172a' }}>Usage Tracking</h2>
    <span style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '9999px', border: '1px solid #cbd5e1' }}>Core Domain</span>
  </div>
  <div style={{ fontSize: '14px', color: '#475569' }}>
    Owned by <a href="/docs/teams/operations">Operations Team</a>
  </div>
</div>

### Description {#description}

<p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '32px' }}>
  The heart of AquaTrack -- ingests meter readings from smart meters and manual entries, calculates consumption periods, validates data quality, detects anomalies, and provides real-time usage feeds to customers and operators. This is the most data-intensive context.
</p>

### Architecture {#architecture}

#### Key Aggregates {#key-aggregates}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>MeterReading</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Handles ingestion and validation of raw readings from smart meters and manual entries. Enforces data quality constraints and deduplication rules.</div>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>UsagePeriod</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Represents calculated consumption between two consecutive readings. Manages period boundaries, interpolation, and estimated usage when readings are missing.</div>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>ConsumptionRecord</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Finalized usage data ready for billing. Immutable once published to downstream contexts. Contains validated, reconciled consumption figures.</div>
</div>

</div>

#### Domain Events {#domain-events}

<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>ReadingRecorded</span>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>UsageCalculated</span>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>AnomalyDetected</span>
</div>

#### Integration Pattern {#integration-pattern}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '32px', fontSize: '13px', color: '#475569', lineHeight: '1.7' }}>
  <strong style={{ color: '#0f172a' }}>Customer-Supplier</strong> from Customer Account Management -- receives customer identity and account references to associate readings with the correct accounts.
  <br /><br />
  <strong style={{ color: '#0f172a' }}>Shared Kernel</strong> with Billing & Payments -- usage data feeds invoice generation through a shared set of consumption value objects agreed upon by both teams.
  <br /><br />
  <strong style={{ color: '#0f172a' }}>Partnership</strong> with Meter Operations -- coordinates reading collection schedules and meter availability. Neither context dominates; changes are negotiated jointly.
</div>

### Capabilities Provided {#capabilities-provided}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>CAP-002</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Usage Logging</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
    Ingests, validates, and stores meter readings from smart meters and manual sources. Provides historical usage data and trend analysis.
  </div>
  <a href="/docs/capabilities/CAP-002" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Capability &#8594;</a>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>CAP-003</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Usage Alerts</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
    Real-time and threshold-based alerts for unusual consumption patterns. Notifies customers and operators when usage exceeds configurable thresholds.
  </div>
  <a href="/docs/capabilities/CAP-003" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Capability &#8594;</a>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>CAP-004</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Anomaly Detection</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
    Identifies irregular consumption patterns indicating leaks, meter faults, or unauthorized use. Uses statistical baselines and configurable sensitivity.
  </div>
  <a href="/docs/capabilities/CAP-004" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Capability &#8594;</a>
</div>

</div>

### Technology Stack {#technology-stack}

<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/tools/convex" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Convex</a>
  <a href="/docs/tools/nextjs" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Next.js</a>
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
    <a href="/docs/adr/ADR-005" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>ADR-005 Usage Pipeline</a>
    <a href="/docs/adr/ADR-008" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>ADR-008 Real-time Streaming</a>
  </div>
</div>

<div style={{ marginBottom: '16px' }}>
  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Non-Functional Requirements</div>
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', fontWeight: '500' }}>NFR-PERF-001 Performance (primary)</span>
  </div>
  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Target: &lt;200ms API response, &lt;500ms real-time updates</div>
</div>

<div>
  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>BDD Coverage</div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>~45 scenarios across 5 feature files</div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ flex: '1', background: '#e2e8f0', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
      <div style={{ width: '90%', background: '#3b82f6', height: '100%', borderRadius: '9999px' }}></div>
    </div>
    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', minWidth: '40px' }}>90%</span>
  </div>
</div>

</div>

### Serves Personas {#serves-personas}

<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/personas/PER-002" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>PER-002 Treatment Operator</a>
  <a href="/docs/personas/PER-003" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>PER-003 Residential Customer</a>
  <a href="/docs/personas/PER-004" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>PER-004 Commercial Customer</a>
</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
  <a href="/docs/teams/operations" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Operations Team</a>
  <a href="/docs/systems" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>All Contexts</a>
  <a href="/docs/practice-areas" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Practice Areas</a>
  <a href="/docs/system-overview" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
</div>

</div>
