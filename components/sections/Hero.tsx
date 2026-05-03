// components/sections/Hero.tsx
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import styles from './Hero.module.css';

export default function Hero() {
    const t = useTranslations('hero');
    const locale = useLocale();

    return (
        <section className={styles.hero} id="hero" aria-labelledby="hero-heading">
            {/* Background grain overlay */}
            <div className={styles.grain} aria-hidden="true" />

            {/* Decorative gold orb */}
            <div className={styles.orb} aria-hidden="true" />

            <div className={`container ${styles.content}`}>
                {/* Eyebrow */}
                <div className={`${styles.eyebrow} reveal`}>
                    <span className={styles.eyebrowDot} />
                    {t('eyebrow')}
                </div>

                {/* Headline */}
                <h1 id="hero-heading" className={`${styles.headline} reveal reveal-delay-1`}>
                    {t('headline').split('\n').map((line, i) => (
                        <span key={i} className={styles.headlineLine}>
                            {i === 1 ? <em className={styles.headlineAccent}>{line}</em> : line}
                        </span>
                    ))}
                </h1>

                {/* Subheadline */}
                <p className={`${styles.sub} reveal reveal-delay-2`}>
                    {t('subheadline')}
                </p>

                {/* CTAs */}
                <div className={`${styles.ctas} reveal reveal-delay-3`}>
                    <a href={`/${locale}#early-access`} className={styles.ctaPrimary}>
                        {t('ctaPrimary')}
                    </a>
                    <a href="https://chat.whatsapp.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.ctaSecondary}
                    >

                        {t('ctaSecondary')}
                    </a>
                </div>

                {/* App badges */}
                <div className={`${styles.badges} reveal reveal-delay-4`}>
                    <span className={styles.badgeLabel}>{t('badge')}</span>
                    <div className={styles.badgeRow}>
                        <a href="#"
                            className={styles.appBadge}
                            aria-label={t('appStore')}></a>

                        <a href="">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.79.03 3.02 2.65 4.03 2.68 4.04l-.07.24zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            {t('appStore')}
                        </a>
                        <a href="#"
                            className={styles.appBadge}
                            aria-label={t('googlePlay')}
                        >

                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M3.18 23.76c.37.2.8.22 1.2.04l12.65-7.08-2.86-2.87-11 10.91zM20.75 10.36L17.96 8.7 14.84 11.7l3.13 3.07 2.79-1.62c.79-.46.79-1.73-.01-2.79zM1.01 1.28C.95 1.5.91 1.74.91 2v20c0 .26.04.5.1.72l11.44-11.27L1.01 1.28zM4.38.24L16.79 7.19l-2.86 2.8L1.2.08C1.6-.1 2.04-.07 2.41.13l1.97 1.11z" />
                            </svg>
                            {t('googlePlay')}
                        </a>
                    </div>
                </div>
            </div >
        </section >
    );
}