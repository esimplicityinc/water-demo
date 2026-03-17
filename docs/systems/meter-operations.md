---
title: "Meter Operations"
sidebar_label: "Meter Operations"
---

<div style={{ maxWidth: '960px', margin: '0 auto' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
    <h2 style={{ margin: '0', fontSize: '22px', color: '#0f172a' }}>Meter Operations</h2>
    <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '9999px', border: '1px solid #cbd5e1' }}>Supporting Subdomain</span>
  </div>
  <div style={{ fontSize: '14px', color: '#475569' }}>
    Owned by <a href="/docs/teams/field-services">Field Services Team</a>
  </div>
</div>

### Description {#description}

<p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '32px' }}>
  Manages the physical infrastructure layer -- smart meter installation and registration, calibration scheduling, preventive maintenance, service request dispatch, technician routing, and SCADA/hardware protocol integration. This is the most independent context and the first candidate for microservice extraction.
</p>

### Architecture {#architecture}

#### Key Aggregates {#key-aggregates}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Meter</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Manages meter registration, hardware status, firmware versions, and calibration records. Tracks the full lifecycle from procurement through decommission.</div>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>ServiceRequest</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Work orders for meter installation, replacement, and repair. Manages assignment, scheduling, technician dispatch, and completion tracking.</div>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>MaintenanceSchedule</div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Preventive maintenance planning based on meter age, reading anomalies, and regulatory calibration requirements. Generates service requests on schedule.</div>
</div>

</div>

#### Domain Events {#domain-events}

<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>MeterRegistered</span>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>MaintenanceScheduled</span>
  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>ServiceCompleted</span>
</div>

#### Integration Pattern {#integration-pattern}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '32px', fontSize: '13px', color: '#475569', lineHeight: '1.7' }}>
  <strong style={{ color: '#0f172a' }}>Partnership</strong> with Usage Tracking -- coordinates meter reading collection schedules and meter availability windows. Neither context dominates; changes are jointly negotiated between the Field Services and Operations teams.
  <br /><br />
  <strong style={{ color: '#0f172a' }}>Anti-Corruption Layer</strong> for external SCADA systems -- translates vendor-specific hardware protocols and data formats into the AquaTrack domain model, isolating the core domain from external system volatility.
</div>

### Capabilities Provided {#capabilities-provided}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>CAP-007</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>System Integration</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
    Integration with SCADA systems, smart meter protocols, and third-party field service platforms. Manages protocol translation, data normalization, and connection health monitoring.
  </div>
  <a href="/docs/capabilities/CAP-007" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Capability &#8594;</a>
</div>

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>CAP-008</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Meter Certification</span>
  </div>
  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
    Meter calibration tracking, certification compliance, and accuracy verification. Ensures all active meters meet regulatory standards and schedules recertification before expiry.
  </div>
  <a href="/docs/capabilities/CAP-008" style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>View Capability &#8594;</a>
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
    <a href="/docs/adr/ADR-007" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>ADR-007 Meter Protocol</a>
    <a href="/docs/adr/ADR-011" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>ADR-011 SCADA Integration</a>
  </div>
</div>

<div style={{ marginBottom: '16px' }}>
  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Non-Functional Requirements</div>
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#0f172a', fontWeight: '500' }}>NFR-PERF-001 Performance</span>
  </div>
</div>

<div>
  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>BDD Coverage</div>
  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>~40 scenarios across 4 feature files</div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ flex: '1', background: '#e2e8f0', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
      <div style={{ width: '80%', background: '#3b82f6', height: '100%', borderRadius: '9999px' }}></div>
    </div>
    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', minWidth: '40px' }}>80%</span>
  </div>
</div>

</div>

### Serves Personas {#serves-personas}

<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/personas/PER-002" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>PER-002 Treatment Operator</a>
  <a href="/docs/personas/PER-005" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>PER-005 Meter Technician</a>
</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
  <a href="/docs/teams/field-services" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Field Services Team</a>
  <a href="/docs/systems" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>All Contexts</a>
  <a href="/docs/practice-areas" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>Practice Areas</a>
  <a href="/docs/system-overview" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
</div>

</div>
