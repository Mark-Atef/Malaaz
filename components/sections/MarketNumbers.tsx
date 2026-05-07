// Content from Startup Documentation:
// Homeowner side: 3M+ unfinished apartments, 70% distrust contractors, 30% material waste
// Trader side: EGP 200B annual market, 200+ suppliers with no digital channel, 500 EGP/mo POS value
import { useTranslations } from 'next-intl';
import styles from './MarketNumbers.module.css';

const homeownerStats = ['h1', 'h2', 'h3'] as const;
const traderStats    = ['t1', 't2', 't3'] as const;

export default function MarketNumbers() {
  const t = useTranslations('numbers');

  return (
    <section
      className={`${styles.section} section`}
      id="numbers"
      aria-labelledby="numbers-heading"
    >
      <div className="container">
        <header className={styles.header}>
          <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
          <h2 id="numbers-heading" className={`${styles.title} reveal reveal-delay-1`}>
            {t('title')}
          </h2>
          <p className={`${styles.subtitle} reveal reveal-delay-2`}>{t('subtitle')}</p>
        </header>

        {/* ── Homeowner pain stats ── */}
        <div className={`${styles.groupWrap} reveal reveal-delay-2`}>
          <p className={styles.groupLabel} aria-hidden="true">{t('homeownerLabel')}</p>
          <ul className={styles.grid} aria-label={t('homeownerLabel')}>
            {homeownerStats.map((key, i) => (
              <li key={key} className={`${styles.card} reveal reveal-delay-${i + 1}`}>
                <span className={styles.value}>{t(`${key}Value`)}</span>
                <span className={styles.label}>{t(`${key}Label`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Trader opportunity stats ── */}
        <div className={`${styles.groupWrap} reveal reveal-delay-3`}>
          <p className={styles.groupLabel} aria-hidden="true">{t('traderLabel')}</p>
          <ul className={styles.grid} aria-label={t('traderLabel')}>
            {traderStats.map((key, i) => (
              <li key={key} className={`${styles.card} ${styles.cardLight} reveal reveal-delay-${i + 1}`}>
                <span className={styles.value}>{t(`${key}Value`)}</span>
                <span className={styles.label}>{t(`${key}Label`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}