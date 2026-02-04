import React from 'react';
import styles from '../css/status.module.css';

interface Incident {
  id: string;
  title: string;
  status: 'resolved' | 'investigating' | 'ongoing';
  severity: 'minor' | 'major' | 'critical' | 'maintenance';
  startedAt: string;
  resolvedAt?: string;
  affectedServices: string[];
  summary: string;
}

interface IncidentHistoryProps {
  incidents: Incident[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function calculateDuration(start: string, end?: string): string {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    return `${diffMins} min`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'resolved':
      return 'Resolved';
    case 'investigating':
      return 'Investigating';
    case 'ongoing':
      return 'Ongoing';
    default:
      return status;
  }
}

export default function IncidentHistory({
  incidents,
}: IncidentHistoryProps): JSX.Element {
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const resolvedIncidents = incidents.filter((i) => i.status === 'resolved');

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Incident History</h2>
      </div>

      {activeIncidents.length > 0 && (
        <div className={styles.incidentsList} style={{ marginBottom: '1rem' }}>
          {activeIncidents.map((incident) => (
            <div key={incident.id} className={styles.incidentEntry}>
              <div className={styles.incidentHeader}>
                <span
                  className={`${styles.incidentBadge} ${styles[incident.status]}`}
                >
                  {getStatusLabel(incident.status)}
                </span>
                <span className={styles.incidentTitle}>{incident.title}</span>
                <span className={styles.incidentDate}>
                  {formatDate(incident.startedAt)}
                </span>
                <span className={styles.incidentDuration}>
                  {calculateDuration(incident.startedAt)}
                </span>
              </div>
              <div className={styles.incidentBody}>
                <span
                  className={`${styles.incidentSeverity} ${
                    styles[incident.severity]
                  }`}
                >
                  {incident.severity}
                </span>
                <span className={styles.incidentSummary}>{incident.summary}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.incidentsList}>
        {resolvedIncidents.length === 0 ? (
          <div className={styles.incidentEntry}>
            <div className={styles.incidentHeader}>
              <span className={styles.incidentTitle}>
                No incidents reported in the last 90 days
              </span>
            </div>
          </div>
        ) : (
          resolvedIncidents.map((incident) => (
            <div key={incident.id} className={styles.incidentEntry}>
              <div className={styles.incidentHeader}>
                <span
                  className={`${styles.incidentBadge} ${styles[incident.status]}`}
                >
                  {getStatusLabel(incident.status)}
                </span>
                <span className={styles.incidentTitle}>{incident.title}</span>
                <span className={styles.incidentDate}>
                  {formatDate(incident.startedAt)}
                </span>
                <span className={styles.incidentDuration}>
                  {calculateDuration(incident.startedAt, incident.resolvedAt)}
                </span>
              </div>
              <div className={styles.incidentBody}>
                <span
                  className={`${styles.incidentSeverity} ${
                    styles[incident.severity]
                  }`}
                >
                  {incident.severity}
                </span>
                <span className={styles.incidentSummary}>{incident.summary}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
