// components/sections/ForTraders.tsx
import { useTranslations } from 'next-intl';
import styles from './ForTraders.module.css';

export default function ForTraders() {
  const t = useTranslations('traders');

  return (
    <section className={`${styles.section} section`} id="for-traders" aria-labelledby="traders-heading">
      <div className="container">
        <div className={styles.header}>
          <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
          <h2 id="traders-heading" className={`${styles.title} reveal reveal-delay-1`}>
            {t('title')}
          </h2>
        </div>

        <div className={styles.grid}>
          {/* Big traders */}
          <article className={`${styles.card} ${styles.cardDark} reveal reveal-delay-1`} aria-labelledby="traders-big">
            <div className={styles.cardBadge}>01</div>
            <h3 id="traders-big" className={styles.cardTitle}>{t('bigTitle')}</h3>
            <p className={styles.cardDesc}>{t('bigDesc')}</p>
            <a href="mailto:hello@malaaz.com" className={styles.cardCtaDark}>
              {t('bigCta')}
            </a>
          </article>

          {/* Small traders */}
          <article className={`${styles.card} ${styles.cardLight} reveal reveal-delay-2`} aria-labelledby="traders-small">
            <div className={styles.cardBadgeLight}>02</div>
            <div className={styles.priceBadge}>{t('smallBadge')}</div>
            <h3 id="traders-small" className={styles.cardTitleDark}>{t('smallTitle')}</h3>
            <p className={styles.cardDescDark}>{t('smallDesc')}</p>
            <a href="#early-access" className={styles.cardCtaGold}>
              {t('smallCta')}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}