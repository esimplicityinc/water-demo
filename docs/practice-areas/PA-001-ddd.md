---
title: "PA-001 Domain-Driven Design"
sidebar_label: "PA-001 DDD"
---

# PA-001 Domain-Driven Design

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>PA-001 Domain-Driven Design</span>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Understanding</span>
  </div>
  <p style={{ fontSize: '14px', color: '#475569', margin: '0' }}>Aggregate boundaries, bounded contexts, ubiquitous language, context mapping, and event storming. This practice area ensures that domain complexity is managed through strategic and tactical DDD patterns, enabling teams to build software models that accurately reflect the business domain.</p>
</div>

### Six Pillars {#six-pillars}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Strategy</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>DDD guides how we decompose the AquaTrack domain into bounded contexts aligned with business capabilities.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Standards</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Ubiquitous language glossary maintained per context. Aggregates enforce invariants. Value objects are immutable.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Frameworks</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Convex schema design patterns. TypeScript discriminated unions for domain events. See <a href="/docs/tools/convex" style={{ color: '#3b82f6', textDecoration: 'none' }}>Convex</a> and <a href="/docs/tools/typescript" style={{ color: '#3b82f6', textDecoration: 'none' }}>TypeScript</a>.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Libraries</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>@foe/schemas for Zod-based domain validation. Custom aggregate base classes.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Processes</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Event storming workshops quarterly. Context map reviews during architecture sync.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Measures</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Aggregate boundary violations per sprint. Cross-context coupling metrics. Domain event coverage.</p>
  </div>

</div>

### Competencies {#competencies}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-001 Aggregate Design</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Designing aggregate boundaries, enforcing invariants, choosing aggregate roots, managing consistency.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Can identify entities vs value objects.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs aggregates with correct invariant boundaries.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Resolves cross-aggregate consistency with domain events.</span>
      </div>
    </div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-002 Context Mapping</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Identifying bounded context boundaries, choosing integration patterns (shared kernel, ACL, conformist).</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Can identify bounded context boundaries.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Selects appropriate integration patterns.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs context maps for multi-team systems.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisite: COMP-001 Basic</div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-003 Event Storming</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Facilitating event storming workshops, identifying domain events, commands, and read models.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Can participate in event storming sessions.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Facilitates sessions and extracts aggregate candidates.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Drives strategic design decisions from workshop outputs.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisites: COMP-001 Intermediate, COMP-002 Basic</div>
  </div>

</div>

### Team Adoption {#team-adoption}

<div style={{ overflowX: 'auto', marginBottom: '32px' }}>
<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
  <thead>
    <tr style={{ background: '#f8fafc' }}>
      <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Team</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Adoption Level</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Score</th>
      <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Advocate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Customer Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Proficient</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>85</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Sarah Chen</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Operations</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Proficient</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>88</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>David Okonkwo</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Finance</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>70</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Priya Sharma</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Field Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>72</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Olga Petrov</td>
    </tr>
  </tbody>
</table>
</div>

### Individual Proficiency {#individual-proficiency}

<div style={{ overflowX: 'auto', marginBottom: '32px' }}>
<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
  <thead>
    <tr style={{ background: '#f8fafc' }}>
      <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Team</th>
      <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Name</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Aggregate Design</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Context Mapping</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Event Storming</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Customer Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Sarah Chen</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Marcus Rivera</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Aisha Patel</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>James Kowalski</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Operations</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>David Okonkwo</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Emily Zhang</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Raj Gupta</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Lisa Nakamura</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
    </tr>
    <tr>
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Finance</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Priya Sharma</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Carlos Mendez</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Anna Bergstrom</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Tom Ikeda</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
    </tr>
    <tr>
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Field Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Olga Petrov</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Kevin Brooks</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Maria Gonzalez</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Yusuf Ali</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
  </tbody>
</table>
</div>

### Related {#related}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/ddd/context-map" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Context Map</a>
  <a href="/docs/ddd/bounded-contexts" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Bounded Contexts</a>
  <a href="/docs/ddd/aggregates-entities" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Aggregates</a>
  <a href="/docs/tools/convex" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Convex</a>
  <a href="/docs/tools/typescript" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>TypeScript</a>
</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
  <a href="/docs/practice-areas/" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Practice Areas Overview</a>
  <a href="/docs/teams-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Teams Overview</a>
  <a href="/docs/system-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
</div>
