import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// SVG Icon Components
const WaterTrackingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
  </svg>
);

const ArchitectureIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4 8 4v14" />
    <path d="M9 21v-6h6v6" />
    <path d="M10 9h4" />
    <path d="M10 13h4" />
  </svg>
);

const BDDIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/ddd/domain-overview">
            Explore DDD
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/roadmap">
            View Roadmap
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/agents/bdd-loop">
            BDD Workflow
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="AquaTrack - Municipal Water Infrastructure Management System">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className={clsx('col col--4')}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <WaterTrackingIcon />
                  </div>
                  <h3>Water Usage Tracking</h3>
                  <p>
                    Monitor consumption, manage meter readings, and automate
                    billing for municipal utilities and water districts.
                  </p>
                </div>
              </div>
              <div className={clsx('col col--4')}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <ArchitectureIcon />
                  </div>
                  <h3>DDD Architecture</h3>
                  <p>
                    Built with bounded contexts, aggregates, and domain events
                    for accurate billing, service management, and compliance.
                  </p>
                </div>
              </div>
              <div className={clsx('col col--4')}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <BDDIcon />
                  </div>
                  <h3>BDD-Driven Development</h3>
                  <p>
                    Comprehensive BDD scenarios validate water usage calculations,
                    payment processing, and service request workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
