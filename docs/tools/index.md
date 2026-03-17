---
title: "Technology Stack"
sidebar_label: "Overview"
---

# Technology Stack

AquaTrack is built on a modern TypeScript-first stack. Every technology choice is deliberate -- optimized for real-time data, type safety, and developer velocity.

### At a Glance {#at-a-glance}

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
    <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>6</div>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Core Technologies</div>
  </div>
  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
    <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>4</div>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Teams Using</div>
  </div>
  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
    <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>6</div>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Practice Areas Connected</div>
  </div>
  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
    <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>6</div>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Stack Layers</div>
  </div>
</div>

### Stack Layers {#stack-layers}

<div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Frontend</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <a href="/docs/tools/nextjs" style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>Next.js</a>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- React framework for SSR and static pages</span>
      </div>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>React</span>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- UI component library</span>
      </div>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Tailwind CSS</span>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- Utility-first styling</span>
      </div>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>shadcn/ui</span>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- Component library</span>
      </div>
    </div>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Backend</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <a href="/docs/tools/convex" style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>Convex</a>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- Reactive backend platform</span>
      </div>
    </div>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #1d4ed8', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Authentication</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <a href="/docs/tools/clerk" style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>Clerk</a>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- Identity and auth provider</span>
      </div>
    </div>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #1e40af', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Testing</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <a href="/docs/tools/vitest" style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>Vitest</a>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- Unit and integration testing</span>
      </div>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Cucumber.js</span>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- BDD scenario runner</span>
      </div>
    </div>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Deployment</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <a href="/docs/tools/vercel" style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>Vercel</a>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- Hosting and edge platform</span>
      </div>
    </div>
  </div>

  <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Runtime & Tooling</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <a href="/docs/tools/typescript" style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>TypeScript</a>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- Type-safe development</span>
      </div>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Bun</span>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- JavaScript runtime</span>
      </div>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>ESLint + Prettier</span>
        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>-- Code quality</span>
      </div>
    </div>
  </div>

</div>

### Cross-References {#cross-references}

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
  <a href="/docs/system-overview" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>System Architecture</a>
  <a href="/docs/practice-areas/" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Practice Areas</a>
  <a href="/docs/teams-overview" style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px', fontSize: '13px', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Teams</a>
</div>
