---
title: "Field Services Team"
sidebar_label: "Field Services"
---

### Team Overview {#team-overview}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
    <div>
      <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '24px' }}>Field Services</h2>
      <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '15px', maxWidth: '700px' }}>
        Manages the physical infrastructure -- meter installation, calibration, maintenance scheduling, service requests, technician dispatch, and SCADA/hardware integration.
      </p>
    </div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Supporting Subdomain</span>
    </div>
  </div>
  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Bounded Context: Meter Operations</span>
  </div>
</div>

### Team Members {#team-members}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <img src="/img/team/olga-petrov.jpg" alt="Olga Petrov" style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
      <div>
        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>Olga Petrov</div>
        <div style={{ color: '#64748b', fontSize: '13px' }}>Team Lead / IoT Engineer</div>
      </div>
    </div>
    <p style={{ margin: '0', color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
      Former SCADA systems architect at Honeywell. Designed the smart meter protocol layer and hardware integration framework.
    </p>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <img src="/img/team/kevin-brooks.jpg" alt="Kevin Brooks" style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
      <div>
        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>Kevin Brooks</div>
        <div style={{ color: '#64748b', fontSize: '13px' }}>Embedded Systems Engineer</div>
      </div>
    </div>
    <p style={{ margin: '0', color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
      Firmware and device communication protocols. Maintains meter certification workflows (CAP-008) and calibration scheduling.
    </p>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <img src="/img/team/maria-gonzalez.jpg" alt="Maria Gonzalez" style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
      <div>
        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>Maria Gonzalez</div>
        <div style={{ color: '#64748b', fontSize: '13px' }}>Full-Stack Engineer</div>
      </div>
    </div>
    <p style={{ margin: '0', color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
      Builds the technician dispatch UI and service request management portal. Owns the mobile-first field worker experience.
    </p>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <img src="/img/team/yusuf-ali.jpg" alt="Yusuf Ali" style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
      <div>
        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>Yusuf Ali</div>
        <div style={{ color: '#64748b', fontSize: '13px' }}>GIS / Integration Engineer</div>
      </div>
    </div>
    <p style={{ margin: '0', color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
      Geospatial data, service area mapping, and third-party system integrations (CAP-007). Built the asset location tracking system.
    </p>
  </div>

</div>

### What We Own {#what-we-own}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>

  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>Key Aggregates</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Meter</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ServiceRequest</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>MaintenanceSchedule</span>
    </div>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>Domain Events</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>MeterRegistered</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>MaintenanceScheduled</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ServiceCompleted</span>
    </div>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>Capabilities</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/capabilities/CAP-007" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#dbeafe', color: '#1e40af', textDecoration: 'none', border: '1px solid #93c5fd' }}>CAP-007 System Integration</a>
      <a href="/docs/capabilities/CAP-008" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#dbeafe', color: '#1e40af', textDecoration: 'none', border: '1px solid #93c5fd' }}>CAP-008 Meter Certification</a>
    </div>
  </div>

  <div>
    <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>Serves Personas</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href="/docs/personas/PER-002-treatment-operator" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>PER-002 Treatment Operator</a>
      <a href="/docs/personas/PER-005-meter-technician" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', textDecoration: 'none', border: '1px solid #cbd5e1' }}>PER-005 Meter Technician</a>
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
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Adopting</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>72</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Olga Petrov</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>PA-002 BDD & Test</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Adopting</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>68</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Maria Gonzalez</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>PA-003 Cloud Infra</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Proficient</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>84</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Kevin Brooks</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>PA-004 API Design</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Proficient</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>76</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Yusuf Ali</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>PA-005 Security</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Adopting</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '600' }}>58</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Olga Petrov</td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', color: '#0f172a' }}>PA-006 Data Eng</td>
        <td style={{ padding: '10px 16px' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Adopting</span></td>
        <td style={{ padding: '10px 16px', color: '#0f172a', fontWeight: '600' }}>52</td>
        <td style={{ padding: '10px 16px', color: '#64748b' }}>Yusuf Ali</td>
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
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '500' }}>Olga Petrov</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '500' }}>Kevin Brooks</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#64748b' }}>Awareness</span></td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '500' }}>Maria Gonzalez</td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
      </tr>
      <tr>
        <td style={{ padding: '10px 16px', color: '#0f172a', fontWeight: '500' }}>Yusuf Ali</td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e' }}>Working</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>Expert</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#64748b' }}>Awareness</span></td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', backgroundColor: '#dbeafe', color: '#1e40af' }}>Practitioner</span></td>
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
      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: '600' }}>~40</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ color: '#475569', fontSize: '13px' }}>Feature Files</span>
      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: '600' }}>4</span>
    </div>
    <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#475569', fontSize: '13px' }}>Pass Rate</span>
      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: '600' }}>80%</span>
    </div>
    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginTop: '8px' }}>
      <div style={{ width: '80%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '9999px' }}></div>
    </div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <h4 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>ADR Responsibility</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ADR-001 Convex Backend</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ADR-007 Meter Protocol</span>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ADR-011 SCADA Integration</span>
    </div>
  </div>

  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
    <h4 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>NFR Ownership</h4>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }}>NFR-PERF-001 Performance (Secondary)</span>
    </div>
  </div>

</div>

### User Stories Owned {#user-stories-owned}

<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
  <a href="/docs/user-stories/US-010" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#f8fafc', color: '#0f172a', textDecoration: 'none', border: '1px solid #e2e8f0' }}>US-010 Service Requests</a>
</div>

### Cross-References {#cross-references}

<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
  <a href="/docs/systems/meter-operations" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#ffffff', color: '#3b82f6', textDecoration: 'none', border: '1px solid #e2e8f0' }}>System: Meter Operations</a>
  <a href="/docs/practice-areas/" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#ffffff', color: '#3b82f6', textDecoration: 'none', border: '1px solid #e2e8f0' }}>Practice Areas</a>
  <a href="/docs/teams-overview" style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', backgroundColor: '#ffffff', color: '#3b82f6', textDecoration: 'none', border: '1px solid #e2e8f0' }}>Teams Overview</a>
</div>