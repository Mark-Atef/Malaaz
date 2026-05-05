// app/[locale]/terms/page.tsx
import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Malaaz',
  description: 'Terms of service for Malaaz.',
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Terms &amp; Conditions</h1>
        <p className={styles.updated}>Last updated: May 2026</p>

        <section className={styles.section}>
          <h2>Acceptance</h2>
          <p>
            By joining the Malaaz waitlist or using any Malaaz service, you agree
            to these terms. If you do not agree, please do not use our services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Service description</h2>
          <p>
            Malaaz is a pre-launch platform that connects Egyptian homeowners with
            verified local traders for interior finishing products. The platform is
            currently in development and the waitlist is for informational purposes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Limitation of liability</h2>
          <p>
            Malaaz is provided as-is during the pre-launch phase. We make no
            guarantees about availability, accuracy, or fitness for a particular
            purpose during this period.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Changes</h2>
          <p>
            We may update these terms as the platform develops. Continued use of
            the service constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact</h2>
          <p>
            Questions? Email us at{' '}
            <a href="mailto:hello@malaaz.com">hello@malaaz.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}