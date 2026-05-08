// Standalone /about page — richer than the inline About section on the homepage.
// Content sourced from Startup_Documentation.pdf:
//   - AI Technical Consultant concept
//   - Two-tier supply chain strategy
//   - Strategic moats (vendor lock-in, hyper-local inventory, cash-flow)
//   - Go-to-market: "Your Trusted Partner in the Finishing Journey"
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
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
      : 'Malaaz is digitizing Egypt\'s finishing market — our story, team, and vision.',
  };
}
 
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
 
  const team = [
    { initials: 'M', name: t('member1Name'), role: t('member1Role') },
    { initials: 'A', name: t('member2Name'), role: t('member2Role') },
    { initials: 'K', name: t('member3Name'), role: t('member3Role') },
  ];
 
  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="about-hero-heading">
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <h1 id="about-hero-heading" className={styles.headline}>{t('headline')}</h1>
          <p className={styles.lead}>{t('lead')}</p>
        </div>
      </section>
 
      {/* ── Story ── */}
      <section className={`${styles.storySection} section`} aria-labelledby="story-heading">
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyLeft}>
            <h2 id="story-heading" className={styles.sectionTitle}>{t('storyTitle')}</h2>
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
 
      {/* ── Vision / Mission / Positioning pillars ── */}
      <section className={`${styles.pillarsSection} section`} aria-labelledby="pillars-heading">
        <div className="container">
          <h2 id="pillars-heading" className={`${styles.sectionTitle} ${styles.centeredTitle}`}>
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
 
      {/* ── Strategic Moats ── */}
      <section className={`${styles.moatsSection} section`} aria-labelledby="moats-heading">
        <div className="container">
          <header className={styles.moatsHeader}>
            <span className={styles.eyebrowDark}>{t('moatsEyebrow')}</span>
            <h2 id="moats-heading" className={styles.moatsTitle}>{t('moatsTitle')}</h2>
            <p className={styles.moatsSub}>{t('moatsSub')}</p>
          </header>
          <ol className={styles.moatsGrid}>
            {moats.map((m, i) => (
              <li key={m.title} className={styles.moatCard}>
                <span className={styles.moatNum} aria-hidden="true">0{i + 1}</span>
                <h3 className={styles.moatTitle}>{m.title}</h3>
                <p className={styles.moatDesc}>{m.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
 
      {/* ── Team ── */}
      <section className={`${styles.teamSection} section`} aria-labelledby="team-heading">
        <div className="container">
          <h2 id="team-heading" className={`${styles.sectionTitle} ${styles.centeredTitle}`}>
            {t('teamTitle')}
          </h2>
          <p className={styles.teamSub}>{t('teamSub')}</p>
          <ul className={styles.teamGrid}>
            {team.map((member) => (
              <li key={member.initials} className={styles.memberCard}>
                <div className={styles.avatar} aria-hidden="true">{member.initials}</div>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
 
      {/* ── CTA ── */}
      <section className={styles.ctaSection} aria-labelledby="about-cta-heading">
        <div className={`container ${styles.ctaInner}`}>
          <h2 id="about-cta-heading" className={styles.ctaTitle}>{t('ctaTitle')}</h2>
          <p className={styles.ctaSub}>{t('ctaSub')}</p>
          <a href={`/${locale}#early-access`} className={styles.ctaButton}>
            {t('ctaButton')}
          </a>
        </div>
      </section>
    </main>
  );
}