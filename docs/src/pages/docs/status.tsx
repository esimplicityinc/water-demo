import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import SystemHealth from '../../components/SystemHealth';
import BusinessMetrics from '../../components/BusinessMetrics';
import ChangeTimeline from '../../components/ChangeTimeline';
import IncidentHistory from '../../components/IncidentHistory';
import styles from '../../css/status.module.css';

interface KeyResult {
  label: string;
  current: number;
  target: number;
  unit: string;
}

interface OKR {
  id: string;
  objective: string;
  keyResults: KeyResult[];
}

interface StatusData {
  health: {
    overall: 'operational' | 'degraded' | 'outage';
    lastChecked: string;
    services: Array<{
      id: string;
      name: string;
      status: 'online' | 'degraded' | 'offline';
      uptime: number;
      latency: number;
      region: string;
    }>;
  };
  deployments: Array<{
    id: string;
    date: string;
    version: string;
    commits: number;
    author: string;
    status: string;
  }>;
  incidents: Array<{
    id: string;
    title: string;
    status: 'resolved' | 'investigating' | 'ongoing';
    severity: 'minor' | 'major' | 'critical' | 'maintenance';
    startedAt: string;
    resolvedAt?: string;
    affectedServices: string[];
    summary: string;
  }>;
  metrics: {
    summary: {
      registrations: { value: number; change: number; period: string };
      activeUsers: { value: number; change: number; period: string };
      transactions: { value: number; change: number; period: string };
      apiCalls: { value: number; change: number; period: string };
    };
    dailyActiveUsers: Array<{ date: string; value: number }>;
    transactionVolume: Array<{ date: string; value: number }>;
  };
  okrs: OKR[];
}

interface BDDData {
  tests: Array<{
    changeId: string;
    roadId?: string;
    title: string;
    date: string;
    total?: number;
    passed?: number;
  }>;
}

// Icons
const ActivityIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const sidebarItems = [
  { id: 'health', label: 'System Health', icon: HeartIcon },
  { id: 'metrics', label: 'Metrics & OKRs', icon: ChartIcon },
  { id: 'changes', label: 'Recent Changes', icon: ClockIcon },
  { id: 'incidents', label: 'Incident History', icon: AlertIcon },
];

export default function StatusPage(): JSX.Element {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [bddData, setBddData] = useState<BDDData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('health');

  useEffect(() => {
    async function loadData() {
      try {
        const [statusResponse, bddResponse] = await Promise.all([
          fetch('/status-data.json'),
          fetch('/bdd-data.json'),
        ]);

        if (!statusResponse.ok) {
          throw new Error('Failed to load status data');
        }

        const status = await statusResponse.json();
        setStatusData(status);

        if (bddResponse.ok) {
          const bdd = await bddResponse.json();
          setBddData(bdd);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = sidebarItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <Layout title="System Status" description="PrimaDemo system status and metrics">
        <div className={styles.statusPageWrapper}>
          <div className={styles.statusPage}>
            <div className={styles.loading}>Loading system status...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !statusData) {
    return (
      <Layout title="System Status" description="PrimaDemo system status and metrics">
        <div className={styles.statusPageWrapper}>
          <div className={styles.statusPage}>
            <div className={styles.loading}>
              Error loading status: {error || 'Unknown error'}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="System Status" description="PrimaDemo system status and metrics">
      <div className={styles.statusPageWrapper}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>On this page</div>
          <nav>
            <ul className={styles.sidebarNav}>
              {sidebarItems.map((item) => (
                <li key={item.id} className={styles.sidebarItem}>
                  <a
                    href={`#${item.id}`}
                    className={`${styles.sidebarLink} ${
                      activeSection === item.id ? styles.active : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                  >
                    <item.icon />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.statusPage}>
          <h1 className={styles.pageTitle}>
            <ActivityIcon />
            System Status
          </h1>
          <p className={styles.pageSubtitle}>
            Real-time health, metrics, and change history for PrimaDemo platform
          </p>

          <section id="health">
            <SystemHealth health={statusData.health} />
          </section>

          <hr className={styles.divider} />

          <section id="metrics">
            <BusinessMetrics metrics={statusData.metrics} okrs={statusData.okrs} />
          </section>

          <hr className={styles.divider} />

          <section id="changes">
            <ChangeTimeline
              deployments={statusData.deployments}
              changes={bddData?.tests || []}
            />
          </section>

          <hr className={styles.divider} />

          <section id="incidents">
            <IncidentHistory incidents={statusData.incidents} />
          </section>
        </main>
      </div>
    </Layout>
  );
}
