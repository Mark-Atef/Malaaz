// components/sections/MarketNumbers.tsx
import { useTranslations } from 'next-intl';
import styles from './MarketNumbers.module.css';

// Two groups: homeowner pain stats + trader opportunity stats
// WHY split: single grid of 4 mixed stats felt abstract.
// Two labelled groups create a clear "this applies to you" reading path
// for both audiences who arrive at the site.
const homeownerStats = ['h1', 'h2', 'h3'] as const;
const traderStats = ['t1', 't2', 't3'] as const;

export default function MarketNumbers() {
  const t = useTranslations('numbers');

  return (
    <section
      className={`${styles.section} section`}
      id="numbers"
      aria-labelledby="numbers-heading"
    >
      <div className="container">
        <div className={styles.header}>
          <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
          <h2
            id="numbers-heading"
            className={`${styles.title} reveal reveal-delay-1`}
          >
            {t('title')}
          </h2>
          <p className={`${styles.subtitle} reveal reveal-delay-2`}>
            {t('subtitle')}
          </p>
        </div>

        {/* Homeowner stats */}
        <div className={`${styles.groupWrap} reveal reveal-delay-2`}>
          <p className={styles.groupLabel}>{t('homeownerLabel')}</p>
          <ul className={styles.grid}>
            {homeownerStats.map((key, i) => (
              <li
                key={key}
                className={`${styles.card} reveal reveal-delay-${i + 1}`}
              >
                <span className={styles.value}>{t(`${key}Value`)}</span>
                <span className={styles.label}>{t(`${key}Label`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trader stats */}
        <div className={`${styles.groupWrap} reveal reveal-delay-3`}>
          <p className={styles.groupLabel}>{t('traderLabel')}</p>
          <ul className={styles.grid}>
            {traderStats.map((key, i) => (
              <li
                key={key}
                className={`${styles.card} ${styles.cardLight} reveal reveal-delay-${i + 1}`}
              >
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