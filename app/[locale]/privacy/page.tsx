// app/[locale]/privacy/page.tsx
import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy — Malaaz',
  description: 'How Malaaz collects and uses your data.',
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: May 2026</p>

        <section className={styles.section}>
          <h2>Information we collect</h2>
          <p>
            When you join the Malaaz waitlist, we collect your email address and
            the role you selected (homeowner or trader). We use this solely to
            notify you when the platform launches and to send you relevant early
            access information.
          </p>
        </section>

        <section className={styles.section}>
          <h2>How we use your data</h2>
          <p>
            Your email is stored securely and used only for product launch
            communications. We do not sell, rent, or share your personal
            information with third parties for marketing purposes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Data retention</h2>
          <p>
            We retain your email for as long as you remain subscribed to our
            waitlist. You may unsubscribe at any time by emailing
            <a href="mailto:hello@malaaz.com"> hello@malaaz.com</a>.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact</h2>
          <p>
            For any privacy-related questions, contact us at{' '}
            <a href="mailto:hello@malaaz.com">hello@malaaz.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}