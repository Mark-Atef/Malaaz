'use client';
// components/sections/EngineerVisit.tsx
//
// Full form validation + professional left panel redesign.
// Egyptian phone: must start 01 + 9 digits = 11 total.
// Date: must be at least tomorrow.

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Shield,
  Clock,
  FileText,
  TrendingDown,
  CheckCircle,
  Phone,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
} from 'lucide-react';
import type { EngineerVisitData } from '@/types';
import styles from './EngineerVisit.module.css';

// ─── Validation ──────────────────────────────────────────────────────────────

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  preferredDate?: string;
}

function validateForm(form: EngineerVisitData, minDate: string): FormErrors {
  const errors: FormErrors = {};

  if (!form.name || form.name.trim().length < 2) {
    errors.name = 'يرجى إدخال اسمك الكامل';
  }

  if (!form.phone || !/^01[0-9]{9}$/.test(form.phone.trim())) {
    errors.phone = 'أدخل رقم هاتف مصري صحيح (01xxxxxxxxx)';
  }

  if (!form.address || form.address.trim().length < 5) {
    errors.address = 'يرجى إدخال عنوان تفصيلي';
  }

  if (!form.preferredDate) {
    errors.preferredDate = 'يرجى اختيار التاريخ';
  } else if (form.preferredDate < minDate) {
    errors.preferredDate = 'التاريخ يجب أن يكون من الغد على الأقل';
  }

  return errors;
}

// ─── Features ────────────────────────────────────────────────────────────────

const FEATURES = [
  { Icon: FileText,     key: 'feature1' as const },
  { Icon: TrendingDown, key: 'feature2' as const },
  { Icon: Shield,       key: 'feature3' as const },
  { Icon: CheckCircle,  key: 'feature4' as const },
] as const;

// ─── Process steps ────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { Icon: Calendar, ar: 'احجز الموعد',    en: 'Book online' },
  { Icon: Phone,    ar: 'تأكيد خلال ٢٤ ساعة', en: 'Confirm in 24h' },
  { Icon: MapPin,   ar: 'زيارة المهندس',  en: 'Engineer visits' },
  { Icon: FileText, ar: 'تقرير مفصّل',   en: 'Get full report' },
] as const;

type VisitPhase = 'idle' | 'loading' | 'success' | 'error';

// ─── Component ───────────────────────────────────────────────────────────────

export default function EngineerVisit() {
  const t = useTranslations('engineerVisit');

  const [phase, setPhase] = useState<VisitPhase>('idle');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<EngineerVisitData>({
    name: '',
    phone: '',
    address: '',
    apartmentSize: 100,
    preferredDate: '',
    notes: '',
  });

  // FIX: computed once on mount — not on every render (react-hooks/purity)
  const minDate = useMemo(
    () => new Date(Date.now() + 86_400_000).toISOString().split('T')[0],
    []
  );

  const update = useCallback(
    (field: keyof EngineerVisitData, value: string | number) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field on change
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errors = validateForm(form, minDate);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setPhase('loading');
      try {
        const res = await fetch('/api/engineer-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json() as { success: boolean };
        setPhase(data.success ? 'success' : 'error');
      } catch {
        setPhase('error');
      }
    },
    [form, minDate]
  );

  return (
    <section
      className={`${styles.section} section`}
      id="engineer-visit"
      aria-labelledby="visit-heading"
    >
      <div className="container">

        {/* Section header */}
        <div className={styles.sectionHeader}>
          <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
          <h2
            id="visit-heading"
            className={`${styles.title} reveal reveal-delay-1`}
          >
            {t('title')}
          </h2>
          <p className={`${styles.subtitle} reveal reveal-delay-2`}>
            {t('subtitle')}
          </p>
        </div>

        <div className={styles.inner}>

          {/* ── Left: Professional info panel ── */}
          <div className={`${styles.left} reveal reveal-delay-2`}>

            {/* Price card */}
            <div className={styles.priceCard}>
              <div className={styles.priceCardTop}>
                <div className={styles.priceCardLabel}>
                  <Star size={14} strokeWidth={1.75} aria-hidden="true" />
                  زيارة معاينة معتمدة
                </div>
                <div className={styles.priceDisplay}>
                  <span className={styles.priceAmount}>{t('price')}</span>
                  <span className={styles.priceNote}>
                    <Clock size={13} strokeWidth={1.5} aria-hidden="true" />
                    {t('priceNote')}
                  </span>
                </div>
              </div>

              {/* Features checklist */}
              <ul className={styles.featuresList} aria-label="What you get">
                {FEATURES.map(({ Icon, key }) => (
                  <li key={key} className={styles.featureItem}>
                    <div className={styles.featureIconWrap} aria-hidden="true">
                      <Icon size={14} strokeWidth={1.5} />
                    </div>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>

              {/* Trust badge */}
              <div className={styles.trustBadge}>
                <Shield size={13} strokeWidth={1.75} aria-hidden="true" />
                <span>مهندسون معتمدون من ملاذ فقط</span>
              </div>
            </div>

            {/* Process timeline */}
            <div className={styles.process}>
              <p className={styles.processLabel}>كيف تتم الزيارة</p>
              <ol className={styles.processSteps}>
                {PROCESS_STEPS.map(({ Icon, ar }, i) => (
                  <li key={ar} className={styles.processStep}>
                    <div className={styles.processNum} aria-hidden="true">
                      {i + 1}
                    </div>
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className={styles.processLine} aria-hidden="true" />
                    )}
                    <div className={styles.processIcon} aria-hidden="true">
                      <Icon size={15} strokeWidth={1.5} />
                    </div>
                    <span className={styles.processText}>{ar}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* CTA skip link */}
            <a href="#early-access" className={styles.skipLink}>
              <span>لست مستعداً الآن؟</span>
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="icon-flip" />
            </a>

          </div>

          {/* ── Right: Form ── */}
          <div className={`${styles.formCard} reveal reveal-delay-3`}>
            {phase === 'success' ? (
              <div className={styles.success} role="status">
                <div className={styles.successCheck} aria-hidden="true">✓</div>
                <h3 className={styles.successTitle}>{t('successTitle')}</h3>
                <p className={styles.successMsg}>{t('successMsg')}</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate aria-label="Engineer visit booking form">
                <p className={styles.formTitle}>احجز زيارتك الآن</p>

                {phase === 'error' && (
                  <div role="alert" className={styles.formError}>
                    حدث خطأ. يرجى المحاولة مرة أخرى.
                  </div>
                )}

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label htmlFor="visit-name" className={styles.fieldLabel}>
                      {t('formName')} *
                    </label>
                    <input
                      id="visit-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder={t('namePlaceholder')}
                      className={`${styles.fieldInput} ${fieldErrors.name ? styles.inputError : ''}`}
                      aria-describedby={fieldErrors.name ? 'err-name' : undefined}
                      aria-invalid={!!fieldErrors.name}
                      autoComplete="name"
                    />
                    {fieldErrors.name && (
                      <span id="err-name" role="alert" className={styles.fieldErrorMsg}>
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="visit-phone" className={styles.fieldLabel}>
                      {t('formPhone')} *
                    </label>
                    <input
                      id="visit-phone"
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                      placeholder="01xxxxxxxxx"
                      className={`${styles.fieldInput} ${fieldErrors.phone ? styles.inputError : ''}`}
                      aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                      aria-invalid={!!fieldErrors.phone}
                      autoComplete="tel"
                      dir="ltr"
                      maxLength={11}
                    />
                    {fieldErrors.phone && (
                      <span id="err-phone" role="alert" className={styles.fieldErrorMsg}>
                        {fieldErrors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="visit-address" className={styles.fieldLabel}>
                    {t('formAddress')} *
                  </label>
                  <input
                    id="visit-address"
                    type="text"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder={t('addressPlaceholder')}
                    className={`${styles.fieldInput} ${fieldErrors.address ? styles.inputError : ''}`}
                    aria-describedby={fieldErrors.address ? 'err-address' : undefined}
                    aria-invalid={!!fieldErrors.address}
                    autoComplete="street-address"
                  />
                  {fieldErrors.address && (
                    <span id="err-address" role="alert" className={styles.fieldErrorMsg}>
                      {fieldErrors.address}
                    </span>
                  )}
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label htmlFor="visit-size" className={styles.fieldLabel}>
                      {t('formSize')}
                    </label>
                    <input
                      id="visit-size"
                      type="number"
                      inputMode="numeric"
                      min={30}
                      max={2000}
                      value={form.apartmentSize}
                      onChange={(e) => update('apartmentSize', Number(e.target.value))}
                      className={styles.fieldInput}
                      dir="ltr"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="visit-date" className={styles.fieldLabel}>
                      {t('formDate')} *
                    </label>
                    <input
                      id="visit-date"
                      type="date"
                      value={form.preferredDate}
                      onChange={(e) => update('preferredDate', e.target.value)}
                      className={`${styles.fieldInput} ${fieldErrors.preferredDate ? styles.inputError : ''}`}
                      aria-describedby={fieldErrors.preferredDate ? 'err-date' : undefined}
                      aria-invalid={!!fieldErrors.preferredDate}
                      min={minDate}
                      dir="ltr"
                    />
                    {fieldErrors.preferredDate && (
                      <span id="err-date" role="alert" className={styles.fieldErrorMsg}>
                        {fieldErrors.preferredDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="visit-notes" className={styles.fieldLabel}>
                    {t('formNotes')}
                  </label>
                  <textarea
                    id="visit-notes"
                    value={form.notes ?? ''}
                    onChange={(e) => update('notes', e.target.value)}
                    placeholder={t('notesPlaceholder')}
                    className={styles.fieldTextarea}
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={phase === 'loading'}
                >
                  {phase === 'loading' ? (
                    <span className={styles.loadingDots} aria-label="Loading">...</span>
                  ) : (
                    <>
                      {t('submitBtn')}
                      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" className="icon-flip" />
                    </>
                  )}
                </button>

                <p className={styles.formNote}>لا يلزم دفع مسبق — تُدفع ٢٥٠ جنيه عند الزيارة فقط</p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}