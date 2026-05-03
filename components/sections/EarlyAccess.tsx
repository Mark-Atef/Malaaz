// components/sections/EarlyAccess.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { WaitlistFormData } from '@/types';
import styles from './EarlyAccess.module.css';

export default function EarlyAccess() {
  const t = useTranslations('earlyAccess');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (type: WaitlistFormData['type']) => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type } satisfies WaitlistFormData),
      });
      const data = await res.json() as { success: boolean };
      if (data.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} id="early-access" aria-labelledby="early-access-heading">
      <div className={styles.grain} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
        <h2 id="early-access-heading" className={`${styles.title} reveal reveal-delay-1`}>
          {t('title')}
        </h2>
        <p className={`${styles.sub} reveal reveal-delay-2`}>{t('subtitle')}</p>

        {success ? (
          <div className={`${styles.success} reveal`} role="status" aria-live="polite">
            <span className={styles.successIcon} aria-hidden="true">✓</span>
            {t('successMsg')}
          </div>
        ) : (
          <div className={`${styles.form} reveal reveal-delay-3`}>
            <div className={styles.inputWrap}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder={t('placeholder')}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                aria-label={t('placeholder')}
                aria-describedby={error ? 'email-error' : undefined}
                disabled={loading}
              />
              {error && (
                <span id="email-error" role="alert" className={styles.error}>
                  {error}
                </span>
              )}
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={() => submit('homeowner')}
                disabled={loading}
                className={styles.btnPrimary}
              >
                {loading ? '...' : t('ctaHomeowner')}
              </button>
              <button
                type="button"
                onClick={() => submit('trader')}
                disabled={loading}
                className={styles.btnSecondary}
              >
                {loading ? '...' : t('ctaTrader')}
              </button>
            </div>
          </div>
        )}

        
          href="https://chat.whatsapp.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.community} reveal reveal-delay-4`}
        >
          <span aria-hidden="true">💬</span>
          {t('community')}
        </a>
      </div>
    </section>
  );
}