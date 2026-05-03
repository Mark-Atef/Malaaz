// components/sections/Problem.tsx
import { useTranslations } from 'next-intl';
import { ShieldAlert, Brain, TrendingDown, DollarSign } from 'lucide-react';
import styles from './Problem.module.css';

const cards = [
  { key: 'card1', Icon: ShieldAlert },
  { key: 'card2', Icon: Brain },
  { key: 'card3', Icon: TrendingDown },
  { key: 'card4', Icon: DollarSign },
] as const;

export default function Problem() {
  const t = useTranslations('problem');

  return (
    <section className={`${styles.section} section`} id="problem" aria-labelledby="problem-heading">
      <div className="container">
        <div className={styles.header}>
          <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
          <h2 id="problem-heading" className={`${styles.title} reveal reveal-delay-1`}>
            {t('title')}
          </h2>
          <p className={`${styles.subtitle} reveal reveal-delay-2`}>{t('subtitle')}</p>
        </div>

        <div className={styles.grid} role="list">
          {cards.map(({ key, Icon }, i) => (
            <article
              key={key}
              className={`${styles.card} reveal reveal-delay-${i + 1}`}
              role="listitem"
              aria-labelledby={`problem-${key}-title`}
            >
              <div className={styles.iconWrap} aria-hidden="true">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <h3 id={`problem-${key}-title`} className={styles.cardTitle}>
                {t(`${key}Title`)}
              </h3>
              <p className={styles.cardDesc}>{t(`${key}Desc`)}</p>
              <div className={styles.solution}>
                <span className={styles.solutionDot} aria-hidden="true" />
                <p className={styles.solutionText}>{t(`${key}Solution`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}