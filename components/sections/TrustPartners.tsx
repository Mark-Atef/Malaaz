// components/sections/TrustPartners.tsx
// Trust section: payment partners + live trader count + press logos.
// Placed after HowItWorks and before CostSimulator — peak credibility position.
// Inspired by Stripe's social proof section: dense, factual, no fluff.

import { useTranslations } from 'next-intl';
import { Shield, Zap, Award } from 'lucide-react';
import styles from './TrustPartners.module.css';

// ─── Payment partner logos ─────────────────────────────────────────────────

function PartnerLogo({
  name,
  label,
  width = 100,
}: {
  name: string;
  label: string;
  width?: number;
}) {
  return (
    <div className={styles.partnerLogo} aria-label={label} title={label}>
      <svg
        viewBox={`0 0 ${width} 36`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width, height: 36 }}
        aria-hidden="true"
      >
        <text
          x={width / 2}
          y="24"
          textAnchor="middle"
          fontFamily="DM Sans, system-ui, sans-serif"
          fontSize="15"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="0.02em"
        >
          {name}
        </text>
      </svg>
    </div>
  );
}

// ─── Press logo ────────────────────────────────────────────────────────────

function PressLogo({ name, href = '#' }: { name: string; href?: string }) {
  return (
    <a       href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.pressLogo}
      aria-label={`${name} — press coverage`}
    >
      <span className={styles.pressLogoText}>{name}</span>
    </a>
  );
}

// ─── Stat pill ─────────────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.statPill}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────

const TRADER_COUNT = parseInt(process.env.NEXT_PUBLIC_TRADER_COUNT ?? '47', 10);

const PAYMENT_PARTNERS = [
  { id: 'paymob', name: 'Paymob',   label: 'Pay with Paymob',   width: 90 },
  { id: 'valu',   name: 'valU',     label: 'Installments via valU',   width: 72 },
  { id: 'sympl',  name: 'sympl',    label: 'Buy now pay later via Sympl', width: 78 },
  { id: 'fawry',  name: 'Fawry',   label: 'Pay with Fawry',    width: 80 },
  { id: 'instapay', name: 'InstaPay', label: 'Pay with InstaPay', width: 102 },
] as const;

const PRESS_COVERAGE = [
  { name: 'Wamda',            href: 'https://wamda.com' },
  { name: 'Startup Scene EG', href: 'https://startupsceneme.com' },
  { name: 'Flat6Labs',        href: 'https://flat6labs.com' },
  { name: 'AUC Venture Lab',  href: 'https://venturelab.aucegypt.edu' },
  { name: 'Egypt Tech',       href: '#' },
] as const;

const TRUST_STATS = [
  { value: TRADER_COUNT.toString(), label: 'Verified Traders' },
  { value: '48h',                   label: 'Avg. Response Time' },
  { value: '100%',                  label: 'Quality Tested' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────

export default function TrustPartners() {
  const t = useTranslations('partners');

  return (
    <section className={styles.section} aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="sr-only">Trust & Partners</h2>
      <div className="container">

        {/* ── Row 1: Stats + Live trader badge ── */}
        <div className={styles.statsRow}>
          <div className={styles.liveChip}>
            <span className={styles.liveDot} aria-hidden="true" />
            <span className={styles.liveText}>
              <strong>{TRADER_COUNT}</strong>
              {' '}{t('traderCount')}
            </span>
            <span className={styles.liveNote}>{t('traderCountNote')}</span>
          </div>

          <div className={styles.statPills} aria-label="Platform stats">
            {TRUST_STATS.map((s) => (
              <StatPill key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Row 2: Payment partners ── */}
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <Shield size={13} strokeWidth={1.75} aria-hidden="true" />
            <span>{t('paymentEyebrow')}</span>
          </div>
          <div
            className={styles.partners}
            role="list"
            aria-label="Accepted payment methods"
          >
            {PAYMENT_PARTNERS.map(({ id, name, label, width }) => (
              <div key={id} role="listitem">
                <PartnerLogo name={name} label={label} width={width} />
              </div>
            ))}
          </div>
          <div className={styles.bnplChip}>
            <Zap size={12} strokeWidth={2} aria-hidden="true" />
            <span>{t('paymentSubtitle')}</span>
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Row 3: Press ── */}
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <Award size={13} strokeWidth={1.75} aria-hidden="true" />
            <span>{t('pressEyebrow')}</span>
          </div>
          <div
            className={styles.pressRow}
            role="list"
            aria-label="Press coverage"
          >
            {PRESS_COVERAGE.map(({ name, href }) => (
              <div key={name} role="listitem">
                <PressLogo name={name} href={href} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}