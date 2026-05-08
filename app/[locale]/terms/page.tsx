// app/[locale]/terms/page.tsx
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
    title: isAr ? 'الشروط والأحكام — ملاذ' : 'Terms & Conditions — Malaaz',
    description: isAr
      ? 'شروط استخدام منصة ملاذ'
      : 'Terms of service for Malaaz.',
    robots: { index: false, follow: false },
  };
}

export default async function TermsPage({
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
          <h1 className={styles.title}>الشروط والأحكام</h1>
          <p className={styles.updated}>آخر تحديث: مايو ٢٠٢٦</p>

          <section className={styles.section}>
            <h2>القبول</h2>
            <p>
              بانضمامك إلى قائمة انتظار ملاذ أو استخدام أي خدمة من خدماتنا، فإنك توافق على هذه الشروط. إذا كنت لا توافق عليها، يرجى عدم استخدام خدماتنا.
            </p>
          </section>

          <section className={styles.section}>
            <h2>وصف الخدمة</h2>
            <p>
              ملاذ منصة في مرحلة ما قبل الإطلاق تربط أصحاب الشقق المصريين بتجار محليين موثوقين لمنتجات التشطيب الداخلي. المنصة قيد التطوير حالياً وقائمة الانتظار لأغراض إعلامية.
            </p>
          </section>

          <section className={styles.section}>
            <h2>تحديد المسؤولية</h2>
            <p>
              تُقدَّم ملاذ كما هي خلال مرحلة ما قبل الإطلاق. لا نقدم أي ضمانات بشأن التوفر أو الدقة أو الملاءمة لغرض معين خلال هذه الفترة.
            </p>
          </section>

          <section className={styles.section}>
            <h2>التغييرات</h2>
            <p>
              قد نحدّث هذه الشروط مع تطور المنصة. يُعدّ استمرار استخدامك للخدمة قبولاً للشروط المحدّثة.
            </p>
          </section>

          <section className={styles.section}>
            <h2>التواصل معنا</h2>
            <p>
              للاستفسارات، راسلنا على{' '}
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