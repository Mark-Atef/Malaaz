'use client';
// components/sections/EngineerVisit.tsx
//
// FIX: Date.now() moved from JSX to useMemo.
// Calling Date.now() directly in JSX is impure — it produces a different
// result on every render. useMemo runs it once on mount, returning a stable
// string that satisfies react-hooks/purity.

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Shield,
  Clock,
  FileText,
  TrendingDown,
  CheckCircle,
} from 'lucide-react';
import type { EngineerVisitData } from '@/types';
import styles from './EngineerVisit.module.css';

const FEATURES = [
  { icon: FileText,     key: 'feature1' as const },
  { icon: TrendingDown, key: 'feature2' as const },
  { icon: Shield,       key: 'feature3' as const },
  { icon: CheckCircle,  key: 'feature4' as const },
] as const;

type VisitPhase = 'idle' | 'loading' | 'success' | 'error';

export default function EngineerVisit() {
  const t = useTranslations('engineerVisit');

  const [phase, setPhase] = useState<VisitPhase>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState<EngineerVisitData>({
    name: '',
    phone: '',
    address: '',
    apartmentSize: 100,
    preferredDate: '',
    notes: '',
  });

  // FIX: computed once on mount — not on every render.
  // Stable string: "tomorrow's date in YYYY-MM-DD format".
  const minDate = useMemo(
    () => new Date(Date.now() + 86_400_000).toISOString().split('T')[0],
    [] // no deps — compute once; date changes are negligible across a session
  );

  const update = useCallback(
    (field: keyof EngineerVisitData, value: string | number) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrorMsg('');
    },
    []
  );

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.phone || !form.address || !form.preferredDate) {
        setErrorMsg('يرجى تعبئة جميع الحقول المطلوبة');
        return;
      }
      setPhase('loading');
      try {
        const res = await fetch('/api/engineer-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json() as { success: boolean };
        setPhase(data.success ? 'success' : 'error');
        if (!data.success) setErrorMsg('حدث خطأ. حاول مرة أخرى.');
      } catch {
        setPhase('error');
        setErrorMsg('حدث خطأ. حاول مرة أخرى.');
      }
    },
    [form]
  );

  return (
    <section
      className={`${styles.section} section`}
      id="engineer-visit"
      aria-labelledby="visit-heading"
    >
      <div className="container">
        <div className={styles.inner}>

          {/* Left: info */}
          <div className={styles.left}>
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

            <div className={`${styles.priceBadge} reveal reveal-delay-2`}>
              <span className={styles.price}>{t('price')}</span>
              <div className={styles.priceNote}>
                <Clock size={12} strokeWidth={1.5} aria-hidden="true" />
                {t('priceNote')}
              </div>
            </div>

            <ul
              className={`${styles.features} reveal reveal-delay-3`}
              aria-label="Visit features"
            >
              {FEATURES.map(({ icon: Icon, key }) => (
                <li key={key} className={styles.feature}>
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className={styles.featureIcon}
                  />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div className={`${styles.formCard} reveal reveal-delay-2`}>
            {phase === 'success' ? (
              <div className={styles.success} role="status">
                <span className={styles.successIcon} aria-hidden="true">
                  ✓
                </span>
                <h3 className={styles.successTitle}>{t('successTitle')}</h3>
                <p className={styles.successMsg}>{t('successMsg')}</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                {errorMsg && (
                  <div role="alert" className={styles.formError}>
                    {errorMsg}
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
                      className={styles.fieldInput}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="visit-phone" className={styles.fieldLabel}>
                      {t('formPhone')} *
                    </label>
                    <input
                      id="visit-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder={t('phonePlaceholder')}
                      className={styles.fieldInput}
                      autoComplete="tel"
                      required
                      dir="ltr"
                    />
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
                    className={styles.fieldInput}
                    autoComplete="street-address"
                    required
                  />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label htmlFor="visit-size" className={styles.fieldLabel}>
                      {t('formSize')}
                    </label>
                    <input
                      id="visit-size"
                      type="number"
                      min={30}
                      max={1000}
                      value={form.apartmentSize}
                      onChange={(e) =>
                        update('apartmentSize', Number(e.target.value))
                      }
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
                      className={styles.fieldInput}
                      // FIX: minDate computed in useMemo above — not during render
                      min={minDate}
                      required
                      dir="ltr"
                    />
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
                  {phase === 'loading' ? '...' : t('submitBtn')}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}