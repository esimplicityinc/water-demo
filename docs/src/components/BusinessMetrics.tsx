import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from '../css/status.module.css';

interface MetricSummary {
  value: number;
  change: number;
  period: string;
}

interface DailyData {
  date: string;
  value: number;
}

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

interface MetricsData {
  summary: {
    registrations: MetricSummary;
    activeUsers: MetricSummary;
    transactions: MetricSummary;
    apiCalls: MetricSummary;
  };
  dailyActiveUsers: DailyData[];
  transactionVolume: DailyData[];
}

interface BusinessMetricsProps {
  metrics: MetricsData;
  okrs?: OKR[];
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getProgressClass(percent: number): string {
  if (percent >= 80) return styles.high;
  if (percent >= 50) return styles.medium;
  return styles.low;
}

const metricLabels = {
  registrations: 'Registrations',
  activeUsers: 'Active Users',
  transactions: 'Transactions',
  apiCalls: 'API Calls',
};

// Icons
const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export default function BusinessMetrics({ metrics, okrs = [] }: BusinessMetricsProps): JSX.Element {
  const chartData = metrics.dailyActiveUsers.map((d) => ({
    ...d,
    displayDate: formatDate(d.date),
  }));

  const transactionData = metrics.transactionVolume.map((d) => ({
    ...d,
    displayDate: formatDate(d.date),
  }));

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Platform Metrics & OKRs</h2>
        <select className={styles.filterSelect} defaultValue="30d">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Two Column Layout: Metrics | OKRs */}
      <div className={styles.twoColumnGrid}>
        {/* Left Column: Key Metrics */}
        <div className={styles.columnSection}>
          <div className={styles.columnTitle}>
            <TrendingIcon />
            Key Metrics
          </div>
          <div className={styles.metricsGrid}>
            {Object.entries(metrics.summary).map(([key, metric]) => (
              <div key={key} className={styles.metricCard}>
                <div className={styles.metricCardLabel}>
                  {metricLabels[key as keyof typeof metricLabels]}
                </div>
                <div className={styles.metricCardValue}>
                  {formatNumber(metric.value)}
                </div>
                <div
                  className={`${styles.metricCardChange} ${
                    metric.change >= 0 ? styles.positive : styles.negative
                  }`}
                >
                  {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: OKRs */}
        <div className={styles.columnSection}>
          <div className={styles.columnTitle}>
            <TargetIcon />
            Quarterly OKRs
          </div>
          <div className={styles.okrList}>
            {okrs.map((okr) => (
              <div key={okr.id} className={styles.okrItem}>
                <div className={styles.okrObjective}>{okr.objective}</div>
                <div className={styles.okrKeyResults}>
                  {okr.keyResults.map((kr, idx) => {
                    const percent = Math.min((kr.current / kr.target) * 100, 100);
                    return (
                      <div key={idx} className={styles.keyResult}>
                        <span className={styles.krLabel}>{kr.label}</span>
                        <div className={styles.krProgress}>
                          <div
                            className={`${styles.krProgressBar} ${getProgressClass(percent)}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className={styles.krValue}>
                          {Math.round(percent)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        {/* Daily Active Users Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Daily Active Users (30 days)</div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Users']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Volume Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Transaction Volume (7 days)</div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Transactions']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
