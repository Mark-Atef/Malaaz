// components/sections/TrustPartners.tsx
// FIX: Removed unused `TrendingUp` import.

import { useTranslations } from 'next-intl';
import { Shield } from 'lucide-react';
import styles from './TrustPartners.module.css';

// ─── Payment partner logos (replace SVG content with real brand assets) ──────

function PaymobLogo() {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Paymob"
      role="img"
    >
      <rect width="120" height="40" rx="6" fill="currentColor" fillOpacity="0.06" />
      <text
        x="60"
        y="26"
        textAnchor="middle"
        fontFamily="DM Sans, system-ui"
        fontSize="14"
        fontWeight="700"
        fill="currentColor"
      >
        Paymob
      </text>
    </svg>
  );
}

function ValULogo() {
  return (
    <svg
      viewBox="0 0 90 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="valU"
      role="img"
    >
      <rect width="90" height="40" rx="6" fill="currentColor" fillOpacity="0.06" />
      <text
        x="45"
        y="26"
        textAnchor="middle"
        fontFamily="DM Sans, system-ui"
        fontSize="14"
        fontWeight="700"
        fill="currentColor"
      >
        valU
      </text>
    </svg>
  );
}

function SymplLogo() {
  return (
    <svg
      viewBox="0 0 90 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sympl"
      role="img"
    >
      <rect width="90" height="40" rx="6" fill="currentColor" fillOpacity="0.06" />
      <text
        x="45"
        y="26"
        textAnchor="middle"
        fontFamily="DM Sans, system-ui"
        fontSize="14"
        fontWeight="700"
        fill="currentColor"
      >
        sympl
      </text>
    </svg>
  );
}

function FawryLogo() {
  return (
    <svg
      viewBox="0 0 90 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Fawry"
      role="img"
    >
      <rect width="90" height="40" rx="6" fill="currentColor" fillOpacity="0.06" />
      <text
        x="45"
        y="26"
        textAnchor="middle"
        fontFamily="DM Sans, system-ui"
        fontSize="14"
        fontWeight="700"
        fill="currentColor"
      >
        Fawry
      </text>
    </svg>
  );
}

// ─── Press logo (styled placeholder until real assets are available) ──────────

function PressLogo({ name }: { name: string }) {
  return (
    <div className={styles.pressLogo} aria-label={name}>
      <span className={styles.pressLogoText}>{name}</span>
    </div>
  );
}

// ─── Data — update TRADER_COUNT via NEXT_PUBLIC_TRADER_COUNT env var ──────────

const TRADER_COUNT = parseInt(
  process.env.NEXT_PUBLIC_TRADER_COUNT ?? '47',
  10
);

const PAYMENT_PARTNERS = [
  { id: 'paymob', Logo: PaymobLogo },
  { id: 'valu',   Logo: ValULogo },
  { id: 'sympl',  Logo: SymplLogo },
  { id: 'fawry',  Logo: FawryLogo },
] as const;

// Replace with real press outlet names as coverage is secured
const PRESS_NAMES = [
  'Wamda',
  'Startup Scene EG',
  'Flat6Labs',
  'AUC Venture Lab',
  'Egypt Tech',
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function TrustPartners() {
  const t = useTranslations('partners');

  return (
    <section className={styles.section} aria-labelledby="partners-heading">
      <div className="container">

        {/* ── Live trader count badge ── */}
        <div className={styles.countBadge}>
          <div className={styles.countDot} aria-hidden="true" />
          <p className={styles.countText}>
            <span className={styles.countNum}>{TRADER_COUNT}</span>
            {' '}
            {t('traderCount')}
          </p>
          <span className={styles.countNote}>{t('traderCountNote')}</span>
        </div>

        {/* ── Payment partners ── */}
        <div className={styles.block}>
          <p className={styles.blockEyebrow}>{t('paymentEyebrow')}</p>

          <div
            className={styles.paymentRow}
            role="list"
            aria-label={t('paymentTitle')}
          >
            {PAYMENT_PARTNERS.map(({ id, Logo }) => (
              <div key={id} className={styles.paymentItem} role="listitem">
                <Logo />
              </div>
            ))}
          </div>

          <div className={styles.paymentNote}>
            <Shield size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>{t('paymentSubtitle')}</span>
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Press logos ── */}
        <div className={styles.block}>
          <p className={styles.blockEyebrow}>{t('pressEyebrow')}</p>
          <div
            className={styles.pressRow}
            role="list"
            aria-label={t('pressTitle')}
          >
            {PRESS_NAMES.map((name) => (
              <div key={name} role="listitem">
                <PressLogo name={name} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}