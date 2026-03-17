---
title: "PA-002 Test Automation & BDD"
sidebar_label: "PA-002 BDD & Test"
---

# PA-002 Test Automation & BDD

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>PA-002 Test Automation & BDD</span>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Feedback</span>
  </div>
  <p style={{ fontSize: '14px', color: '#475569', margin: '0' }}>Behavior-Driven Development scenarios, test automation pipelines, coverage strategy, and quality gates. This practice area ensures that every feature is validated against business expectations through executable specifications written before code, creating a living documentation system that drives development.</p>
</div>

### Six Pillars {#six-pillars}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Strategy</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>BDD drives our development loop — scenarios are written before code, ensuring every feature is tested against business expectations.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Standards</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Gherkin feature files follow naming conventions. Step definitions share a common vocabulary. No scenario exceeds 10 steps.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Frameworks</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Vitest for unit/integration tests, Cucumber.js for BDD scenarios. See <a href="/docs/tools/vitest" style={{ color: '#2563eb', textDecoration: 'none' }}>Vitest</a>.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Libraries</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Custom step definition helpers. Test data factories. Mock generators for Convex functions.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Processes</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Scenario review in sprint planning. BDD pairing sessions. Test-first pull request policy.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Measures</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Scenario pass rate per context. Feature coverage percentage. Flaky test count trending.</p>
  </div>

</div>

### Competencies {#competencies}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-004 Gherkin Authoring</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Writing clear Given/When/Then scenarios, organizing feature files, parameterized scenarios.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Writes simple Given/When/Then scenarios.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Uses scenario outlines and data tables effectively.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs feature files that serve as living documentation.</span>
      </div>
    </div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-005 Test Pipeline</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>System</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Configuring Vitest, Cucumber integration, CI/CD test gates, parallel execution.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Runs tests locally and in CI.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Configures test gates and parallelization.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs end-to-end pipeline with selective execution.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisite: COMP-004 Basic</div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-006 Coverage Strategy</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Test pyramid balancing, coverage thresholds, mutation testing.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Understands the test pyramid.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Sets and maintains coverage thresholds.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Implements mutation testing and risk-based prioritization.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisites: COMP-004 Intermediate, COMP-005 Basic</div>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>80</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>James Kowalski</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Operations</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Leading</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>91</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Raj Gupta</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Finance</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>65</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Anna Bergstrom</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Field Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>68</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Maria Gonzalez</td>
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
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Gherkin Authoring</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Test Pipeline</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Coverage Strategy</th>
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
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Expert</span>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>James Kowalski</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Raj Gupta</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Lisa Nakamura</td>
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
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Practitioner</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Tom Ikeda</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Yusuf Ali</td>
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
  </tbody>
</table>
</div>

### Related {#related}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/bdd/feature-index" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>BDD Feature Index</a>
  <a href="/docs/tools/vitest" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Vitest</a>
</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
  <a href="/docs/practice-areas/" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Practice Areas Overview</a>
  <a href="/docs/teams-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Teams Overview</a>
  <a href="/docs/system-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
</div>
