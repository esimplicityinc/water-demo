---
title: "Clerk"
sidebar_label: "Clerk"
---

# Clerk

<div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc', marginBottom: '32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Clerk</span>
    <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', color: '#475569' }}>Authentication Provider</span>
  </div>
  <p style={{ fontSize: '14px', color: '#475569', margin: '0' }}>Handles user authentication, session management, and identity for all AquaTrack users -- from residential customers to system administrators.</p>
</div>

### Overview {#overview}

<div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc', marginBottom: '32px' }}>
  <p style={{ fontSize: '14px', color: '#475569', margin: '0', lineHeight: '1.7' }}>Clerk provides AquaTrack with a complete identity layer -- pre-built sign-in and sign-up components, session tokens, multi-factor authentication, and role-based access control. It integrates directly with both Next.js middleware for frontend route protection and Convex for backend authorization, ensuring consistent identity enforcement across every layer of the application.</p>
</div>

### Teams Using Clerk {#teams-using}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <a href="/docs/teams/customer-services" style={{ fontSize: '15px', fontWeight: '700', color: '#3b82f6', textDecoration: 'none' }}>Customer Services</a>
    <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 0 0', lineHeight: '1.6' }}>Customer login, account creation, self-service identity management</p>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <a href="/docs/teams/finance" style={{ fontSize: '15px', fontWeight: '700', color: '#3b82f6', textDecoration: 'none' }}>Finance</a>
    <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 0 0', lineHeight: '1.6' }}>Payment authorization, PCI-scoped sessions, billing access control</p>
  </div>

</div>

### Systems {#systems}

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
  <a href="/docs/systems/customer-account-mgmt" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Customer Account Mgmt (primary)</a>
  <a href="/docs/systems/billing-payments" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Billing & Payments (payment auth)</a>
</div>

### Related Competencies {#related-competencies}

<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>COMP-013 Auth & Identity</span>
    </div>
    <a href="/docs/practice-areas/PA-005-security" style={{ fontSize: '13px', fontWeight: '500', color: '#3b82f6', textDecoration: 'none' }}>PA-005 Security</a>
  </div>

</div>

### Architecture Decisions {#architecture-decisions}

<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>ADR-003</span>
      <span style={{ fontSize: '13px', color: '#475569' }}>-- Use Clerk for authentication</span>
    </div>
  </div>

</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
  <a href="/docs/tools/" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Tools Overview</a>
  <a href="/docs/practice-areas/PA-005-security" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Security Practice Area</a>
  <a href="/docs/systems/customer-account-mgmt" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Customer Account Mgmt</a>
</div>
