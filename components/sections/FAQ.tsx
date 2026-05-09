'use client';
// components/sections/FAQ.tsx

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';
import styles from './FAQ.module.css';

const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export default function FAQ() {
  const t = useTranslations('faq');
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) =>
    setOpen((prev) => (prev === key ? null : key));

  return (
    <section
      className={`${styles.section} section`}
      id="faq"
      aria-labelledby="faq-heading"
    >
      <div className="container">
        <header className={styles.header}>
          <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
          <h2 id="faq-heading" className={`${styles.title} reveal reveal-delay-1`}>
            {t('title')}
          </h2>
        </header>

        <dl className={styles.list}>
          {questions.map((key, i) => {
            const isOpen = open === key;
            return (
              <div
                key={key}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ''} reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <dt>
                  <button
                    type="button"
                    className={styles.question}
                    onClick={() => toggle(key)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${key}`}
                    id={`faq-question-${key}`}
                  >
                    <span>{t(key)}</span>
                    <span className={`${styles.iconWrap} ${isOpen ? styles.iconOpen : ''}`} aria-hidden="true">
                      {isOpen
                        ? <Minus size={16} strokeWidth={2} />
                        : <Plus  size={16} strokeWidth={2} />}
                    </span>
                  </button>
                </dt>

                {/*
                  WHY grid-template-rows instead of max-height:

                  max-height: 0 → max-height: 600px works but has two problems:
                  1. The easing is wrong — CSS eases from 0 to 600px, but actual
                     content might only be 80px tall. The first 86% of the
                     transition is invisible, then the element "pops" into view
                     at the end. This is the "bad animation" you reported.
                  2. Closing feels slow because it eases from 600px → 0.

                  grid-template-rows: 0fr → 1fr animates the grid track from
                  zero to the actual content height. The inner div has
                  overflow:hidden which keeps it clipped at exactly the right
                  size at every frame. The easing maps correctly to the
                  real content height, giving a natural accordion feel.

                  This is the modern CSS accordion pattern (Chrome 101+,
                  Firefox 109+, Safari 16+). All modern browsers support it.
                */}
                <dd
                  id={`faq-answer-${key}`}
                  role="region"
                  aria-labelledby={`faq-question-${key}`}
                  aria-hidden={!isOpen}
                  className={`${styles.answerGrid} ${isOpen ? styles.answerOpen : ''}`}
                >
                  {/* Inner div is required for grid-template-rows technique */}
                  <div className={styles.answerInner}>
                    <p className={styles.answerText}>{t(key.replace('q', 'a') as never)}</p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}