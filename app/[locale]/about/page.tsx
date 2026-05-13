// app/[locale]/about/page.tsx
// Standalone /about page — richer than the inline About section on the homepage.

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Globe } from 'lucide-react';
import styles from './about.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return {
    title: isAr ? 'من نحن — ملاذ' : 'About — Malaaz',
    description: isAr
      ? 'ملاذ منصة ذكية تحول سوق التشطيب المصري — نبذتنا وفريقنا ورؤيتنا'
      : "Malaaz is digitizing Egypt's finishing market — our story, team, and vision.",
  };
}

// ─── Team data — replace href values with real URLs ───────────────────────────

const TEAM_DATA = [
  {
    memberKey: '1' as const,
    linkedin: 'https://www.linkedin.com/in/mohamed-magdy/',
    github: null,
    website: null,
    // Areas of expertise shown as chips
    tags: ['Business Development', 'Operations', 'Market Strategy'],
  },
  {
    memberKey: '2' as const,
    linkedin: 'https://www.linkedin.com/in/mark-yacoub/',
    github: 'https://github.com/markyacoub',
    website: null,
    tags: ['Software Engineering', 'Product', 'Business'],
  },
  {
    memberKey: '3' as const,
    linkedin: 'https://www.linkedin.com/in/mohamed-agroudy/',
    github: null,
    website: null,
    tags: ['Business Development', 'Partnerships', 'Sales'],
  },
  {
    memberKey: '4' as const,
    linkedin: 'https://www.linkedin.com/in/mohamed-nassar/',
    github: 'https://github.com/mnassar',
    website: null,
    tags: ['Software Architecture', 'Engineering', 'Business'],
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage' });

  const pillars = [
    { label: t('pillar1Label'), text: t('pillar1Text') },
    { label: t('pillar2Label'), text: t('pillar2Text') },
    { label: t('pillar3Label'), text: t('pillar3Text') },
  ];

  const moats = [
    { title: t('moat1Title'), desc: t('moat1Desc') },
    { title: t('moat2Title'), desc: t('moat2Desc') },
    { title: t('moat3Title'), desc: t('moat3Desc') },
  ];

  // Derive initials from name — no translation key needed
  function getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="about-hero-heading">
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <h1 id="about-hero-heading" className={styles.headline}>
            {t('headline')}
          </h1>
          <p className={styles.lead}>{t('lead')}</p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className={`${styles.storySection} section`} aria-labelledby="story-heading">
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyLeft}>
            <h2 id="story-heading" className={styles.sectionTitle}>
              {t('storyTitle')}
            </h2>
          </div>
          <div className={styles.storyRight}>
            <p className={styles.storyText}>{t('story1')}</p>
            <p className={styles.storyText}>{t('story2')}</p>
            <blockquote className={styles.quote}>
              <p>{t('quote')}</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className={`${styles.pillarsSection} section`} aria-labelledby="pillars-heading">
        <div className="container">
          <h2
            id="pillars-heading"
            className={`${styles.sectionTitle} ${styles.centeredTitle}`}
          >
            {t('pillarsTitle')}
          </h2>
          <ul className={styles.pillarsGrid}>
            {pillars.map((p) => (
              <li key={p.label} className={styles.pillarCard}>
                <span className={styles.pillarLabel}>{p.label}</span>
                <p className={styles.pillarText}>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Moats ── */}
      <section
        className={`${styles.moatsSection} section`}
        aria-labelledby="moats-heading"
      >
        <div className="container">
          <header className={styles.moatsHeader}>
            <span className={styles.eyebrowDark}>{t('moatsEyebrow')}</span>
            <h2 id="moats-heading" className={styles.moatsTitle}>
              {t('moatsTitle')}
            </h2>
            <p className={styles.moatsSub}>{t('moatsSub')}</p>
          </header>
          <ol className={styles.moatsGrid}>
            {moats.map((m, i) => (
              <li key={m.title} className={styles.moatCard}>
                <span className={styles.moatNum} aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className={styles.moatTitle}>{m.title}</h3>
                <p className={styles.moatDesc}>{m.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Team — 4 cards side by side, clickable ── */}
      <section
        className={`${styles.teamSection} section`}
        aria-labelledby="team-heading"
      >
        <div className="container">
          <h2
            id="team-heading"
            className={`${styles.sectionTitle} ${styles.centeredTitle}`}
          >
            {t('teamTitle')}
          </h2>
          <p className={styles.teamSub}>{t('teamSub')}</p>

          <ul className={styles.teamGrid}>
            {TEAM_DATA.map(({ memberKey, linkedin, github, website, tags }) => {
              const name = t(`member${memberKey}Name`);
              const role = t(`member${memberKey}Role`);
              const initials = getInitials(name);

              return (
                <li key={memberKey} className={styles.memberCard}>
                  {/* Avatar */}
                  <div className={styles.memberAvatarWrap}>
                    <div className={styles.memberAvatar} aria-hidden="true">
                      {initials}
                    </div>
                  </div>

                  {/* Info */}
                  <div className={styles.memberInfo}>
                    <h3 className={styles.memberName}>{name}</h3>
                    <p className={styles.memberRole}>{role}</p>
                  </div>

                  {/* Expertise tags */}
                  <div className={styles.memberTags}>
                    {tags.map((tag) => (
                      <span key={tag} className={styles.memberTag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Social links */}
                  <ul className={styles.memberSocial} aria-label={`${name} social links`}>
                    {linkedin && (
                      <li key="linkedin">
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialBtn}
                          aria-label={`${name} on LinkedIn`}
                        >
                          <svg xmlns="w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                          </svg>
                        </a>
                      </li>
                    )}
                    {github && (
                      <li key="github">
                        <a
                          href={github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialBtn}
                          aria-label={`${name} on GitHub`}
                        >
                          <svg xmlns="w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect width="4" height="12" x="2" y="9" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        </a>
                      </li>
                    )}
                    {website && (
                      <li key="website">
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialBtn}
                          aria-label={`${name} website`}
                        >
                          <Globe size={15} strokeWidth={1.75} aria-hidden="true" />
                        </a>
                      </li>
                    )}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className={styles.ctaSection}
        aria-labelledby="about-cta-heading"
      >
        <div className={`container ${styles.ctaInner}`}>
          <h2 id="about-cta-heading" className={styles.ctaTitle}>
            {t('ctaTitle')}
          </h2>
          <p className={styles.ctaSub}>{t('ctaSub')}</p>
          <a href={`/${locale}#early-access`} className={styles.ctaButton}>
            {t('ctaButton')}
          </a>
        </div>
      </section>

    </main>
  );
}