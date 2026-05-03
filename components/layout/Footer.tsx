// components/layout/Footer.tsx
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-labelledby="footer-label">
      <h2 id="footer-label" className="sr-only">{t('links')}</h2>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href={`/${locale}`} className={styles.logo} aria-label="Malaaz">
              <span className={styles.logoText}>Malaaz</span>
            </Link>
            <p className={styles.tagline}>{t('tagline')}</p>
          </div>

          <nav className={styles.links} aria-label={t('links')}>
            <Link href={`/${locale}#how-it-works`} className={styles.link}>
              {useTranslations('nav')('howItWorks')}
            </Link>
            <Link href={`/${locale}#for-traders`} className={styles.link}>
              {useTranslations('nav')('forTraders')}
            </Link>
            <Link href={`/${locale}#about`} className={styles.link}>
              {useTranslations('nav')('about')}
            </Link>
            <Link href={`/${locale}#faq`} className={styles.link}>
              FAQ
            </Link>
          </nav>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {year} Malaaz. {t('rights')}.
          </span>
          <div className={styles.legal}>
            <Link href={`/${locale}/privacy`} className={styles.legalLink}>{t('privacy')}</Link>
            <Link href={`/${locale}/terms`} className={styles.legalLink}>{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}