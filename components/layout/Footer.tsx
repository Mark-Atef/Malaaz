// components/layout/Footer.tsx
// WHY: The previous Footer called useTranslations('nav') INSIDE JSX (inside the
// render return), which violates Rules of Hooks. Hooks must be called at the top
// level of the component function, not inside callbacks, conditions, or JSX.
// This caused the "روابط" nav links to silently fail in production builds.
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');   // ← hoisted to top level — fixes the bug
  const locale = useLocale();
  const year = new Date().getFullYear();

  const navLinks = [
    { label: nav('howItWorks'), href: `/${locale}#how-it-works` },
    { label: nav('forTraders'), href: `/${locale}#for-traders` },
    { label: nav('about'),       href: `/${locale}#about` },
    { label: 'FAQ',              href: `/${locale}#faq` },
  ];

  const legalLinks = [
    { label: t('privacy'), href: `/${locale}/privacy` },
    { label: t('terms'),   href: `/${locale}/terms` },
  ];

  return (
    <footer className={styles.footer} aria-labelledby="footer-brand">
      <div className="container">

        {/* ── Main row: brand + three column groups ── */}
        <div className={styles.main}>

          {/* Brand */}
          <div className={styles.brand}>
            <Link href={`/${locale}`} className={styles.logoLink} aria-label="Malaaz">
              <span id="footer-brand" className={styles.logoText}>Malaaz</span>
            </Link>
            <p className={styles.tagline}>{t('tagline')}</p>
          </div>

          {/* Nav links */}
          <div className={styles.col}>
            <p className={styles.colLabel}>{t('links')}</p>
            <nav aria-label={t('links')}>
              <ul className={styles.linkList}>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal links */}
          <div className={styles.col}>
            <p className={styles.colLabel}>{t('legal')}</p>
            <ul className={styles.linkList}>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <p className={styles.colLabel}>{t('contact')}</p>
            <ul className={styles.linkList}>
              <li>
                <a href="mailto:hello@malaaz.com" className={styles.link}>
                  hello@malaaz.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {year} Malaaz. {t('rights')}.
          </span>
          <div className={styles.legalRow}>
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.legalLink}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}