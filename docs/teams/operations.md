---
title: "Operations Team"
sidebar_label: "Operations"
---

### Team Overview {#team-overview}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
    <div>
      <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '24px' }}>Operations</h2>
      <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '15px', maxWidth: '700px' }}>
        Responsible for the heartbeat of the system -- collecting meter readings, calculating consumption, validating data quality, detecting anomalies, and providing real-time usage data.
      </p>
    </div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Core Domain</span>
    </div>
  </div>
  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Bounded Context: Usage Tracking</span>
  </div>
</div>

### Team Members {#team-members}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <img src="/img/team/david-okonkwo.jpg" alt="David Okonkwo" style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
      <div>
        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>David Okonkwo</div>
        <div style={{ color: '#64748b', fontSize: '13px' }}>Team Lead / Backend Engineer</div>
      </div>
    </div>
    <p style={{ margin: '0', color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
      12 years in data systems. Ex-AWS. Designed the meter reading pipeline and real-time consumption engine.
    </p>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <img src="/img/team/emily-zhang.jpg" alt="Emily Zhang" style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
      <div>
        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>Emily Zhang</div>
        <div style={{ color: '#64748b', fontSize: '13px' }}>Data Engineer</div>
      </div>
    </div>
    <p style={{ margin: '0', color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
      Owns the usage data pipeline, ETL workflows, and data quality validation. Background in IoT telemetry at Siemens.
    </p>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <img src="/img/team/raj-gupta.jpg" alt="Raj Gupta" style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
      <div>
        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>Raj Gupta</div>
        <div style={{ color: '#64748b', fontSize: '13px' }}>Full-Stack Engineer</div>
      </div>
    </div>
    <p style={{ margin: '0', color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
      Builds the operator dashboards and usage history views. Handles the Convex real-time subscriptions for live usage feeds.
    </p>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <img src="/img/team/lisa-nakamura.jpg" alt="Lisa Nakamura" style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
      <div>
        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>Lisa Nakamura</div>
        <div style={{ color: '#64748b', fontSize: '13px' }}>ML / Analytics Engineer</div>
      </div>
    </div>
    <p style={{ margin: '0', color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
      Built the anomaly detection system (CAP-004). Maintains usage alert thresholds and predictive consumption models.
    </p>
  </div>

</div>

### What We Own {#what-we-own}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>

  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>Key Aggregates</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>MeterReading</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>UsagePeriod</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ConsumptionRecord</span>
    </div>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>Domain Events</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ReadingRecorded</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>UsageCalculated</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>AnomalyDetected</span>
    </div>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>Capabilities</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/capabilities/CAP-002" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#dbeafe', color: '#1e40af', textDecoration: 'none', border: '1px solid #93c5fd' }}>CAP-002 Usage Logging</a>
      <a href="/docs/capabilities/CAP-003" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#dbeafe', color: '#1e40af', textDecoration: 'none', border: '1px solid #93c5fd' }}>CAP-003 Usage Alerts</a>
      <a href="/docs/capabilities/CAP-004" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#dbeafe', color: '#1e40af', textDecoration: 'none', border: '1px solid #93c5fd' }}>CAP-004 Anomaly Detection</a>
    </div>
  </div>

  <div>
    <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>Serves Personas</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/personas/PER-002-treatment-operator" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>PER-002 Treatment Operator</a>
      <a href="/docs/personas/PER-003-residential-customer" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>PER-003 Residential</a>
      <a href="/docs/personas/PER-004-commercial-customer" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>PER-004 Commercial</a>
    </div>
  </div>

</div>

### Technology Stack {#technology-stack}

<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
  <a href="/docs/tools/convex" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>Convex</a>
  <a href="/docs/tools/nextjs" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>Next.js</a>
  <a href="/docs/tools/typescript" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>TypeScript</a>
  <a href="/docs/tools/vitest" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>Vitest</a>
  <a href="/docs/tools/vercel" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>Vercel</a>
</div>

### Practice Area Adoption {#practice-area-adoption}

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
    <thead>
      <tr style={{ backgroundColor: '#f8fafc' }}>
        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Practice Area</th>
        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Level</th>
        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Score</th>
        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Advocate</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>PA-001 DDD</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Proficient</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>88</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>David Okonkwo</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>PA-002 BDD & Test</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#bbf7d0', color: '#14532d' }}>Leading</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>91</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Raj Gupta</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>PA-003 Cloud Infra</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Proficient</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>78</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>David Okonkwo</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>PA-004 API Design</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Proficient</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>75</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>David Okonkwo</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>PA-005 Security</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Adopting</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>60</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Emily Zhang</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', color: '#0f172a' }}>PA-006 Data Eng</td>
        <td style={{ padding: '10px 16px' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#bbf7d0', color: '#14532d' }}>Leading</span></td>
        <td style={{ padding: '10px 16px', color: '#0f172a', fontWeight: '600' }}>94</td>
        <td style={{ padding: '10px 16px', color: '#64748b' }}>Lisa Nakamura</td>
      </tr>
    </tbody>
  </table>
</div>

### Individual Proficiency Matrix {#individual-proficiency-matrix}

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'auto', marginBottom: '24px' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '700px' }}>
    <thead>
      <tr style={{ backgroundColor: '#f8fafc' }}>
        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Member</th>
        <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>DDD</th>
        <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>BDD</th>
        <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Cloud</th>
        <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>API</th>
        <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Security</th>
        <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Data</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '500' }}>David Okonkwo</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '500' }}>Emily Zhang</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#64748b' }}>Awareness</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '500' }}>Raj Gupta</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', color: '#0f172a', fontWeight: '500' }}>Lisa Nakamura</td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#64748b' }}>Awareness</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
      </tr>
    </tbody>
  </table>
</div>

### Compliance Dashboard {#compliance-dashboard}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <h4 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>BDD Coverage</h4>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ color: '#475569', fontSize: '13px' }}>Scenarios</span>
      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: '600' }}>~45</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ color: '#475569', fontSize: '13px' }}>Feature Files</span>
      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: '600' }}>5</span>
    </div>
    <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#475569', fontSize: '13px' }}>Pass Rate</span>
      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: '600' }}>90%</span>
    </div>
    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginTop: '8px' }}>
      <div style={{ width: '90%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '9999px' }}></div>
    </div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <h4 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>ADR Responsibility</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ADR-001 Convex Backend</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ADR-005 Usage Pipeline</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ADR-008 Real-time Streaming</span>
    </div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <h4 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>NFR Ownership</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>NFR-PERF-001 Performance (Primary)</span>
    </div>
  </div>

</div>

### User Stories Owned {#user-stories-owned}

<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
  <a href="/docs/user-stories/US-003" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#f8fafc', color: '#0f172a', textDecoration: 'none', border: '1px solid #e2e8f0' }}>US-003 Usage Dashboard</a>
  <a href="/docs/user-stories/US-004" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#f8fafc', color: '#0f172a', textDecoration: 'none', border: '1px solid #e2e8f0' }}>US-004 Usage Alerts</a>
  <a href="/docs/user-stories/US-006" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#f8fafc', color: '#0f172a', textDecoration: 'none', border: '1px solid #e2e8f0' }}>US-006 Anomaly Detection</a>
</div>

### Cross-References {#cross-references}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
  <a href="/docs/systems/usage-tracking" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#ffffff', color: '#3b82f6', textDecoration: 'none', border: '1px solid #e2e8f0' }}>System: Usage Tracking</a>
  <a href="/docs/practice-areas/" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#ffffff', color: '#3b82f6', textDecoration: 'none', border: '1px solid #e2e8f0' }}>Practice Areas</a>
  <a href="/docs/teams-overview" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#ffffff', color: '#3b82f6', textDecoration: 'none', border: '1px solid #e2e8f0' }}>Teams Overview</a>
</div>
