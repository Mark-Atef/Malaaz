// components/sections/FAQ.tsx
'use client';

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
        <div className={styles.header}>
          <span className={`${styles.eyebrow} reveal`}>{t('eyebrow')}</span>
          <h2
            id="faq-heading"
            className={`${styles.title} reveal reveal-delay-1`}
          >
            {t('title')}
          </h2>
        </div>

        <dl className={styles.list}>
          {questions.map((key, i) => {
            const isOpen = open === key;
            return (
              <div
                key={key}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ''} reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                {/* Question button */}
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
                    <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`} aria-hidden="true">
                      {isOpen
                        ? <Minus size={16} strokeWidth={1.75} />
                        : <Plus size={16} strokeWidth={1.75} />}
                    </span>
                  </button>
                </dt>
                <dd
                  id={`faq-answer-${key}`}
                  role="region"
                  aria-labelledby={`faq-question-${key}`}
                  aria-hidden={!isOpen}
                  className={`${styles.answer} ${isOpen ? styles.answerOpen : ''}`}
                >
                  <p className={styles.answerText}>{t(key.replace('q', 'a') as never)}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}