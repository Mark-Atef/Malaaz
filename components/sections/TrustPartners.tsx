// cspell:ignore paymob valu valU sympl fawry instapay wamda bnpl
// components/sections/TrustPartners.tsx
//
// FIXES:
// - SVG aria-label now valid: added role="img" to all SVG elements
// - div[role="list"] replaced with <ul> (Biome useSemanticElements)
// - div[role="listitem"] replaced with <li> (Biome useSemanticElements)
// - cspell ignore comment suppresses brand name false positives

import { useTranslations } from 'next-intl';
import { Shield, Zap, Award } from 'lucide-react';
import styles from './TrustPartners.module.css';

// ─── Payment partner logo ─────────────────────────────────────────────────────
// FIX: role="img" makes aria-label valid on SVG.
// Without role="img", SVG implicit role is "graphics-document" which
// does not support aria-label per ARIA spec.

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
    <div className={styles.partnerLogo} title={label}>
      <svg
        viewBox={`0 0 ${width} 36`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width, height: 36 }}
        role="img"
        aria-label={label}
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

// ─── Press logo ───────────────────────────────────────────────────────────────

function PressLogo({ name, href = '#' }: { name: string; href?: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.pressLogo}
      aria-label={`${name} — press coverage`}
    >
      <span className={styles.pressLogoText}>{name}</span>
    </a>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.statPill}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRADER_COUNT = parseInt(
  process.env.NEXT_PUBLIC_TRADER_COUNT ?? '47',
  10
);

// FIX: as const array — used with <li> not div[role="listitem"]
const PAYMENT_PARTNERS = [
  { id: 'paymob',   name: 'Paymob',    label: 'Pay with Paymob',             width: 90  },
  { id: 'valu',     name: 'valU',      label: 'Installments via valU',       width: 72  },
  { id: 'sympl',    name: 'sympl',     label: 'Buy now pay later via Sympl', width: 78  },
  { id: 'fawry',    name: 'Fawry',    label: 'Pay with Fawry',              width: 80  },
  { id: 'instapay', name: 'InstaPay', label: 'Pay with InstaPay',           width: 102 },
] as const;

const PRESS_COVERAGE = [
  { name: 'Wamda',            href: 'https://wamda.com'                       },
  { name: 'Startup Scene EG', href: 'https://startupsceneme.com'              },
  { name: 'Flat6Labs',        href: 'https://flat6labs.com'                   },
  { name: 'AUC Venture Lab',  href: 'https://venturelab.aucegypt.edu'         },
  { name: 'Egypt Tech',       href: '#'                                       },
] as const;

const TRUST_STATS = [
  { value: `${TRADER_COUNT}+`, label: 'Verified Traders' },
  { value: '48h',              label: 'Avg. Response Time' },
  { value: '100%',             label: 'Quality Tested' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrustPartners() {
  const t = useTranslations('partners');

  return (
    <section className={styles.section} aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="sr-only">Trust &amp; Partners</h2>
      <div className="container">

        {/* ── Row 1: Live stats ── */}
        <div className={styles.statsRow}>
          <div className={styles.liveChip}>
            <span className={styles.liveDot} aria-hidden="true" />
            <span className={styles.liveText}>
              <strong>{TRADER_COUNT}</strong>
              {' '}{t('traderCount')}
            </span>
            <span className={styles.liveNote}>{t('traderCountNote')}</span>
          </div>

          {/* FIX: role="list" on div → aria is implicit on <ul> */}
          <ul className={styles.statPills} aria-label="Platform stats">
            {TRUST_STATS.map((s) => (
              // FIX: <li> not div[role="listitem"]
              <li key={s.label} className={styles.statPillItem}>
                <StatPill value={s.value} label={s.label} />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Row 2: Payment partners ── */}
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <Shield size={13} strokeWidth={1.75} aria-hidden="true" />
            <span>{t('paymentEyebrow')}</span>
          </div>

          {/* FIX: <ul> not div[role="list"] */}
          <ul
            className={styles.partners}
            aria-label="Accepted payment methods"
          >
            {PAYMENT_PARTNERS.map(({ id, name, label, width }) => (
              // FIX: <li> not div[role="listitem"]
              <li key={id}>
                <PartnerLogo name={name} label={label} width={width} />
              </li>
            ))}
          </ul>

          <div className={styles.bnplChip}>
            <Zap size={12} strokeWidth={2} aria-hidden="true" />
            <span>{t('paymentSubtitle')}</span>
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Row 3: Press coverage ── */}
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <Award size={13} strokeWidth={1.75} aria-hidden="true" />
            <span>{t('pressEyebrow')}</span>
          </div>

          {/* FIX: <ul> not div[role="list"] */}
          <ul
            className={styles.pressRow}
            aria-label="Press coverage"
          >
            {PRESS_COVERAGE.map(({ name, href }) => (
              // FIX: <li> not div[role="listitem"]
              <li key={name}>
                <PressLogo name={name} href={href} />
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}