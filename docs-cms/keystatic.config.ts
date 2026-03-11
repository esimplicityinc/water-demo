import { config, collection, fields } from '@keystatic/core';

// ---------------------------------------------------------------------------
// Storage configuration — local in dev, GitHub in production
// ---------------------------------------------------------------------------
const storageConfig =
  process.env.NODE_ENV === 'production' ||
  import.meta.env?.KEYSTATIC_STORAGE_KIND === 'github'
    ? ({
        kind: 'github' as const,
        repo: {
          owner: import.meta.env?.GITHUB_REPO_OWNER ?? process.env.GITHUB_REPO_OWNER ?? '',
          name: import.meta.env?.GITHUB_REPO_NAME ?? process.env.GITHUB_REPO_NAME ?? '',
        },
      })
    : ({ kind: 'local' as const });

// ---------------------------------------------------------------------------
// Reusable field helpers
// ---------------------------------------------------------------------------

/** Simple status select */
function statusField(
  label: string,
  options: readonly { label: string; value: string }[],
  defaultValue?: string,
) {
  return fields.select({
    label,
    options: options as { label: string; value: string }[],
    defaultValue: defaultValue ?? (options[0]?.value ?? ''),
  });
}

/**
 * Extra fields that may appear on README.md, index.md, and TEMPLATE files
 * in the docs directories. These are added to every collection so Keystatic
 * doesn't reject files with unknown frontmatter keys.
 */
const extraFields = {
  description: fields.text({ label: 'Description' }),
  last_updated: fields.date({ label: 'Last Updated' }),
  sidebar_position: fields.integer({ label: 'Sidebar Position' }),
  generated: fields.checkbox({ label: 'Generated', defaultValue: false }),
  generated_at: fields.text({ label: 'Generated At' }),
} as const;

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export default config({
  storage: storageConfig,
  ui: {
    brand: { name: 'AquaTrack Docs' },
    navigation: {
      'Governance': ['roads', 'adrs', 'changes'],
      'Requirements': ['nfrs', 'userStories', 'capabilities', 'personas'],
      'Methodology': ['bdd', 'ddd', 'agents'],
      'Planning': ['plans'],
    },
  },

  collections: {
    // -----------------------------------------------------------------------
    // ADRs — Architecture Decision Records
    // -----------------------------------------------------------------------
    adrs: collection({
      label: 'Architecture Decision Records',
      slugField: 'title',
      path: '../docs/adr/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        id: fields.text({
          label: 'ID',
          description: 'e.g. ADR-001',
        }),
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        status: statusField('Status', [
          { label: 'Proposed', value: 'proposed' },
          { label: 'Accepted', value: 'accepted' },
          { label: 'Deprecated', value: 'deprecated' },
          { label: 'Superseded', value: 'superseded' },
        ]),
        category: statusField('Category', [
          { label: 'Architecture', value: 'architecture' },
          { label: 'Infrastructure', value: 'infrastructure' },
          { label: 'Security', value: 'security' },
          { label: 'Performance', value: 'performance' },
        ]),
        scope: fields.text({
          label: 'Scope',
          defaultValue: 'project-wide',
        }),
        created: fields.date({ label: 'Created' }),
        validated_by: fields.text({
          label: 'Validated By',
          description: 'Agent reference, e.g. @arch-inspector',
        }),
        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
          options: {
            image: {
              directory: '../docs/static/img/adr',
              publicPath: '/img/adr/',
            },
          },
        }),
      },
    }),

    // -----------------------------------------------------------------------
    // ROADs — Roadmap Items
    // -----------------------------------------------------------------------
    roads: collection({
      label: 'Roadmap Items',
      slugField: 'title',
      path: '../docs/roads/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        id: fields.text({
          label: 'ID',
          description: 'e.g. ROAD-001',
        }),
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        status: statusField('Status', [
          { label: 'Proposed', value: 'proposed' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Complete', value: 'complete' },
        ]),
        created: fields.text({ label: 'Created', description: 'Date string YYYY-MM-DD' }),
        started: fields.text({ label: 'Started', description: 'Date string YYYY-MM-DD' }),
        completed: fields.text({ label: 'Completed', description: 'Date string YYYY-MM-DD' }),
        phase: fields.integer({
          label: 'Phase',
          description: '0=Foundation, 1=Bot Identity, 2=Token & Promise, 3=Settlement',
          validation: { min: 0, max: 3 },
        }),
        priority: statusField('Priority', [
          { label: 'High', value: 'High' },
          { label: 'Medium', value: 'Medium' },
          { label: 'Low', value: 'Low' },
        ]),

        // -- Governance (complex nested object) --
        governance: fields.object({
          adrs: fields.object({
            validated: fields.checkbox({ label: 'ADRs Validated', defaultValue: false }),
            validated_by: fields.text({ label: 'Validated By' }),
            validated_at: fields.text({ label: 'Validated At', description: 'ISO timestamp' }),
            references: fields.array(
              fields.text({ label: 'ADR Reference' }),
              { label: 'ADR References', itemLabel: (props) => props.value || 'ADR' },
            ),
            compliance_check: fields.array(
              fields.object({
                adr: fields.text({ label: 'ADR ID' }),
                compliant: fields.checkbox({ label: 'Compliant' }),
                notes: fields.text({ label: 'Notes' }),
              }),
              {
                label: 'Compliance Checks',
                itemLabel: (props) => props.fields.adr.value || 'Check',
              },
            ),
          }, { label: 'ADR Governance' }),

          bdd: fields.object({
            id: fields.text({ label: 'BDD ID' }),
            status: statusField('BDD Status', [
              { label: 'Draft', value: 'draft' },
              { label: 'Approved', value: 'approved' },
            ], 'draft'),
            file: fields.text({ label: 'Feature File Path' }),
            scenarios_count: fields.integer({ label: 'Scenarios Count' }),
            scenarios_implemented: fields.integer({ label: 'Scenarios Implemented' }),
            step_definitions: fields.integer({ label: 'Step Definitions' }),
            tests_passing: fields.integer({ label: 'Tests Passing' }),
            approved_by: fields.array(
              fields.object({
                customer: fields.text({ label: 'Approver' }),
                timestamp: fields.text({ label: 'Timestamp' }),
              }),
              {
                label: 'Approved By',
                itemLabel: (props) => props.fields.customer.value || 'Approver',
              },
            ),
            test_results: fields.object({
              total: fields.integer({ label: 'Total' }),
              passed: fields.integer({ label: 'Passed' }),
              failed: fields.integer({ label: 'Failed' }),
            }, { label: 'Test Results' }),
          }, { label: 'BDD Governance' }),

          nfrs: fields.object({
            applicable: fields.array(
              fields.text({ label: 'NFR ID' }),
              { label: 'Applicable NFRs', itemLabel: (props) => props.value || 'NFR' },
            ),
            status: statusField('NFR Status', [
              { label: 'Pending', value: 'pending' },
              { label: 'Pass', value: 'pass' },
              { label: 'Validated', value: 'validated' },
            ], 'pending'),
          }, { label: 'NFR Governance' }),

          capabilities: fields.array(
            fields.text({ label: 'Capability ID' }),
            { label: 'Capabilities', itemLabel: (props) => props.value || 'CAP' },
          ),

          architecture: fields.object({
            status: fields.text({ label: 'Architecture Status' }),
            compliance_score: fields.text({ label: 'Compliance Score' }),
            review_date: fields.text({ label: 'Review Date' }),
            inspector: fields.text({ label: 'Inspector' }),
          }, { label: 'Architecture Review' }),
        }, { label: 'Governance' }),

        // -- Dependencies --
        blocks: fields.array(
          fields.text({ label: 'ROAD ID' }),
          { label: 'Blocks', itemLabel: (props) => props.value || 'ROAD' },
        ),
        depends_on: fields.array(
          fields.text({ label: 'ROAD ID' }),
          { label: 'Depends On', itemLabel: (props) => props.value || 'ROAD' },
        ),
        blocked_by: fields.array(
          fields.text({ label: 'ROAD ID' }),
          { label: 'Blocked By', itemLabel: (props) => props.value || 'ROAD' },
        ),
        plans: fields.array(
          fields.text({ label: 'Plan Reference' }),
          { label: 'Plans', itemLabel: (props) => props.value || 'Plan' },
        ),
        related_changes: fields.array(
          fields.text({ label: 'Change ID' }),
          { label: 'Related Changes', itemLabel: (props) => props.value || 'Change' },
        ),

        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
          options: {
            image: {
              directory: '../docs/static/img/roads',
              publicPath: '/img/roads/',
            },
          },
        }),
      },
    }),

    // -----------------------------------------------------------------------
    // CHANGEs — Change Records
    // -----------------------------------------------------------------------
    changes: collection({
      label: 'Change Records',
      slugField: 'title',
      path: '../docs/changes/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        id: fields.text({
          label: 'ID',
          description: 'e.g. CHANGE-001',
        }),
        road_id: fields.text({
          label: 'Road ID',
          description: 'e.g. ROAD-005',
        }),
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        date: fields.text({ label: 'Date', description: 'YYYY-MM-DD' }),
        version: fields.text({ label: 'Version', description: 'Semver e.g. 0.3.0' }),
        status: statusField('Status', [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
          { label: 'Archived', value: 'archived' },
        ]),
        categories: fields.multiselect({
          label: 'Categories',
          options: [
            { label: 'Added', value: 'Added' },
            { label: 'Changed', value: 'Changed' },
            { label: 'Deprecated', value: 'Deprecated' },
            { label: 'Removed', value: 'Removed' },
            { label: 'Fixed', value: 'Fixed' },
            { label: 'Security', value: 'Security' },
          ],
        }),

        // -- Compliance --
        compliance: fields.object({
          adr_check: fields.object({
            status: statusField('ADR Check Status', [
              { label: 'Pending', value: 'pending' },
              { label: 'Pass', value: 'pass' },
              { label: 'Fail', value: 'fail' },
            ], 'pending'),
            validated_by: fields.text({ label: 'Validated By' }),
            validated_at: fields.text({ label: 'Validated At' }),
            notes: fields.text({ label: 'Notes' }),
          }, { label: 'ADR Check' }),

          bdd_check: fields.object({
            status: statusField('BDD Check Status', [
              { label: 'Pending', value: 'pending' },
              { label: 'Pass', value: 'pass' },
              { label: 'Fail', value: 'fail' },
            ], 'pending'),
            scenarios: fields.integer({ label: 'Scenarios' }),
            passed: fields.integer({ label: 'Passed' }),
            coverage: fields.text({ label: 'Coverage', description: 'e.g. 100%' }),
          }, { label: 'BDD Check' }),

          nfr_checks: fields.object({
            performance: fields.object({
              status: statusField('Performance Status', [
                { label: 'Pending', value: 'pending' },
                { label: 'Pass', value: 'pass' },
                { label: 'Fail', value: 'fail' },
                { label: 'N/A', value: 'na' },
              ], 'pending'),
              evidence: fields.text({ label: 'Evidence' }),
              validated_by: fields.text({ label: 'Validated By' }),
            }, { label: 'Performance' }),
            security: fields.object({
              status: statusField('Security Status', [
                { label: 'Pending', value: 'pending' },
                { label: 'Pass', value: 'pass' },
                { label: 'Fail', value: 'fail' },
                { label: 'N/A', value: 'na' },
              ], 'pending'),
              evidence: fields.text({ label: 'Evidence' }),
              validated_by: fields.text({ label: 'Validated By' }),
            }, { label: 'Security' }),
            accessibility: fields.object({
              status: statusField('Accessibility Status', [
                { label: 'Pending', value: 'pending' },
                { label: 'Pass', value: 'pass' },
                { label: 'Fail', value: 'fail' },
                { label: 'N/A', value: 'na' },
              ], 'pending'),
              evidence: fields.text({ label: 'Evidence' }),
              validated_by: fields.text({ label: 'Validated By' }),
            }, { label: 'Accessibility' }),
          }, { label: 'NFR Checks' }),
        }, { label: 'Compliance' }),

        // -- Signatures --
        signatures: fields.array(
          fields.object({
            agent: fields.text({ label: 'Agent' }),
            role: fields.text({ label: 'Role' }),
            status: statusField('Signature Status', [
              { label: 'Approved', value: 'approved' },
              { label: 'Pending', value: 'pending' },
              { label: 'Rejected', value: 'rejected' },
            ], 'pending'),
            timestamp: fields.text({ label: 'Timestamp' }),
          }),
          {
            label: 'Signatures',
            itemLabel: (props) =>
              `${props.fields.agent.value} (${props.fields.role.value})` || 'Signature',
          },
        ),

        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
          options: {
            image: {
              directory: '../docs/static/img/changes',
              publicPath: '/img/changes/',
            },
          },
        }),
      },
    }),

    // -----------------------------------------------------------------------
    // NFRs — Non-Functional Requirements
    // -----------------------------------------------------------------------
    nfrs: collection({
      label: 'Non-Functional Requirements',
      slugField: 'title',
      path: '../docs/nfr/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        id: fields.text({
          label: 'ID',
          description: 'e.g. NFR-PERF-001',
        }),
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        category: statusField('Category', [
          { label: 'Performance', value: 'performance' },
          { label: 'Security', value: 'security' },
          { label: 'Reliability', value: 'reliability' },
          { label: 'Scalability', value: 'scalability' },
          { label: 'Maintainability', value: 'maintainability' },
          { label: 'Accessibility', value: 'accessibility' },
        ]),
        priority: statusField('Priority', [
          { label: 'Must', value: 'must' },
          { label: 'Should', value: 'should' },
          { label: 'Could', value: 'could' },
        ]),
        status: statusField('Status', [
          { label: 'Active', value: 'active' },
          { label: 'Pending', value: 'pending' },
          { label: 'Deprecated', value: 'deprecated' },
        ]),
        created: fields.date({ label: 'Created' }),
        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
        }),
      },
    }),

    // -----------------------------------------------------------------------
    // BDD — Behavior-Driven Development Documentation
    // -----------------------------------------------------------------------
    bdd: collection({
      label: 'BDD Documentation',
      slugField: 'title',
      path: '../docs/bdd/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),

    // -----------------------------------------------------------------------
    // DDD — Domain-Driven Design Documentation
    // -----------------------------------------------------------------------
    ddd: collection({
      label: 'DDD Documentation',
      slugField: 'title',
      path: '../docs/ddd/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),

    // -----------------------------------------------------------------------
    // Personas
    // -----------------------------------------------------------------------
    personas: collection({
      label: 'Personas',
      slugField: 'name',
      path: '../docs/personas/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        id: fields.text({
          label: 'ID',
          description: 'e.g. PER-001',
        }),
        name: fields.slug({
          name: { label: 'Name', validation: { isRequired: true } },
        }),
        tag: fields.text({ label: 'Tag', description: 'e.g. @PER-001' }),
        type: statusField('Type', [
          { label: 'Human', value: 'human' },
          { label: 'Bot', value: 'bot' },
        ]),
        status: statusField('Status', [
          { label: 'Approved', value: 'approved' },
          { label: 'Draft', value: 'draft' },
          { label: 'Deprecated', value: 'deprecated' },
        ]),
        archetype: statusField('Archetype', [
          { label: 'Creator', value: 'creator' },
          { label: 'Operator', value: 'operator' },
          { label: 'Consumer', value: 'consumer' },
          { label: 'Administrator', value: 'administrator' },
          { label: 'Integrator', value: 'integrator' },
        ]),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),

        goals: fields.array(
          fields.text({ label: 'Goal' }),
          { label: 'Goals', itemLabel: (props) => props.value || 'Goal' },
        ),
        pain_points: fields.array(
          fields.text({ label: 'Pain Point' }),
          { label: 'Pain Points', itemLabel: (props) => props.value || 'Pain Point' },
        ),
        behaviors: fields.array(
          fields.text({ label: 'Behavior' }),
          { label: 'Behaviors', itemLabel: (props) => props.value || 'Behavior' },
        ),

        typical_capabilities: fields.array(
          fields.text({ label: 'Capability ID' }),
          { label: 'Typical Capabilities', itemLabel: (props) => props.value || 'CAP' },
        ),

        technical_profile: fields.object({
          skill_level: statusField('Skill Level', [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ], 'intermediate'),
          integration_type: statusField('Integration Type', [
            { label: 'API', value: 'api' },
            { label: 'Web UI', value: 'web_ui' },
            { label: 'Mobile App', value: 'mobile_app' },
          ], 'api'),
          frequency: statusField('Frequency', [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ], 'daily'),
        }, { label: 'Technical Profile' }),

        related_stories: fields.array(
          fields.text({ label: 'User Story ID' }),
          { label: 'Related Stories', itemLabel: (props) => props.value || 'US' },
        ),
        related_personas: fields.array(
          fields.text({ label: 'Persona ID' }),
          { label: 'Related Personas', itemLabel: (props) => props.value || 'PER' },
        ),

        created: fields.text({ label: 'Created', description: 'YYYY-MM-DD' }),
        updated: fields.text({ label: 'Updated', description: 'YYYY-MM-DD' }),
        validated_by: fields.text({ label: 'Validated By' }),

        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),

    // -----------------------------------------------------------------------
    // User Stories
    // -----------------------------------------------------------------------
    userStories: collection({
      label: 'User Stories',
      slugField: 'title',
      path: '../docs/user-stories/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        id: fields.text({
          label: 'ID',
          description: 'e.g. US-001',
        }),
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        persona: fields.text({
          label: 'Persona',
          description: 'e.g. PER-001',
        }),
        status: statusField('Status', [
          { label: 'Planned', value: 'planned' },
          { label: 'Implemented', value: 'implemented' },
        ]),
        capabilities: fields.array(
          fields.text({ label: 'Capability ID' }),
          { label: 'Capabilities', itemLabel: (props) => props.value || 'CAP' },
        ),
        use_cases: fields.array(
          fields.text({ label: 'Use Case ID' }),
          { label: 'Use Cases', itemLabel: (props) => props.value || 'UC' },
        ),
        roadmap: fields.array(
          fields.text({ label: 'ROAD ID' }),
          { label: 'Roadmap Items', itemLabel: (props) => props.value || 'ROAD' },
        ),
        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),

    // -----------------------------------------------------------------------
    // Capabilities
    // -----------------------------------------------------------------------
    capabilities: collection({
      label: 'Capabilities',
      slugField: 'title',
      path: '../docs/capabilities/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        id: fields.text({
          label: 'ID',
          description: 'e.g. CAP-001',
        }),
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        category: fields.text({ label: 'Category' }),
        tag: fields.text({ label: 'Tag', description: 'e.g. @CAP-001' }),
        status: statusField('Status', [
          { label: 'Stable', value: 'stable' },
          { label: 'Planned', value: 'planned' },
        ]),
        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),

    // -----------------------------------------------------------------------
    // Plans
    // -----------------------------------------------------------------------
    plans: collection({
      label: 'Implementation Plans',
      slugField: 'title',
      path: '../docs/plans/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),

    // -----------------------------------------------------------------------
    // Agents
    // -----------------------------------------------------------------------
    agents: collection({
      label: 'Agent Documentation',
      slugField: 'title',
      path: '../docs/agents/*',
      format: { contentField: 'content' },
      schema: {
        ...extraFields,
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),
  },
});
