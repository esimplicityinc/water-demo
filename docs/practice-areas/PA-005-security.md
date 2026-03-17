---
title: "PA-005 Security & Compliance"
sidebar_label: "PA-005 Security"
---

# PA-005 Security & Compliance

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>PA-005 Security & Compliance</span>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Confidence</span>
  </div>
  <p style={{ fontSize: '14px', color: '#475569', margin: '0' }}>Authentication, authorization, audit trails, compliance automation, and security-by-design practices. This practice area ensures that security is embedded into every layer of the system, from identity management through domain-level authorization to automated compliance evidence generation.</p>
</div>

### Six Pillars {#six-pillars}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Strategy</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Security by design. Auth delegated to Clerk. Authorization at domain layer. Audit trails on all mutations.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Standards</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>OWASP Top 10. PCI DSS for payments. SOC 2 Type II prep. SHA-256 minimum.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Frameworks</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Clerk for auth, Convex row-level security. See <a href="/docs/tools/clerk" style={{ color: '#3b82f6', textDecoration: 'none' }}>Clerk</a> and <a href="/docs/tools/convex" style={{ color: '#3b82f6', textDecoration: 'none' }}>Convex</a>.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Libraries</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Auth middleware. Audit trail helpers. Compliance checklist automation.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Processes</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Security review for every PR touching auth/payment. Quarterly pen testing.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Measures</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Vulnerability count. Time to patch critical CVEs. Auth failure rate. Audit trail completeness.</p>
  </div>

</div>

### Competencies {#competencies}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-013 Auth & Identity</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>System</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Authentication flows, session management, RBAC, API key management.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Understands auth flows and can use Clerk SDK.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Implements RBAC policies and custom auth middleware.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs multi-tenant auth architecture with delegated admin.</span>
      </div>
    </div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-014 Audit & Logging</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Audit trail design, structured logging, compliance evidence.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Adds audit logs to mutations.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs structured logging with correlation IDs.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Builds automated compliance evidence pipelines.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisite: COMP-013 Basic</div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-015 Compliance Automation</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Automated compliance checks, policy-as-code.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Understands compliance requirements (PCI, SOC 2).</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Implements automated compliance checks in CI.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs policy-as-code framework with continuous monitoring.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisite: COMP-014 Intermediate</div>
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
        <span style={{ background: '#bbf7d0', color: '#14532d', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Leading</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>92</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Aisha Patel</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Operations</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>60</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Emily Zhang</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Finance</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Proficient</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>82</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Tom Ikeda</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Field Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>58</td>
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
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Auth & Identity</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Audit & Logging</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Compliance Automation</th>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>James Kowalski</td>
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
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Operations</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>David Okonkwo</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Emily Zhang</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Raj Gupta</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Lisa Nakamura</td>
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
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Finance</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Priya Sharma</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Carlos Mendez</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Anna Bergstrom</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Tom Ikeda</td>
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
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Field Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Olga Petrov</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Kevin Brooks</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Maria Gonzalez</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Yusuf Ali</td>
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
  </tbody>
</table>
</div>

### Related {#related}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/tools/clerk" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Clerk</a>
  <a href="/docs/nfr/" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>NFR Security</a>
  <a href="/docs/adr/" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>ADR-003</a>
</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
  <a href="/docs/practice-areas/" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Practice Areas Overview</a>
  <a href="/docs/teams-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Teams Overview</a>
  <a href="/docs/system-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
</div>