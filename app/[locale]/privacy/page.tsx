// app/[locale]/privacy/page.tsx
import type { Metadata } from 'next';
import styles from '../legal.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return {
    title: isAr ? 'سياسة الخصوصية — ملاذ' : 'Privacy Policy — Malaaz',
    description: isAr
      ? 'كيف تجمع ملاذ بياناتك وتستخدمها'
      : 'How Malaaz collects and uses your data.',
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  if (isAr) {
    return (
      <main className={styles.page} dir="rtl" lang="ar">
        <div className={`container ${styles.content}`}>
          <h1 className={styles.title}>سياسة الخصوصية</h1>
          <p className={styles.updated}>آخر تحديث: مايو ٢٠٢٦</p>

          <section className={styles.section}>
            <h2>المعلومات التي نجمعها</h2>
            <p>
              عند انضمامك لقائمة انتظار ملاذ، نجمع عنوان بريدك الإلكتروني والدور الذي اخترته (صاحب شقة أو تاجر). نستخدم هذه المعلومات فقط لإعلامك عند إطلاق المنصة وإرسال معلومات الوصول المبكر ذات الصلة.
            </p>
          </section>

          <section className={styles.section}>
            <h2>كيف نستخدم بياناتك</h2>
            <p>
              يتم تخزين بريدك الإلكتروني بشكل آمن ويُستخدم فقط للتواصل المتعلق بإطلاق المنتج. لا نبيع معلوماتك الشخصية أو نؤجرها أو نشاركها مع أطراف ثالثة لأغراض تسويقية.
            </p>
          </section>

          <section className={styles.section}>
            <h2>مدة الاحتفاظ بالبيانات</h2>
            <p>
              نحتفظ ببريدك الإلكتروني طالما بقيت مشتركاً في قائمة الانتظار. يمكنك إلغاء الاشتراك في أي وقت عبر مراسلتنا على{' '}
              <a href="mailto:hello@malaaz.com">hello@malaaz.com</a>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>التواصل معنا</h2>
            <p>
              لأي استفسارات تتعلق بالخصوصية، تواصل معنا على{' '}
              <a href="mailto:hello@malaaz.com">hello@malaaz.com</a>.
            </p>
          </section>
        </div>
      </main>
    );
  }

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
            waitlist. You may unsubscribe at any time by emailing{' '}
            <a href="mailto:hello@malaaz.com">hello@malaaz.com</a>.
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