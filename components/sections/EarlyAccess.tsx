'use client';
// components/sections/EarlyAccess.tsx
//
// Extended with:
// - Real-time waitlist counter (fetched from /api/waitlist/count)
// - Referral mechanic: after signup, show referral link + share buttons
// - Referral code generated deterministically server-side from email + salt
// - Referral code from URL (?ref=XXXXXX) captured and sent with signup

// FIX: useReferralCode now returns MutableRefObject<string | null> instead of
// string | null state. The referral code only needs to be read at form
// submission time — it does not need to trigger a re-render when it is set.
// Using useRef avoids the react-hooks/set-state-in-effect violation.

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';
import type { WaitlistFormData, WaitlistResponse } from '@/types';
import styles from './EarlyAccess.module.css';

// ─── Capture referral code from URL — no re-render needed ────────────────────
// Returns a stable MutableRefObject. Read .current at submission time.
// useRef is correct here: the code is set once on mount, never changes,
// and does not affect what the user sees on screen.

function useReferralCode(): React.MutableRefObject<string | null> {
  const codeRef = useRef<string | null>(null);

  useEffect(() => {
    // window is safe here — this effect runs only on the client
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref && /^[A-Z0-9]{8}$/.test(ref)) {
      // Write to ref — no setState, no cascading re-render
      codeRef.current = ref;
      sessionStorage.setItem('malaaz_ref', ref);
    } else {
      const stored = sessionStorage.getItem('malaaz_ref');
      if (stored) {
        codeRef.current = stored;
      }
    }
  }, []); // mount-only — eslint-disable-next-line react-hooks/exhaustive-deps

  return codeRef;
}

// ─── Waitlist counter ────────────────────────────────────────────────────────

function useWaitlistCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/waitlist/count')
      .then((r) => r.json())
      .then((d: { count: number }) => setCount(d.count))
      .catch(() => {}); // non-critical — silent fail
  }, []);

  return count;
}

// ─── Copy to clipboard ───────────────────────────────────────────────────────

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [text]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { copied, copy };
}

// ─── Types ───────────────────────────────────────────────────────────────────

type FormPhase = 'idle' | 'loading';

type SuccessState = {
  email: string;
  referralCode: string;
  position: number;
  count: number;
};

// ─── Referral Panel ──────────────────────────────────────────────────────────

function ReferralPanel({ data, locale }: { data: SuccessState; locale: string }) {
  const t = useTranslations('referral');

  const referralUrl = `https://malaaz.com/${locale}?ref=${data.referralCode}`;
  const { copied, copy } = useCopy(referralUrl);

  const whatsappMsg = encodeURIComponent(
    locale === 'ar'
      ? `سجّل معايا على ملاذ — المنصة الذكية للتشطيب في مصر. كودي الخاص: ${referralUrl}`
      : `Join me on Malaaz — Egypt's smart finishing platform. My referral: ${referralUrl}`
  );

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;

  const positionText = t('positionUnit').replace('{{count}}', String(data.count));

  return (
    <div className={styles.referralPanel} role="status" aria-live="polite">
      {/* Success header */}
      <div className={styles.referralHeader}>
        <div className={styles.referralCheck} aria-hidden="true">✓</div>
        <div>
          <h3 className={styles.referralTitle}>{t('title')}</h3>
          <p className={styles.referralSub}>{t('subtitle')}</p>
        </div>
      </div>

      {/* Position */}
      <div className={styles.positionBox}>
        <div className={styles.positionNumber}>
          #{data.position.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
        </div>
        <div className={styles.positionLabel}>
          <span className={styles.positionMain}>{t('positionLabel')}</span>
          <span className={styles.positionSub}>{positionText}</span>
        </div>
      </div>

      {/* Share CTA */}
      <div className={styles.shareBlock}>
        <p className={styles.shareTitle}>{t('shareTitle')}</p>
        <p className={styles.shareDesc}>{t('shareDesc')}</p>

        <div className={styles.linkRow}>
          <div className={styles.linkBox} aria-label={t('linkLabel')}>
            <span className={styles.linkText}>{referralUrl}</span>
          </div>
          <button
            type="button"
            onClick={copy}
            className={styles.copyBtn}
            aria-label={copied ? t('copied') : t('copyBtn')}
          >
            {copied
              ? <Check size={15} strokeWidth={2} />
              : <Copy size={15} strokeWidth={1.75} />}
            <span>{copied ? t('copied') : t('copyBtn')}</span>
          </button>
        </div>

        <div className={styles.shareButtons}>
          <a 
            href={`https://wa.me/?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.shareBtn} ${styles.whatsappBtn}`}
          >
            <MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />
            {t('shareWhatsApp')}
          </a>
          

<a
                      href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.shareBtn} ${styles.fbBtn}`}
          >
            <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
            {t('shareFacebook')}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function EarlyAccess() {
  const t = useTranslations('earlyAccess');
  const locale = useLocale();

  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<FormPhase>('idle');
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [error, setError] = useState('');

  // FIX: returns a ref, not state — no re-render on capture
  const inboundRef = useReferralCode();
  const count = useWaitlistCount();

  const submit = useCallback(async (type: WaitlistFormData['type']) => {
    if (!email || !email.includes('@')) {
      setError(
        locale === 'ar'
          ? 'أدخل بريداً إلكترونياً صحيحاً'
          : 'Please enter a valid email'
      );
      return;
    }
    setError('');
    setPhase('loading');

    try {
      // FIX: read .current at call time — ref is always up-to-date
      const referralCode = inboundRef.current;

      const payload: WaitlistFormData = {
        email,
        type,
        ...(referralCode ? { referralCode } : {}),
      };

      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json() as WaitlistResponse;

      if (data.success) {
        setSuccess({
          email,
          referralCode: data.referralCode ?? 'MALAAZ00',
          position: data.position ?? 999,
          count: data.count ?? 1000,
        });
        setEmail('');
      } else {
        setError(
          locale === 'ar'
            ? 'حدث خطأ. حاول مرة أخرى.'
            : 'Something went wrong. Please try again.'
        );
      }
    } catch {
      setError(
        locale === 'ar'
          ? 'حدث خطأ. حاول مرة أخرى.'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setPhase('idle');
    }
    // inboundRef is a stable ref object — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, locale]);

  const loading = phase === 'loading';

  return (
    <section
      className={styles.section}
      id="early-access"
      aria-labelledby="early-access-heading"
    >
      <div className={styles.grain} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
        <h2
          id="early-access-heading"
          className={`${styles.title} reveal reveal-delay-1`}
        >
          {t('title')}
        </h2>
        <p className={`${styles.sub} reveal reveal-delay-2`}>{t('subtitle')}</p>

        {/* Live counter badge — non-critical, renders after fetch */}
        {count !== null && !success && (
          <div
            className={`${styles.counterBadge} reveal reveal-delay-2`}
            aria-live="polite"
          >
            <span className={styles.counterDot} aria-hidden="true" />
            <span>
              {locale === 'ar'
                ? `${count.toLocaleString('ar-EG')} شخص مسجّل بالفعل`
                : `${count.toLocaleString()} people already registered`}
            </span>
          </div>
        )}

        {success ? (
          <ReferralPanel data={success} locale={locale} />
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
                aria-describedby={error ? 'ea-email-error' : undefined}
                aria-invalid={!!error}
                disabled={loading}
                autoComplete="email"
              />
              {error && (
                <span id="ea-email-error" role="alert" className={styles.error}>
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

        <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer" className={`${styles.community} reveal reveal-delay-4`}>
          <MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />
          {t('community')}
        </a>
      </div>
    </section>
  );
}