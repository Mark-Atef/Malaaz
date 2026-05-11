'use client';
// app/[locale]/traders/page.tsx
//
// FIXES:
// 1. react-hooks/incompatible-library + exhaustive-deps:
//    Replaced `watch('categories')` with `useWatch({ control, name })`.
//    `useWatch` is the RHF-recommended approach for reading field values
//    reactively in components. It integrates correctly with memoization.
//    Also moved category reading inside the callback via `getValues` to
//    decouple toggleCat from re-render cycles entirely.
//
// 2. no-unused-vars: Removed unused `i` from HOW_STEPS .map().

import { useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Zap,
  Database,
  Users,
  BarChart2,
  CreditCard,
  Headphones,
  Check,
  ChevronRight,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import styles from './traders.module.css';

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const step2Schema = z.object({
  businessName: z.string().min(2, 'يرجى إدخال اسم المتجر'),
  governorate:  z.string().min(1, 'يرجى اختيار المحافظة'),
  area:         z.string().min(2, 'يرجى إدخال المنطقة'),
  categories:   z.array(z.string()).min(1, 'اختر تصنيفاً واحداً على الأقل'),
  revenueRange: z.string().min(1, 'يرجى اختيار حجم المبيعات'),
});

const step3Schema = z.object({
  contactName: z.string().min(2, 'يرجى إدخال اسمك'),
  phone:       z.string().regex(/^01[0-9]{9}$/, 'أدخل رقم هاتف مصري صحيح'),
  email:       z.string().email('أدخل بريداً إلكترونياً صحيحاً'),
  whatsapp:    z.string().optional(),
});

type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

// ─── Static data ─────────────────────────────────────────────────────────────

const GOVERNORATES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الشرقية',
  'الغربية', 'المنوفية', 'البحيرة', 'الدقهلية', 'كفر الشيخ',
  'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'أسيوط',
  'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'المنيا', 'بني سويف',
  'الفيوم', 'أخرى',
];

const FEATURES = [
  { Icon: Zap,        keyTitle: 'feat1Title', keyDesc: 'feat1Desc' },
  { Icon: Database,   keyTitle: 'feat2Title', keyDesc: 'feat2Desc' },
  { Icon: Users,      keyTitle: 'feat3Title', keyDesc: 'feat3Desc' },
  { Icon: BarChart2,  keyTitle: 'feat4Title', keyDesc: 'feat4Desc' },
  { Icon: CreditCard, keyTitle: 'feat5Title', keyDesc: 'feat5Desc' },
  { Icon: Headphones, keyTitle: 'feat6Title', keyDesc: 'feat6Desc' },
] as const;

const HOW_STEPS = ['how1', 'how2', 'how3'] as const;

const LOCAL_FEATURES = [
  'localFeature1', 'localFeature2', 'localFeature3',
  'localFeature4', 'localFeature5',
] as const;

const DIST_FEATURES = [
  'distributorFeature1', 'distributorFeature2', 'distributorFeature3',
  'distributorFeature4', 'distributorFeature5',
] as const;

const TRADER_FAQ_KEYS = [
  'tq1','tq2','tq3','tq4','tq5','tq6','tq7','tq8',
] as const;

const CATEGORIES_AR = [
  'cat1','cat2','cat3','cat4','cat5','cat6',
] as const;

// ─── Step 1 ──────────────────────────────────────────────────────────────────

function Step1({
  t,
  onSelect,
}: {
  t: ReturnType<typeof useTranslations>;
  onSelect: (type: 'distributor' | 'local') => void;
}) {
  return (
    <div className={styles.step1Grid}>
      {(['distributor', 'local'] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className={styles.typeCard}
        >
          <div className={styles.typeCardNum} aria-hidden="true">
            {type === 'distributor' ? '01' : '02'}
          </div>
          <h3 className={styles.typeCardTitle}>
            {t(type === 'distributor' ? 'distributorCard' : 'localCard')}
          </h3>
          <p className={styles.typeCardDesc}>
            {t(type === 'distributor' ? 'distributorCardDesc' : 'localCardDesc')}
          </p>
          <div className={styles.typeCardCta}>
            {t('nextBtn')}
            <ArrowRight size={14} aria-hidden="true" />
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

function Step2({
  t,
  onNext,
  onBack,
}: {
  t: ReturnType<typeof useTranslations>;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,   // FIX: read field values lazily inside callbacks
    control,     // FIX: needed for useWatch
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onBlur',
    defaultValues: { categories: [] },
  });

  // FIX: useWatch integrates correctly with React's rendering model.
  // Unlike watch(), useWatch subscribes to field changes without breaking
  // memoization or the incompatible-library constraint.
  const selectedCats = useWatch({ control, name: 'categories', defaultValue: [] });

  const toggleCat = useCallback(
    (cat: string) => {
      // FIX: read current value lazily with getValues() inside the callback.
      // This means toggleCat does not depend on selectedCats for its logic,
      // only for display. getValues is stable (same reference each render).
      const current = getValues('categories') ?? [];
      setValue(
        'categories',
        current.includes(cat)
          ? current.filter((c) => c !== cat)
          : [...current, cat],
        { shouldValidate: true }
      );
    },
    [getValues, setValue]
  );

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className={styles.formBody}>
      {/* Business name */}
      <div className={styles.field}>
        <label htmlFor="biz-name" className={styles.fieldLabel}>
          {t('businessNameLabel')} *
        </label>
        <input
          id="biz-name"
          {...register('businessName')}
          className={`${styles.fieldInput} ${errors.businessName ? styles.fieldError : ''}`}
        />
        {errors.businessName && (
          <span role="alert" className={styles.fieldErrorMsg}>
            {errors.businessName.message}
          </span>
        )}
      </div>

      <div className={styles.fieldRow}>
        {/* Governorate */}
        <div className={styles.field}>
          <label htmlFor="gov" className={styles.fieldLabel}>
            {t('governorateLabel')} *
          </label>
          <select
            id="gov"
            {...register('governorate')}
            className={`${styles.fieldInput} ${errors.governorate ? styles.fieldError : ''}`}
          >
            <option value="">—</option>
            {GOVERNORATES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.governorate && (
            <span role="alert" className={styles.fieldErrorMsg}>
              {errors.governorate.message}
            </span>
          )}
        </div>

        {/* Area */}
        <div className={styles.field}>
          <label htmlFor="area" className={styles.fieldLabel}>
            {t('areaLabel')} *
          </label>
          <input
            id="area"
            {...register('area')}
            className={`${styles.fieldInput} ${errors.area ? styles.fieldError : ''}`}
          />
          {errors.area && (
            <span role="alert" className={styles.fieldErrorMsg}>
              {errors.area.message}
            </span>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className={styles.field}>
        <p className={styles.fieldLabel}>{t('categoriesLabel')} *</p>
        <div
          className={styles.checkGrid}
          role="group"
          aria-label={t('categoriesLabel')}
        >
          {CATEGORIES_AR.map((key) => {
            const label = t(key);
            // Use selectedCats (from useWatch) for display only
            const active = selectedCats.includes(label);
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCat(label)}
                className={`${styles.checkBtn} ${active ? styles.checkActive : ''}`}
              >
                {active && (
                  <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                )}
                {label}
              </button>
            );
          })}
        </div>
        {errors.categories && (
          <span role="alert" className={styles.fieldErrorMsg}>
            {errors.categories.message}
          </span>
        )}
      </div>

      {/* Revenue */}
      <div className={styles.field}>
        <label htmlFor="revenue" className={styles.fieldLabel}>
          {t('revenueLabel')} *
        </label>
        <select
          id="revenue"
          {...register('revenueRange')}
          className={`${styles.fieldInput} ${errors.revenueRange ? styles.fieldError : ''}`}
        >
          <option value="">—</option>
          {(['rev1','rev2','rev3','rev4'] as const).map((k) => (
            <option key={k} value={t(k)}>{t(k)}</option>
          ))}
        </select>
        {errors.revenueRange && (
          <span role="alert" className={styles.fieldErrorMsg}>
            {errors.revenueRange.message}
          </span>
        )}
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onBack} className={styles.backBtn}>
          {t('backBtn')}
        </button>
        <button type="submit" className={styles.nextBtn}>
          {t('nextBtn')}
        </button>
      </div>
    </form>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────

function Step3({
  t,
  onNext,
  onBack,
  loading,
}: {
  t: ReturnType<typeof useTranslations>;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
  loading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className={styles.formBody}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="cname" className={styles.fieldLabel}>
            {t('contactNameLabel')} *
          </label>
          <input
            id="cname"
            {...register('contactName')}
            className={`${styles.fieldInput} ${errors.contactName ? styles.fieldError : ''}`}
            autoComplete="name"
          />
          {errors.contactName && (
            <span role="alert" className={styles.fieldErrorMsg}>
              {errors.contactName.message}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="cphone" className={styles.fieldLabel}>
            {t('phoneLabel')} *
          </label>
          <input
            id="cphone"
            type="tel"
            dir="ltr"
            {...register('phone')}
            className={`${styles.fieldInput} ${errors.phone ? styles.fieldError : ''}`}
            autoComplete="tel"
            placeholder="01xxxxxxxxx"
          />
          {errors.phone && (
            <span role="alert" className={styles.fieldErrorMsg}>
              {errors.phone.message}
            </span>
          )}
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="cemail" className={styles.fieldLabel}>
            {t('emailLabel')} *
          </label>
          <input
            id="cemail"
            type="email"
            dir="ltr"
            {...register('email')}
            className={`${styles.fieldInput} ${errors.email ? styles.fieldError : ''}`}
            autoComplete="email"
          />
          {errors.email && (
            <span role="alert" className={styles.fieldErrorMsg}>
              {errors.email.message}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="cwhatsapp" className={styles.fieldLabel}>
            {t('whatsappLabel')}
          </label>
          <input
            id="cwhatsapp"
            type="tel"
            dir="ltr"
            {...register('whatsapp')}
            className={styles.fieldInput}
            placeholder="01xxxxxxxxx"
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onBack} className={styles.backBtn}>
          {t('backBtn')}
        </button>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? '...' : t('submitBtn')}
        </button>
      </div>
    </form>
  );
}

// ─── Trader FAQ ───────────────────────────────────────────────────────────────

function TraderFAQ({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className={styles.faqList}>
      {TRADER_FAQ_KEYS.map((key) => {
        const isOpen = open === key;
        const aKey = key.replace('tq', 'ta');
        return (
          <div
            key={key}
            className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ''}`}
          >
            <button
              type="button"
              className={styles.faqQ}
              onClick={() => setOpen(isOpen ? null : key)}
              aria-expanded={isOpen}
            >
              <span>{t(key)}</span>
              <span className={styles.faqIcon} aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              className={`${styles.faqAnswerGrid} ${
                isOpen ? styles.faqAnswerOpen : ''
              }`}
            >
              <div className={styles.faqAnswerInner}>
                <p className={styles.faqAnswer}>{t(aKey as never)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TradersPage() {
  const t = useTranslations('traderPage');
  const locale = useLocale();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [traderType, setTraderType] = useState<'distributor' | 'local' | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStep1 = useCallback((type: 'distributor' | 'local') => {
    setTraderType(type);
    setStep(2);
  }, []);

  const handleStep2 = useCallback((data: Step2Data) => {
    setStep2Data(data);
    setStep(3);
  }, []);

  const handleStep3 = useCallback(
    async (contactData: Step3Data) => {
      if (!step2Data || !traderType) return;
      setLoading(true);
      try {
        const payload = { traderType, ...step2Data, ...contactData };
        const res = await fetch('/api/trader-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json() as { success: boolean };
        if (data.success) setStep(4);
      } catch {
        // Step stays at 3 — user can retry
      } finally {
        setLoading(false);
      }
    },
    [step2Data, traderType]
  );

  const STEP_TITLES: Record<1 | 2 | 3 | 4, string> = {
    1: t('step1Title'),
    2: t('step2Title'),
    3: t('step3Title'),
    4: t('step4Title'),
  };

  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="trader-hero-heading">
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.heroEyebrow}>{t('heroEyebrow')}</span>
          <h1 id="trader-hero-heading" className={styles.heroTitle}>
            {t('heroTitle').split('\n').map((line, lineIdx) => (
              <span key={lineIdx} className={styles.heroLine}>{line}</span>
            ))}
          </h1>
          <p className={styles.heroSub}>{t('heroSub')}</p>
          <div className={styles.heroCtas}>
            <a href="#trader-form" className={styles.heroPrimary}>
              {t('heroCta')}
              <ChevronRight size={16} aria-hidden="true" className="icon-flip" />
            </a>
            <a href="mailto:hello@malaaz.com" className={styles.heroSecondary}>
              {t('heroSecondary')}
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        className={`${styles.statsSection} section`}
        aria-labelledby="trader-stats-heading"
      >
        <div className="container">
          <p id="trader-stats-heading" className={styles.statsTitle}>
            {t('statsTitle')}
          </p>
          <div className={styles.statsGrid}>
            {(['stat1', 'stat2', 'stat3'] as const).map((s) => (
              <div key={s} className={styles.statCard}>
                <span className={styles.statValue}>{t(`${s}Value`)}</span>
                <span className={styles.statLabel}>{t(`${s}Label`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        className={`${styles.featuresSection} section`}
        aria-labelledby="features-heading"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>{t('featuresEyebrow')}</span>
            <h2 id="features-heading" className={styles.sectionTitle}>
              {t('featuresTitle')}
            </h2>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map(({ Icon, keyTitle, keyDesc }) => (
              <div key={keyTitle} className={styles.featureCard}>
                <div className={styles.featureIcon} aria-hidden="true">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className={styles.featureTitle}>{t(keyTitle)}</h3>
                <p className={styles.featureDesc}>{t(keyDesc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        className={`${styles.howSection} section`}
        aria-labelledby="how-heading"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>{t('howEyebrow')}</span>
            <h2 id="how-heading" className={styles.sectionTitle}>
              {t('howTitle')}
            </h2>
          </div>
          {/* FIX: removed unused `i` parameter from .map() */}
          <ol className={styles.howSteps}>
            {HOW_STEPS.map((s) => (
              <li key={s} className={styles.howStep}>
                <div className={styles.howNum} aria-hidden="true">
                  {t(`${s}Num`)}
                </div>
                <div className={styles.howConnector} aria-hidden="true" />
                <h3 className={styles.howTitle}>{t(`${s}Title`)}</h3>
                <p className={styles.howDesc}>{t(`${s}Desc`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        className={`${styles.pricingSection} section`}
        aria-labelledby="pricing-heading"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>{t('pricingEyebrow')}</span>
            <h2 id="pricing-heading" className={styles.sectionTitle}>
              {t('pricingTitle')}
            </h2>
          </div>
          <div className={styles.pricingGrid}>
            {/* Local trader */}
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingName}>{t('localTitle')}</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingAmount}>{t('localPrice')}</span>
                <span className={styles.pricingPeriod}>{t('localPeriod')}</span>
              </div>
              <p className={styles.pricingYearly}>{t('localYearly')}</p>
              <ul className={styles.pricingFeatures}>
                {LOCAL_FEATURES.map((f) => (
                  <li key={f} className={styles.pricingFeature}>
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      aria-hidden="true"
                      className={styles.pricingCheck}
                    />
                    {t(f)}
                  </li>
                ))}
              </ul>
              <a href="#trader-form" className={styles.pricingCta}>
                {t('localCta')}
              </a>
            </div>

            {/* Distributor */}
            <div className={`${styles.pricingCard} ${styles.pricingDark}`}>
              <h3 className={styles.pricingName}>{t('distributorTitle')}</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingAmount}>
                  {t('distributorPrice')}
                </span>
              </div>
              <p className={styles.pricingYearly}>{t('distributorSub')}</p>
              <ul className={styles.pricingFeatures}>
                {DIST_FEATURES.map((f) => (
                  <li key={f} className={styles.pricingFeature}>
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      aria-hidden="true"
                      className={styles.pricingCheck}
                    />
                    {t(f)}
                  </li>
                ))}
              </ul>
              <a href="mailto:hello@malaaz.com" className={`${styles.pricingCta} ${styles.pricingCtaDark}`}>
                {t('distributorCta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        className={`${styles.faqSection} section`}
        aria-labelledby="trader-faq-heading"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>{t('faqEyebrow')}</span>
            <h2 id="trader-faq-heading" className={styles.sectionTitle}>
              {t('faqTitle')}
            </h2>
          </div>
          <div className={styles.faqWrap}>
            <TraderFAQ t={t} />
          </div>
        </div>
      </section>

      {/* ── Registration Form ── */}
      <section
        className={`${styles.formSection} section`}
        id="trader-form"
        aria-labelledby="form-heading"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>{t('formEyebrow')}</span>
            <h2 id="form-heading" className={styles.sectionTitle}>
              {t('formTitle')}
            </h2>
          </div>

          <div className={styles.formCard}>
            {/* Step indicator */}
            {step < 4 && (
              <div className={styles.stepIndicator} aria-label={`Step ${step} of 3`}>
                {([1, 2, 3] as const).map((s) => (
                  <div
                    key={s}
                    className={`${styles.stepDot} ${
                      step >= s ? styles.stepDotActive : ''
                    } ${step === s ? styles.stepDotCurrent : ''}`}
                    aria-current={step === s ? 'step' : undefined}
                  />
                ))}
              </div>
            )}

            <h3 className={styles.stepTitle}>{STEP_TITLES[step]}</h3>

            {step === 1 && <Step1 t={t} onSelect={handleStep1} />}
            {step === 2 && (
              <Step2 t={t} onNext={handleStep2} onBack={() => setStep(1)} />
            )}
            {step === 3 && (
              <Step3
                t={t}
                onNext={handleStep3}
                onBack={() => setStep(2)}
                loading={loading}
              />
            )}
            {step === 4 && (
              <div className={styles.successPanel} role="status">
                <div className={styles.successIcon} aria-hidden="true">✓</div>
                <h3 className={styles.successTitle}>{t('successTitle')}</h3>
                <p className={styles.successMsg}>{t('successMsg')}</p>
                <a 
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.successWA}
                >
                  <MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />
                  {t('successWhatsApp')}
                </a>
                <Link href={`/${locale}`} className={styles.successHome}>
                  {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}