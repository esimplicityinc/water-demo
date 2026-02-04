import React, { useState, useMemo } from 'react';
import Link from '@docusaurus/Link';
import styles from '../css/status.module.css';

interface Deployment {
  id: string;
  date: string;
  version: string;
  commits: number;
  author: string;
  status: string;
}

interface ChangeEntry {
  changeId: string;
  roadId?: string;
  title: string;
  date: string;
  total?: number;
  passed?: number;
}

interface ChangeTimelineProps {
  deployments: Deployment[];
  changes: ChangeEntry[];
}

type TimelineItem = {
  id: string;
  type: 'deployment' | 'change';
  date: Date;
  title: string;
  meta: string;
  link?: string;
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function isWithinDays(date: Date, days: number): boolean {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}

export default function ChangeTimeline({
  deployments,
  changes,
}: ChangeTimelineProps): JSX.Element {
  const [filter, setFilter] = useState<'7d' | '30d' | 'all'>('7d');

  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    // Add deployments
    deployments.forEach((d) => {
      items.push({
        id: d.id,
        type: 'deployment',
        date: new Date(d.date),
        title: `${d.version} deployed`,
        meta: `${d.commits} commit${d.commits > 1 ? 's' : ''}`,
      });
    });

    // Add changes
    changes.forEach((c) => {
      if (c.date) {
        items.push({
          id: c.changeId,
          type: 'change',
          date: new Date(c.date),
          title: `${c.changeId}: ${c.title}`,
          meta: c.total ? `${c.passed || 0}/${c.total} scenarios passing` : 'No test data',
          link: `/docs/changes/${c.changeId}`,
        });
      }
    });

    // Sort by date descending
    items.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Filter by time range
    const filterDays = filter === '7d' ? 7 : filter === '30d' ? 30 : Infinity;
    return items.filter((item) => isWithinDays(item.date, filterDays));
  }, [deployments, changes, filter]);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Recent Changes & Deployments</h2>
        <select
          className={styles.filterSelect}
          value={filter}
          onChange={(e) => setFilter(e.target.value as '7d' | '30d' | 'all')}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div className={styles.timeline}>
        {timelineItems.length === 0 ? (
          <div className={styles.timelineEntry}>
            <div className={styles.timelineContent}>
              <div className={styles.timelineTitle}>No changes in this period</div>
            </div>
          </div>
        ) : (
          timelineItems.map((item) => {
            const isRecent = isWithinDays(item.date, 7);
            return (
              <div key={item.id} className={styles.timelineEntry}>
                <span className={styles.timelineDate}>{formatDate(item.date)}</span>
                <span
                  className={`${styles.timelineDot} ${styles[item.type]} ${
                    !isRecent ? styles.old : ''
                  }`}
                />
                <div className={styles.timelineContent}>
                  {item.link ? (
                    <Link to={item.link} className={styles.timelineTitle}>
                      {item.title}
                    </Link>
                  ) : (
                    <div className={styles.timelineTitle}>{item.title}</div>
                  )}
                  <div className={styles.timelineMeta}>
                    <span>{item.meta}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
