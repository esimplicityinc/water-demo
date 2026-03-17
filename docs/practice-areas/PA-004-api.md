---
title: "PA-004 API Design & Integration"
sidebar_label: "PA-004 API Design"
---

# PA-004 API Design & Integration

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #1e40af', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>PA-004 API Design & Integration</span>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Confidence</span>
  </div>
  <p style={{ fontSize: '14px', color: '#475569', margin: '0' }}>Domain event contracts, anti-corruption layers, cross-context communication, and external API integration. This practice area ensures that APIs follow domain-driven contracts and that cross-context boundaries are protected through well-defined integration patterns.</p>
</div>

### Six Pillars {#six-pillars}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Strategy</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>APIs follow domain event contracts. Cross-context communication uses well-defined anti-corruption layers.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Standards</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Event schemas versioned with semver. ACL adapters isolate external concerns. Shared kernel contracts reviewed bi-weekly.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Frameworks</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Convex HTTP actions for external APIs. Zod for contract validation. See <a href="/docs/tools/convex" style={{ color: '#3b82f6', textDecoration: 'none' }}>Convex</a> and <a href="/docs/tools/typescript" style={{ color: '#3b82f6', textDecoration: 'none' }}>TypeScript</a>.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Libraries</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Event bus abstractions. ACL adapter base classes. Integration test helpers.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Processes</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Event schema review ceremony bi-weekly. Integration testing before cross-context deployments.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Measures</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>API response time p95. Contract violation rate. Integration test coverage.</p>
  </div>

</div>

### Competencies {#competencies}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #1e40af', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-010 Event Contracts</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Designing domain event schemas, versioning, event bus patterns.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Understands domain events and their purpose.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs versioned event schemas with backward compatibility.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Architects event-driven workflows across bounded contexts.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisite: COMP-001 Basic</div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #1e40af', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-011 ACL Patterns</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Anti-corruption layer design, adapter patterns, translation between contexts.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Understands why ACLs exist.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Implements ACL adapters for external systems.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs ACL strategies for multi-system integration.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisite: COMP-010 Intermediate</div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #1e40af', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-012 External Integrations</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>System</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Third-party API integration (SCADA, payment gateways, GIS).</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Can integrate with a documented REST API.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Handles authentication, retry logic, error mapping.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs resilient multi-provider integration with fallback.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisites: COMP-007 Intermediate, COMP-011 Basic</div>
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
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>58</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Sarah Chen</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Operations</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Proficient</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>75</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>David Okonkwo</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Finance</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>64</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Priya Sharma</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Field Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Proficient</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>76</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Yusuf Ali</td>
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
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Event Contracts</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>ACL Patterns</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>External Integrations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Customer Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Sarah Chen</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Marcus Rivera</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Aisha Patel</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>James Kowalski</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
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
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
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
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
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
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Anna Bergstrom</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Tom Ikeda</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
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
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Maria Gonzalez</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Yusuf Ali</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
      </td>
    </tr>
  </tbody>
</table>
</div>

### Related {#related}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/ddd/context-map" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Context Map</a>
  <a href="/docs/ddd/domain-events" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Domain Events</a>
  <a href="/docs/tools/convex" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Convex</a>
</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
  <a href="/docs/practice-areas/" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Practice Areas Overview</a>
  <a href="/docs/teams-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Teams Overview</a>
  <a href="/docs/system-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
</div>