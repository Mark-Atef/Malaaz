// components/sections/About.tsx
import { useTranslations } from 'next-intl';
import styles from './About.module.css';

export default function About() {
  const t = useTranslations('about');

  return (
    <section className={`${styles.section} section`} id="about" aria-labelledby="about-heading">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
            <h2 id="about-heading" className={`${styles.title} reveal reveal-delay-1`}>
              {t('title')}
            </h2>
          </div>

          <div className={styles.right}>
            <p className={`${styles.story} reveal reveal-delay-1`}>{t('story')}</p>

            <div className={`${styles.pillars} reveal reveal-delay-2`}>
              <div className={styles.pillar}>
                <span className={styles.pillarLabel}>{t('visionLabel')}</span>
                <p className={styles.pillarText}>{t('vision')}</p>
              </div>
              <div className={styles.divider} aria-hidden="true" />
              <div className={styles.pillar}>
                <span className={styles.pillarLabel}>{t('missionLabel')}</span>
                <p className={styles.pillarText}>{t('mission')}</p>
              </div>
            </div>

            <div className={`${styles.team} reveal reveal-delay-3`}>
              <span className={styles.teamLabel}>{t('team')}</span>
              <div className={styles.teamAvatars} aria-label={t('team')}>
                {['M', 'A', 'K'].map((initial) => (
                  <div key={initial} className={styles.avatar} aria-label={initial}>
                    {initial}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}