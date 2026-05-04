// components/sections/TheLab.tsx
import { useTranslations } from 'next-intl';
import { Flame, Ruler, Zap, Weight } from 'lucide-react';
import styles from './TheLab.module.css';

const tests = [
  { key: 'test1', Icon: Flame },
  { key: 'test2', Icon: Ruler },
  { key: 'test3', Icon: Zap },
  { key: 'test4', Icon: Weight },
] as const;

export default function TheLab() {
  const t = useTranslations('lab');

  return (
    <section className={`${styles.section} section`} id="lab" aria-labelledby="lab-heading">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
            <h2 id="lab-heading" className={`${styles.title} reveal reveal-delay-1`}>
              {t('title')}
            </h2>
            <p className={`${styles.sub} reveal reveal-delay-2`}>{t('subtitle')}</p>

            {/* ← opening tag was missing here — caused the build crash */}
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.cta} reveal reveal-delay-3`}
            >
              {t('cta')}
              <span className="icon-flip" aria-hidden="true">→</span>
            </a>
          </div>

          <div className={styles.right}>
            <ul className={styles.tests} aria-label="Quality tests we perform">
              {tests.map(({ key, Icon }, i) => (
                <li key={key} className={`${styles.testItem} reveal reveal-delay-${i + 1}`}>
                  <div className={styles.testIcon} aria-hidden="true">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className={styles.testLabel}>{t(key)}</span>
                  <span className={styles.testCheck} aria-hidden="true">✓</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}