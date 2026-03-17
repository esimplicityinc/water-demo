---
title: "PA-006 Data Engineering"
sidebar_label: "PA-006 Data Eng"
---

# PA-006 Data Engineering

<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>PA-006 Data Engineering</span>
    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Understanding</span>
  </div>
  <p style={{ fontSize: '14px', color: '#475569', margin: '0' }}>Data pipelines, time-series ingestion, anomaly detection, and real-time analytics. This practice area ensures that data is treated as a first-class domain concern, with robust pipelines for meter reading ingestion, statistical anomaly detection, and operational dashboards powered by real-time streaming.</p>
</div>

### Six Pillars {#six-pillars}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Strategy</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Data as first-class domain concern. Time-series pipelines for meter reading ingestion. Real-time analytics for operational dashboards.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Standards</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Data quality validation on every pipeline stage. Anomaly thresholds reviewed monthly. Schema evolution backward compatible.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Frameworks</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Convex for real-time data, custom ETL pipelines. See <a href="/docs/tools/convex" style={{ color: '#3b82f6', textDecoration: 'none' }}>Convex</a>.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Libraries</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Time-series aggregation utilities. Statistical anomaly detection. Data quality validation rules.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Processes</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Data quality review weekly. Anomaly threshold tuning monthly. Pipeline performance review quarterly.</p>
  </div>

  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Measures</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: '0' }}>Pipeline throughput (readings/sec). Data quality score. Anomaly detection precision/recall. Query latency p95.</p>
  </div>

</div>

### Competencies {#competencies}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginBottom: '32px' }}>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-016 Data Pipelines</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>System</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>ETL workflow design, data ingestion, quality validation, schema evolution.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Understands ETL concepts and can read pipeline code.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs data pipelines with validation and error handling.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Architects scalable pipelines with exactly-once semantics.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisite: COMP-007 Basic</div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-017 Anomaly Detection</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Practice</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Statistical methods for usage anomaly detection, threshold management.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Understands basic statistical anomaly detection.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Configures and tunes anomaly detection thresholds.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs ML-based anomaly detection with feedback loops.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisite: COMP-016 Intermediate</div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>COMP-018 Real-time Analytics</span>
      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>System</span>
    </div>
    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>Streaming data processing, real-time dashboards, live usage feeds.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Basic:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Can consume real-time data feeds.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Intermediate:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Builds real-time dashboards with Convex subscriptions.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', minWidth: '90px' }}>Advanced:</span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Designs streaming aggregation with windowed computations.</span>
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>Prerequisite: COMP-016 Basic</div>
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
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Exploring</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>35</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Marcus Rivera</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Operations</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#bbf7d0', color: '#14532d', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Leading</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>94</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Lisa Nakamura</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Finance</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>55</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Anna Bergstrom</td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>Field Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Adopting</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', color: '#475569' }}>52</td>
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
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Data Pipelines</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Anomaly Detection</th>
      <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>Real-time Analytics</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Customer Services</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Sarah Chen</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Marcus Rivera</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Raj Gupta</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Lisa Nakamura</td>
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
      <td rowSpan="4" style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a', verticalAlign: 'top' }}>Finance</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Priya Sharma</td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Carlos Mendez</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Anna Bergstrom</td>
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
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Awareness</span>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>Working</span>
      </td>
    </tr>
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Kevin Brooks</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Maria Gonzalez</td>
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
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Yusuf Ali</td>
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
  </tbody>
</table>
</div>

### Related {#related}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
  <a href="/docs/systems/usage-tracking" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Usage Tracking</a>
  <a href="/docs/tools/convex" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Convex</a>
  <a href="/docs/capabilities/CAP-004" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>CAP-004</a>
</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
  <a href="/docs/practice-areas/" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Practice Areas Overview</a>
  <a href="/docs/teams-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Teams Overview</a>
  <a href="/docs/system-overview" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>System Architecture</a>
</div>