'use client';
// components/sections/CostSimulator.tsx
//
// FIX: Replaced ternary expression-statement with if/else block.
// `condition ? set.delete() : set.add()` is flagged as no-unused-expressions
// because the ternary result is discarded. if/else makes intent explicit.

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import {
  Zap,
  PaintBucket,
  Grid2X2,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import styles from './CostSimulator.module.css';

// ─── Cost tables (EGP per m²) — Egyptian market rates 2025 ───────────────────

const RATES = {
  electrical: {
    economic: { min: 400,  max: 560  },
    standard: { min: 680,  max: 950  },
    premium:  { min: 1050, max: 1550 },
  },
  painting: {
    // Painting rates are per m² of floor area (wall factor already applied)
    economic: { min: 90,  max: 140 },
    standard: { min: 155, max: 225 },
    premium:  { min: 240, max: 380 },
  },
  flooring: {
    economic: { min: 260, max: 400  },
    standard: { min: 430, max: 680  },
    premium:  { min: 780, max: 1350 },
  },
} as const;

// Malaaz market saving estimate: 18–26% vs unguided traditional purchase
const MALAAZ_SAVING_PCT = { min: 0.18, max: 0.26 };

type Level = 'economic' | 'standard' | 'premium';
type Scope = 'electrical' | 'painting' | 'flooring';

interface Range {
  min: number;
  max: number;
}

function calcRange(rate: Range, size: number): Range {
  return {
    min: Math.round(rate.min * size),
    max: Math.round(rate.max * size),
  };
}

function formatNum(n: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(n);
}

function formatRange(r: Range, locale: string, t: (k: string) => string): string {
  return `${formatNum(r.min, locale)} ${t('to')} ${formatNum(r.max, locale)}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CostSimulator() {
  const t = useTranslations('costSimulator');
  const locale = useLocale();

  const [size, setSize] = useState(120);
  const [level, setLevel] = useState<Level>('standard');
  const [scope, setScope] = useState<Set<Scope>>(
    new Set(['electrical', 'painting', 'flooring'])
  );

  const toggleScope = useCallback((s: Scope) => {
    setScope((prev) => {
      const next = new Set(prev);
      // Keep at least one scope selected at all times
      if (next.has(s) && next.size === 1) return prev;

      // FIX: replaced `next.has(s) ? next.delete(s) : next.add(s)` — that is
      // a discarded ternary expression, flagged by no-unused-expressions.
      // if/else makes the side effects explicit statements.
      if (next.has(s)) {
        next.delete(s);
      } else {
        next.add(s);
      }

      return next;
    });
  }, []);

  // Memoized calculations — only recompute when inputs change
  const estimates = useMemo(() => {
    const electrical = scope.has('electrical')
      ? calcRange(RATES.electrical[level], size)
      : null;
    const painting = scope.has('painting')
      ? calcRange(RATES.painting[level], size)
      : null;
    const flooring = scope.has('flooring')
      ? calcRange(RATES.flooring[level], size)
      : null;

    const totalMin =
      (electrical?.min ?? 0) + (painting?.min ?? 0) + (flooring?.min ?? 0);
    const totalMax =
      (electrical?.max ?? 0) + (painting?.max ?? 0) + (flooring?.max ?? 0);

    const savingMin = Math.round(totalMin * MALAAZ_SAVING_PCT.min);
    const savingMax = Math.round(totalMax * MALAAZ_SAVING_PCT.max);

    return {
      electrical,
      painting,
      flooring,
      total: { min: totalMin, max: totalMax },
      saving: { min: savingMin, max: savingMax },
    };
  }, [size, level, scope]);

  const levels: Array<{ key: Level; label: string }> = [
    { key: 'economic', label: t('levelEconomic') },
    { key: 'standard', label: t('levelStandard') },
    { key: 'premium',  label: t('levelPremium') },
  ];

  const scopes: Array<{ key: Scope; label: string; Icon: typeof Zap }> = [
    { key: 'electrical', label: t('scopeElectrical'), Icon: Zap },
    { key: 'painting',   label: t('scopePainting'),   Icon: PaintBucket },
    { key: 'flooring',   label: t('scopeFlooring'),   Icon: Grid2X2 },
  ];

  return (
    <section
      className={`${styles.section} section`}
      id="cost-simulator"
      aria-labelledby="sim-heading"
    >
      <div className="container">
        <div className={styles.header}>
          <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
          <h2
            id="sim-heading"
            className={`${styles.title} reveal reveal-delay-1`}
          >
            {t('title')}
          </h2>
          <p className={`${styles.subtitle} reveal reveal-delay-2`}>
            {t('subtitle')}
          </p>
        </div>

        <div className={`${styles.card} reveal reveal-delay-2`}>

          {/* ── Left: Inputs ── */}
          <div className={styles.inputs}>

            {/* Size slider */}
            <div className={styles.inputGroup}>
              <label htmlFor="apt-size" className={styles.inputLabel}>
                {t('sizeLabel')}
                <span className={styles.sizeDisplay}>
                  {formatNum(size, locale)} {t('sizeUnit')}
                </span>
              </label>
              <input
                id="apt-size"
                type="range"
                min={50}
                max={300}
                step={5}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className={styles.slider}
                aria-valuemin={50}
                aria-valuemax={300}
                aria-valuenow={size}
                aria-valuetext={`${size} ${t('sizeUnit')}`}
              />
              <div className={styles.sliderLabels} aria-hidden="true">
                <span>50 {t('sizeUnit')}</span>
                <span>300 {t('sizeUnit')}</span>
              </div>
            </div>

            {/* Level selector */}
            <div className={styles.inputGroup}>
              <p className={styles.inputLabel}>{t('levelLabel')}</p>
              <div
                className={styles.levelGrid}
                role="radiogroup"
                aria-label={t('levelLabel')}
              >
                {levels.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={level === key}
                    onClick={() => setLevel(key)}
                    className={`${styles.levelBtn} ${
                      level === key ? styles.levelActive : ''
                    }`}
                  >
                    {label}
                    {level === key && (
                      <span className={styles.levelCheck} aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope checkboxes */}
            <div className={styles.inputGroup}>
              <p className={styles.inputLabel}>{t('scopeLabel')}</p>
              <div className={styles.scopeGrid}>
                {scopes.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={scope.has(key)}
                    onClick={() => toggleScope(key)}
                    className={`${styles.scopeBtn} ${
                      scope.has(key) ? styles.scopeActive : ''
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div
            className={styles.results}
            aria-live="polite"
            aria-atomic="true"
            aria-label={t('resultTitle')}
          >
            <p className={styles.resultsLabel}>{t('resultTitle')}</p>

            <div className={styles.breakdown}>
              {estimates.electrical && (
                <div
                  className={`${styles.breakdownRow} ${styles.breakdownElectrical}`}
                >
                  <div className={styles.breakdownIcon} aria-hidden="true">
                    <Zap size={14} strokeWidth={1.5} />
                  </div>
                  <span className={styles.breakdownName}>
                    {t('resultElectrical')}
                  </span>
                  <span className={styles.breakdownRange} dir="ltr">
                    {formatRange(estimates.electrical, locale, t)}
                  </span>
                </div>
              )}
              {estimates.painting && (
                <div
                  className={`${styles.breakdownRow} ${styles.breakdownPainting}`}
                >
                  <div className={styles.breakdownIcon} aria-hidden="true">
                    <PaintBucket size={14} strokeWidth={1.5} />
                  </div>
                  <span className={styles.breakdownName}>
                    {t('resultPainting')}
                  </span>
                  <span className={styles.breakdownRange} dir="ltr">
                    {formatRange(estimates.painting, locale, t)}
                  </span>
                </div>
              )}
              {estimates.flooring && (
                <div
                  className={`${styles.breakdownRow} ${styles.breakdownFlooring}`}
                >
                  <div className={styles.breakdownIcon} aria-hidden="true">
                    <Grid2X2 size={14} strokeWidth={1.5} />
                  </div>
                  <span className={styles.breakdownName}>
                    {t('resultFlooring')}
                  </span>
                  <span className={styles.breakdownRange} dir="ltr">
                    {formatRange(estimates.flooring, locale, t)}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.total}>
              <span className={styles.totalLabel}>{t('resultTotal')}</span>
              <div className={styles.totalValue} dir="ltr">
                <span className={styles.totalCurrency}>{t('egp')}</span>
                <span>{formatNum(estimates.total.min, locale)}</span>
                <span className={styles.totalSep}>—</span>
                <span>{formatNum(estimates.total.max, locale)}</span>
              </div>
            </div>

            {/* Malaaz saving callout */}
            <div className={styles.saving}>
              <div className={styles.savingIcon} aria-hidden="true">
                <TrendingDown size={18} strokeWidth={1.5} />
              </div>
              <div className={styles.savingContent}>
                <p className={styles.savingLabel}>{t('malaazSaving')}</p>
                <p className={styles.savingValue} dir="ltr">
                  {t('egp')} {formatNum(estimates.saving.min, locale)} —{' '}
                  {formatNum(estimates.saving.max, locale)}
                </p>
                <p className={styles.savingNote}>{t('malaazSavingNote')}</p>
              </div>
            </div>

            <p className={styles.disclaimer}>{t('disclaimer')}</p>

            <a href="#early-access" className={styles.simCta}>
              {t('cta')}
              <ChevronRight
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="icon-flip"
              />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}