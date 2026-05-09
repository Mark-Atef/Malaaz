'use client';
// components/layout/Navbar.tsx
//
// WHY dark variant logic:
// The about page hero has background: var(--color-obsidian). The navbar starts
// transparent (no background before scrolling). This makes the obsidian logo
// invisible on an obsidian background. We detect the pathname and apply
// styles.dark which sets logo + nav links to --color-ivory when unscrolled.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, Globe } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);

  const t        = useTranslations('nav');
  const locale   = useLocale();
  const pathname = usePathname();
  const router   = useRouter();
  const isRTL    = locale === 'ar';

  // Pages whose hero is dark — logo must be ivory when unscrolled
  const isDarkHero = pathname.includes('/about');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const toggleLocale = useCallback(() => {
    const next    = locale === 'ar' ? 'en' : 'ar';
    const stripped = pathname.replace(/^\/(ar|en)/, '') || '/';
    router.push(`/${next}${stripped}`);
    closeMenu();
  }, [locale, pathname, router, closeMenu]);

  const navLinks = [
    { label: t('howItWorks'), href: `/${locale}#how-it-works` },
    { label: t('forTraders'), href: `/${locale}#for-traders`  },
    { label: t('about'),      href: `/${locale}/about`        },
  ];

  const langLabel    = locale === 'ar' ? 'EN' : 'ع';
  const langAriaLabel = locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';

  const headerClass = [
    styles.header,
    scrolled    ? styles.scrolled  : '',
    isDarkHero && !scrolled ? styles.dark : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <header className={headerClass}>
        <div className={styles.inner}>

          {/* Logo — bolder weight, ivory on dark pages */}
          <Link href={`/${locale}`} className={styles.logo} aria-label="Malaaz">
            <span className={styles.logoText}>Malaaz</span>
            <span className={styles.logoLine} />
          </Link>

          <nav className={styles.desktopNav} aria-label={isRTL ? 'روابط التنقل' : 'Site links'}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.desktopActions}>
            <button
              type="button"
              onClick={toggleLocale}
              className={styles.langBtn}
              aria-label={langAriaLabel}
            >
              <Globe size={13} strokeWidth={1.75} aria-hidden="true" />
              <span>{langLabel}</span>
            </button>
            <Link href={`/${locale}#early-access`} className={styles.cta}>
              {t('getEarlyAccess')}
            </Link>
          </div>

          <div className={styles.mobileActions}>
            <button
              type="button"
              onClick={toggleLocale}
              className={styles.langBtn}
              aria-label={langAriaLabel}
            >
              <Globe size={13} strokeWidth={1.75} aria-hidden="true" />
              <span>{langLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((p) => !p)}
              className={styles.hamburger}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? (isRTL ? 'إغلاق' : 'Close') : (isRTL ? 'القائمة' : 'Menu')}
            >
              {menuOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
            </button>
          </div>

        </div>
      </header>

      <div
        id="mobile-menu"
        ref={useRef<HTMLDivElement>(null)}
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}
      >
        <div className={styles.mobileDivider} />
        <nav className={styles.mobileNav} aria-label={isRTL ? 'قائمة التنقل' : 'Navigation menu'}>
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`${styles.mobileLink} reveal reveal-delay-${i + 1}`}
            >
              <span>{link.label}</span>
              <span className={styles.arrow}>{isRTL ? '←' : '→'}</span>
            </Link>
          ))}
          <Link
            href={`/${locale}#early-access`}
            onClick={closeMenu}
            className={`${styles.mobileCta} reveal reveal-delay-4`}
          >
            {t('getEarlyAccess')}
          </Link>
        </nav>
      </div>
    </>
  );
}