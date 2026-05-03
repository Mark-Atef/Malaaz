// components/sections/MarketNumbers.tsx
import { useTranslations } from 'next-intl';
import styles from './MarketNumbers.module.css';

const stats = ['stat1', 'stat2', 'stat3', 'stat4'] as const;

export default function MarketNumbers() {
  const t = useTranslations('numbers');

  return (
    <section className={`${styles.section} section`} id="numbers" aria-labelledby="numbers-heading">
      <div className="container">
        <h2 id="numbers-heading" className={`${styles.title} reveal`}>
          {t('title')}
        </h2>
        <div className={styles.grid} role="list">
          {stats.map((key, i) => (
            <article
              key={key}
              className={`${styles.card} reveal reveal-delay-${i + 1}`}
              role="listitem"
            >
              <span className={styles.value}>{t(`${key}Value`)}</span>
              <span className={styles.label}>{t(`${key}Label`)}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}