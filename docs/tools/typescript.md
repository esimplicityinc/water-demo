---
title: "TypeScript"
sidebar_label: "TypeScript"
---

# TypeScript

<div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>TypeScript</span>
    <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', color: '#475569' }}>Language & Type System</span>
  </div>
  <p style={{ fontSize: '14px', color: '#475569', margin: '0' }}>The foundation of AquaTrack's entire codebase -- providing type safety across domain models, API contracts, UI components, and test suites. Every aggregate, value object, and domain event is typed.</p>
</div>

### Overview {#overview}

<div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc', marginBottom: '32px' }}>
  <p style={{ fontSize: '14px', color: '#475569', margin: '0', lineHeight: '1.7' }}>TypeScript is not just a language choice for AquaTrack -- it is an architectural decision that shapes how the entire system is built. Strict mode catches errors at compile time rather than runtime. Discriminated unions model domain states precisely. Branded types enforce that a MeterId cannot be used where an AccountId is expected. From Convex function arguments to React component props to Cucumber step definitions, TypeScript ensures consistency and correctness across every layer.</p>
</div>

### Teams Using TypeScript {#teams-using}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <a href="/docs/teams/customer-services" style={{ fontSize: '15px', fontWeight: '700', color: '#3b82f6', textDecoration: 'none' }}>Customer Services</a>
    <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 0 0', lineHeight: '1.6' }}>Typed customer aggregates, account state machines, portal component props</p>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <a href="/docs/teams/operations" style={{ fontSize: '15px', fontWeight: '700', color: '#3b82f6', textDecoration: 'none' }}>Operations</a>
    <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 0 0', lineHeight: '1.6' }}>Typed meter reading schemas, usage calculation types, pipeline data contracts</p>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <a href="/docs/teams/finance" style={{ fontSize: '15px', fontWeight: '700', color: '#3b82f6', textDecoration: 'none' }}>Finance</a>
    <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 0 0', lineHeight: '1.6' }}>Typed billing models, currency value objects, invoice generation contracts</p>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <a href="/docs/teams/field-services" style={{ fontSize: '15px', fontWeight: '700', color: '#3b82f6', textDecoration: 'none' }}>Field Services</a>
    <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 0 0', lineHeight: '1.6' }}>Typed service request workflows, meter registration schemas, scheduling interfaces</p>
  </div>

</div>

### Systems {#systems}

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
  <a href="/docs/systems/customer-account-mgmt" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Customer Account Mgmt</a>
  <a href="/docs/systems/usage-tracking" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Usage Tracking</a>
  <a href="/docs/systems/billing-payments" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Billing & Payments</a>
  <a href="/docs/systems/meter-operations" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Meter Operations</a>
</div>

### Related Competencies {#related-competencies}

<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>COMP-001 Aggregate Design</span>
    </div>
    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Types enforce aggregate invariants and state transitions</div>
    <a href="/docs/practice-areas/PA-001-ddd" style={{ fontSize: '13px', fontWeight: '500', color: '#3b82f6', textDecoration: 'none' }}>PA-001 Domain-Driven Design</a>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>COMP-010 Event Contracts</span>
    </div>
    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Typed event schemas ensure cross-context communication safety</div>
    <a href="/docs/practice-areas/PA-004-api" style={{ fontSize: '13px', fontWeight: '500', color: '#3b82f6', textDecoration: 'none' }}>PA-004 API Design</a>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>COMP-007 Convex Functions</span>
    </div>
    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>End-to-end typed functions from client to database</div>
    <a href="/docs/practice-areas/PA-003-cloud" style={{ fontSize: '13px', fontWeight: '500', color: '#3b82f6', textDecoration: 'none' }}>PA-003 Cloud Infrastructure</a>
  </div>

</div>

### Architecture Decisions {#architecture-decisions}

<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>ADR-013</span>
      <span style={{ fontSize: '13px', color: '#475569' }}>-- TypeScript-first development</span>
    </div>
  </div>

</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
  <a href="/docs/tools/" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Tools Overview</a>
  <a href="/docs/practice-areas/PA-001-ddd" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>DDD Practice Area</a>
  <a href="/docs/tools/convex" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Convex</a>
  <a href="/docs/tools/vitest" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Vitest</a>
</div>
