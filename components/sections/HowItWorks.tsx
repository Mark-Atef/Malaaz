// components/sections/HowItWorks.tsx
import { useTranslations } from 'next-intl';
import styles from './HowItWorks.module.css';

const steps = ['step1', 'step2', 'step3'] as const;

export default function HowItWorks() {
  const t = useTranslations('howItWorks');

  return (
    <section className={`${styles.section} section`} id="how-it-works" aria-labelledby="how-heading">
      <div className="container">
        <div className={styles.header}>
          <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
          <h2 id="how-heading" className={`${styles.title} reveal reveal-delay-1`}>
            {t('title')}
          </h2>
        </div>

        <ol className={styles.steps} aria-label={t('eyebrow')}>
          {steps.map((step, i) => (
            <li key={step} className={`${styles.step} reveal reveal-delay-${i + 1}`}>
              <div className={styles.stepNum} aria-hidden="true">{t(`${step}Num`)}</div>
              <div className={styles.stepConnector} aria-hidden="true" />
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{t(`${step}Title`)}</h3>
                <p className={styles.stepDesc}>{t(`${step}Desc`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}