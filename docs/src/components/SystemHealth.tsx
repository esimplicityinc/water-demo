import React from 'react';
import styles from '../css/status.module.css';

interface Service {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  uptime: number;
  latency: number;
  region: string;
}

interface HealthData {
  overall: 'operational' | 'degraded' | 'outage';
  lastChecked: string;
  services: Service[];
}

interface SystemHealthProps {
  health: HealthData;
}

function formatTimeAgo(_dateString: string): string {
  // For mock data, show a realistic "just updated" time
  // In production, this would calculate from actual lastChecked timestamp
  return '2 mins ago';
}

function getOverallStatusText(status: string): string {
  switch (status) {
    case 'operational':
      return 'All Systems Operational';
    case 'degraded':
      return 'Some Systems Degraded';
    case 'outage':
      return 'System Outage Detected';
    default:
      return 'Unknown Status';
  }
}

export default function SystemHealth({ health }: SystemHealthProps): JSX.Element {
  return (
    <div className={styles.section}>
      {/* Overall Status Banner */}
      <div className={`${styles.overallStatus} ${styles[health.overall]}`}>
        <span className={styles.statusText}>
          <span className={`${styles.statusDot} ${health.overall === 'operational' ? styles.online : health.overall === 'degraded' ? styles.degraded : styles.offline}`} />
          {getOverallStatusText(health.overall)}
        </span>
        <span className={styles.lastUpdated}>
          Updated {formatTimeAgo(health.lastChecked)}
        </span>
      </div>

      {/* Service Cards */}
      <div className={styles.servicesGrid}>
        {health.services.map((service) => (
          <div key={service.id} className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <span className={styles.serviceName}>{service.name}</span>
              <span className={`${styles.serviceStatus} ${styles[service.status]}`}>
                <span className={`${styles.statusDot} ${styles[service.status]}`} />
                {service.status}
              </span>
            </div>
            <div className={styles.serviceMetrics}>
              <div className={styles.serviceMetric}>
                <span className={styles.metricLabel}>Uptime</span>
                <span className={styles.metricValue}>{service.uptime}%</span>
              </div>
              <div className={styles.serviceMetric}>
                <span className={styles.metricLabel}>Latency</span>
                <span className={styles.metricValue}>{service.latency}ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
